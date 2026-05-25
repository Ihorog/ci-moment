/**
 * Tests for ADSA route handler logic.
 *
 * Route handlers depend on `readManifestSafe` from `lib/manifest-io`, which
 * is mocked here so tests remain fast and filesystem-independent.
 */

import { validateManifest, buildOplogEntry } from '@/lib/manifest';

// ---------------------------------------------------------------------------
// Helpers (mirror the logic inside the route handlers)
// ---------------------------------------------------------------------------

function runHealthChecks(
  envVars: Record<string, string | undefined>,
  manifestRaw: unknown
): { ok: boolean; checks: Record<string, unknown> } {
  const envChecks: Record<string, boolean> = {
    SUPABASE_URL: Boolean(envVars.SUPABASE_URL),
    SUPABASE_SERVICE_KEY: Boolean(envVars.SUPABASE_SERVICE_KEY),
    NEXT_PUBLIC_URL: Boolean(envVars.NEXT_PUBLIC_URL),
  };
  const envOk = Object.values(envChecks).every(Boolean);
  const manifestValidation = validateManifest(manifestRaw);

  const checks = {
    env: { ok: envOk, details: envChecks },
    manifest: { ok: manifestValidation.valid, errors: manifestValidation.errors },
  };

  return { ok: envOk && manifestValidation.valid, checks };
}

function runManifestChecks(manifestRaw: unknown): {
  ok: boolean;
  schema: { valid: boolean; errors: string[] };
  invariants: Record<string, boolean>;
} {
  const validation = validateManifest(manifestRaw);
  const invariants: Record<string, boolean> = {};
  let invariantsOk = true;

  if (validation.valid && manifestRaw && typeof manifestRaw === 'object') {
    const m = manifestRaw as Record<string, unknown>;
    const hasActions = Array.isArray(m.actions) && (m.actions as unknown[]).length > 0;
    invariants.has_registered_actions = hasActions;
    if (!hasActions) invariantsOk = false;

    const actionIds = Array.isArray(m.actions)
      ? (m.actions as Array<{ id?: unknown }>).map((a) => a.id)
      : [];
    const hasHealth = actionIds.includes('adsa.health_selfcheck');
    const hasConsistency = actionIds.includes('adsa.manifest_consistency');
    invariants.has_adsa_health = hasHealth;
    invariants.has_adsa_manifest_consistency = hasConsistency;
    if (!hasHealth || !hasConsistency) invariantsOk = false;
  }

  return { ok: validation.valid && invariantsOk, schema: validation, invariants };
}

// ---------------------------------------------------------------------------
// Valid test manifest fixture
// ---------------------------------------------------------------------------

const VALID_MANIFEST = {
  version: '0.1.0',
  state: { abilities_enabled: [], last_action_at: null },
  actions: [
    {
      id: 'adsa.health_selfcheck',
      intent: 'Verify system invariants',
      triggers: { manual: true },
      policy: { can_open_issue: false, can_push_code: false },
      steps: ['check_env', 'check_manifest', 'report'],
      effects: ['audit_log'],
    },
    {
      id: 'adsa.manifest_consistency',
      intent: 'Validate manifest schema',
      triggers: { manual: true },
      policy: { can_open_issue: false, can_push_code: false },
      steps: ['validate_schema', 'report'],
      effects: ['audit_log'],
    },
  ],
  oplog: [],
};

// ---------------------------------------------------------------------------
// Health action tests
// ---------------------------------------------------------------------------

describe('ADSA: health_selfcheck logic', () => {
  it('reports ok=true when all env vars are present and manifest is valid', () => {
    const env = {
      SUPABASE_URL: 'https://example.supabase.co',
      SUPABASE_SERVICE_KEY: 'secret',
      NEXT_PUBLIC_URL: 'https://ci-moment.vercel.app',
    };
    const result = runHealthChecks(env, VALID_MANIFEST);
    expect(result.ok).toBe(true);
    expect((result.checks.env as { ok: boolean }).ok).toBe(true);
    expect((result.checks.manifest as { ok: boolean }).ok).toBe(true);
  });

  it('reports ok=false when env vars are missing', () => {
    const result = runHealthChecks({}, VALID_MANIFEST);
    expect(result.ok).toBe(false);
    expect((result.checks.env as { ok: boolean }).ok).toBe(false);
  });

  it('reports ok=false when manifest is invalid', () => {
    const env = {
      SUPABASE_URL: 'https://example.supabase.co',
      SUPABASE_SERVICE_KEY: 'secret',
      NEXT_PUBLIC_URL: 'https://ci-moment.vercel.app',
    };
    const result = runHealthChecks(env, null);
    expect(result.ok).toBe(false);
    expect((result.checks.manifest as { ok: boolean }).ok).toBe(false);
  });

  it('env checks never expose secret values', () => {
    const env = { SUPABASE_URL: 'secret-url', SUPABASE_SERVICE_KEY: 'secret-key', NEXT_PUBLIC_URL: 'url' };
    const result = runHealthChecks(env, VALID_MANIFEST);
    const details = (result.checks.env as { details: Record<string, unknown> }).details;
    // Each detail must be a boolean, not the actual value
    for (const val of Object.values(details)) {
      expect(typeof val).toBe('boolean');
    }
  });
});

// ---------------------------------------------------------------------------
// Manifest consistency action tests
// ---------------------------------------------------------------------------

describe('ADSA: manifest_consistency logic', () => {
  it('passes a valid manifest with required actions', () => {
    const result = runManifestChecks(VALID_MANIFEST);
    expect(result.ok).toBe(true);
    expect(result.schema.valid).toBe(true);
    expect(result.invariants.has_registered_actions).toBe(true);
    expect(result.invariants.has_adsa_health).toBe(true);
    expect(result.invariants.has_adsa_manifest_consistency).toBe(true);
  });

  it('fails when manifest is null', () => {
    const result = runManifestChecks(null);
    expect(result.ok).toBe(false);
    expect(result.schema.valid).toBe(false);
  });

  it('fails when required ADSA ids are absent', () => {
    const noActions = { ...VALID_MANIFEST, actions: [] };
    const result = runManifestChecks(noActions);
    expect(result.ok).toBe(false);
    expect(result.invariants.has_registered_actions).toBe(false);
  });

  it('fails when adsa.health_selfcheck is missing', () => {
    const onlyConsistency = {
      ...VALID_MANIFEST,
      actions: [VALID_MANIFEST.actions[1]],
    };
    const result = runManifestChecks(onlyConsistency);
    expect(result.ok).toBe(false);
    expect(result.invariants.has_adsa_health).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// buildOplogEntry integration
// ---------------------------------------------------------------------------

describe('buildOplogEntry integration', () => {
  it('creates entries with valid schema accepted by validateManifest', () => {
    const entry = buildOplogEntry('adsa.health_selfcheck', true);
    const manifest = { ...VALID_MANIFEST, oplog: [entry] };
    const result = validateManifest(manifest);
    expect(result.valid).toBe(true);
  });
});

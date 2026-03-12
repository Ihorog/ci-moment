import { NextResponse } from 'next/server';
import { readManifestSafe, appendOplogEntry } from '@/lib/manifest-io';
import { validateManifest, buildOplogEntry } from '@/lib/manifest';

// Always run fresh — never cache consistency check responses.
export const dynamic = 'force-dynamic';

/**
 * ADSA: manifest_consistency
 *
 * Runs manifest schema validation and invariant checks.
 * Safe for Vercel serverless.
 *
 * GET /api/actions/manifest
 */
export async function GET(): Promise<NextResponse> {
  const timestamp = new Date().toISOString();

  const manifestRaw = await readManifestSafe();
  const validation = validateManifest(manifestRaw);

  // Additional invariant checks beyond schema
  const invariants: Record<string, boolean> = {};
  let invariantsOk = true;

  if (validation.valid && manifestRaw && typeof manifestRaw === 'object') {
    const m = manifestRaw as Record<string, unknown>;

    // Invariant: at least one registered action
    const hasActions = Array.isArray(m.actions) && (m.actions as unknown[]).length > 0;
    invariants.has_registered_actions = hasActions;
    if (!hasActions) invariantsOk = false;

    // Invariant: required ADSA IDs are present
    const actionIds = Array.isArray(m.actions)
      ? (m.actions as Array<{ id?: unknown }>).map((a) => a.id)
      : [];
    const hasHealth = actionIds.includes('adsa.health_selfcheck');
    const hasConsistency = actionIds.includes('adsa.manifest_consistency');
    invariants.has_adsa_health = hasHealth;
    invariants.has_adsa_manifest_consistency = hasConsistency;
    if (!hasHealth || !hasConsistency) invariantsOk = false;
  }

  const ok = validation.valid && invariantsOk;

  // --- Append audit entry (best-effort) ---
  const entry = buildOplogEntry('adsa.manifest_consistency', ok);
  const audit = await appendOplogEntry(entry);

  return NextResponse.json({
    ok,
    timestamp,
    schema: { valid: validation.valid, errors: validation.errors },
    invariants,
    audit,
  });
}

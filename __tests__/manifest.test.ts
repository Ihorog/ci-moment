import { validateManifest, buildOplogEntry } from '@/lib/manifest';
import type { OrganismManifest } from '@/lib/manifest';

const VALID_MANIFEST: OrganismManifest = {
  version: '0.1.0',
  state: {
    abilities_enabled: [],
    last_action_at: null,
  },
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

describe('validateManifest', () => {
  it('accepts a valid manifest', () => {
    const result = validateManifest(VALID_MANIFEST);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects null', () => {
    const result = validateManifest(null);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('rejects a non-object value', () => {
    expect(validateManifest('string')).toMatchObject({ valid: false });
    expect(validateManifest(42)).toMatchObject({ valid: false });
    expect(validateManifest([])).toMatchObject({ valid: false });
  });

  it('rejects missing version', () => {
    const m = { ...VALID_MANIFEST, version: '' };
    const result = validateManifest(m);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('version must be a non-empty string');
  });

  it('rejects invalid state.abilities_enabled', () => {
    const m = { ...VALID_MANIFEST, state: { ...VALID_MANIFEST.state, abilities_enabled: 'bad' } };
    const result = validateManifest(m);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('abilities_enabled'))).toBe(true);
  });

  it('rejects invalid state.last_action_at', () => {
    const m = {
      ...VALID_MANIFEST,
      state: { ...VALID_MANIFEST.state, last_action_at: 123 },
    };
    const result = validateManifest(m);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('last_action_at'))).toBe(true);
  });

  it('rejects non-array actions', () => {
    const result = validateManifest({ ...VALID_MANIFEST, actions: 'bad' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('actions must be an array');
  });

  it('rejects action with missing id', () => {
    const badAction = { ...VALID_MANIFEST.actions[0], id: '' };
    const m = { ...VALID_MANIFEST, actions: [badAction] };
    const result = validateManifest(m);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('actions[0].id'))).toBe(true);
  });

  it('rejects non-array oplog', () => {
    const result = validateManifest({ ...VALID_MANIFEST, oplog: 'bad' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('oplog must be an array');
  });

  it('rejects invalid oplog entry', () => {
    const m = {
      ...VALID_MANIFEST,
      oplog: [{ action_id: 'test', timestamp: 'ts', ok: 'not-a-bool' }],
    };
    const result = validateManifest(m);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('oplog[0].ok'))).toBe(true);
  });

  it('accepts oplog entries with valid structure', () => {
    const m = {
      ...VALID_MANIFEST,
      oplog: [
        { action_id: 'adsa.health_selfcheck', timestamp: new Date().toISOString(), ok: true },
      ],
    };
    const result = validateManifest(m);
    expect(result.valid).toBe(true);
  });
});

describe('buildOplogEntry', () => {
  it('returns an entry with the given action_id and ok status', () => {
    const entry = buildOplogEntry('adsa.health_selfcheck', true);
    expect(entry.action_id).toBe('adsa.health_selfcheck');
    expect(entry.ok).toBe(true);
    expect(typeof entry.timestamp).toBe('string');
    expect(entry.detail).toBeUndefined();
  });

  it('includes optional detail when provided', () => {
    const entry = buildOplogEntry('adsa.manifest_consistency', false, 'schema error');
    expect(entry.ok).toBe(false);
    expect(entry.detail).toBe('schema error');
  });

  it('generates a valid ISO timestamp', () => {
    const entry = buildOplogEntry('test.action', true);
    expect(() => new Date(entry.timestamp)).not.toThrow();
    expect(new Date(entry.timestamp).toISOString()).toBe(entry.timestamp);
  });
});

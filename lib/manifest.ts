/**
 * Organism state ledger — schema types and validators for manifest.json.
 *
 * The manifest is the single source of truth for the system's registered
 * autonomous actions and audit oplog. All mutations should append an entry
 * to `oplog`; the ledger is otherwise append-only.
 */

export interface ManifestActionPolicy {
  can_open_issue: boolean;
  can_push_code: boolean;
}

export interface ManifestAction {
  id: string;
  intent: string;
  triggers: Record<string, unknown>;
  policy: ManifestActionPolicy;
  steps: string[];
  effects: string[];
}

export interface OplogEntry {
  action_id: string;
  timestamp: string;
  ok: boolean;
  detail?: string;
}

export interface ManifestState {
  abilities_enabled: string[];
  last_action_at: string | null;
}

export interface OrganismManifest {
  version: string;
  state: ManifestState;
  actions: ManifestAction[];
  oplog: OplogEntry[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate the top-level shape of an organism manifest.
 */
export function validateManifest(value: unknown): ValidationResult {
  const errors: string[] = [];

  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return { valid: false, errors: ['manifest must be a non-null object'] };
  }

  const m = value as Record<string, unknown>;

  // version
  if (typeof m.version !== 'string' || m.version.trim() === '') {
    errors.push('version must be a non-empty string');
  }

  // state
  if (typeof m.state !== 'object' || m.state === null || Array.isArray(m.state)) {
    errors.push('state must be a non-null object');
  } else {
    const s = m.state as Record<string, unknown>;
    if (!Array.isArray(s.abilities_enabled)) {
      errors.push('state.abilities_enabled must be an array');
    }
    if (s.last_action_at !== null && typeof s.last_action_at !== 'string') {
      errors.push('state.last_action_at must be a string or null');
    }
  }

  // actions
  if (!Array.isArray(m.actions)) {
    errors.push('actions must be an array');
  } else {
    (m.actions as unknown[]).forEach((a, i) => {
      if (typeof a !== 'object' || a === null) {
        errors.push(`actions[${i}] must be an object`);
        return;
      }
      const action = a as Record<string, unknown>;
      if (typeof action.id !== 'string' || action.id.trim() === '') {
        errors.push(`actions[${i}].id must be a non-empty string`);
      }
      if (typeof action.intent !== 'string') {
        errors.push(`actions[${i}].intent must be a string`);
      }
      if (!Array.isArray(action.steps)) {
        errors.push(`actions[${i}].steps must be an array`);
      }
      if (!Array.isArray(action.effects)) {
        errors.push(`actions[${i}].effects must be an array`);
      }
    });
  }

  // oplog
  if (!Array.isArray(m.oplog)) {
    errors.push('oplog must be an array');
  } else {
    (m.oplog as unknown[]).forEach((entry, i) => {
      if (typeof entry !== 'object' || entry === null) {
        errors.push(`oplog[${i}] must be an object`);
        return;
      }
      const e = entry as Record<string, unknown>;
      if (typeof e.action_id !== 'string') {
        errors.push(`oplog[${i}].action_id must be a string`);
      }
      if (typeof e.timestamp !== 'string') {
        errors.push(`oplog[${i}].timestamp must be a string`);
      }
      if (typeof e.ok !== 'boolean') {
        errors.push(`oplog[${i}].ok must be a boolean`);
      }
    });
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Build a new oplog audit entry for an action execution.
 */
export function buildOplogEntry(
  action_id: string,
  ok: boolean,
  detail?: string
): OplogEntry {
  return {
    action_id,
    timestamp: new Date().toISOString(),
    ok,
    ...(detail !== undefined ? { detail } : {}),
  };
}

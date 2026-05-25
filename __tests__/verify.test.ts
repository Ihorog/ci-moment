/**
 * Tests for the verify page decision logic.
 *
 * The verify page exports `resolveVerifyState`, a pure function that maps an
 * artifact (or null) and a `justPaid` flag to one of four UI states. Tests
 * here use a mock `Artifact` object so that Supabase is never called.
 */

import { resolveVerifyState, VerifyState } from '@/lib/verify';
import type { Artifact } from '@/lib/supabase';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a minimal Artifact fixture. Callers can override specific fields. */
function makeArtifact(overrides: Partial<Artifact> = {}): Artifact {
  return {
    id: 'test-id-001',
    artifact_code: 'CI-TEST-0001',
    context: 'career',
    status: 'PROCEED',
    locked_minute_utc: 1710000000,
    locked_at_utc: '2024-03-10T00:00:00.000Z',
    is_sealed: false,
    sealed_at_utc: null,
    verify_hash: 'abc123def456',
    payment_id: null,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// resolveVerifyState
// ---------------------------------------------------------------------------

describe('resolveVerifyState', () => {
  it('returns "sealed" when artifact is sealed', () => {
    const artifact = makeArtifact({ is_sealed: true, sealed_at_utc: '2024-03-10T00:01:00.000Z', payment_id: 'pay_001' });
    const state: VerifyState = resolveVerifyState(artifact, false);
    expect(state).toBe('sealed');
  });

  it('returns "sealed" even when justPaid is true and artifact is already sealed', () => {
    const artifact = makeArtifact({ is_sealed: true, sealed_at_utc: '2024-03-10T00:01:00.000Z', payment_id: 'pay_002' });
    const state: VerifyState = resolveVerifyState(artifact, true);
    expect(state).toBe('sealed');
  });

  it('returns "pending-payment" when artifact exists, is not sealed, and justPaid is true', () => {
    const artifact = makeArtifact({ is_sealed: false });
    const state: VerifyState = resolveVerifyState(artifact, true);
    expect(state).toBe('pending-payment');
  });

  it('returns "unsealed" when artifact exists, is not sealed, and justPaid is false', () => {
    const artifact = makeArtifact({ is_sealed: false });
    const state: VerifyState = resolveVerifyState(artifact, false);
    expect(state).toBe('unsealed');
  });

  it('returns "not-found" when artifact is null and justPaid is false', () => {
    const state: VerifyState = resolveVerifyState(null, false);
    expect(state).toBe('not-found');
  });

  it('returns "not-found" when artifact is null even if justPaid is true', () => {
    // The artifact was never persisted, so we cannot show a pending state.
    const state: VerifyState = resolveVerifyState(null, true);
    expect(state).toBe('not-found');
  });

  it('reflects correct state for HOLD decision artifacts', () => {
    const artifact = makeArtifact({ status: 'HOLD', is_sealed: true, sealed_at_utc: '2024-03-10T00:02:00.000Z', payment_id: 'pay_003' });
    expect(resolveVerifyState(artifact, false)).toBe('sealed');
  });

  it('reflects correct state for NOT NOW decision artifacts', () => {
    const artifact = makeArtifact({ status: 'NOT NOW', is_sealed: false });
    expect(resolveVerifyState(artifact, false)).toBe('unsealed');
  });
});

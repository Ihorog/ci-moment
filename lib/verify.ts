import type { Artifact } from '@/lib/supabase';

export type VerifyState = 'sealed' | 'pending-payment' | 'unsealed' | 'not-found';

/**
 * Pure function that determines which UI state to render for the verify page.
 * Exported for unit testing.
 *
 * States:
 * - 'sealed':          artifact exists and payment confirmed
 * - 'pending-payment': artifact exists, not sealed, user arrived via ?sealed=true
 *                      (webhook race condition — auto-refresh)
 * - 'unsealed':        artifact exists but payment not yet received
 * - 'not-found':       no artifact record for the given hash
 */
export function resolveVerifyState(
  artifact: Artifact | null,
  justPaid: boolean
): VerifyState {
  if (artifact && artifact.is_sealed) return 'sealed';
  if (artifact && !artifact.is_sealed && justPaid) return 'pending-payment';
  if (artifact && !artifact.is_sealed) return 'unsealed';
  return 'not-found';
}

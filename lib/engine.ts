/**
 * Mapping of context names to numeric identifiers used for seed generation.
 * These values are part of the deterministic status engine and must not be changed
 * without also adjusting the client logic that depends on them.
 */
export const CONTEXT_IDS = {
  career: 1,
  love: 2,
  timing: 3,
} as const;

/**
 * All possible statuses returned by the Ci Moment engine.
 */
export const STATUSES = [
  'PROCEED',
  'HOLD',
  'NOT NOW',
] as const;

export type Context = keyof typeof CONTEXT_IDS;
export type Status = (typeof STATUSES)[number];

/**
 * Generate a unique artifact code with the format `ci-XX-XXXXX` where the X
 * characters are hexadecimal. The prefix is fixed and the suffixes are
 * generated from random bytes. Uses the Web Crypto API (globalThis.crypto)
 * which is available in both browsers and Node.js 20+.
 */
export function generateArtifactCode(): string {
  // Generate 4 random bytes which yield 8 hex characters. The first two
  // characters form the first group and the next five form the second group.
  const bytes = new Uint8Array(4);
  globalThis.crypto.getRandomValues(bytes);
  // More efficient: use direct iteration instead of Array.from().map()
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  const firstGroup = hex.slice(0, 2);
  const secondGroup = hex.slice(2, 7);
  return `ci-${firstGroup}-${secondGroup}`;
}

/**
 * Determine the current minute (UTC) and calculate the status for a given
 * context using the deterministic engine. A new random artifact code is
 * generated each time this function runs.
 *
 * @param context The context for which to compute the status.
 * @returns An object containing the resolved status, the minute seed and a
 *          newly generated artifact code.
 */
export function getStatus(
  context: Context
): { status: Status; minute: number; artifactCode: string } {
  const minute = Math.floor(Date.now() / 60000);
  const contextId = CONTEXT_IDS[context];
  const index = (minute + contextId) % STATUSES.length;
  const status = STATUSES[index];
  const artifactCode = generateArtifactCode();
  return { status, minute, artifactCode };
}
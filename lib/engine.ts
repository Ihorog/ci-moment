import crypto from 'crypto';

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
 * generated from random bytes. This function uses Node.js crypto for
 * cryptographically secure randomness.
 */
export function generateArtifactCode(): string {
  // Generate 4 bytes which yields 8 hex characters. The first two characters
  // form the first group and the next five characters form the second group.
  const bytes = crypto.randomBytes(4).toString('hex');
  const firstGroup = bytes.slice(0, 2);
  const secondGroup = bytes.slice(2, 7);
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

/**
 * Compute a verification hash for a given artifact. The hash is derived
 * deterministically from the artifact code, the minute at which it was
 * generated and the status. Only the first 16 characters of the SHA-256
 * digest are used to shorten the verify URL while maintaining uniqueness.
 *
 * @param artifactCode The code for the artifact being hashed.
 * @param minute The minute (seed) associated with the artifact.
 * @param status The status associated with the artifact.
 * @returns A 16-character hexadecimal hash used for verification URLs.
 */
export function generateVerifyHash(
  artifactCode: string,
  minute: number,
  status: string
): string {
  const digest = crypto
    .createHash('sha256')
    .update(`${artifactCode}-${minute}-${status}`)
    .digest('hex');
  return digest.slice(0, 16);
}
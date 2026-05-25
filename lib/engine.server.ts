import crypto from 'node:crypto';

/**
 * Compute a verification hash for a given artifact. The hash is derived
 * deterministically from the artifact code, the minute at which it was
 * generated and the status. Only the first 16 characters of the SHA-256
 * digest are used to shorten the verify URL while maintaining uniqueness.
 *
 * This function uses the Node.js crypto module and must only be called from
 * server-side code (API routes, server components, etc.).
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

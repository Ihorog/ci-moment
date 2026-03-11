import crypto from 'node:crypto';

/**
 * Verify a Fondy callback signature.
 *
 * Fondy computes the signature using the same algorithm as the checkout
 * request: sort all parameter keys alphabetically, filter out empty values,
 * the 'signature' key and the 'response_status' key, join values with '|',
 * prepend the merchant password, then take the SHA-1 hex digest.
 *
 * @param password The Fondy secret key.
 * @param params   All parameters received from Fondy (including signature).
 * @returns        True when the computed hash matches the provided signature.
 */
export function verifyFondySignature(
  password: string,
  params: Record<string, string>
): boolean {
  const provided = params.signature;
  if (!provided) return false;

  const sorted = Object.keys(params)
    .sort()
    .filter(
      (key) =>
        key !== 'signature' &&
        key !== 'response_status' &&
        params[key] !== '' &&
        params[key] != null
    )
    .map((key) => params[key]);

  const raw = [password, ...sorted].join('|');
  const computed = crypto.createHash('sha1').update(raw).digest('hex');

  return computed === provided;
}

/**
 * Parse the Fondy order ID to extract the artifact UUID.
 *
 * The seal API generates order IDs in the format `ci_{uuid}_{timestamp}` where
 * `uuid` is a standard v4 UUID (e.g. `6ba7b810-9dad-11d1-80b4-00c04fd430c8`)
 * and `timestamp` is a Unix timestamp in milliseconds. UUIDs only contain
 * hexadecimal characters and hyphens, never underscores, so splitting on `_`
 * reliably separates the three components.
 *
 * @param orderId Raw order ID string from Fondy.
 * @returns       The extracted UUID string or null if the format is invalid.
 */
export function parseArtifactId(orderId: string): string | null {
  const match = orderId?.match(
    /^ci_([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})_\d+$/
  );
  return match ? match[1] : null;
}

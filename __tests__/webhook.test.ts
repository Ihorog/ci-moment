import crypto from 'node:crypto';
import { verifyFondySignature, parseArtifactId } from '@/lib/fondy';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a valid Fondy signature for a set of parameters using the given
 * password. This mirrors the production algorithm so tests can generate
 * correctly-signed payloads.
 */
function buildSignature(
  password: string,
  params: Record<string, string>
): string {
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
  return crypto.createHash('sha1').update(raw).digest('hex');
}

// ---------------------------------------------------------------------------
// verifyFondySignature
// ---------------------------------------------------------------------------

describe('verifyFondySignature', () => {
  const PASSWORD = 'test_secret_password';

  it('should return true when the signature matches', () => {
    const params: Record<string, string> = {
      order_id: 'ci_6ba7b810-9dad-11d1-80b4-00c04fd430c8_1710000000000',
      merchant_id: '1396424',
      order_status: 'approved',
      payment_id: '123456',
      currency: 'USD',
      amount: '500',
    };
    params.signature = buildSignature(PASSWORD, params);

    expect(verifyFondySignature(PASSWORD, params)).toBe(true);
  });

  it('should return false when the signature is missing', () => {
    const params: Record<string, string> = {
      order_id: 'ci_6ba7b810-9dad-11d1-80b4-00c04fd430c8_1710000000000',
      order_status: 'approved',
    };
    expect(verifyFondySignature(PASSWORD, params)).toBe(false);
  });

  it('should return false when a parameter has been tampered with', () => {
    const params: Record<string, string> = {
      order_id: 'ci_6ba7b810-9dad-11d1-80b4-00c04fd430c8_1710000000000',
      merchant_id: '1396424',
      order_status: 'approved',
      payment_id: '123456',
      amount: '500',
    };
    params.signature = buildSignature(PASSWORD, params);

    // Tamper with the amount after signing
    params.amount = '99999';

    expect(verifyFondySignature(PASSWORD, params)).toBe(false);
  });

  it('should return false when the wrong password is used', () => {
    const params: Record<string, string> = {
      order_id: 'ci_6ba7b810-9dad-11d1-80b4-00c04fd430c8_1710000000000',
      order_status: 'approved',
    };
    params.signature = buildSignature('correct_password', params);

    expect(verifyFondySignature('wrong_password', params)).toBe(false);
  });

  it('should exclude response_status from signature computation', () => {
    const params: Record<string, string> = {
      order_id: 'ci_6ba7b810-9dad-11d1-80b4-00c04fd430c8_1710000000000',
      merchant_id: '1396424',
      order_status: 'approved',
      payment_id: '123456',
    };
    params.signature = buildSignature(PASSWORD, params);

    // Adding response_status should not invalidate the signature
    params.response_status = 'success';

    expect(verifyFondySignature(PASSWORD, params)).toBe(true);
  });

  it('should handle empty string values by excluding them', () => {
    const params: Record<string, string> = {
      order_id: 'ci_6ba7b810-9dad-11d1-80b4-00c04fd430c8_1710000000000',
      merchant_id: '1396424',
      order_status: 'approved',
      optional_field: '',
    };
    params.signature = buildSignature(PASSWORD, params);

    expect(verifyFondySignature(PASSWORD, params)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// parseArtifactId
// ---------------------------------------------------------------------------

describe('parseArtifactId', () => {
  it('should extract a valid UUID from a well-formed order ID', () => {
    const uuid = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
    const orderId = `ci_${uuid}_1710000000000`;
    expect(parseArtifactId(orderId)).toBe(uuid);
  });

  it('should return null for an order ID without the ci_ prefix', () => {
    expect(parseArtifactId('bad_order_id')).toBeNull();
  });

  it('should return null for an empty string', () => {
    expect(parseArtifactId('')).toBeNull();
  });

  it('should return null when the UUID part is malformed', () => {
    expect(parseArtifactId('ci_not-a-valid-uuid_1710000000000')).toBeNull();
  });

  it('should return null when the timestamp part is missing', () => {
    const uuid = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
    expect(parseArtifactId(`ci_${uuid}`)).toBeNull();
  });

  it('should handle different valid UUIDs', () => {
    const testCases = [
      '123e4567-e89b-12d3-a456-426614174000',
      'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      '00000000-0000-0000-0000-000000000000',
    ];
    testCases.forEach((uuid) => {
      const orderId = `ci_${uuid}_9999999999999`;
      expect(parseArtifactId(orderId)).toBe(uuid);
    });
  });
});

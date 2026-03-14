/**
 * Tests for the new moment-specific backend additions:
 *  - engine getStatus returning contextId
 *  - lib/validations Zod schemas
 *  - lib/payment scaffold
 */

import { getStatus, CONTEXT_IDS, STATUSES } from '@/lib/engine';
import { generateVerifyHash } from '@/lib/engine.server';
import {
  contextSchema,
  statusQuerySchema,
  createMomentSchema,
  verifyQuerySchema,
  sealMomentSchema,
  listQuerySchema,
} from '@/lib/validations';
import { createSealCheckout, confirmSealPayment, CI_MOMENT_PRICE_USD } from '@/lib/payment';

// ---------------------------------------------------------------------------
// Engine — contextId in getStatus
// ---------------------------------------------------------------------------

describe('engine.getStatus (extended)', () => {
  it('returns contextId matching CONTEXT_IDS for career', () => {
    const result = getStatus('career');
    expect(result.contextId).toBe(CONTEXT_IDS.career);
  });

  it('returns contextId matching CONTEXT_IDS for love', () => {
    const result = getStatus('love');
    expect(result.contextId).toBe(CONTEXT_IDS.love);
  });

  it('returns contextId matching CONTEXT_IDS for timing', () => {
    const result = getStatus('timing');
    expect(result.contextId).toBe(CONTEXT_IDS.timing);
  });

  it('returns all expected fields', () => {
    const result = getStatus('career');
    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('minute');
    expect(result).toHaveProperty('artifactCode');
    expect(result).toHaveProperty('contextId');
    expect(STATUSES).toContain(result.status);
    expect(typeof result.minute).toBe('number');
    expect(result.artifactCode).toMatch(/^ci-[0-9a-f]{2}-[0-9a-f]{5}$/);
    expect(typeof result.contextId).toBe('number');
  });
});

// ---------------------------------------------------------------------------
// generateVerifyHash — 16 hex chars
// ---------------------------------------------------------------------------

describe('generateVerifyHash', () => {
  it('returns a 16-character hex string', () => {
    const hash = generateVerifyHash('ci-ab-12345', 28463841, 'PROCEED');
    expect(hash).toHaveLength(16);
    expect(hash).toMatch(/^[0-9a-f]{16}$/);
  });

  it('is deterministic for identical inputs', () => {
    const h1 = generateVerifyHash('ci-ab-12345', 28463841, 'PROCEED');
    const h2 = generateVerifyHash('ci-ab-12345', 28463841, 'PROCEED');
    expect(h1).toBe(h2);
  });
});

// ---------------------------------------------------------------------------
// validations — Zod schemas
// ---------------------------------------------------------------------------

describe('validations', () => {
  describe('contextSchema', () => {
    it('accepts valid context values', () => {
      expect(contextSchema.parse('career')).toBe('career');
      expect(contextSchema.parse('love')).toBe('love');
      expect(contextSchema.parse('timing')).toBe('timing');
    });

    it('rejects invalid context', () => {
      const result = contextSchema.safeParse('money');
      expect(result.success).toBe(false);
    });
  });

  describe('statusQuerySchema', () => {
    it('accepts a valid context', () => {
      const result = statusQuerySchema.safeParse({ context: 'career' });
      expect(result.success).toBe(true);
    });

    it('rejects missing context', () => {
      const result = statusQuerySchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe('createMomentSchema', () => {
    it('accepts minimal valid body', () => {
      const result = createMomentSchema.safeParse({ context: 'love' });
      expect(result.success).toBe(true);
    });

    it('accepts optional fields', () => {
      const result = createMomentSchema.safeParse({
        context: 'timing',
        ownerId: 'user-123',
        source: 'web',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.ownerId).toBe('user-123');
        expect(result.data.source).toBe('web');
      }
    });

    it('rejects invalid context', () => {
      const result = createMomentSchema.safeParse({ context: 'invalid' });
      expect(result.success).toBe(false);
    });
  });

  describe('verifyQuerySchema', () => {
    it('accepts valid artifactCode', () => {
      const result = verifyQuerySchema.safeParse({ artifactCode: 'ci-4a-92f8b' });
      expect(result.success).toBe(true);
    });

    it('rejects missing artifactCode', () => {
      const result = verifyQuerySchema.safeParse({ artifactCode: '' });
      expect(result.success).toBe(false);
    });
  });

  describe('sealMomentSchema', () => {
    it('accepts valid artifactCode', () => {
      const result = sealMomentSchema.safeParse({ artifactCode: 'ci-4a-92f8b' });
      expect(result.success).toBe(true);
    });

    it('rejects empty artifactCode', () => {
      const result = sealMomentSchema.safeParse({ artifactCode: '' });
      expect(result.success).toBe(false);
    });
  });

  describe('listQuerySchema', () => {
    it('applies defaults when no params provided', () => {
      const result = listQuerySchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.limit).toBe(20);
        expect(result.data.page).toBe(1);
      }
    });

    it('accepts context filter', () => {
      const result = listQuerySchema.safeParse({ context: 'career' });
      expect(result.success).toBe(true);
    });

    it('accepts status filter', () => {
      const result = listQuerySchema.safeParse({ status: 'PROCEED' });
      expect(result.success).toBe(true);
    });

    it('transforms sealed string "true" to boolean', () => {
      const result = listQuerySchema.safeParse({ sealed: 'true' });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.sealed).toBe(true);
    });

    it('transforms sealed string "false" to boolean', () => {
      const result = listQuerySchema.safeParse({ sealed: 'false' });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.sealed).toBe(false);
    });

    it('coerces limit to number', () => {
      const result = listQuerySchema.safeParse({ limit: '50' });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.limit).toBe(50);
    });

    it('rejects limit > 100', () => {
      const result = listQuerySchema.safeParse({ limit: '200' });
      expect(result.success).toBe(false);
    });
  });
});

// ---------------------------------------------------------------------------
// payment scaffold
// ---------------------------------------------------------------------------

describe('payment scaffold', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.STRIPE_SECRET_KEY;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('CI_MOMENT_PRICE_USD defaults to 5', () => {
    expect(CI_MOMENT_PRICE_USD).toBe(5);
  });

  it('createSealCheckout returns a URL containing the artifactCode when Stripe is not configured', async () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://ci-moment.vercel.app';
    const result = await createSealCheckout('ci-4a-92f8b');
    expect(result.checkoutUrl).toContain('ci-4a-92f8b');
    expect(result.sessionId).toBeNull();
  });

  it('confirmSealPayment returns paid: false stub', async () => {
    const result = await confirmSealPayment({});
    expect(result.paid).toBe(false);
    expect(result.paymentId).toBeNull();
  });
});

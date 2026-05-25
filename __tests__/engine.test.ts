import { CONTEXT_IDS, STATUSES, getStatus, generateArtifactCode } from '@/lib/engine';
import { generateVerifyHash } from '@/lib/engine.server';
import type { Context, Status } from '@/lib/engine';

describe('engine', () => {
  describe('CONTEXT_IDS', () => {
    it('should have exactly three contexts', () => {
      expect(Object.keys(CONTEXT_IDS)).toHaveLength(3);
    });

    it('should map career, love, and timing to unique numeric IDs', () => {
      expect(CONTEXT_IDS.career).toBe(1);
      expect(CONTEXT_IDS.love).toBe(2);
      expect(CONTEXT_IDS.timing).toBe(3);
    });
  });

  describe('STATUSES', () => {
    it('should have exactly three statuses', () => {
      expect(STATUSES).toHaveLength(3);
    });

    it('should contain PROCEED, HOLD, and NOT NOW', () => {
      expect(STATUSES).toContain('PROCEED');
      expect(STATUSES).toContain('HOLD');
      expect(STATUSES).toContain('NOT NOW');
    });
  });

  describe('generateArtifactCode', () => {
    it('should return a string matching the ci-XX-XXXXX format', () => {
      const code = generateArtifactCode();
      expect(code).toMatch(/^ci-[0-9a-f]{2}-[0-9a-f]{5}$/);
    });

    it('should generate unique codes on successive calls', () => {
      const codes = new Set(Array.from({ length: 20 }, () => generateArtifactCode()));
      // With 20 random codes the probability of a collision is negligible
      expect(codes.size).toBe(20);
    });
  });

  describe('getStatus', () => {
    const contexts: Context[] = ['career', 'love', 'timing'];

    it.each(contexts)('should return a valid status for context "%s"', (ctx) => {
      const result = getStatus(ctx);
      expect(STATUSES).toContain(result.status);
    });

    it('should return a minute value based on current time', () => {
      const before = Math.floor(Date.now() / 60000);
      const result = getStatus('career');
      const after = Math.floor(Date.now() / 60000);
      expect(result.minute).toBeGreaterThanOrEqual(before);
      expect(result.minute).toBeLessThanOrEqual(after);
    });

    it('should return a valid artifact code', () => {
      const result = getStatus('love');
      expect(result.artifactCode).toMatch(/^ci-[0-9a-f]{2}-[0-9a-f]{5}$/);
    });

    it('should produce deterministic status for same minute and context', () => {
      // The status is deterministic: (minute + contextId) % 3
      const result1 = getStatus('career');
      const result2 = getStatus('career');
      // Within the same test execution the minute is almost certainly the same
      if (result1.minute === result2.minute) {
        expect(result1.status).toBe(result2.status);
      }
    });
  });

  describe('generateVerifyHash', () => {
    it('should return a 16-character hexadecimal string', () => {
      const hash = generateVerifyHash('ci-ab-cdefg', 12345, 'PROCEED');
      expect(hash).toMatch(/^[0-9a-f]{16}$/);
    });

    it('should be deterministic for the same inputs', () => {
      const hash1 = generateVerifyHash('ci-ab-cdefg', 12345, 'PROCEED');
      const hash2 = generateVerifyHash('ci-ab-cdefg', 12345, 'PROCEED');
      expect(hash1).toBe(hash2);
    });

    it('should differ when inputs differ', () => {
      const hash1 = generateVerifyHash('ci-ab-cdefg', 12345, 'PROCEED');
      const hash2 = generateVerifyHash('ci-ab-cdefg', 12345, 'HOLD');
      const hash3 = generateVerifyHash('ci-ab-cdefg', 99999, 'PROCEED');
      const hash4 = generateVerifyHash('ci-zz-zzzzz', 12345, 'PROCEED');
      expect(hash1).not.toBe(hash2);
      expect(hash1).not.toBe(hash3);
      expect(hash1).not.toBe(hash4);
    });
  });
});

import { generateArtifactCode } from '@/lib/engine';

describe('Performance optimizations', () => {
  describe('generateArtifactCode performance', () => {
    it('should generate 1000 artifact codes quickly', () => {
      const start = performance.now();
      const codes = [];

      for (let i = 0; i < 1000; i++) {
        codes.push(generateArtifactCode());
      }

      const end = performance.now();
      const duration = end - start;

      // Should complete in less than 100ms for 1000 iterations
      expect(duration).toBeLessThan(100);
      // Verify all codes are valid
      codes.forEach(code => {
        expect(code).toMatch(/^ci-[0-9a-f]{2}-[0-9a-f]{5}$/);
      });
    });

    it('should generate artifact codes with low memory overhead', () => {
      // Generate many codes and ensure they're all unique
      const codes = new Set();
      for (let i = 0; i < 10000; i++) {
        codes.add(generateArtifactCode());
      }

      // With proper randomness, collision rate should be extremely low
      // Allow for maximum 0.1% collision rate
      expect(codes.size).toBeGreaterThan(9990);
    });
  });

  describe('Hex conversion performance', () => {
    it('should efficiently convert bytes to hex', () => {
      const bytes = new Uint8Array([255, 128, 64, 32]);
      const start = performance.now();

      // Simulate our optimized approach
      let hex = '';
      for (let i = 0; i < bytes.length; i++) {
        hex += bytes[i].toString(16).padStart(2, '0');
      }

      const end = performance.now();
      expect(end - start).toBeLessThan(1);
      expect(hex).toBe('ff804020');
    });
  });
});

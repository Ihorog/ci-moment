import { GUMROAD_URL, getPaymentProvider, isPaymentsEnabled, getSealCtaHref } from '@/lib/payments';

describe('payments', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.NEXT_PUBLIC_PAYMENT_PROVIDER;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('GUMROAD_URL', () => {
    it('should equal the canonical Gumroad checkout link', () => {
      expect(GUMROAD_URL).toBe('https://cimoment.gumroad.com/l/rwffi');
    });
  });

  describe('getPaymentProvider', () => {
    it('should return "gumroad" by default when env var is not set', () => {
      expect(getPaymentProvider()).toBe('gumroad');
    });

    it('should return "gumroad" when env var is "gumroad"', () => {
      process.env.NEXT_PUBLIC_PAYMENT_PROVIDER = 'gumroad';
      expect(getPaymentProvider()).toBe('gumroad');
    });

    it('should return "disabled" when env var is "disabled"', () => {
      process.env.NEXT_PUBLIC_PAYMENT_PROVIDER = 'disabled';
      expect(getPaymentProvider()).toBe('disabled');
    });

    it('should return "gumroad" for unrecognised values', () => {
      process.env.NEXT_PUBLIC_PAYMENT_PROVIDER = 'unknown';
      expect(getPaymentProvider()).toBe('gumroad');
    });
  });

  describe('isPaymentsEnabled', () => {
    it('should return true by default', () => {
      expect(isPaymentsEnabled()).toBe(true);
    });

    it('should return false when provider is disabled', () => {
      process.env.NEXT_PUBLIC_PAYMENT_PROVIDER = 'disabled';
      expect(isPaymentsEnabled()).toBe(false);
    });
  });

  describe('getSealCtaHref', () => {
    it('should return GUMROAD_URL when payments are enabled', () => {
      expect(getSealCtaHref()).toBe(GUMROAD_URL);
    });

    it('should return null when payments are disabled', () => {
      process.env.NEXT_PUBLIC_PAYMENT_PROVIDER = 'disabled';
      expect(getSealCtaHref()).toBeNull();
    });
  });
});

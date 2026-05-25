/**
 * Payment configuration module.
 *
 * Gumroad is the canonical payment provider. Set
 * `NEXT_PUBLIC_PAYMENT_PROVIDER=disabled` to hide the CTA entirely.
 *
 * Allowed values for NEXT_PUBLIC_PAYMENT_PROVIDER:
 *   - "gumroad"  (default) — open Gumroad checkout link
 *   - "disabled" — no payment CTA is rendered
 */

export const GUMROAD_URL = 'https://cimoment.gumroad.com/l/rwffi';

export type PaymentProvider = 'gumroad' | 'disabled';

/**
 * Returns the active payment provider from the environment variable.
 * Defaults to "gumroad" when the variable is absent or unrecognised.
 */
export function getPaymentProvider(): PaymentProvider {
  const raw = process.env.NEXT_PUBLIC_PAYMENT_PROVIDER;
  if (raw === 'disabled') return 'disabled';
  return 'gumroad';
}

/** Returns true when a payment CTA should be shown to the user. */
export function isPaymentsEnabled(): boolean {
  return getPaymentProvider() !== 'disabled';
}

/**
 * Returns the href for the "Seal this moment" CTA, or null when payments
 * are disabled.
 */
export function getSealCtaHref(): string | null {
  if (!isPaymentsEnabled()) return null;
  return GUMROAD_URL;
}

/**
 * Build the full Gumroad checkout URL for a specific artifact. The verify
 * hash is embedded as the `passthrough` parameter so it can be tied back to
 * the sealed artifact after payment. `wanted=true` forces the Gumroad
 * overlay directly to the checkout step.
 *
 * @param verifyHash The 16-character verification hash for the artifact.
 */
export function getCheckoutUrl(verifyHash: string): string {
  return `${GUMROAD_URL}?passthrough=${encodeURIComponent(verifyHash)}&wanted=true`;
}

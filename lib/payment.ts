/**
 * Payment abstraction layer — Stripe-ready scaffold.
 *
 * Currently a placeholder implementation. When Stripe is connected:
 *   1. Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET in .env
 *   2. Replace the stub bodies with real Stripe SDK calls
 *   3. No changes to route handlers are needed — the interface is stable
 *
 * Price in USD is controlled by CI_MOMENT_PRICE_USD (default $5).
 */

export const CI_MOMENT_PRICE_USD = Number(
  process.env.CI_MOMENT_PRICE_USD ?? '5'
);

export interface SealCheckoutResult {
  checkoutUrl: string;
  sessionId: string | null;
}

export interface SealPaymentConfirmation {
  artifactCode: string;
  paid: boolean;
  paymentId: string | null;
}

/**
 * Create a payment checkout session for sealing an artifact.
 *
 * Stub: returns a placeholder URL until Stripe is connected.
 * Replace this body with a real `stripe.checkout.sessions.create()` call.
 *
 * @param artifactCode The artifact code to seal after successful payment.
 */
export async function createSealCheckout(
  artifactCode: string
): Promise<SealCheckoutResult> {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    // Payment provider not yet connected — return stub response
    return {
      checkoutUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/verify?artifactCode=${encodeURIComponent(artifactCode)}&checkout=pending`,
      sessionId: null,
    };
  }

  // TODO: replace with real Stripe checkout session creation
  // const stripe = new Stripe(stripeKey);
  // const session = await stripe.checkout.sessions.create({ ... });
  // return { checkoutUrl: session.url, sessionId: session.id };

  return {
    checkoutUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/verify?artifactCode=${encodeURIComponent(artifactCode)}&checkout=pending`,
    sessionId: null,
  };
}

/**
 * Confirm a seal payment from a Stripe webhook event or checkout session.
 *
 * Stub: always returns `paid: false` until Stripe is connected.
 * Replace this body with real Stripe event/session verification logic.
 *
 * @param eventOrSession The raw Stripe event or checkout session object.
 */
export async function confirmSealPayment(
  eventOrSession: unknown
): Promise<SealPaymentConfirmation> {
  void eventOrSession; // suppress unused-variable warning in stub

  // TODO: replace with real Stripe event verification
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  // const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  // ...

  return {
    artifactCode: '',
    paid: false,
    paymentId: null,
  };
}

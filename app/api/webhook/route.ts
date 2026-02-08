import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { sealArtifact } from '@/lib/supabase';

// Initialize Stripe with the secret key. The webhook secret is used below for
// signature verification.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * Stripe webhook handler. Validates the signature using the raw request
 * payload and the Stripe webhook secret. On successful checkout sessions,
 * seals the corresponding artifact in Supabase. Returns a 200 response on
 * success and a 400 response on signature verification failure.
 */
export async function POST(request: Request) {
  // Stripe requires the raw body to verify the webhook signature. Using
  // request.text() preserves the body exactly as sent by Stripe.
  const body = await request.text();
  const sig = headers().get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
    }
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    const message = err?.message || 'Webhook signature verification failed';
    console.error('Stripe webhook error:', message);
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }

  // Only act on completed checkout sessions. Other events are ignored.
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const artifactCode = session.metadata?.artifact_code as string | undefined;
    const stripeSessionId = session.id as string | undefined;
    if (artifactCode && stripeSessionId) {
      try {
        await sealArtifact(artifactCode, stripeSessionId);
      } catch (err) {
        console.error('Error sealing artifact:', err);
        // We still return 200 so Stripe does not retry endlessly; the error is logged.
      }
    }
  }
  return new NextResponse(null, { status: 200 });
}
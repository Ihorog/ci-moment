import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import {
  CONTEXT_IDS,
  STATUSES,
  generateVerifyHash,
} from '@/lib/engine';
import { createArtifact } from '@/lib/supabase';

// Initialize Stripe client once per Lambda/container. The secret key must be
// provided on the server via environment variables.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * Handle POST requests to the seal API. This endpoint validates the
 * incoming payload, ensures the provided status is correct for the given
 * context and minute, persists the artifact in Supabase and creates a
 * Stripe checkout session for the user to seal their Ci Moment.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { artifactCode, context, status, lockedMinute } = body || {};

    // Validate required fields
    if (
      !artifactCode ||
      !context ||
      !status ||
      typeof lockedMinute !== 'number'
    ) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Validate context
    if (!(context in CONTEXT_IDS)) {
      return NextResponse.json({ error: 'Invalid context' }, { status: 400 });
    }
    // Validate status
    if (!STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    const contextId = CONTEXT_IDS[context as keyof typeof CONTEXT_IDS];
    const expectedStatus =
      STATUSES[(lockedMinute + contextId) % STATUSES.length];
    if (status !== expectedStatus) {
      return NextResponse.json(
        { error: 'Status does not match engine output' },
        { status: 400 }
      );
    }

    // Generate verification hash and persist artifact
    const verifyHash = generateVerifyHash(artifactCode, lockedMinute, status);
    const lockedAtIso = new Date(lockedMinute * 60000).toISOString();
    await createArtifact({
      artifact_code: artifactCode,
      context,
      status,
      locked_minute_utc: lockedMinute,
      locked_at_utc: lockedAtIso,
      verify_hash: verifyHash,
    });

    // Ensure NEXT_PUBLIC_URL is set
    const baseUrl = process.env.NEXT_PUBLIC_URL;
    if (!baseUrl) {
      return NextResponse.json(
        { error: 'Server configuration error: NEXT_PUBLIC_URL not set' },
        { status: 500 }
      );
    }

    // Create a Stripe Checkout Session for sealing the artifact
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Ci Moment Seal',
              description: `Artifact: ${artifactCode} · Status: ${status}`,
            },
            unit_amount: 500,
          },
          quantity: 1,
        },
      ],
      metadata: {
        artifact_code: artifactCode,
        verify_hash: verifyHash,
      },
      success_url: `${baseUrl}/verify/${verifyHash}?sealed=true`,
      cancel_url: `${baseUrl}?cancelled=true`,
    });

    return NextResponse.json(
      { checkoutUrl: session.url },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in seal route:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
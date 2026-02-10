import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import {
  CONTEXT_IDS,
  STATUSES,
} from '@/lib/engine';
import { generateVerifyHash } from '@/lib/engine.server';
import { createArtifact } from '@/lib/supabase';

/**
 * Generate a Fondy-compatible SHA-1 signature.
 *
 * The algorithm is:
 *   1. Sort the parameter keys alphabetically.
 *   2. Filter out keys whose value is empty and the 'signature' key.
 *   3. Join values with '|', prepending the merchant password.
 *   4. Return the SHA-1 hex digest.
 */
function generateFondySignature(
  password: string,
  params: Record<string, string | number>
): string {
  const sorted = Object.keys(params)
    .sort()
    .filter((key) => key !== 'signature' && params[key] !== '')
    .map((key) => params[key]);

  const raw = [password, ...sorted].join('|');
  return crypto.createHash('sha1').update(raw).digest('hex');
}

/**
 * Handle POST requests to the seal API. This endpoint validates the
 * incoming payload, ensures the provided status is correct for the given
 * context and minute, persists the artifact in Supabase and creates a
 * Fondy checkout session for the user to seal their Ci Moment.
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
    const artifact = await createArtifact({
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

    // Build stateless success URL
    const successUrl = `${baseUrl}/verify/${verifyHash}?sealed=true&status=${encodeURIComponent(status)}&context=${encodeURIComponent(context)}`;

    // Validate Fondy environment variables
    const merchantId = process.env.FONDY_MERCHANT_ID;
    const secretKey = process.env.FONDY_SECRET_KEY;
    if (!merchantId || !secretKey) {
      return NextResponse.json(
        { error: 'Server configuration error: Fondy credentials not set' },
        { status: 500 }
      );
    }

    // Build and sign the Fondy checkout request
    const fondyParams: Record<string, string | number> = {
      order_id: `ci_${artifact.id}_${Date.now()}`,
      merchant_id: merchantId,
      order_desc: `Ci Moment Seal: ${artifactCode}`,
      amount: 500, // cents — $5.00 USD
      currency: 'USD',
      response_url: successUrl,
    };
    fondyParams.signature = generateFondySignature(secretKey, fondyParams);

    // Send request to Fondy checkout API
    const fondyResponse = await fetch(
      'https://pay.fondy.eu/api/checkout/url/',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request: fondyParams }),
      }
    );

    const fondyData = await fondyResponse.json();

    if (
      !fondyData.response ||
      fondyData.response.response_status === 'failure'
    ) {
      const msg =
        fondyData.response?.error_message || 'Fondy checkout creation failed';
      console.error('Fondy error:', msg);
      return NextResponse.json({ error: msg }, { status: 502 });
    }

    return NextResponse.json(
      { checkoutUrl: fondyData.response.checkout_url },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in seal route:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
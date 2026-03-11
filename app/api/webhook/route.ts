import { NextResponse } from 'next/server';
import { verifyFondySignature, parseArtifactId } from '@/lib/fondy';
import { sealArtifactById } from '@/lib/supabase';

/**
 * Handle POST requests from Fondy's server callback (server_callback_url).
 *
 * Fondy sends a JSON body containing payment details when a transaction
 * completes (successfully or otherwise). This handler verifies the signature,
 * checks whether the payment was approved and, if so, marks the corresponding
 * artifact as sealed in Supabase.
 *
 * The handler always returns HTTP 200 so that Fondy does not retry the
 * callback, even when the payment was not approved. Errors are logged
 * server-side without exposing internal details to the caller.
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const secretKey = process.env.FONDY_SECRET_KEY;
    if (!secretKey) {
      console.error('Webhook: FONDY_SECRET_KEY is not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Fondy sends a JSON body; some versions wrap the payload in a `response`
    // object — unwrap it if present.
    const raw = await request.json();
    const params: Record<string, string> =
      raw && typeof raw === 'object' && 'response' in raw ? raw.response : raw;

    if (!params || typeof params !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // Convert all values to strings for signature verification.
    const stringParams: Record<string, string> = Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    );

    if (!verifyFondySignature(secretKey, stringParams)) {
      console.error('Webhook: invalid Fondy signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const { order_id, order_status, payment_id } = params;

    // Only seal artifacts for approved payments; log and return 200 for all
    // other statuses so Fondy does not retry.
    if (order_status !== 'approved') {
      return NextResponse.json(
        { message: `Payment status: ${order_status}` },
        { status: 200 }
      );
    }

    const artifactId = parseArtifactId(String(order_id));
    if (!artifactId) {
      console.error('Webhook: could not parse artifact ID from order_id:', order_id);
      return NextResponse.json(
        { error: 'Invalid order ID format' },
        { status: 400 }
      );
    }

    await sealArtifactById(artifactId, String(payment_id));

    return NextResponse.json({ message: 'Artifact sealed' }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

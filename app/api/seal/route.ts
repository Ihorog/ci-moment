import { NextRequest, NextResponse } from 'next/server';
import { generateVerifyHash } from '@/lib/engine.server';
import { createArtifact } from '@/lib/supabase';
import { getCheckoutUrl } from '@/lib/payments';
import type { Context, Status } from '@/lib/engine';

const VALID_CONTEXTS: Context[] = ['career', 'love', 'timing'];
const VALID_STATUSES: Status[] = ['PROCEED', 'HOLD', 'NOT NOW'];

/**
 * POST /api/seal
 *
 * Persists a Ci Moment artifact to Supabase and returns a Gumroad checkout
 * URL so the client can redirect the user to complete payment.
 *
 * Request body:
 *   { context, status, artifactCode, minute }
 *
 * Response:
 *   { verifyHash: string | null, checkoutUrl: string }
 *
 * If Supabase is not configured the artifact is not persisted, but the
 * checkout URL is still returned so the payment flow is not blocked.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  if (
    typeof b?.context !== 'string' ||
    typeof b?.status !== 'string' ||
    typeof b?.artifactCode !== 'string' ||
    typeof b?.minute !== 'number'
  ) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { context, status, artifactCode, minute } = b as {
    context: string;
    status: string;
    artifactCode: string;
    minute: number;
  };

  if (!VALID_CONTEXTS.includes(context as Context)) {
    return NextResponse.json({ error: 'Invalid context' }, { status: 400 });
  }
  if (!VALID_STATUSES.includes(status as Status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const verifyHash = generateVerifyHash(artifactCode, minute, status);

  let hashSaved = false;
  try {
    await createArtifact({
      artifact_code: artifactCode,
      context: context as Context,
      status: status as Status,
      locked_minute_utc: minute,
      locked_at_utc: new Date().toISOString(),
      verify_hash: verifyHash,
    });
    hashSaved = true;
  } catch (error) {
    // In production, a DB failure means the artifact won't be recoverable after
    // payment, so we surface a 500 rather than silently proceeding.
    // In non-production environments (preview/development) we allow the payment
    // flow to continue without DB persistence so the UI can be tested without
    // a Supabase instance.
    if (process.env.NODE_ENV === 'production') {
      console.error('Failed to persist artifact in production:', error);
      return NextResponse.json({ error: 'Failed to save artifact' }, { status: 500 });
    }
    console.error('Failed to persist artifact (non-production):', error);
  }

  const checkoutUrl = getCheckoutUrl(verifyHash);

  return NextResponse.json({
    verifyHash: hashSaved ? verifyHash : null,
    checkoutUrl,
  });
}
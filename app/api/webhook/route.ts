import { NextResponse } from 'next/server';

/**
 * /api/webhook is dormant in Gumroad-canonical mode.
 *
 * Gumroad handles its own payment confirmation; there is no server-side
 * webhook in the current configuration. This endpoint returns 410 Gone so
 * any stale callback attempt receives a clear, permanent signal.
 */
export async function POST(): Promise<NextResponse> {
  return NextResponse.json(
    { error: 'Webhook endpoint inactive in Gumroad mode' },
    { status: 410 }
  );
}

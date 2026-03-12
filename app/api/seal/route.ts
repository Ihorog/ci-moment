import { NextResponse } from 'next/server';

/**
 * /api/seal is dormant in Gumroad-canonical mode.
 *
 * The UI links directly to Gumroad checkout; this server-side endpoint is
 * not reachable in the current payment configuration. It returns 410 Gone
 * so callers receive a clear, permanent signal instead of a timeout or 404.
 */
export async function POST(): Promise<NextResponse> {
  return NextResponse.json(
    { error: 'Payment endpoint inactive in Gumroad mode' },
    { status: 410 }
  );
}
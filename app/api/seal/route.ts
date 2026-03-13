import { NextResponse } from 'next/server';

/**
 * /api/seal is dormant in direct-Gumroad mode.
 *
 * The client redirects straight to the Gumroad checkout link; there is no
 * server-side seal step. This endpoint returns 410 Gone so any stale call
 * receives a clear, permanent signal.
 */
export async function POST(): Promise<NextResponse> {
  return NextResponse.json(
    { error: 'Seal endpoint inactive — use direct Gumroad checkout' },
    { status: 410 }
  );
}

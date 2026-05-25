import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/health
 *
 * Simple liveness probe. Returns 200 with service metadata.
 * Safe for public use — contains no secrets or internal state.
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    ok: true,
    service: 'ci-moment',
    timestamp: new Date().toISOString(),
  });
}

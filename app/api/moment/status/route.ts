import { NextRequest, NextResponse } from 'next/server';
import { getStatus } from '@/lib/engine';
import { generateVerifyHash } from '@/lib/engine.server';
import { statusQuerySchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

/**
 * GET /api/moment/status?context=career
 *
 * Computes a deterministic status for the given context at the current minute.
 * Does NOT persist anything to the database — purely a read/compute operation.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const parsed = statusQuerySchema.safeParse({ context: searchParams.get('context') });

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: parsed.error.issues[0]?.message ?? 'Invalid request',
          details: parsed.error.flatten(),
        },
      },
      { status: 400 }
    );
  }

  const { context } = parsed.data;
  const { status, minute, artifactCode, contextId } = getStatus(context);
  const verifyHash = generateVerifyHash(artifactCode, minute, status);

  return NextResponse.json({
    ok: true,
    data: {
      context,
      contextId,
      minute,
      status,
      artifactCode,
      verifyHash,
    },
  });
}

export async function POST(): Promise<NextResponse> {
  return NextResponse.json(
    { ok: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Use GET' } },
    { status: 405 }
  );
}

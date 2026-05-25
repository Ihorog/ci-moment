import { NextRequest, NextResponse } from 'next/server';
import { sealMomentSchema } from '@/lib/validations';
import prisma from '@/lib/db';

/**
 * POST /api/moment/seal
 *
 * Permanently marks an artifact as sealed. If the artifact is already sealed
 * the current state is returned without modification (idempotent). The
 * canonical fields (minute, status, context, verifyHash) are never altered.
 *
 * Body: { artifactCode }
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: { code: 'VALIDATION_ERROR', message: 'Request body must be valid JSON' },
      },
      { status: 400 }
    );
  }

  const parsed = sealMomentSchema.safeParse(body);
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

  const { artifactCode } = parsed.data;

  try {
    const existing = await prisma.momentArtifact.findUnique({
      where: { artifactCode },
    });

    if (!existing) {
      return NextResponse.json(
        {
          ok: false,
          error: { code: 'NOT_FOUND', message: 'Artifact not found' },
        },
        { status: 404 }
      );
    }

    // Idempotent: return current state if already sealed
    if (existing.sealed) {
      return NextResponse.json({
        ok: true,
        data: {
          artifactCode: existing.artifactCode,
          sealed: existing.sealed,
          sealedAt: existing.sealedAt ? existing.sealedAt.toISOString() : null,
        },
      });
    }

    const now = new Date();
    const updated = await prisma.momentArtifact.update({
      where: { artifactCode },
      data: { sealed: true, sealedAt: now },
    });

    return NextResponse.json({
      ok: true,
      data: {
        artifactCode: updated.artifactCode,
        sealed: updated.sealed,
        sealedAt: updated.sealedAt ? updated.sealedAt.toISOString() : null,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      {
        ok: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to seal artifact', details: { message } },
      },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { ok: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Use POST' } },
    { status: 405 }
  );
}

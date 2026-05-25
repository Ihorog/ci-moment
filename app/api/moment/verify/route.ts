import { NextRequest, NextResponse } from 'next/server';
import { verifyQuerySchema } from '@/lib/validations';
import { generateVerifyHash } from '@/lib/engine.server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * GET /api/moment/verify?artifactCode=ci-XX-XXXXX
 *
 * Looks up the artifact, recomputes its verification hash from stored data,
 * compares it with the stored hash, and returns a `valid` flag. No
 * authentication is required — this endpoint is intentionally public.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const parsed = verifyQuerySchema.safeParse({ artifactCode: searchParams.get('artifactCode') });

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
    const artifact = await prisma.momentArtifact.findUnique({
      where: { artifactCode },
    });

    if (!artifact) {
      return NextResponse.json(
        {
          ok: false,
          error: { code: 'NOT_FOUND', message: 'Artifact not found' },
        },
        { status: 404 }
      );
    }

    // Recompute hash from stored canonical fields to validate integrity
    const recomputedHash = generateVerifyHash(
      artifact.artifactCode,
      artifact.minute,
      artifact.status
    );
    const valid = recomputedHash === artifact.verifyHash;

    return NextResponse.json({
      ok: true,
      data: {
        artifactCode: artifact.artifactCode,
        context: artifact.context,
        minute: artifact.minute,
        status: artifact.status,
        verifyHash: artifact.verifyHash,
        sealed: artifact.sealed,
        sealedAt: artifact.sealedAt ? artifact.sealedAt.toISOString() : null,
        valid,
        createdAt: artifact.createdAt.toISOString(),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      {
        ok: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to verify artifact', details: { message } },
      },
      { status: 500 }
    );
  }
}

export async function POST(): Promise<NextResponse> {
  return NextResponse.json(
    { ok: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Use GET' } },
    { status: 405 }
  );
}

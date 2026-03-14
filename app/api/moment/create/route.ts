import { NextRequest, NextResponse } from 'next/server';
import { getStatus } from '@/lib/engine';
import { generateVerifyHash } from '@/lib/engine.server';
import { createMomentSchema } from '@/lib/validations';
import prisma from '@/lib/db';

/**
 * POST /api/moment/create
 *
 * Computes a deterministic status for the given context and persists the
 * resulting artifact to the database. The artifact is created with
 * `sealed = false`.
 *
 * Body: { context, ownerId?, source? }
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

  const parsed = createMomentSchema.safeParse(body);
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

  const { context, ownerId, source } = parsed.data;
  const { status, minute, artifactCode, contextId } = getStatus(context);
  const verifyHash = generateVerifyHash(artifactCode, minute, status);

  try {
    // Protect against the (astronomically unlikely) collision on artifactCode.
    let attempts = 0;
    let code = artifactCode;
    let hash = verifyHash;

    while (attempts < 5) {
      const existing = await prisma.momentArtifact.findUnique({
        where: { artifactCode: code },
      });
      if (!existing) break;

      // Regenerate code and hash on collision
      const { artifactCode: newCode } = getStatus(context);
      code = newCode;
      hash = generateVerifyHash(code, minute, status);
      attempts++;
    }

    const artifact = await prisma.momentArtifact.create({
      data: {
        artifactCode: code,
        context,
        contextId,
        minute,
        status,
        verifyHash: hash,
        sealed: false,
        ownerId: ownerId ?? null,
        source: source ?? null,
      },
    });

    return NextResponse.json({
      ok: true,
      data: {
        artifactCode: artifact.artifactCode,
        context: artifact.context,
        contextId: artifact.contextId,
        minute: artifact.minute,
        status: artifact.status,
        verifyHash: artifact.verifyHash,
        sealed: artifact.sealed,
        createdAt: artifact.createdAt.toISOString(),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      {
        ok: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to create artifact', details: { message } },
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

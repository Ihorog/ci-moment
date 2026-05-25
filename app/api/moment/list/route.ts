import { NextRequest, NextResponse } from 'next/server';
import { listQuerySchema } from '@/lib/validations';
import prisma from '@/lib/db';
import type { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

/**
 * GET /api/moment/list
 *
 * Admin/dev listing endpoint. Supports filtering by context, status, and
 * sealed state, plus limit/page pagination.
 *
 * Query params: context?, status?, sealed?, limit?, page?
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;

  const rawParams = {
    context: searchParams.get('context') ?? undefined,
    status: searchParams.get('status') ?? undefined,
    sealed: searchParams.get('sealed') ?? undefined,
    limit: searchParams.get('limit') ?? undefined,
    page: searchParams.get('page') ?? undefined,
  };

  const parsed = listQuerySchema.safeParse(rawParams);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: parsed.error.issues[0]?.message ?? 'Invalid query parameters',
          details: parsed.error.flatten(),
        },
      },
      { status: 400 }
    );
  }

  const { context, status, sealed, limit, page } = parsed.data;

  const where: Prisma.MomentArtifactWhereInput = {};
  if (context !== undefined) where.context = context;
  if (status !== undefined) where.status = status;
  if (sealed !== undefined && sealed !== null) where.sealed = sealed;

  try {
    const [total, items] = await prisma.$transaction([
      prisma.momentArtifact.count({ where }),
      prisma.momentArtifact.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          artifactCode: true,
          context: true,
          contextId: true,
          minute: true,
          status: true,
          verifyHash: true,
          sealed: true,
          sealedAt: true,
          source: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      ok: true,
      data: {
        items: items.map((item) => ({
          ...item,
          sealedAt: item.sealedAt ? item.sealedAt.toISOString() : null,
          createdAt: item.createdAt.toISOString(),
        })),
        page,
        limit,
        total,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      {
        ok: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to list artifacts', details: { message } },
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

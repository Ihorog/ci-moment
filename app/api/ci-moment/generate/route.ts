import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateManuscript, formatArtifactId, renderSeal, renderText } from '@/lib/manuscript';

const generateSchema = z.object({
  context: z.enum(['career', 'love', 'timing'], {
    error: () => 'context must be one of: career, love, timing',
  }),
  signal: z.enum(['PROCEED', 'HOLD', 'NOT NOW'], {
    error: () => 'signal must be one of: PROCEED, HOLD, NOT NOW',
  }),
  minute: z.number().int().optional(),
  timestamp: z.string().optional(),
});

/**
 * POST /api/ci-moment/generate
 *
 * Generates a deterministic 8-symbol manuscript for the given context and
 * signal. Does NOT persist to the database — it is a pure compute endpoint.
 *
 * Body: { context, signal, minute?, timestamp? }
 *
 * Response:
 * {
 *   artifact_id,
 *   manuscript,     // compact string e.g. "∧×Y~∨○Y↺"
 *   symbol_map,     // { outer: [...], inner: [...], text: "...", seal_svg: "..." }
 *   timestamp,
 *   signal
 * }
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: { code: 'VALIDATION_ERROR', message: 'Request body must be valid JSON' } },
      { status: 400 }
    );
  }

  const parsed = generateSchema.safeParse(body);
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

  const { context, signal, minute: minuteInput, timestamp: timestampInput } = parsed.data;
  const now = new Date();
  const minute = minuteInput ?? Math.floor(now.getTime() / 60000);
  const timestamp = timestampInput ?? now.toISOString();

  const manuscript = generateManuscript(minute, context, signal);
  const artifact_id = formatArtifactId(timestamp, signal);

  return NextResponse.json({
    ok: true,
    data: {
      artifact_id,
      manuscript: manuscript.compact,
      symbol_map: {
        outer: manuscript.outer,
        inner: manuscript.inner,
        text: renderText(manuscript),
        seal_svg: renderSeal(manuscript),
      },
      timestamp,
      signal,
      context,
      minute,
    },
  });
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { ok: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Use POST' } },
    { status: 405 }
  );
}

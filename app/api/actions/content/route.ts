import { NextResponse } from 'next/server';
import { readManifestSafe, appendOplogEntry } from '@/lib/manifest-io';
import { validateManifest, buildOplogEntry } from '@/lib/manifest';
import { STATUSES } from '@/lib/engine';

// Always run fresh — content generation should reflect current state.
export const dynamic = 'force-dynamic';

/**
 * ADSA: content generation — "Ci Legends"
 *
 * Generates short, shareable text legends for each status based on the
 * current manifest state. These are designed for use as captions in
 * Twitter / TikTok social content by AI avatars (ambient presence strategy).
 *
 * GET /api/actions/content
 *
 * Response:
 *   { ok, timestamp, legends, audit }
 *
 * Each legend entry contains:
 *   - status: 'PROCEED' | 'HOLD' | 'NOT NOW'
 *   - headline: short hook line for social media
 *   - caption: expanded caption for TikTok / Twitter thread
 *   - hashtags: relevant hashtags for ambient discovery
 */
export async function GET(): Promise<NextResponse> {
  const timestamp = new Date().toISOString();

  // Verify system is healthy before generating content
  const manifestRaw = await readManifestSafe();
  const manifestValidation = validateManifest(manifestRaw);
  const ok = manifestValidation.valid;

  const legends = STATUSES.map((status) => {
    switch (status) {
      case 'PROCEED':
        return {
          status,
          headline: 'The signal is clear. Move now.',
          caption:
            'Stop overthinking. The moment aligned. Your Ci Moment says PROCEED — that is the clarity you were looking for. Lock it in.',
          hashtags: ['#decisionclarity', '#stopoverthinking', '#proceed', '#cimoment', '#digitalartifact'],
        };
      case 'HOLD':
        return {
          status,
          headline: 'Not yet. The timing is off.',
          caption:
            'Sometimes the wisest move is to wait. Your Ci Moment says HOLD — gather more signal before committing. This is not a no.',
          hashtags: ['#decisionclarity', '#timing', '#hold', '#cimoment', '#mindset'],
        };
      case 'NOT NOW':
        return {
          status,
          headline: 'Release it. This moment says no.',
          caption:
            "Your Ci Moment says NOT NOW. That's not defeat — that's clarity. The right moment will come. This one isn't it.",
          hashtags: ['#decisionclarity', '#stopoverthinking', '#notnow', '#cimoment', '#lettinggo'],
        };
      default:
        return { status, headline: '', caption: '', hashtags: [] };
    }
  });

  // Append audit oplog entry (best-effort; fails silently on read-only FS)
  const entry = buildOplogEntry('adsa.content_generation', ok);
  const audit = await appendOplogEntry(entry);

  return NextResponse.json({ ok, timestamp, legends, audit });
}

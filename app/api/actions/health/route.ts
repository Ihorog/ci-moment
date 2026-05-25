import { NextResponse } from 'next/server';
import { readManifestSafe, appendOplogEntry } from '@/lib/manifest-io';
import { validateManifest, buildOplogEntry } from '@/lib/manifest';

// Always run fresh — never cache health responses.
export const dynamic = 'force-dynamic';

/**
 * ADSA: health_selfcheck
 *
 * Validates environment variable presence (boolean only — never returns
 * secret values) and manifest invariants. Safe for Vercel serverless.
 *
 * GET /api/actions/health
 */
export async function GET(): Promise<NextResponse> {
  const timestamp = new Date().toISOString();

  // --- Environment checks (presence only) ---
  const envChecks: Record<string, boolean> = {
    SUPABASE_URL: Boolean(process.env.SUPABASE_URL),
    SUPABASE_SERVICE_KEY: Boolean(process.env.SUPABASE_SERVICE_KEY),
    NEXT_PUBLIC_URL: Boolean(process.env.NEXT_PUBLIC_URL),
  };
  const envOk = Object.values(envChecks).every(Boolean);

  // --- Manifest checks ---
  const manifestRaw = await readManifestSafe();
  const manifestValidation = validateManifest(manifestRaw);

  const checks = {
    env: { ok: envOk, details: envChecks },
    manifest: { ok: manifestValidation.valid, errors: manifestValidation.errors },
  };

  const ok = envOk && manifestValidation.valid;

  // --- Append audit entry (best-effort; fails silently on read-only FS) ---
  const entry = buildOplogEntry('adsa.health_selfcheck', ok);
  const audit = await appendOplogEntry(entry);

  return NextResponse.json({ ok, timestamp, checks, audit });
}

'use server';

import { appendOplogEntry } from '@/lib/manifest-io';

/**
 * Log a sketch → sealed transition for a specific artifact.
 * Called from client components after a successful Gumroad overlay purchase.
 *
 * The underlying write to manifest.json will silently no-op on Vercel
 * (read-only FS) but always returns the entry for structured logging.
 */
export async function logSealTransition(artifactCode: string): Promise<void> {
  await appendOplogEntry({
    action_id: 'artifact.seal_transition',
    timestamp: new Date().toISOString(),
    ok: true,
    detail: `Artifact ${artifactCode} transitioned from sketch to sealed receipt`,
  });
}

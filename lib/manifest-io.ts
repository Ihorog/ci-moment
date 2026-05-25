/**
 * Manifest I/O helpers.
 *
 * In Vercel serverless the filesystem is read-only at runtime. This module
 * provides a safe read strategy (reads from the deployed bundle) and a
 * best-effort write strategy that returns the entry regardless of whether
 * the write succeeds (logs on failure).
 */

import type { OplogEntry, OrganismManifest } from '@/lib/manifest';

/** Absolute path to the root manifest.json in the project. */
const MANIFEST_PATH = `${process.cwd()}/manifest.json`;

/**
 * Read manifest.json safely. Returns `null` if the file cannot be read or
 * parsed (e.g., during tests or when the file is absent).
 */
export async function readManifestSafe(): Promise<unknown> {
  try {
    const fs = await import('fs/promises');
    const raw = await fs.readFile(MANIFEST_PATH, 'utf8');
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

/**
 * Append an oplog entry to manifest.json.
 *
 * On Vercel (read-only FS) the write will fail; in that case the entry is
 * still returned so callers can include it in API responses / structured
 * logs without breaking.
 *
 * @returns The entry that was (or would have been) appended.
 */
export async function appendOplogEntry(entry: OplogEntry): Promise<OplogEntry> {
  try {
    const fs = await import('fs/promises');
    const raw = await fs.readFile(MANIFEST_PATH, 'utf8');
    const manifest = JSON.parse(raw) as OrganismManifest;
    manifest.oplog = [...manifest.oplog, entry];
    manifest.state.last_action_at = entry.timestamp;
    await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  } catch {
    // Silently degrade — filesystem may be read-only (Vercel) or absent (test).
    // The entry is always returned to the caller for in-response audit logging.
  }
  return entry;
}

import { createClient } from '@supabase/supabase-js';

/**
 * Initialize a Supabase client using the service role key. This client is
 * intended for server‑side use only. It bypasses Row Level Security and must
 * never be exposed to the client. Environment variables must be defined in
 * `.env` for the URL and service key.
 */
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'Supabase environment variables SUPABASE_URL and SUPABASE_SERVICE_KEY must be set'
  );
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export interface Artifact {
  id: string;
  artifact_code: string;
  context: 'career' | 'love' | 'timing';
  status: 'PROCEED' | 'HOLD' | 'NOT NOW';
  locked_minute_utc: number;
  locked_at_utc: string;
  is_sealed: boolean;
  sealed_at_utc: string | null;
  verify_hash: string;
  stripe_session_id: string | null;
}

export interface ArtifactInput {
  artifact_code: string;
  context: 'career' | 'love' | 'timing';
  status: 'PROCEED' | 'HOLD' | 'NOT NOW';
  locked_minute_utc: number;
  locked_at_utc: string;
  verify_hash: string;
}

/**
 * Insert a new artifact into the `artifacts` table. When creating an
 * artifact it is not yet sealed, so `is_sealed` is set to false and
 * `sealed_at_utc` and `stripe_session_id` are null. Returns the inserted
 * artifact on success or throws on failure.
 */
export async function createArtifact(
  data: ArtifactInput
): Promise<Artifact> {
  const { data: inserted, error } = await supabase
    .from('artifacts')
    .insert([{ ...data, is_sealed: false, sealed_at_utc: null, stripe_session_id: null }])
    .select()
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return inserted as unknown as Artifact;
}

/**
 * Mark an artifact as sealed after a successful payment. Updates the row
 * identified by its artifact code, setting the `is_sealed` flag to true,
 * recording the current UTC time and the Stripe session ID. Returns the
 * updated artifact or throws on failure.
 */
export async function sealArtifact(
  artifactCode: string,
  stripeSessionId: string
): Promise<Artifact> {
  const { data: updated, error } = await supabase
    .from('artifacts')
    .update({
      is_sealed: true,
      sealed_at_utc: new Date().toISOString(),
      stripe_session_id: stripeSessionId,
    })
    .eq('artifact_code', artifactCode)
    .select()
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return updated as unknown as Artifact;
}

/**
 * Retrieve an artifact by its verification hash. Returns null when not found.
 * This function does not require the artifact to be sealed, leaving the
 * responsibility for UI handling to the caller.
 */
export async function getArtifactByHash(
  hash: string
): Promise<Artifact | null> {
  const { data, error } = await supabase
    .from('artifacts')
    .select('*')
    .eq('verify_hash', hash)
    .limit(1);
  if (error) {
    throw new Error(error.message);
  }
  if (Array.isArray(data) && data.length > 0) {
    return data[0] as unknown as Artifact;
  }
  return null;
}
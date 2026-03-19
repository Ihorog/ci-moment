import { createClient } from '@supabase/supabase-js';

type Artifact = {
  id: number;
  verify_hash: string;
  status: 'UNLOCKED' | 'LOCKED';
  locked_at: string | null;
  payment_provider: string | null;
  payment_id: string | null;
};

function getServerSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error('Missing SUPABASE_URL');
  if (!key) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function sealByVerifyHash(
  verifyHash: string,
  paymentId: string,
  provider: string
) {
  const supabase = getServerSupabase();

  const { data: existing, error: findErr } = await supabase
    .from('artifacts')
    .select('id, verify_hash, status, locked_at, payment_provider, payment_id')
    .eq('verify_hash', verifyHash)
    .maybeSingle<Artifact>();

  if (findErr) throw new Error(`Supabase read failed: ${findErr.message}`);
  if (!existing) throw new Error('Invalid verify_hash (not found)');

  if (existing.status === 'LOCKED') {
    return { ok: true, idempotent: true, artifact: existing };
  }

  const { data: updated, error: updErr } = await supabase
    .from('artifacts')
    .update({
      status: 'LOCKED',
      payment_provider: provider,
      payment_id: paymentId,
    })
    .eq('verify_hash', verifyHash)
    .neq('status', 'LOCKED')
    .select('id, verify_hash, status, locked_at, payment_provider, payment_id')
    .single<Artifact>();

  if (updErr) throw new Error(`Supabase update failed: ${updErr.message}`);

  return { ok: true, idempotent: false, artifact: updated };
}

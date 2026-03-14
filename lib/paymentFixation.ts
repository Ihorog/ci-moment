// Function to seal payment using verifyHash
import { createClient } from './supabase';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function sealByVerifyHash(verifyHash: string, paymentId: string, provider: string) {
    const { data, error } = await supabase
        .from('artifacts')
        .select('*')
        .eq('verify_hash', verifyHash)
        .single();

    if (error || !data) {
        throw new Error('Invalid verify hash');
    }

    // implement locking mechanism if needed here
    const { error: updateError } = await supabase
        .from('artifacts')
        .update({ status: 'LOCKED', payment_provider: provider, payment_id: paymentId })
        .match({ verify_hash: verifyHash });

    if (updateError) {
        throw new Error('Failed to lock artifact: ' + updateError.message);
    }

    return 'Artifact sealed successfully';
}

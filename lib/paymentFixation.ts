import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'your_supabase_url';
const SUPABASE_SERVICE_ROLE_KEY = 'your_service_role_key';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function updatePaymentFixation(paymentId: string, newData: Record<string, unknown>) {
    // Check the current sealing/locking state of the artifact associated with this payment
    const { data: artifact, error: fetchError } = await supabase
        .from('artifacts')
        .select('*')
        .eq('payment_id', paymentId)
        .single();

    if (fetchError) {
        throw new Error(fetchError.message);
    }

    // If the artifact is already sealed, do not proceed with the update
    if (artifact && artifact.is_sealed) {
        return;
    }

    // Perform the update and lock the artifact
    const { error: updateError } = await supabase
        .from('artifacts')
        .update({ ...newData, locked_at_utc: new Date().toISOString() })
        .eq('payment_id', paymentId);

    if (updateError) {
        throw new Error(updateError.message);
    }
}

export { updatePaymentFixation };

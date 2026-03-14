import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'your_supabase_url';
const SUPABASE_SERVICE_ROLE_KEY = 'your_service_role_key';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function updatePaymentFixation(paymentId, newData) {
    // Check the current status of the payment
    const { data: payment, error: fetchError } = await supabase
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .single();

    if (fetchError) {
        throw new Error(fetchError.message);
    }

    // If the status is LOCKED, do not proceed with the update
    if (payment.status === 'LOCKED') {
        return;
    }

    // Perform the update  
    const { error: updateError } = await supabase
        .from('payments')
        .update({ ...newData, locked_at: new Date() })
        .eq('id', paymentId);

    if (updateError) {
        throw new Error(updateError.message);
    }
}

export { updatePaymentFixation };

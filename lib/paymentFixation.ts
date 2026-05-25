import { getArtifactByHash, sealArtifactByHash } from '@/lib/supabase';

export type PaymentProvider = 'gumroad';

export async function updatePaymentFixation(
  key: { verifyHash: string; provider: PaymentProvider },
  payment: { paymentId: string }
): Promise<void> {
  const artifact = await getArtifactByHash(key.verifyHash);

  if (artifact && artifact.is_sealed) {
    return;
  }

  await sealArtifactByHash(key.verifyHash, payment.paymentId);
}


import { NextRequest, NextResponse } from 'next/server';
import { updatePaymentFixation } from '@/lib/paymentFixation';
import { getArtifactByHash } from '@/lib/supabase';

/**
 * POST /api/fixate
 *
 * Seals an artifact after Gumroad payment redirect. This endpoint is called
 * automatically when the user lands on /verify/[hash]?sealed=true after
 * completing payment on Gumroad (free plan, no webhook).
 *
 * Body: { verifyHash: string }
 *
 * Returns:
 * - { status: 'sealed' } if artifact was successfully sealed
 * - { status: 'already_sealed' } if artifact was already sealed (idempotent)
 * - { error: ... } if validation fails or artifact not found
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { verifyHash } = body;

    // Validate verifyHash is present
    if (!verifyHash || typeof verifyHash !== 'string') {
      return NextResponse.json(
        { error: 'verifyHash is required and must be a string' },
        { status: 400 }
      );
    }

    // Check artifact exists in Supabase by verify_hash
    const artifact = await getArtifactByHash(verifyHash);

    if (!artifact) {
      return NextResponse.json(
        { error: 'artifact_not_found' },
        { status: 404 }
      );
    }

    // If already sealed, return already_sealed status (idempotent)
    if (artifact.is_sealed) {
      return NextResponse.json({ status: 'already_sealed' });
    }

    // Call paymentFixation to seal the artifact
    // Using 'gumroad_direct' as payment ID since we don't have webhook data
    await updatePaymentFixation(
      { verifyHash, provider: 'gumroad' },
      { paymentId: 'gumroad_direct' }
    );

    return NextResponse.json({ status: 'sealed' });
  } catch (error) {
    console.error('Error in /api/fixate:', error);
    return NextResponse.json(
      { error: 'internal_server_error' },
      { status: 500 }
    );
  }
}

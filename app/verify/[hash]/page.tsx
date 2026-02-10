import { getArtifactByHash } from '@/lib/supabase';

interface VerifyPageProps {
  params: { hash: string };
  searchParams: { sealed?: string };
}

/**
 * Verification page for Ci Moment artifacts. It retrieves the artifact by
 * verification hash from Supabase and displays its details if the artifact
 * exists and has been sealed. Otherwise a not found message is shown.
 *
 * When a user arrives with ?sealed=true (post-payment redirect) but the
 * webhook has not yet processed, a pending message is displayed instead of
 * "not found" to account for the race condition.
 *
 * The page is a server component — it does not include client side logic.
 */
export default async function VerifyPage({ params, searchParams }: VerifyPageProps) {
  const { hash } = params;
  const justPaid = searchParams.sealed === 'true';

  let artifact = null;
  try {
    artifact = await getArtifactByHash(hash);
  } catch (error) {
    // Log on the server but do not leak errors to the user interface.
    console.error('Error fetching artifact:', error);
  }

  // Artifact exists and is sealed — show full verification
  if (artifact && artifact.is_sealed) {
    const lockedAt = new Date(artifact.locked_at_utc)
      .toISOString()
      .replace('T', ' ')
      .replace('Z', ' UTC');

    return (
      <div
        style={{
          backgroundColor: '#0a0a0a',
          color: '#ffffff',
          fontFamily: 'monospace',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div>Issued: YES</div>
          <div>Artifact: {artifact.artifact_code}</div>
          <div>Status: {artifact.status}</div>
          <div>Locked at: {lockedAt}</div>
        </div>
      </div>
    );
  }

  // Artifact exists but is not yet sealed and user just came from payment —
  // the Stripe webhook may still be processing.
  if (artifact && !artifact.is_sealed && justPaid) {
    return (
      <div
        style={{
          backgroundColor: '#0a0a0a',
          color: '#ffffff',
          fontFamily: 'monospace',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
        }}
      >
        <div style={{ color: '#888', fontSize: '0.85rem' }}>
          Sealing your moment…
        </div>
        <div style={{ color: '#555', fontSize: '0.7rem' }}>
          Payment received. Refresh in a few seconds.
        </div>
      </div>
    );
  }

  // Artifact not found or not sealed
  return (
    <div
      style={{
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        fontFamily: 'monospace',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      Artifact not found
    </div>
  );
}
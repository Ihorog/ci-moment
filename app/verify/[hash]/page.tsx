import { getArtifactByHash } from '@/lib/supabase';

interface VerifyPageProps {
  params: { hash: string };
}

/**
 * Verification page for Ci Moment artifacts. It retrieves the artifact by
 * verification hash from Supabase and displays its details if the artifact
 * exists and has been sealed. Otherwise a not found message is shown.
 *
 * The page is a server component — it does not include client side logic.
 */
export default async function VerifyPage({ params }: VerifyPageProps) {
  const { hash } = params;
  let artifact = null;
  try {
    artifact = await getArtifactByHash(hash);
  } catch (error) {
    // Log on the server but do not leak errors to the user interface.
    console.error('Error fetching artifact:', error);
  }

  const notFound =
    !artifact || typeof artifact.is_sealed === 'undefined' || !artifact.is_sealed;

  if (notFound) {
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

  if (!artifact) {
    return <div>Artifact not found</div>;
  }

  // Format the locked_at timestamp into a human readable UTC string without
  // milliseconds. If the string already ends with 'Z' the replacement below
  // appends ' UTC' for clarity.
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
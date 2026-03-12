import { getArtifactByHash, Artifact } from '@/lib/supabase';
import { resolveVerifyState } from '@/lib/verify';
import { colors, typography, spacing } from '@/lib/design-system';
import type { Metadata } from 'next';

interface VerifyPageProps {
  params: { hash: string };
  searchParams: { sealed?: string };
}

/**
 * Generate dynamic metadata for artifact verification pages.
 * This enables custom OG images for each artifact when shared on social media.
 */
export async function generateMetadata({ params }: VerifyPageProps): Promise<Metadata> {
  const { hash } = params;

  let artifact: Artifact | null = null;
  try {
    artifact = await getArtifactByHash(hash);
  } catch (error) {
    console.error('Error fetching artifact for metadata:', error);
  }

  if (artifact) {
    const ogImageUrl = `/api/og?status=${encodeURIComponent(artifact.status)}&code=${encodeURIComponent(artifact.artifact_code)}&context=${encodeURIComponent(artifact.context)}`;

    return {
      title: `${artifact.status} — Ci Moment Artifact ${artifact.artifact_code}`,
      description: `Decision artifact: ${artifact.status}. Locked to a unique moment. Context: ${artifact.context}.`,
      openGraph: {
        title: `${artifact.status} — Ci Moment`,
        description: `Decision artifact locked to your unique moment.`,
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: `Ci Moment Artifact: ${artifact.status}`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${artifact.status} — Ci Moment`,
        description: 'Decision artifact locked to your unique moment.',
        images: [ogImageUrl],
      },
    };
  }

  return {
    title: 'Artifact Verification — Ci Moment',
    description: 'Verify your Ci Moment decision artifact.',
  };
}

/**
 * Verification page for Ci Moment artifacts. It retrieves the artifact by
 * verification hash from Supabase and displays its details based on the
 * artifact's seal state.
 *
 * States:
 * - Sealed: full artifact details are shown.
 * - Pending-payment (?sealed=true): auto-refreshes while the webhook processes.
 * - Unsealed (no payment yet): shows a clear "Pending" message so the artifact
 *   can be confirmed as persisted without completing payment. This is the
 *   expected state in Gumroad mode before a purchase is made.
 * - Not found: generic not-found message.
 *
 * The page is a server component — it does not include client side logic.
 */
export default async function VerifyPage({ params, searchParams }: VerifyPageProps) {
  const { hash } = params;
  const justPaid = searchParams.sealed === 'true';

  let artifact: Artifact | null = null;
  try {
    artifact = await getArtifactByHash(hash);
  } catch (error) {
    // Log on the server but do not leak errors to the user interface.
    console.error('Error fetching artifact:', error);
  }

  const state = resolveVerifyState(artifact, justPaid);

  // Artifact exists and is sealed — show full verification
  if (state === 'sealed') {
    const lockedAt = new Date(artifact!.locked_at_utc)
      .toISOString()
      .replace('T', ' ')
      .replace('Z', ' UTC');

    return (
      <div
        style={{
          backgroundColor: colors.background,
          color: '#ffffff',
          fontFamily: typography.fontMonospace,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.gapXSmall }}>
          <div>Issued: YES</div>
          <div>Artifact: {artifact!.artifact_code}</div>
          <div>Status: {artifact!.status}</div>
          <div>Locked at: {lockedAt}</div>
        </div>
      </div>
    );
  }

  // Artifact exists but not yet sealed — user was redirected back after payment
  // (?sealed=true). For webhook-based providers the webhook may still be
  // processing and the page will auto-refresh until the artifact is sealed. In
  // Gumroad canonical mode no webhook runs, so this state will not
  // auto-resolve; the page refreshes but the artifact stays unsealed.
  if (state === 'pending-payment') {
    return (
      <div
        style={{
          backgroundColor: colors.background,
          color: '#ffffff',
          fontFamily: typography.fontMonospace,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.gapBase,
        }}
      >
        {/* Auto-refresh for webhook-based providers that seal artifacts after redirect */}
        <meta httpEquiv="refresh" content="3" />
        <div style={{ color: colors.textTertiary, fontSize: typography.fontBase }}>
          Sealing your moment…
        </div>
        <div style={{ color: colors.textQuaternary, fontSize: typography.fontXSmall }}>
          Payment received. Checking for confirmation…
        </div>
      </div>
    );
  }

  // Artifact exists but payment has not been received yet.
  // In Gumroad mode this is the normal state before a purchase is completed.
  if (state === 'unsealed') {
    return (
      <div
        style={{
          backgroundColor: colors.background,
          color: colors.textPrimary,
          fontFamily: typography.fontMonospace,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.gapBase,
        }}
      >
        <div style={{ color: colors.textTertiary, fontSize: typography.fontBase }}>
          Artifact: {artifact!.artifact_code}
        </div>
        <div style={{ color: colors.textQuaternary, fontSize: typography.fontXSmall }}>
          Status: PENDING — payment not yet confirmed.
        </div>
      </div>
    );
  }

  // No artifact record found for this hash
  return (
    <div
      style={{
        backgroundColor: colors.background,
        color: '#ffffff',
        fontFamily: typography.fontMonospace,
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
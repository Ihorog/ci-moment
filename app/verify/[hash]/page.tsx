import { getArtifactByHash, Artifact } from '@/lib/supabase';
import { resolveVerifyState } from '@/lib/verify';
import { colors, typography, spacing, effects } from '@/lib/design-system';
import ArtifactBarcode from '@/components/ArtifactBarcode';
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
      description: `Decision artifact: ${artifact.status}. Stop overthinking — this moment is locked. Context: ${artifact.context}.`,
      openGraph: {
        title: `${artifact.status} — Ci Moment`,
        description: `Your decision clarity, locked as a digital artifact.`,
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
        description: 'Stop overthinking. Decision clarity locked to a digital artifact.',
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
 * - Sealed: full artifact details shown as a "digital physical object" card.
 * - Pending-payment (?sealed=true): auto-refreshes while the webhook processes.
 * - Unsealed (no payment yet): shows a clear "Pending" message.
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

  // Artifact exists and is sealed — show full verification as digital artifact card
  if (state === 'sealed') {
    const lockedAt = new Date(artifact!.locked_at_utc)
      .toISOString()
      .replace('T', ' ')
      .replace('Z', ' UTC');

    const statusColor =
      artifact!.status === 'PROCEED'
        ? colors.statusProceed
        : artifact!.status === 'HOLD'
          ? colors.statusHold
          : colors.statusNotNow;

    return (
      <div
        style={{
          backgroundColor: colors.background,
          color: colors.textPrimary,
          fontFamily: typography.fontMonospace,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing.gapBase,
        }}
      >
        {/* Digital artifact card — wallet proportions */}
        <div
          style={{
            maxWidth: effects.walletCardMaxWidth,
            width: '90%',
            aspectRatio: effects.walletCardAspectRatio,
            backgroundColor: colors.background,
            border: `1px solid ${colors.borderPrimary}`,
            borderRadius: '12px',
            boxShadow: effects.paperShadow,
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            WebkitMaskImage: effects.paperTextureMask,
            maskImage: effects.paperTextureMask,
            WebkitMaskSize: effects.paperTextureMaskSize,
            maskSize: effects.paperTextureMaskSize,
          }}
        >
          {/* Holographic overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: effects.holographicGradient(colors),
              backgroundSize: '200% 200%',
              backgroundPosition: '50% 50%',
              opacity: 0.06,
              pointerEvents: 'none',
            }}
          />

          {/* Card content */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Header label */}
            <div
              style={{
                fontSize: typography.fontXXXSmall,
                color: colors.textMuted,
                letterSpacing: typography.letterSpacingXWide,
                marginBottom: spacing.gapSmall,
                textTransform: 'uppercase',
              }}
            >
              CI MOMENT • SEALED ARTIFACT
            </div>

            {/* Status */}
            <div
              style={{
                fontSize: typography.fontLarge,
                fontWeight: typography.fontWeightLight,
                letterSpacing: typography.letterSpacingMedium,
                color: statusColor,
                marginBottom: spacing.gapMedium,
                textTransform: 'uppercase',
              }}
            >
              {artifact!.status}
            </div>

            {/* Info block */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.gapXXSmall,
                fontSize: typography.fontXXSmall,
                color: colors.textQuinary,
              }}
            >
              <div>ID: {artifact!.artifact_code}</div>
              <div>{lockedAt}</div>
              <div style={{ textTransform: 'capitalize' }}>{artifact!.context}</div>
            </div>

            <ArtifactBarcode artifactCode={artifact!.artifact_code} height={24} opacity={0.4} />
          </div>

          {/* Footer */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: typography.fontXXSmall,
              color: colors.textMuted,
              borderTop: `1px solid ${colors.borderTertiary}`,
              paddingTop: spacing.gapXSmall,
            }}
          >
            <div style={{ letterSpacing: typography.letterSpacingXSmall }}>ISSUED: VERIFIED</div>
            <div style={{ letterSpacing: typography.letterSpacingXSmall }}>cimoment.com</div>
          </div>
        </div>
      </div>
    );
  }

  // Artifact exists but not yet sealed — user was redirected back after payment
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

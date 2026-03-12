import type { Metadata } from "next";
import { colors, typography, spacing } from "@/lib/design-system";

export const metadata: Metadata = {
  title: "Should I Do It? — Instant Decision Signal",
  description:
    "Feeling uncertain about a decision? Ci Moment gives you an instant signal based on your personal moment in time.",
  alternates: {
    canonical: "https://ci-moment.vercel.app/should-i-do-it",
  },
  openGraph: {
    title: "Should I Do It? — Instant Decision Signal",
    description:
      "Get instant clarity for a personal decision in seconds.",
    url: "https://ci-moment.vercel.app/should-i-do-it",
    siteName: "Ci Moment",
    type: "website",
  },
};

const GUMROAD_URL = "https://cimoment.gumroad.com/l/rwffi";

export default function ShouldIDoItPage() {
  return (
    <main
      style={{
        maxWidth: "560px",
        margin: "0 auto",
        padding: "4rem 2rem",
        fontFamily: typography.fontMonospace,
        color: colors.textPrimary,
        backgroundColor: colors.background,
        minHeight: "100vh",
      }}
    >
      <h1 style={{ fontSize: typography.fontLarge, fontWeight: typography.fontWeightNormal, marginBottom: spacing.gapMedium }}>
        Should I Do It?
      </h1>

      <p style={{ fontSize: typography.fontBase, color: colors.textTertiary, lineHeight: 1.8, marginBottom: spacing.gapXLarge }}>
        Uncertainty is part of every real decision. Whether it&apos;s a career move,
        a relationship step, or simply the right timing — sometimes you just need a
        signal. Ci Moment reads your personal moment and returns a clear answer:
        proceed, hold, or not now. No analysis paralysis. No endless second-guessing.
        Just an instant signal anchored to your exact moment in time.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: spacing.gapXSmall }}>
        <a
          href={GUMROAD_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            border: `1px solid ${colors.borderSecondary}`,
            color: colors.textQuinary,
            padding: spacing.paddingSmall,
            fontSize: typography.fontXXXSmall,
            fontFamily: typography.fontMonospace,
            textDecoration: "none",
            letterSpacing: typography.letterSpacingSmall,
          }}
        >
          Seal this moment — $5
        </a>
        <p style={{ fontSize: typography.fontTiny, color: colors.borderTertiary, margin: 0 }}>
          Lock this signal as a personal checkpoint.
        </p>
      </div>
    </main>
  );
}

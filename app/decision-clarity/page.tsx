import type { Metadata } from "next";
import { colors, typography, spacing } from "@/lib/design-system";

export const metadata: Metadata = {
  title: "Decision Clarity Tool — Get Your Answer in Seconds",
  description:
    "Ci Moment is a lightweight decision clarity tool. Select a context and receive your personal signal in seconds.",
  alternates: {
    canonical: "https://ci-moment.vercel.app/decision-clarity",
  },
  openGraph: {
    title: "Decision Clarity Tool — Get Your Answer in Seconds",
    description:
      "Get instant clarity for a personal decision in seconds.",
    url: "https://ci-moment.vercel.app/decision-clarity",
    siteName: "Ci Moment",
    type: "website",
  },
};

const GUMROAD_URL = "https://cimoment.gumroad.com/l/rwffi";

export default function DecisionClarityPage() {
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
        Decision Clarity
      </h1>

      <p style={{ fontSize: typography.fontBase, color: colors.textTertiary, lineHeight: 1.8, marginBottom: spacing.gapXLarge }}>
        Instant clarity means cutting through noise and getting a direct signal for
        your personal decision. Ci Moment ties your answer to the exact UTC minute
        you ask — making it unique to your moment. Choose a context — Career, Love,
        or Timing — and receive your signal in seconds. Clear, minimal, and personal.
        No accounts, no algorithms, no delay.
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

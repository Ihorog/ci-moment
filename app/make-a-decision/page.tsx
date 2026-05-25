import type { Metadata } from "next";
import { colors, typography, spacing } from "@/lib/design-system";

export const metadata: Metadata = {
  title: "Make a Decision Fast — Ci Moment",
  description:
    "Stop overthinking. Ci Moment helps you finalize a choice quickly with an instant personal signal tied to your exact moment in time.",
  alternates: {
    canonical: "https://ci-moment.vercel.app/make-a-decision",
  },
  openGraph: {
    title: "Make a Decision Fast — Ci Moment",
    description:
      "Get instant clarity for a personal decision in seconds.",
    url: "https://ci-moment.vercel.app/make-a-decision",
    siteName: "Ci Moment",
    type: "website",
  },
};

const GUMROAD_URL = "https://cimoment.gumroad.com/l/rwffi";

export default function MakeADecisionPage() {
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
        Make a Decision Fast
      </h1>

      <p style={{ fontSize: typography.fontBase, color: colors.textTertiary, lineHeight: 1.8, marginBottom: spacing.gapXLarge }}>
        Overthinking a choice costs time and energy. Ci Moment gives you a way to
        finalize your decision quickly — select your context, receive your signal,
        and move forward. Each signal is locked to your exact moment, making it
        uniquely yours. Seal it to preserve a cryptographic record of the checkpoint
        you crossed. One moment. One answer. No hesitation.
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

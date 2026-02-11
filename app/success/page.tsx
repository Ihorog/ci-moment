"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { colors, typography, spacing, transitions } from "@/lib/design-system";

function SuccessContent() {
  const searchParams = useSearchParams();
  const context = searchParams.get("context");
  const status = searchParams.get("status");

  return (
    <main
      style={{
        width: "100%",
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: spacing.gapMedium,
        }}
      >
        <h1
          style={{
            fontSize: typography.fontLarge,
            fontWeight: typography.fontWeightLight,
            letterSpacing: typography.letterSpacingBase,
            color: colors.statusProceed,
            margin: 0,
          }}
        >
          Moment sealed.
        </h1>

        <p
          style={{
            fontSize: typography.fontSmall,
            color: colors.textTertiary,
            letterSpacing: typography.letterSpacingXSmall,
            margin: 0,
          }}
        >
          Your decision checkpoint is locked.
        </p>

        {context && status && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: spacing.gapXXSmall,
              fontSize: typography.fontXXSmall,
              color: colors.textQuaternary,
              marginTop: spacing.gapXSmall,
            }}
          >
            <div style={{ textTransform: "capitalize" }}>{context}</div>
            <div style={{ textTransform: "uppercase", letterSpacing: typography.letterSpacingMedium }}>
              {status}
            </div>
          </div>
        )}

        <a
          href="/"
          style={{
            marginTop: spacing.gapLarge,
            background: "transparent",
            border: `1px solid ${colors.borderTertiary}`,
            color: colors.textMuted,
            padding: spacing.paddingSmall,
            cursor: "pointer",
            fontSize: typography.fontXXSmall,
            fontFamily: "inherit",
            textDecoration: "none",
            transition: `all ${transitions.fast}`,
            letterSpacing: typography.letterSpacingXSmall,
          }}
        >
          Back to Ci Moment
        </a>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}

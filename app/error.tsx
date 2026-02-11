"use client";

import { useState } from "react";
import { colors, typography, spacing, transitions, layout } from "@/lib/design-system";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  const [hover, setHover] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        gap: spacing.gapLarge,
      }}
    >
      <div
        style={{
          fontSize: typography.fontXXXSmall,
          color: colors.textMuted,
          letterSpacing: typography.letterSpacingXWide,
          textTransform: "uppercase",
        }}
      >
        ERROR
      </div>

      <div
        style={{
          fontSize: typography.fontMedium,
          fontWeight: typography.fontWeightLight,
          color: colors.textTertiary,
          letterSpacing: typography.letterSpacingSmall,
        }}
      >
        Something went wrong.
      </div>

      <button
        onClick={reset}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: "transparent",
          border: `1px solid ${hover ? colors.hoverBorderSecondary : colors.borderSecondary}`,
          color: hover ? colors.hoverTextPrimary : colors.textSecondary,
          padding: spacing.paddingMedium,
          cursor: "pointer",
          fontSize: typography.fontSmall,
          letterSpacing: typography.letterSpacingSmall,
          fontFamily: "inherit",
          transition: `border-color ${transitions.fast}, color ${transitions.fast}`,
          minHeight: layout.minTouchTarget,
        }}
      >
        Try again
      </button>
    </div>
  );
}

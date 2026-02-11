"use client";

import { useState } from "react";
import { colors, typography, spacing, transitions, layout } from "@/lib/design-system";

export default function NotFound() {
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
          letterSpacing: typography.letterSpacingWide,
          textTransform: "uppercase",
        }}
      >
        404
      </div>

      <div
        style={{
          fontSize: typography.fontMedium,
          fontWeight: typography.fontWeightLight,
          color: colors.textSecondary,
          letterSpacing: typography.letterSpacingSmall,
        }}
      >
        This moment doesn&apos;t exist.
      </div>

      <a
        href="/"
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
          textDecoration: "none",
          minHeight: layout.minTouchTarget,
          display: "flex",
          alignItems: "center",
        }}
      >
        Return
      </a>
    </div>
  );
}

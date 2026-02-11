"use client";

import { useState, memo } from "react";
import { ContextType } from "@/app/page";
import { colors, typography, spacing, transitions, layout } from "@/lib/design-system";

interface LandingProps {
  onSelect: (ctx: ContextType) => void;
}

export default function Landing({ onSelect }: LandingProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      {/* Top Brand */}
      <div
        style={{
          position: "absolute",
          top: "3rem",
          fontSize: typography.fontXSmall,
          letterSpacing: typography.letterSpacingWide,
          color: colors.textTertiary,
          textTransform: "uppercase",
        }}
      >
        Ci
      </div>

      {/* Main Headline */}
      <h1
        style={{
          fontSize: typography.fontLarge,
          fontWeight: typography.fontWeightNormal,
          color: colors.textPrimary,
          margin: `0 0 ${spacing.gapXLarge} 0`,
          textAlign: "center",
        }}
      >
        Is now your Ci Moment?
      </h1>

      {/* Buttons Container */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: spacing.gapBase,
          width: "100%",
          maxWidth: layout.maxContentWidth,
        }}
      >
        <LandingButton label="Career" onClick={() => onSelect("career")} />
        <LandingButton label="Love" onClick={() => onSelect("love")} />
        <LandingButton label="Timing" onClick={() => onSelect("timing")} />
      </div>

      {/* Footer Disclaimer */}
      <div
        style={{
          position: "absolute",
          bottom: spacing.gapLarge,
          fontSize: typography.fontXXSmall,
          color: colors.textMuted,
          textAlign: "center",
          width: "100%",
        }}
      >
        Not advice. Not prediction. A personal moment signal.
      </div>
    </div>
  );
}

// Sub-component for Hover State management
const LandingButton = memo(function LandingButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "transparent",
        border: `1px solid ${hover ? colors.hoverBorderSecondary : colors.borderSecondary}`,
        color: hover ? colors.hoverTextPrimary : colors.textSecondary,
        padding: spacing.paddingLarge,
        cursor: "pointer",
        textTransform: "capitalize",
        fontSize: typography.fontBase,
        letterSpacing: typography.letterSpacingBase,
        fontFamily: "inherit",
        transition: `border-color ${transitions.fast}, color ${transitions.fast}`,
        width: "100%",
        minHeight: layout.minTouchTarget,
      }}
    >
      {label}
    </button>
  );
});
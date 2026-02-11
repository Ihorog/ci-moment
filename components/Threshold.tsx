"use client";

import { useEffect, useState, memo } from "react";
import { colors, typography, spacing, transitions, layout, animations } from "@/lib/design-system";

interface ThresholdProps {
  onConfirm: () => void;
  onBack: () => void;
}

export default function Threshold({ onConfirm, onBack }: ThresholdProps) {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Trigger fade in on mount
    const timer = setTimeout(() => setOpacity(1), animations.fadeInDelay);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        opacity: opacity,
        transition: `opacity ${transitions.slow}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.gapLarge,
      }}
    >
      <div
        style={{
          fontSize: typography.fontBase,
          color: colors.textSecondary,
          textAlign: "center",
          letterSpacing: typography.letterSpacingXSmall,
        }}
      >
        This moment will be locked.
      </div>

      <div style={{ display: "flex", gap: spacing.gapBase }}>
        <ThresholdButton
          label="Confirm"
          primary={true}
          onClick={onConfirm}
        />
        <ThresholdButton
          label="Not now"
          primary={false}
          onClick={onBack}
        />
      </div>
    </div>
  );
}

const ThresholdButton = memo(function ThresholdButton({
  label,
  primary,
  onClick,
}: {
  label: string;
  primary: boolean;
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);

  const baseBorder = primary ? colors.borderPrimary : colors.borderTertiary;
  const hoverBorder = primary ? colors.hoverBorderPrimary : colors.hoverBorderTertiary;
  const baseColor = primary ? colors.textPrimary : colors.textQuaternary;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "transparent",
        border: `1px solid ${hover ? hoverBorder : baseBorder}`,
        color: baseColor,
        padding: spacing.paddingMedium,
        cursor: "pointer",
        fontSize: typography.fontBase,
        letterSpacing: typography.letterSpacingSmall,
        fontFamily: "inherit",
        transition: `border-color ${transitions.fast}`,
        minHeight: layout.minTouchTarget,
        minWidth: "100px",
      }}
    >
      {label}
    </button>
  );
});
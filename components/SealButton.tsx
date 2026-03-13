"use client";

import { memo } from "react";
import { colors, typography, spacing, transitions, layout } from "@/lib/design-system";
import { GUMROAD_URL, isPaymentsEnabled } from "@/lib/payments";

interface SealButtonProps {
  context: string | null;
  /** @deprecated no longer used — kept for call-site compatibility */
  status?: string;
  /** @deprecated no longer used — kept for call-site compatibility */
  artifactCode?: string;
  /** @deprecated no longer used — kept for call-site compatibility */
  minute?: number;
}

const SealButton = memo(function SealButton({ context }: SealButtonProps) {
  if (!context || !isPaymentsEnabled()) return null;

  const handleSeal = () => {
    window.location.href = GUMROAD_URL;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: spacing.gapXSmall }}>
      <button
        onClick={handleSeal}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = colors.hoverBorderPrimary;
          (e.currentTarget as HTMLButtonElement).style.color = colors.textSecondary;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = colors.borderPrimary;
          (e.currentTarget as HTMLButtonElement).style.color = colors.textTertiary;
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          border: `1px solid ${colors.borderPrimary}`,
          color: colors.textTertiary,
          padding: spacing.paddingSmall,
          cursor: "pointer",
          fontSize: typography.fontXSmall,
          fontFamily: "inherit",
          textDecoration: "none",
          letterSpacing: typography.letterSpacingSmall,
          transition: `all ${transitions.fast}`,
          minHeight: layout.minTouchTarget,
        }}
      >
        Seal this moment \u2014 $5
      </button>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: spacing.gapXXXSmall }}>
        <div style={{ fontSize: typography.fontTiny, color: colors.textQuinary }}>
          Lock this signal as a personal checkpoint.
        </div>
        <div style={{ fontSize: typography.fontTiny, color: colors.textQuinary }}>
          Secure checkout powered by Gumroad.
        </div>
      </div>
    </div>
  );
});

export default SealButton;

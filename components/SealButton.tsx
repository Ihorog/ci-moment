"use client";

import { useState, memo } from "react";
import { colors, typography, spacing, transitions, layout } from "@/lib/design-system";
import { getSealCtaHref } from "@/lib/payments";

interface SealButtonProps {
  context: string | null;
  status: string;
  artifactCode: string;
}

const SealButton = memo(function SealButton({
  context,
  status,
  artifactCode,
}: SealButtonProps) {
  const [hover, setHover] = useState(false);

  const ctaHref = getSealCtaHref();

  if (!context || !status || !artifactCode || !ctaHref) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: spacing.gapXSmall }}>
      <a
        href={ctaHref}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          border: `1px solid ${hover ? colors.hoverBorderTertiary : colors.borderTertiary}`,
          color: hover ? colors.textQuaternary : colors.textMuted,
          opacity: hover ? 1 : 0.6,
          padding: spacing.paddingSmall,
          cursor: "pointer",
          fontSize: typography.fontXXXSmall,
          fontFamily: "inherit",
          textDecoration: "none",
          transition: `all ${transitions.fast}`,
          minHeight: layout.minTouchTarget,
        }}
      >
        Seal this moment — $5
      </a>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: spacing.gapXXXSmall }}>
        <div style={{ fontSize: typography.fontTiny, color: colors.borderTertiary }}>
          Lock this signal as a personal checkpoint.
        </div>
        <div style={{ fontSize: typography.fontTiny, color: colors.borderTertiary }}>
          Secure checkout powered by Gumroad.
        </div>
      </div>
    </div>
  );
});

export default SealButton;
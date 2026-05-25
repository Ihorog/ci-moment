"use client";

import { memo, useState } from "react";
import { colors, typography, spacing, transitions, layout } from "@/lib/design-system";
import { GUMROAD_URL, isPaymentsEnabled } from "@/lib/payments";

interface SealButtonProps {
  context: string | null;
  verifyHash: string;
  /** @deprecated no longer used — kept for call-site compatibility */
  status?: string;
  /** @deprecated no longer used — kept for call-site compatibility */
  artifactCode?: string;
  /** @deprecated no longer used — kept for call-site compatibility */
  minute?: number;
}

const SealButton = memo(function SealButton({ context, verifyHash }: SealButtonProps) {
  const [hovered, setHovered] = useState(false);

  if (!context || !isPaymentsEnabled()) return null;

  // Build redirect URL that includes sealed=true parameter
  const redirectUrl = `${process.env.NEXT_PUBLIC_URL}/verify/${verifyHash}?sealed=true`;
  const gumroadUrl = `${GUMROAD_URL}?wanted=true&redirect=${encodeURIComponent(redirectUrl)}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: spacing.gapXSmall }}>
      {/*
        Gumroad overlay checkout: clicking opens an in-page overlay instead of
        redirecting. The embed script (loaded in layout.tsx) intercepts this
        anchor and renders the payment modal inline.
      */}
      <a
        href={gumroadUrl}
        data-gumroad-overlay-checkout="true"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          border: `1px solid ${hovered ? colors.hoverBorderPrimary : colors.borderPrimary}`,
          color: hovered ? colors.textSecondary : colors.textTertiary,
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
      </a>

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

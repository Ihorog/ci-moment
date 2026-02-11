"use client";

import { useState, memo } from "react";
import { colors, typography, spacing, transitions, layout } from "@/lib/design-system";

interface SealButtonProps {
  context: string | null;
  status: string;
}

const SealButton = memo(function SealButton({
  context,
  status,
}: SealButtonProps) {
  const [hover, setHover] = useState(false);

  const paymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;
  const isConfigured = Boolean(paymentLink);

  const handleSeal = () => {
    if (!paymentLink) return;
    const url = new URL(paymentLink);
    if (context && status) url.searchParams.set("client_reference_id", `${context}_${status}`);
    window.location.href = url.toString();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: spacing.gapXSmall }}>
      <button
        onClick={handleSeal}
        disabled={!isConfigured}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: "transparent",
          border: `1px solid ${hover && isConfigured ? colors.hoverBorderTertiary : colors.borderTertiary}`,
          color: hover && isConfigured ? colors.textQuaternary : colors.textMuted,
          opacity: !isConfigured ? 0.3 : hover ? 1 : 0.6,
          padding: spacing.paddingSmall,
          cursor: isConfigured ? "pointer" : "not-allowed",
          fontSize: typography.fontXXXSmall,
          fontFamily: "inherit",
          transition: `all ${transitions.fast}`,
          minHeight: layout.minTouchTarget,
        }}
      >
        Seal this moment — $5
      </button>

      {isConfigured && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: spacing.gapXXXSmall }}>
          <div style={{ fontSize: typography.fontTiny, color: colors.borderTertiary }}>
            Lock this signal as a permanent checkpoint.
          </div>
          <div style={{ fontSize: typography.fontTiny, color: colors.borderTertiary }}>
            Secure payment via Stripe.
          </div>
        </div>
      )}

      {!isConfigured && (
        <div style={{ fontSize: typography.fontMicro, color: colors.textMuted, opacity: 0.5 }}>
          Payment not configured
        </div>
      )}
    </div>
  );
});

export default SealButton;
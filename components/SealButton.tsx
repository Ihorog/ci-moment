"use client";

import { useState, memo } from "react";
import { colors, typography, spacing, transitions, layout } from "@/lib/design-system";

interface SealButtonProps {
  context: string | null;
  status: string;
  artifactCode: string;
  lockedMinute: number;
}

const SealButton = memo(function SealButton({
  context,
  status,
  artifactCode,
  lockedMinute,
}: SealButtonProps) {
  const [hover, setHover] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSeal = async () => {
    if (!context || !status || !artifactCode) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/seal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artifactCode,
          context,
          status,
          lockedMinute,
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        console.error('Payment initiation failed:', data.error);
        alert('Payment initiation failed. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: spacing.gapXSmall }}>
      <button
        onClick={handleSeal}
        disabled={loading}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: "transparent",
          border: `1px solid ${hover && !loading ? colors.hoverBorderTertiary : colors.borderTertiary}`,
          color: hover && !loading ? colors.textQuaternary : colors.textMuted,
          opacity: loading ? 0.3 : hover ? 1 : 0.6,
          padding: spacing.paddingSmall,
          cursor: loading ? "wait" : "pointer",
          fontSize: typography.fontXXXSmall,
          fontFamily: "inherit",
          transition: `all ${transitions.fast}`,
          minHeight: layout.minTouchTarget,
        }}
      >
        {loading ? "Processing..." : "Seal this moment — $5"}
      </button>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: spacing.gapXXXSmall }}>
        <div style={{ fontSize: typography.fontTiny, color: colors.borderTertiary }}>
          Lock this signal as a permanent checkpoint.
        </div>
        <div style={{ fontSize: typography.fontTiny, color: colors.borderTertiary }}>
          Secure payment via Fondy.
        </div>
      </div>
    </div>
  );
});

export default SealButton;
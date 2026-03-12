"use client";

import { useState, memo } from "react";
import { colors, typography, spacing, transitions, layout } from "@/lib/design-system";
import { isPaymentsEnabled } from "@/lib/payments";

interface SealButtonProps {
  context: string | null;
  status: string;
  artifactCode: string;
  minute: number;
}

const SealButton = memo(function SealButton({
  context,
  status,
  artifactCode,
  minute,
}: SealButtonProps) {
  const [hover, setHover] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!context || !status || !artifactCode || !isPaymentsEnabled()) return null;

  const handleSeal = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/seal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context, status, artifactCode, minute }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(errData.error ?? 'Seal request failed');
      }

      const data = await res.json() as { verifyHash: string | null; checkoutUrl: string };

      if (!data.checkoutUrl) {
        throw new Error('No checkout URL returned');
      }

      // Persist the verify hash so the success page can link back to the
      // sealed artifact. This is intentionally non-fatal if sessionStorage
      // is unavailable (e.g., private browsing with strict settings).
      if (data.verifyHash) {
        try {
          sessionStorage.setItem('ci_verify_hash', data.verifyHash);
        } catch {
          // ignore
        }
      }

      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          border: `1px solid ${hover && !loading ? colors.hoverBorderPrimary : colors.borderPrimary}`,
          color: hover && !loading ? colors.textSecondary : colors.textTertiary,
          opacity: loading ? 0.5 : 1,
          padding: spacing.paddingSmall,
          cursor: loading ? "wait" : "pointer",
          fontSize: typography.fontXSmall,
          fontFamily: "inherit",
          textDecoration: "none",
          letterSpacing: typography.letterSpacingSmall,
          transition: `all ${transitions.fast}`,
          minHeight: layout.minTouchTarget,
        }}
      >
        {loading ? "Sealing\u2026" : "Seal this moment \u2014 $5"}
      </button>

      {error ? (
        <div style={{ fontSize: typography.fontTiny, color: colors.statusNotNow }}>
          {error}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: spacing.gapXXXSmall }}>
          <div style={{ fontSize: typography.fontTiny, color: colors.textQuinary }}>
            Lock this signal as a personal checkpoint.
          </div>
          <div style={{ fontSize: typography.fontTiny, color: colors.textQuinary }}>
            Secure checkout powered by Gumroad.
          </div>
        </div>
      )}
    </div>
  );
});

export default SealButton;
"use client";

import { useEffect, useState, useMemo } from "react";
import SealButton from "./SealButton";
import { ContextType } from "@/app/page";
import { colors, typography, spacing, transitions, animations } from "@/lib/design-system";

interface ResultProps {
  status: string;
  artifactCode: string;
  timestamp: string;
  context: ContextType;
}

export default function Result({
  status,
  artifactCode,
  timestamp,
  context,
}: ResultProps) {
  const [opacity, setOpacity] = useState(0);
  const [showSeal, setShowSeal] = useState(false);

  useEffect(() => {
    // Fade in main result
    const t1 = setTimeout(() => setOpacity(1), animations.fadeInDelay);
    // Show seal button after 2s
    const t2 = setTimeout(() => setShowSeal(true), animations.sealButtonDelay);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Memoize status color calculation to avoid recalculation on every render
  const statusColor = useMemo(() => {
    const up = status.toUpperCase();
    if (up === "PROCEED") return colors.statusProceed;
    if (up === "HOLD") return colors.statusHold;
    if (up === "NOT NOW") return colors.statusNotNow;
    return colors.textPrimary; // Fallback
  }, [status]);

  return (
    <div
      style={{
        opacity: opacity,
        transition: `opacity ${transitions.verySlow}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        textAlign: "center",
      }}
    >
      {/* Label */}
      <div
        style={{
          fontSize: typography.fontXXXSmall,
          color: colors.textMuted,
          letterSpacing: typography.letterSpacingWide,
          marginBottom: spacing.gapMedium,
          textTransform: "uppercase",
        }}
      >
        YOUR CI MOMENT
      </div>

      {/* Status */}
      <div
        style={{
          fontSize: typography.fontXLarge,
          fontWeight: typography.fontWeightLight,
          letterSpacing: typography.letterSpacingMedium,
          color: statusColor,
          marginBottom: spacing.gapXLarge,
          textTransform: "uppercase",
        }}
      >
        {status}
      </div>

      {/* Info Block */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: spacing.gapXSmall,
          fontSize: typography.fontXXSmall,
          color: colors.textQuaternary,
          marginBottom: "4rem",
        }}
      >
        <div>Artifact: {artifactCode}</div>
        <div>{timestamp}</div>
        <div style={{ textTransform: "capitalize" }}>{context}</div>
        <div style={{ color: colors.textMuted, marginTop: spacing.gapXSmall }}>
          Locked to your moment.
        </div>
      </div>

      {/* Seal CTA Container */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: spacing.gapSmall,
          opacity: showSeal ? 1 : 0,
          transition: `opacity ${transitions.slow}`,
        }}
      >
        {showSeal && (
          <SealButton
            context={context}
            status={status}
          />
        )}
      </div>
    </div>
  );
}
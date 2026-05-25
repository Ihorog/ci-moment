"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import SealButton from "./SealButton";
import ArtifactBarcode from "./ArtifactBarcode";
import { ContextType } from "@/app/page";
import { colors, typography, spacing, transitions, animations, effects, styles } from "@/lib/design-system";
import { logSealTransition } from "@/lib/actions/oplog";

interface ResultProps {
  status: string;
  artifactCode: string;
  timestamp: string;
  context: ContextType;
  minute: number;
  verifyHash?: string;
}

export default function Result({
  status,
  artifactCode,
  timestamp,
  context,
  minute,
  verifyHash,
}: ResultProps) {
  const [opacity, setOpacity] = useState(0);
  const [showSeal, setShowSeal] = useState(false);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [windowExpiring, setWindowExpiring] = useState(false);
  const [isSealed, setIsSealed] = useState(false);

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

  // UTC Timer: countdown to next minute
  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const secondsIntoMinute = Math.floor((now % 60000) / 1000);
      const remaining = 60 - secondsIntoMinute;
      setTimeRemaining(remaining);

      // Trigger expiry warning at 10 seconds remaining
      if (remaining <= 10 && !windowExpiring) {
        setWindowExpiring(true);
        // Vibrate if available (mobile)
        if ('vibrate' in navigator) {
          navigator.vibrate(animations.windowExpiryVibrateDuration);
        }
      } else if (remaining > 10 && windowExpiring) {
        setWindowExpiring(false);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [windowExpiring]);

  // Gyroscope support for holographic tilt effect (mobile)
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta !== null && event.gamma !== null) {
        setTiltX(Math.max(-45, Math.min(45, event.gamma)));
        setTiltY(Math.max(-45, Math.min(45, event.beta - 45)));
      }
    };

    if ('DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation);
      return () => window.removeEventListener('deviceorientation', handleOrientation);
    }
  }, []);

  // Listen for Gumroad overlay purchase completion.
  // The Gumroad embed script posts 'gumroad:purchase' to the parent window
  // when the user completes a payment inside the overlay iframe.
  const handleSealTransition = useCallback(async () => {
    if (isSealed) return;
    setIsSealed(true);
    setShowSeal(false);
    // Log transition to manifest oplog (best-effort; silently no-ops on Vercel)
    try {
      await logSealTransition(artifactCode);
    } catch (err) {
      console.error('[ci-moment] oplog seal transition failed:', err);
    }
  }, [isSealed, artifactCode]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from Gumroad origins
      if (
        event.origin !== 'https://gumroad.com' &&
        event.origin !== 'https://app.gumroad.com'
      ) {
        return;
      }
      if (event.data === 'gumroad:purchase') {
        handleSealTransition();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleSealTransition]);

  // Memoize status color calculation
  const statusColor = useMemo(() => {
    const up = status.toUpperCase();
    if (up === "PROCEED") return isSealed ? "#2a7a2a" : colors.statusProceed;
    if (up === "HOLD") return isSealed ? "#7a6a1a" : colors.statusHold;
    if (up === "NOT NOW") return isSealed ? "#555" : colors.statusNotNow;
    return isSealed ? colors.ink : colors.textPrimary;
  }, [status, isSealed]);

  // Holographic gradient position based on tilt or time-based animation
  const holographicPosition = useMemo(() => {
    const xPercent = ((tiltX + 45) / 90) * 100;
    const yPercent = ((tiltY + 45) / 90) * 100;
    return { x: xPercent, y: yPercent };
  }, [tiltX, tiltY]);

  // Formatted UTC timestamp for the sealed receipt
  const lockedAtUtc = useMemo(() => {
    return new Date(timestamp).toISOString().replace('T', ' ').replace('Z', ' UTC');
  }, [timestamp]);

  // ─── Phase A: Sketch / Blueprint ────────────────────────────────────────────
  if (!isSealed) {
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
          position: "relative",
        }}
      >
        {/* Blueprint / sketch card */}
        <div
          style={{
            maxWidth: effects.walletCardMaxWidth,
            width: "90%",
            aspectRatio: effects.walletCardAspectRatio,
            backgroundColor: "transparent",
            border: `1px dashed ${colors.borderPrimary}`,
            borderRadius: "12px",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
            opacity: 0.7,
          }}
        >
          {/* Card Content */}
          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Label */}
            <div
              style={{
                fontSize: typography.fontXXXSmall,
                color: colors.textMuted,
                letterSpacing: typography.letterSpacingXWide,
                marginBottom: spacing.gapSmall,
                textTransform: "uppercase",
              }}
            >
              CI MOMENT • ARTIFACT
            </div>

            {/* Status — pale */}
            <div
              style={{
                fontSize: typography.fontLarge,
                fontWeight: typography.fontWeightLight,
                letterSpacing: typography.letterSpacingMedium,
                color: statusColor,
                marginBottom: spacing.gapMedium,
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
                gap: spacing.gapXXSmall,
                fontSize: typography.fontXXSmall,
                color: colors.textQuinary,
              }}
            >
              <div>ID: {artifactCode}</div>
              <div>{lockedAtUtc}</div>
              <div style={{ textTransform: "capitalize" }}>{context}</div>
            </div>

            {/* Barcode — low opacity for sketch look */}
            <ArtifactBarcode artifactCode={artifactCode} opacity={0.3} />
          </div>

          {/* UTC Timer */}
          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: typography.fontXXSmall,
                color: windowExpiring ? colors.accent : colors.textMuted,
                borderTop: `1px dashed ${colors.borderTertiary}`,
                paddingTop: spacing.gapXSmall,
                marginBottom: spacing.gapXXXSmall,
                transition: `color ${transitions.fast}`,
              }}
            >
              <div style={{ letterSpacing: typography.letterSpacingXSmall }}>
                {windowExpiring ? "WINDOW CLOSING" : "LOCKED TO MOMENT"}
              </div>
              <div
                style={{
                  fontWeight: typography.fontWeightNormal,
                  letterSpacing: typography.letterSpacingSmall,
                }}
              >
                00:{String(timeRemaining).padStart(2, '0')}
              </div>
            </div>

            {/* Progress bar */}
            <div
              style={{
                width: "100%",
                height: "2px",
                backgroundColor: colors.borderTertiary,
                borderRadius: "1px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(timeRemaining / 60) * 100}%`,
                  backgroundColor: windowExpiring ? colors.accent : colors.textMuted,
                  borderRadius: "1px",
                  transition: `width 1s linear, background-color ${transitions.fast}`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Seal CTA */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: spacing.gapSmall,
            marginTop: spacing.gapLarge,
            opacity: showSeal ? 1 : 0,
            transition: `opacity ${transitions.slow}`,
          }}
        >
          {showSeal && verifyHash && (
            <SealButton
              context={context}
              verifyHash={verifyHash}
              status={status}
              artifactCode={artifactCode}
              minute={minute}
            />
          )}
        </div>
      </div>
    );
  }

  // ─── Phase B: Sealed Receipt ─────────────────────────────────────────────────
  return (
    <div
      style={{
        opacity: 1,
        transition: `opacity ${transitions.verySlow}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        textAlign: "center",
        position: "relative",
      }}
    >
      {/* Thermal-paper receipt card */}
      <div
        style={{
          maxWidth: effects.walletCardMaxWidth,
          width: "90%",
          aspectRatio: effects.walletCardAspectRatio,
          backgroundColor: colors.paper,
          color: colors.ink,
          fontFamily: styles.receipt.fontFamily,
          borderRadius: styles.receipt.borderRadius,
          boxShadow: styles.receipt.boxShadow,
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
          // Subtle paper grain via mask
          WebkitMaskImage: effects.paperTextureMask,
          maskImage: effects.paperTextureMask,
          WebkitMaskSize: effects.paperTextureMaskSize,
          maskSize: effects.paperTextureMaskSize,
          animation: `receiptMaterialize ${transitions.verySlow} ease-out`,
        }}
      >
        {/* Holographic sheen — active only after sealing */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: effects.holographicGradient(colors),
            backgroundSize: "200% 200%",
            backgroundPosition: `${holographicPosition.x}% ${holographicPosition.y}%`,
            opacity: 0.06,
            pointerEvents: "none",
            animation: tiltX === 0 && tiltY === 0
              ? `holographicShift ${animations.holographicShiftDuration} ease-in-out infinite alternate`
              : "none",
            transition: tiltX !== 0 || tiltY !== 0 ? "background-position 0.3s ease-out" : "none",
          }}
        />

        {/* Receipt Content */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Header label — ink print style */}
          <div
            style={{
              fontSize: typography.fontXXXSmall,
              color: colors.ink,
              letterSpacing: typography.letterSpacingXWide,
              marginBottom: spacing.gapSmall,
              textTransform: "uppercase",
              opacity: 0.5,
            }}
          >
            CI MOMENT • SEALED
          </div>

          {/* Status — inked */}
          <div
            style={{
              fontSize: typography.fontLarge,
              fontWeight: typography.fontWeightLight,
              letterSpacing: typography.letterSpacingMedium,
              color: statusColor,
              marginBottom: spacing.gapMedium,
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
              gap: spacing.gapXXSmall,
              fontSize: typography.fontXXSmall,
              color: colors.ink,
              opacity: 0.7,
            }}
          >
            <div>ID: {artifactCode}</div>
            <div>{lockedAtUtc}</div>
            <div style={{ textTransform: "capitalize" }}>{context}</div>
          </div>

          {/* Barcode — full opacity on sealed receipt */}
          <ArtifactBarcode artifactCode={artifactCode} opacity={0.6} />
        </div>

        {/* Receipt Footer with perforated divider */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: typography.fontXXSmall,
              color: colors.ink,
              opacity: 0.5,
              borderTop: `1px solid ${colors.ink}`,
              paddingTop: spacing.gapXSmall,
              marginBottom: spacing.gapXXXSmall,
              letterSpacing: typography.letterSpacingXSmall,
            }}
          >
            <div>ISSUED: {lockedAtUtc}</div>
            <div>✓ SEALED</div>
          </div>
        </div>
      </div>

      {/* CSS Keyframe Animations */}
      <style jsx>{`
        @keyframes holographicShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes receiptMaterialize {
          0% {
            opacity: 0;
            transform: scale(0.97) translateY(8px);
            filter: blur(2px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0);
          }
        }
      `}</style>
    </div>
  );
}
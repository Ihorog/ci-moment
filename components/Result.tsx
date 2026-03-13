"use client";

import { useEffect, useState, useMemo } from "react";
import SealButton from "./SealButton";
import ArtifactBarcode from "./ArtifactBarcode";
import { ContextType } from "@/app/page";
import { colors, typography, spacing, transitions, animations, effects } from "@/lib/design-system";

interface ResultProps {
  status: string;
  artifactCode: string;
  timestamp: string;
  context: ContextType;
  minute: number;
}

export default function Result({
  status,
  artifactCode,
  timestamp,
  context,
  minute,
}: ResultProps) {
  const [opacity, setOpacity] = useState(0);
  const [showSeal, setShowSeal] = useState(false);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [windowExpiring, setWindowExpiring] = useState(false);

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
        // Map device tilt to gradient position
        // beta: -180 to 180 (front to back tilt)
        // gamma: -90 to 90 (left to right tilt)
        setTiltX(Math.max(-45, Math.min(45, event.gamma)));
        setTiltY(Math.max(-45, Math.min(45, event.beta - 45))); // Offset for natural reading position
      }
    };

    if ('DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation);
      return () => window.removeEventListener('deviceorientation', handleOrientation);
    }
  }, []);

  // Memoize status color calculation to avoid recalculation on every render
  const statusColor = useMemo(() => {
    const up = status.toUpperCase();
    if (up === "PROCEED") return colors.statusProceed;
    if (up === "HOLD") return colors.statusHold;
    if (up === "NOT NOW") return colors.statusNotNow;
    return colors.textPrimary; // Fallback
  }, [status]);

  // Holographic gradient position based on tilt or time-based animation
  const holographicPosition = useMemo(() => {
    // Map tilt to percentage (from -45/45 to 0-100%)
    const xPercent = ((tiltX + 45) / 90) * 100;
    const yPercent = ((tiltY + 45) / 90) * 100;
    return { x: xPercent, y: yPercent };
  }, [tiltX, tiltY]);

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
      {/* Digital Artifact Card (Wallet-Ready) */}
      <div
        style={{
          maxWidth: effects.walletCardMaxWidth,
          width: "90%",
          aspectRatio: effects.walletCardAspectRatio,
          backgroundColor: colors.background,
          border: `1px solid ${colors.borderPrimary}`,
          borderRadius: "12px",
          boxShadow: effects.paperShadow,
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
          // Paper texture via mask
          WebkitMaskImage: effects.paperTextureMask,
          maskImage: effects.paperTextureMask,
          WebkitMaskSize: effects.paperTextureMaskSize,
          maskSize: effects.paperTextureMaskSize,
        }}
      >
        {/* Holographic overlay with tilt-responsive gradient */}
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
            opacity: 0.08,
            pointerEvents: "none",
            animation: tiltX === 0 && tiltY === 0 ? `holographicShift ${animations.holographicShiftDuration} ease-in-out infinite alternate` : "none",
            transition: tiltX !== 0 || tiltY !== 0 ? "background-position 0.3s ease-out" : "none",
          }}
        />

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

          {/* Status */}
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
            <div>{timestamp}</div>
            <div style={{ textTransform: "capitalize" }}>{context}</div>
          </div>

          {/* Decorative barcode visual */}
          <ArtifactBarcode artifactCode={artifactCode} />
        </div>

        {/* UTC Timer Display (Bottom of Card) */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Timer label + countdown */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: typography.fontXXSmall,
              color: windowExpiring ? colors.accent : colors.textMuted,
              borderTop: `1px solid ${colors.borderTertiary}`,
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

          {/* Progress bar — shrinks to zero as the minute elapses */}
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

      {/* Seal CTA Container (Below Card) */}
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
        {showSeal && (
          <SealButton
            context={context}
            status={status}
            artifactCode={artifactCode}
            minute={minute}
          />
        )}
      </div>

      {/* CSS Keyframe Animation for Holographic Shift */}
      <style jsx>{`
        @keyframes holographicShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import SealButton from "./SealButton";
import { ContextType } from "@/app/page";

interface ResultProps {
  status: string;
  artifactCode: string;
  timestamp: string;
  context: ContextType;
  lockedMinute: number;
}

export default function Result({
  status,
  artifactCode,
  timestamp,
  context,
  lockedMinute,
}: ResultProps) {
  const [opacity, setOpacity] = useState(0);
  const [showSeal, setShowSeal] = useState(false);

  useEffect(() => {
    // Fade in main result
    const t1 = setTimeout(() => setOpacity(1), 50);
    // Show seal button after 2s
    const t2 = setTimeout(() => setShowSeal(true), 2000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Determine status color
  const getStatusColor = (s: string) => {
    const up = s.toUpperCase();
    if (up === "PROCEED") return "#c8d8c0";
    if (up === "HOLD") return "#d8d0b8";
    if (up === "NOT NOW") return "#b8b8b8";
    return "#d4d4d4"; // Fallback
  };

  return (
    <div
      style={{
        opacity: opacity,
        transition: "opacity 1s ease",
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
          fontSize: "0.6rem",
          color: "#333",
          letterSpacing: "0.3em",
          marginBottom: "1.5rem",
          textTransform: "uppercase",
        }}
      >
        YOUR CI MOMENT
      </div>

      {/* Status */}
      <div
        style={{
          fontSize: "clamp(1.6rem, 5vw, 2.8rem)",
          fontWeight: 200,
          letterSpacing: "0.2em",
          color: getStatusColor(status),
          marginBottom: "3rem",
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
          gap: "0.5rem",
          fontSize: "0.65rem",
          color: "#444",
          marginBottom: "4rem",
        }}
      >
        <div>Artifact: {artifactCode}</div>
        <div>{timestamp}</div>
        <div style={{ textTransform: "capitalize" }}>{context}</div>
        <div style={{ color: "#333", marginTop: "0.5rem" }}>
          Locked to your moment.
        </div>
      </div>

      {/* Seal Button Container */}
      <div
        style={{
          height: "60px", // Reserve space
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: showSeal ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}
      >
        {showSeal && (
          <SealButton
            artifactCode={artifactCode}
            context={context}
            status={status}
            lockedMinute={lockedMinute}
          />
        )}
      </div>
    </div>
  );
}
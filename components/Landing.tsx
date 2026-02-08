"use client";

import { useState } from "react";
import { ContextType } from "@/app/page";

interface LandingProps {
  onSelect: (ctx: ContextType) => void;
}

export default function Landing({ onSelect }: LandingProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      {/* Top Brand */}
      <div
        style={{
          position: "absolute",
          top: "3rem",
          fontSize: "0.65rem",
          letterSpacing: "0.4em",
          color: "#555",
          textTransform: "uppercase",
        }}
      >
        Ci
      </div>

      {/* Main Headline */}
      <h1
        style={{
          fontSize: "clamp(1.4rem, 4vw, 2.2rem)",
          fontWeight: 300,
          color: "#d4d4d4",
          margin: "0 0 3rem 0",
          textAlign: "center",
        }}
      >
        Is now your Ci Moment?
      </h1>

      {/* Buttons Container */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "100%",
          maxWidth: "280px",
        }}
      >
        <LandingButton label="Career" onClick={() => onSelect("career")} />
        <LandingButton label="Love" onClick={() => onSelect("love")} />
        <LandingButton label="Timing" onClick={() => onSelect("timing")} />
      </div>

      {/* Footer Disclaimer */}
      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          fontSize: "0.6rem",
          color: "#333",
          textAlign: "center",
          width: "100%",
        }}
      >
        Not advice. Not prediction. A personal moment signal.
      </div>
    </div>
  );
}

// Sub-component for Hover State management
function LandingButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "transparent",
        border: `1px solid ${hover ? "#555" : "#2a2a2a"}`,
        color: hover ? "#e8e8e8" : "#b0b0b0",
        padding: "1rem 1.5rem",
        cursor: "pointer",
        textTransform: "capitalize",
        fontSize: "0.85rem",
        letterSpacing: "0.15em",
        fontFamily: "inherit",
        transition: "border-color 0.3s ease, color 0.3s ease",
        width: "100%",
        minHeight: "44px",
      }}
    >
      {label}
    </button>
  );
}
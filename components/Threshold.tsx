"use client";

import { useEffect, useState } from "react";

interface ThresholdProps {
  onConfirm: () => void;
  onBack: () => void;
}

export default function Threshold({ onConfirm, onBack }: ThresholdProps) {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Trigger fade in on mount
    const timer = setTimeout(() => setOpacity(1), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        opacity: opacity,
        transition: "opacity 0.8s ease",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
      }}
    >
      <div
        style={{
          fontSize: "0.9rem",
          color: "#888",
          textAlign: "center",
          letterSpacing: "0.05em",
        }}
      >
        This moment will be locked.
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        <ThresholdButton
          label="Confirm"
          primary={true}
          onClick={onConfirm}
        />
        <ThresholdButton
          label="Not now"
          primary={false}
          onClick={onBack}
        />
      </div>
    </div>
  );
}

function ThresholdButton({
  label,
  primary,
  onClick,
}: {
  label: string;
  primary: boolean;
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);

  const baseBorder = primary ? "#444" : "#1a1a1a";
  const hoverBorder = primary ? "#888" : "#333"; // Slight visibility for secondary on hover logic (implied)
  const baseColor = primary ? "#d4d4d4" : "#444";
  
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "transparent",
        border: `1px solid ${hover ? hoverBorder : baseBorder}`,
        color: baseColor, // Keep color stable unless explicit hover color needed
        padding: "0.8rem 1.5rem",
        cursor: "pointer",
        fontSize: "0.85rem",
        letterSpacing: "0.1em",
        fontFamily: "inherit",
        transition: "border-color 0.3s ease",
        minHeight: "44px",
        minWidth: "100px",
      }}
    >
      {label}
    </button>
  );
}
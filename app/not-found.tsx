"use client";

import { useState } from "react";

export default function NotFound() {
  const [hover, setHover] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        gap: "2rem",
      }}
    >
      <div
        style={{
          fontSize: "0.6rem",
          color: "#333",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
        }}
      >
        404
      </div>

      <div
        style={{
          fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
          fontWeight: 200,
          color: "#888",
          letterSpacing: "0.1em",
        }}
      >
        This moment doesn&apos;t exist.
      </div>

      <a
        href="/"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: "transparent",
          border: `1px solid ${hover ? "#555" : "#2a2a2a"}`,
          color: hover ? "#e8e8e8" : "#b0b0b0",
          padding: "0.8rem 1.5rem",
          cursor: "pointer",
          fontSize: "0.75rem",
          letterSpacing: "0.1em",
          fontFamily: "inherit",
          transition: "border-color 0.3s ease, color 0.3s ease",
          textDecoration: "none",
          minHeight: "44px",
          display: "flex",
          alignItems: "center",
        }}
      >
        Return
      </a>
    </div>
  );
}

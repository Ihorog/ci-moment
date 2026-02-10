"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const [hover, setHover] = useState(false);
  const searchParams = useSearchParams();

  const context = searchParams.get("context");
  const status = searchParams.get("status");

  return (
    <main
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "1.5rem",
        }}
      >
        <div
          style={{
            fontSize: "clamp(1.4rem, 4vw, 2.2rem)",
            fontWeight: 200,
            letterSpacing: "0.2em",
            color: "#c8d8c0",
            textTransform: "uppercase",
          }}
        >
          Moment sealed.
        </div>

        <div
          style={{
            fontSize: "0.65rem",
            color: "#444",
            letterSpacing: "0.05em",
          }}
        >
          Your decision checkpoint is locked.
        </div>

        {(context || status) && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.4rem",
              fontSize: "0.6rem",
              color: "#555",
              marginTop: "0.5rem",
            }}
          >
            {context && (
              <div style={{ textTransform: "capitalize" }}>{context}</div>
            )}
            {status && (
              <div style={{ textTransform: "uppercase", letterSpacing: "0.15em" }}>
                {status}
              </div>
            )}
          </div>
        )}

        <a
          href="/"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            marginTop: "1.5rem",
            background: "transparent",
            border: `1px solid ${hover ? "#333" : "#1a1a1a"}`,
            color: hover ? "#555" : "#333",
            opacity: hover ? 1 : 0.6,
            padding: "0.6rem 1.2rem",
            cursor: "pointer",
            fontSize: "0.6rem",
            fontFamily: "inherit",
            letterSpacing: "0.05em",
            textDecoration: "none",
            transition: "all 0.3s ease",
          }}
        >
          Back to Ci Moment
        </a>
      </div>
    </main>
  );
}

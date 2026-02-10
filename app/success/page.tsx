"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const context = searchParams.get("context");
  const status = searchParams.get("status");

  return (
    <main
      style={{
        width: "100%",
        minHeight: "100dvh",
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
        <h1
          style={{
            fontSize: "clamp(1.4rem, 4vw, 2.2rem)",
            fontWeight: 200,
            letterSpacing: "0.15em",
            color: "#c8d8c0",
            margin: 0,
          }}
        >
          Moment sealed.
        </h1>

        <p
          style={{
            fontSize: "0.7rem",
            color: "#555",
            letterSpacing: "0.05em",
            margin: 0,
          }}
        >
          Your decision checkpoint is locked.
        </p>

        {context && status && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.4rem",
              fontSize: "0.6rem",
              color: "#444",
              marginTop: "0.5rem",
            }}
          >
            <div style={{ textTransform: "capitalize" }}>{context}</div>
            <div style={{ textTransform: "uppercase", letterSpacing: "0.2em" }}>
              {status}
            </div>
          </div>
        )}

        <a
          href="/"
          style={{
            marginTop: "2rem",
            background: "transparent",
            border: "1px solid #1a1a1a",
            color: "#333",
            padding: "0.6rem 1.2rem",
            cursor: "pointer",
            fontSize: "0.6rem",
            fontFamily: "inherit",
            textDecoration: "none",
            transition: "all 0.3s ease",
            letterSpacing: "0.05em",
          }}
        >
          Back to Ci Moment
        </a>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}

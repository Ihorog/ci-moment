"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

interface SealButtonProps {
  artifactCode: string;
  context: string | null;
  status: string;
  lockedMinute: number;
}

export default function SealButton({
  artifactCode,
  context,
  status,
  lockedMinute,
}: SealButtonProps) {
  const [hover, setHover] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  
  // Safe extraction of query params
  const searchParams = useSearchParams();
  const isSealed = searchParams.get("sealed") === "true";

  // If redirected back with success
  if (isSealed) {
    return (
      <div style={{ fontSize: "0.6rem", color: "#555", letterSpacing: "0.1em" }}>
        Your Ci Moment is recorded.
      </div>
    );
  }

  const handleSeal = async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await fetch("/api/seal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artifactCode,
          context,
          status,
          lockedMinute,
        }),
      });

      if (!response.ok) throw new Error("Seal failed");

      const data = await response.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("No checkout URL");
      }
    } catch {
      setLoading(false);
      setError(true);
    }
  };

  if (error) {
    return (
      <div style={{ fontSize: "0.6rem", color: "#333" }}>
        Something went wrong.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
      <button
        onClick={handleSeal}
        disabled={loading}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: "transparent",
          border: `1px solid ${hover ? "#333" : "#1a1a1a"}`,
          color: hover ? "#555" : "#333",
          opacity: loading ? 0.3 : hover ? 1 : 0.6,
          padding: "0.6rem 1.2rem",
          cursor: loading ? "wait" : "pointer",
          fontSize: "0.6rem",
          fontFamily: "inherit",
          transition: "all 0.3s ease",
          minHeight: "44px",
        }}
      >
        {loading ? "Sealing..." : "Seal this moment · $5"}
      </button>
      
      {!loading && (
        <div style={{ fontSize: "0.55rem", color: "#1a1a1a" }}>
          Creates a permanent record.
        </div>
      )}
    </div>
  );
}
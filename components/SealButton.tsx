"use client";

import { useState } from "react";

interface SealButtonProps {
  artifactCode: string;
  context: string | null;
  status: string;
  lockedMinute: number;
}

export default function SealButton({
  context,
  status,
}: SealButtonProps) {
  const [hover, setHover] = useState(false);

  const paymentUrl = process.env.NEXT_PUBLIC_PAYMENT_URL;
  const isConfigured = Boolean(paymentUrl);

  const handleSeal = () => {
    if (!paymentUrl) return;
    const url = new URL(paymentUrl);
    if (context) url.searchParams.set("context", context);
    if (status) url.searchParams.set("status", status);
    window.location.href = url.toString();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
      <button
        onClick={handleSeal}
        disabled={!isConfigured}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: "transparent",
          border: `1px solid ${hover && isConfigured ? "#333" : "#1a1a1a"}`,
          color: hover && isConfigured ? "#555" : "#333",
          opacity: !isConfigured ? 0.3 : hover ? 1 : 0.6,
          padding: "0.6rem 1.2rem",
          cursor: isConfigured ? "pointer" : "not-allowed",
          fontSize: "0.6rem",
          fontFamily: "inherit",
          transition: "all 0.3s ease",
          minHeight: "44px",
        }}
      >
        Seal this moment — $5
      </button>

      {!isConfigured && (
        <div style={{ fontSize: "0.5rem", color: "#333" }}>
          Payment not configured
        </div>
      )}
    </div>
  );
}
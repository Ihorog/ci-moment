"use client";

import { useState, memo } from "react";

interface SealButtonProps {
  context: string | null;
  status: string;
}

const SealButton = memo(function SealButton({
  context,
  status,
}: SealButtonProps) {
  const [hover, setHover] = useState(false);

  const paymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;
  const isConfigured = Boolean(paymentLink);

  const handleSeal = () => {
    if (!paymentLink) return;
    const url = new URL(paymentLink);
    if (context && status) url.searchParams.set("client_reference_id", `${context}_${status}`);
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

      {isConfigured && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem" }}>
          <div style={{ fontSize: "0.55rem", color: "#1a1a1a" }}>
            Lock this signal as a permanent checkpoint.
          </div>
          <div style={{ fontSize: "0.55rem", color: "#1a1a1a" }}>
            Secure payment via Stripe.
          </div>
        </div>
      )}

      {!isConfigured && (
        <div style={{ fontSize: "0.5rem", color: "#333", opacity: 0.5 }}>
          Payment not configured
        </div>
      )}
    </div>
  );
});

export default SealButton;
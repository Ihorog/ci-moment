"use client";

import { useEffect, useState } from "react";

interface ManifestProps {
  onComplete: () => void;
}

export default function Manifest({ onComplete }: ManifestProps) {
  const [styles, setStyles] = useState({
    backgroundColor: "#222",
    boxShadow: "none",
    transform: "scale(1)",
  });

  useEffect(() => {
    // 800ms
    const t1 = setTimeout(() => {
      setStyles((s) => ({ ...s, backgroundColor: "#444" }));
    }, 800);

    // 1800ms
    const t2 = setTimeout(() => {
      setStyles((s) => ({
        ...s,
        backgroundColor: "#888",
        boxShadow: "0 0 20px rgba(255,255,255,0.1)",
      }));
    }, 1800);

    // 2800ms
    const t3 = setTimeout(() => {
      setStyles((s) => ({
        ...s,
        backgroundColor: "#d4d4d4",
        transform: "scale(2)",
      }));
    }, 2800);

    // 3200ms
    const t4 = setTimeout(() => {
      onComplete();
    }, 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div
      style={{
        width: "4px",
        height: "4px",
        borderRadius: "50%",
        transition: "background-color 1s ease, box-shadow 1s ease, transform 0.4s ease",
        ...styles,
      }}
    />
  );
}
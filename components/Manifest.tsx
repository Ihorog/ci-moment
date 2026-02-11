"use client";

import { useEffect, useState } from "react";
import { colors, transitions } from "@/lib/design-system";

interface ManifestProps {
  onComplete: () => void;
}

export default function Manifest({ onComplete }: ManifestProps) {
  const [styles, setStyles] = useState({
    backgroundColor: colors.manifestDark,
    boxShadow: "none",
    transform: "scale(1)",
  });

  useEffect(() => {
    // 800ms
    const t1 = setTimeout(() => {
      setStyles({ backgroundColor: colors.manifestMid, boxShadow: "none", transform: "scale(1)" });
    }, 800);

    // 1800ms
    const t2 = setTimeout(() => {
      setStyles({ backgroundColor: colors.manifestLight, boxShadow: "0 0 20px rgba(255,255,255,0.1)", transform: "scale(1)" });
    }, 1800);

    // 2800ms
    const t3 = setTimeout(() => {
      setStyles({ backgroundColor: colors.manifestBright, boxShadow: "0 0 20px rgba(255,255,255,0.1)", transform: "scale(2)" });
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
        transition: `background-color ${transitions.verySlow}, box-shadow ${transitions.verySlow}, transform 0.4s ease`,
        ...styles,
      }}
    />
  );
}
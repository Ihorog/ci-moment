"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
// Assumed existence based on prompt instructions
import { getStatus } from "@/lib/engine";

import Landing from "@/components/Landing";
import Threshold from "@/components/Threshold";
import Manifest from "@/components/Manifest";
import Result from "@/components/Result";

export type ScreenState = "landing" | "threshold" | "manifest" | "result";
export type ContextType = "career" | "love" | "timing" | null;

interface ResultData {
  status: string;
  minute: number;
  artifactCode: string;
  timestamp: string;
}

export default function Page() {
  const [screen, setScreen] = useState<ScreenState>("landing");
  const [context, setContext] = useState<ContextType>(null);
  const [result, setResult] = useState<ResultData | null>(null);
  const [cancelled, setCancelled] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("cancelled") === "true") {
      setCancelled(true);
      const timer = setTimeout(() => setCancelled(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleContextSelect = useCallback((selectedContext: ContextType) => {
    setCancelled(false);
    setContext(selectedContext);
    setScreen("threshold");
  }, []);

  const handleThresholdBack = useCallback(() => {
    setContext(null);
    setScreen("landing");
  }, []);

  const handleThresholdConfirm = useCallback(() => {
    setScreen("manifest");
  }, []);

  const handleManifestComplete = useCallback(() => {
    if (!context) return;

    // Simulate engine call logic
    const engineData = getStatus(context);
    
    setResult({
      status: engineData.status,
      minute: engineData.minute, // passing through for locking
      artifactCode: engineData.artifactCode,
      timestamp: new Date().toISOString(),
    });
    setScreen("result");
  }, [context]);

  return (
    <main
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {screen === "landing" && <Landing onSelect={handleContextSelect} />}

      {screen === "threshold" && (
        <Threshold
          onConfirm={handleThresholdConfirm}
          onBack={handleThresholdBack}
        />
      )}

      {screen === "manifest" && (
        <Manifest onComplete={handleManifestComplete} />
      )}

      {screen === "result" && result && context && (
        <Result
          status={result.status}
          artifactCode={result.artifactCode}
          timestamp={result.timestamp}
          context={context}
          lockedMinute={result.minute}
        />
      )}

      {cancelled && (
        <div
          style={{
            position: "absolute",
            bottom: "2rem",
            fontSize: "0.65rem",
            color: "#555",
            letterSpacing: "0.05em",
            transition: "opacity 0.5s ease",
          }}
        >
          Payment cancelled. Your moment is still here.
        </div>
      )}
    </main>
  );
}
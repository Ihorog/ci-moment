import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Ci Moment",
  description: "A personal moment signal.",
  openGraph: {
    title: "Ci Moment",
    description: "A personal moment signal.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents zooming to maintain app-like feel
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          backgroundColor: "#0a0a0a",
          color: "#d4d4d4",
          fontFamily:
            "'SF Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
          margin: 0,
          padding: 0,
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        {children}
      </body>
    </html>
  );
}
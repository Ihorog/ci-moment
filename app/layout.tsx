import type { Metadata, Viewport } from "next";
import { colors, typography } from "@/lib/design-system";

export const metadata: Metadata = {
  title: "Ci Moment — Instant Decision Clarity",
  description: "Get instant clarity for a personal decision. Choose a context and receive a signal in seconds. Seal your Ci Moment and lock the checkpoint.",
  keywords: [
    "decision clarity",
    "decision tool",
    "should I do it",
    "instant decision help",
    "decision moment",
  ],
  authors: [{ name: "Ci Moment" }],
  creator: "Ci Moment",
  publisher: "Ci Moment",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://ci-moment.vercel.app"),
  alternates: {
    canonical: "https://ci-moment.vercel.app",
  },
  openGraph: {
    title: "Ci Moment — Instant Decision Clarity",
    description: "Get instant clarity for a personal decision in seconds.",
    url: "https://ci-moment.vercel.app",
    siteName: "Ci Moment",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ci Moment — Instant Decision Clarity",
    description: "Get instant clarity for a personal decision in seconds.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
          backgroundColor: colors.background,
          color: colors.textPrimary,
          fontFamily: typography.fontMonospace,
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
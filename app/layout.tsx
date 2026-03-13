import type { Metadata, Viewport } from "next";
import { colors, typography } from "@/lib/design-system";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

// JetBrains Mono via Google Fonts (preconnect for performance)
// Loaded as a <link> via the <head> element in the HTML shell.

export const metadata: Metadata = {
  title: "Ci Moment — Instant Decision Clarity",
  description: "Stop overthinking. Get instant decision clarity. Your answer, locked to a unique digital artifact.",
  keywords: [
    "decision clarity",
    "stop overthinking",
    "digital artifact",
    "decision tool",
    "should I do it",
    "instant decision help",
    "decision moment",
    "overthinking relief",
    "instant clarity",
    "make a decision",
    "confidence signal",
    "digital document",
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
    title: "Ci Moment — Stop Overthinking. Get Clarity Now.",
    description: "Your decision, locked to a unique digital artifact. Instant clarity for career, love, and timing.",
    url: "https://ci-moment.vercel.app",
    siteName: "Ci Moment",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ci Moment - Digital Decision Artifact",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ci Moment — Stop Overthinking. Get Clarity Now.",
    description: "Stop overthinking. Your decision locked to a digital artifact in 60 seconds.",
    images: ["/og-image.png"],
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
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents zooming to maintain app-like feel
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@200;300&display=swap"
          rel="stylesheet"
        />
      </head>
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
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
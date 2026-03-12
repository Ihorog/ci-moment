import type { Metadata, Viewport } from "next";
import { colors, typography } from "@/lib/design-system";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

export const metadata: Metadata = {
  title: "Ci Moment — Instant Decision Clarity",
  description: "Overthinking relief. Instant clarity. Your decision artifact locked to a unique moment in time.",
  keywords: [
    "decision clarity",
    "decision tool",
    "should I do it",
    "instant decision help",
    "decision moment",
    "overthinking relief",
    "decision artifact",
    "instant clarity",
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
    title: "Ci Moment — Your Digital Decision Artifact",
    description: "Overthinking relief. Instant clarity. Decision artifact locked to your unique moment.",
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
    title: "Ci Moment — Your Digital Decision Artifact",
    description: "Overthinking relief. Instant clarity. Decision artifact.",
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
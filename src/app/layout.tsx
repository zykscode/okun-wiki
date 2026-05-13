import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { WhyteInktrap } from "@/lib/utils";
import siteMetadata from "@/data/siteMetadata";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s — ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  keywords: [
    "Okun",
    "Kogi State",
    "Nigeria",
    "Yoruba",
    "encyclopedia",
    "history",
    "culture",
    "Kabba",
    "Ijumu",
    "Yagba",
  ],
  authors: [{ name: siteMetadata.author }],
  creator: siteMetadata.author,
  icons: {
    icon: [
      { url: "/static/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/static/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/static/favicons/apple-touch-icon.png",
  },
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.title,
    images: [{ url: siteMetadata.socialBanner, width: 1200, height: 630, alt: siteMetadata.title }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: [siteMetadata.socialBanner],
  },
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": `${siteMetadata.siteUrl}/feed.xml`,
    },
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
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteMetadata.title,
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${WhyteInktrap.variable}`}
    >
      <head>
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
      </head>
      <body className="min-h-screen flex flex-col bg-wiki-bg">
        <div className="ambient-glow" aria-hidden="true" />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

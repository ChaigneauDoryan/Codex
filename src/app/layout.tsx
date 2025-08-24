import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// IMPORTANT: Remplacez cette URL par l'URL de votre site en production
const siteUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Codex - Suivez vos lectures, rejoignez des clubs",
    template: `%s | Codex`,
  },
  description: "Codex est une application pour les passionnés de lecture. Suivez votre progression, partagez des résumés, et rejoignez des clubs de lecture pour discuter de vos oeuvres préférées.",
  openGraph: {
    title: "Codex - Suivez vos lectures, rejoignez des clubs",
    description: "Suivez votre progression de lecture, partagez des résumés, et rejoignez des clubs de lecture.",
    url: siteUrl,
    siteName: "Codex",
    images: [
      {
        url: "/globe.svg", // Remplacez par une image plus représentative si possible
        width: 800,
        height: 600,
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Codex - Suivez vos lectures, rejoignez des clubs",
    description: "Suivez votre progression de lecture, partagez des résumés, et rejoignez des clubs de lecture.",
    images: ["/globe.svg"], // Remplacez par une image plus représentative
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico", // Pensez à créer des icônes spécifiques pour Apple
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
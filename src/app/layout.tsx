import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { AppProviders } from "@/components/providers/app-providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Zoma Calculator and OSA Converter — 500+ Calculators & Converters",
    template: "%s · Zoma Calculator and OSA Converter",
  },
  description:
    "Zoma Calculator and OSA Converter — all-in-one calculator and conversion platform with 500+ calculators across 14 categories: math, chemistry, physics, finance, health, engineering, lab, computer, and more. Bilingual (Arabic/English) with RTL support, offline-ready PWA.",
  keywords: [
    "zoma", "calculator", "converter", "OSA", "BMI", "molarity", "EMI", "loan", "compound interest",
    "unit conversion", "chemistry", "physics", "math", "PWA", "Arabic", "English",
    "حاسبة", "محوّل", "زوما", "كيمياء", "فيزياء", "رياضيات", "مالية", "صحة",
  ],
  authors: [{ name: "Zoma Calculator and OSA Converter" }],
  applicationName: "Zoma Calculator and OSA Converter",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Zoma Calculator",
  },
  icons: {
    icon: [{ url: "/logo.png", type: "image/png", sizes: "1254x1254" }],
    apple: [{ url: "/logo.png", sizes: "1254x1254" }],
  },
  openGraph: {
    title: "Zoma Calculator and OSA Converter",
    description: "500+ calculators & converters in one beautiful PWA.",
    type: "website",
    siteName: "Zoma Calculator and OSA Converter",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zoma Calculator and OSA Converter",
    description: "500+ calculators & converters in one beautiful PWA.",
  },
  category: "education",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google AdSense Script */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3474575203383848"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        <AppProviders>
          {children}
        </AppProviders>
        <Toaster />
        <SonnerToaster position="top-center" />
      </body>
    </html>
  );
}

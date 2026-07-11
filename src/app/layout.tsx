import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { AppProviders } from "@/components/providers/app-providers";
import { PopunderLoader } from "@/components/ads/popunder-loader";

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
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg" }],
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
        {/* Native Banner ad script (EffectiveCPMNetwork) */}
        <script
          async
          data-cfasync="false"
          src="https://pl30318327.effectivecpmnetwork.com/a43b4584a8c9a26bff900f3543d3ca80/invoke.js"
        />
        {/* Social Bar ad script (EffectiveCPMNetwork) */}
        <script
          async
          src="https://pl30318261.effectivecpmnetwork.com/09/06/bd/0906bd7626f8048137180fb19d3d9ffa.js"
        />
        {/* Popunder ad — loaded with delay & cooldown via PopunderLoader component */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        <AppProviders>
          {children}
          <PopunderLoader />
        </AppProviders>
        <Toaster />
        <SonnerToaster position="top-center" />
      </body>
    </html>
  );
}

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
    default: "Universal Calculator Hub — 500+ Calculators & Converters",
    template: "%s · Universal Calculator Hub",
  },
  description:
    "All-in-one calculator and conversion platform with 500+ calculators across 14 categories: math, chemistry, physics, finance, health, engineering, lab, computer, and more. Bilingual (Arabic/English) with RTL support, offline-ready PWA.",
  keywords: [
    "calculator", "converter", "BMI", "molarity", "EMI", "loan", "compound interest",
    "unit conversion", "chemistry", "physics", "math", "PWA", "Arabic", "English",
    "حاسبة", "محوّل", "كيمياء", "فيزياء", "رياضيات", "مالية", "صحة",
  ],
  authors: [{ name: "Universal Calculator Hub" }],
  applicationName: "Universal Calculator Hub",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Calculator Hub",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg" }],
  },
  openGraph: {
    title: "Universal Calculator Hub",
    description: "500+ calculators & converters in one beautiful PWA.",
    type: "website",
    siteName: "Universal Calculator Hub",
  },
  twitter: {
    card: "summary_large_image",
    title: "Universal Calculator Hub",
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

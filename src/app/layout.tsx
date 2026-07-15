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

const BASE_URL = "https://zoma-calculator.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Zoma Calculator and OSA Converter — 150+ Free Online Calculators & Converters",
    template: "%s · Zoma Calculator and OSA Converter",
  },
  description:
    "Free online platform with 150+ calculators and converters across 19 categories: math, chemistry, physics, biology, genetics, DNA, agriculture, finance, health, engineering, and more. Bilingual Arabic/English with RTL support, offline PWA, educational articles, and a knowledge center.",
  keywords: [
    "zoma calculator", "OSA converter", "online calculator", "unit converter", "BMI calculator",
    "molarity calculator", "pH calculator", "EMI calculator", "loan calculator", "compound interest",
    "DNA calculator", "PCR calculator", "fertilizer calculator", "agriculture calculator",
    "periodic table", "chemistry tools", "physics calculator", "math calculator",
    "financial calculator", "health calculator", "engineering calculator",
    "حاسبة", "محوّل", "زوما", "كيمياء", "فيزياء", "رياضيات", "مالية", "صحة", "زراعة",
    "molecular biology tools", "genetics calculator", "unit conversion",
  ],
  authors: [{ name: "Mohamed Osama Sayed", url: "https://github.com/m-osama-10" }],
  creator: "Mohamed Osama Sayed",
  publisher: "Zoma Calculator and OSA Converter",
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
    title: "Zoma Calculator and OSA Converter — 150+ Free Online Calculators",
    description: "Free platform with 150+ calculators and converters across 19 categories: math, chemistry, physics, biology, genetics, DNA, agriculture, finance, health, and more. Bilingual (Arabic/English), offline PWA.",
    type: "website",
    siteName: "Zoma Calculator and OSA Converter",
    url: BASE_URL,
    images: [
      {
        url: "/promo.png",
        width: 1536,
        height: 1024,
        alt: "Zoma Calculator and OSA Converter — 150+ Free Online Calculators",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zoma Calculator and OSA Converter — 150+ Free Online Calculators",
    description: "Free platform with 150+ calculators and converters: math, chemistry, physics, biology, genetics, DNA, agriculture, finance, health, and more.",
    images: ["/promo.png"],
  },
  category: "education",
  alternates: {
    canonical: BASE_URL,
    languages: {
      "en": BASE_URL,
      "ar": BASE_URL,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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

// JSON-LD Structured Data
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Zoma Calculator and OSA Converter",
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  description: "Free online platform with 150+ calculators and converters across 19 categories.",
  founder: {
    "@type": "Person",
    name: "Mohamed Osama Sayed",
  },
  sameAs: [
    "https://github.com/m-osama-10",
    "https://www.linkedin.com/in/MoOsama",
    "https://www.facebook.com/M.o0sama",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Zoma Calculator and OSA Converter",
  url: BASE_URL,
  description: "Free online platform with 150+ calculators and converters across 19 categories: math, chemistry, physics, biology, genetics, DNA, agriculture, finance, health, engineering, and more.",
  potentialAction: {
    "@type": "SearchAction",
    target: `${BASE_URL}/?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Zoma Calculator and OSA Converter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Zoma Calculator and OSA Converter is a free online platform offering 150+ calculators and unit converters across 19 categories including math, chemistry, physics, biology, genetics, DNA tools, agriculture, finance, health, and engineering. It's bilingual (Arabic/English) with RTL support and works offline as a PWA.",
      },
    },
    {
      "@type": "Question",
      name: "Is Zoma Calculator free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Zoma Calculator is completely free to use. No registration or personal information is required. All calculations run locally on your device.",
      },
    },
    {
      "@type": "Question",
      name: "Does Zoma Calculator work offline?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, after the first visit, the platform works offline as a Progressive Web App (PWA). You can install it on your device and use all calculators without an internet connection.",
      },
    },
    {
      "@type": "Question",
      name: "How many calculators are available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Zoma Calculator offers 150+ calculators and converters across 19 categories including basic calculators, unit converters, chemistry, physics, mathematics, health, finance, agriculture, molecular biology, genetics, DNA tools, and safe home experiments.",
      },
    },
    {
      "@type": "Question",
      name: "Who developed Zoma Calculator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Zoma Calculator and OSA Converter was developed by Mohamed Osama Sayed, a biotechnology graduate from Assiut University with expertise in web development and UI/UX design.",
      },
    },
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
        {/* JSON-LD Structured Data — in body to avoid AdSense head hydration conflicts */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <AppProviders>
          {children}
        </AppProviders>
        <Toaster />
        <SonnerToaster position="top-center" />
      </body>
    </html>
  );
}

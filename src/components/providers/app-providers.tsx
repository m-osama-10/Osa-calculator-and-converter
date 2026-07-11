"use client";

import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import { usePreferences, useDirection } from "@/store";
import { ServiceWorkerRegister } from "@/components/providers/service-worker-register";

/** Applies <html dir="rtl|ltr"> and lang attributes whenever language changes. */
function HtmlDirectionSync() {
  const lang = usePreferences((s) => s.language);
  const dir = useDirection();
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);
  return null;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      <HtmlDirectionSync />
      <ServiceWorkerRegister />
      {children}
    </ThemeProvider>
  );
}

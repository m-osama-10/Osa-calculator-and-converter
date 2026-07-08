"use client";

import { useEffect } from "react";

/**
 * Registers the service worker for offline PWA support.
 * Only runs in production to avoid interfering with HMR in dev.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    // Skip in dev to avoid caching HMR chunks
    if (process.env.NODE_ENV !== "production") return;

    const register = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch((err) => {
          // Silent fail — SW is a progressive enhancement
          console.warn("SW registration failed:", err);
        });
    };

    // Register after window load to avoid competing with first paint
    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
      return () => window.removeEventListener("load", register);
    }
  }, []);

  return null;
}

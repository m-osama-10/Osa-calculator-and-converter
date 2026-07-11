"use client";

import { useEffect } from "react";

/**
 * Popunder Ad Loader with Frequency Control
 *
 * Instead of loading the popunder script immediately in <head>, this component
 * loads it dynamically with:
 * 1. A delay (default: 30 seconds after page load)
 * 2. A cooldown period between popunder shows (default: 2 hours)
 * 3. Once per session option
 *
 * This prevents the popunder from annoying users by appearing too frequently.
 */

const POPUNDER_SCRIPT_SRC = "https://pl30318260.effectivecpmnetwork.com/2b/9a/6b/2b9a6b655fa25e8a7985dc74f25da262.js";
const STORAGE_KEY = "zoma-popunder-last-shown";

// Configuration — adjust these to control frequency
const DELAY_BEFORE_LOAD_MS = 15_000;       // 15 seconds after page load
const COOLDOWN_MINUTES = 1;                // Show at most once every 1 minute

export function PopunderLoader() {
  useEffect(() => {
    // Check if we should show the popunder (cooldown check)
    const lastShown = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    if (lastShown) {
      const lastShownTime = parseInt(lastShown, 10);
      const minutesSinceLastShow = (now - lastShownTime) / (1000 * 60);
      if (minutesSinceLastShow < COOLDOWN_MINUTES) {
        // Still in cooldown — don't load the popunder
        return;
      }
    }

    // Delay loading the popunder script
    const timer = setTimeout(() => {
      // Record that we're showing the popunder
      localStorage.setItem(STORAGE_KEY, String(Date.now()));

      // Load the popunder script
      const script = document.createElement("script");
      script.async = true;
      script.src = POPUNDER_SCRIPT_SRC;
      document.head.appendChild(script);
    }, DELAY_BEFORE_LOAD_MS);

    return () => clearTimeout(timer);
  }, []);

  return null;
}

"use client";

import { useEffect, useRef, memo } from "react";
import { cn } from "@/lib/utils";

/**
 * Native Banner Ad (EffectiveCPMNetwork)
 *
 * Renders a native banner ad. The invoke.js script is loaded globally in layout.tsx.
 * This component renders the container div that the ad network fills.
 *
 * Container ID: container-a43b4584a8c9a26bff900f3543d3ca80
 */

const CONTAINER_ID = "container-a43b4584a8c9a26bff900f3543d3ca80";

function NativeBannerBase({
  className,
  label = "Advertisement",
}: {
  className?: string;
  label?: string;
}) {
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    // The invoke.js script (loaded in <head>) populates all elements with the
    // container ID. Since React renders the div dynamically, we may need to
    // re-trigger the ad by re-injecting the script after mount.
    const existing = document.getElementById(CONTAINER_ID);
    if (existing && existing.children.length === 0) {
      // Re-inject the invoke script to trigger ad render
      const script = document.createElement("script");
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      script.src = "https://pl30318327.effectivecpmnetwork.com/a43b4584a8c9a26bff900f3543d3ca80/invoke.js";
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div
      className={cn(
        "ad-container-native w-full flex flex-col items-center justify-center",
        "border border-dashed border-muted-foreground/20 rounded-lg",
        "bg-muted/20 overflow-hidden my-3 no-print",
        className
      )}
      style={{ minHeight: 120 }}
      aria-label="Advertisement"
    >
      {label && (
        <span className="text-[9px] uppercase tracking-wider text-muted-foreground/50 pt-1.5 select-none">
          {label}
        </span>
      )}
      <div id={CONTAINER_ID} className="w-full" />
    </div>
  );
}

export const NativeBanner = memo(NativeBannerBase);

"use client";

import { useEffect, memo } from "react";
import { cn } from "@/lib/utils";

/**
 * Native Banner Ad (EffectiveCPMNetwork)
 *
 * Renders a native banner ad. Should be placed ONLY ONCE per page — the ad
 * network fills a container with a fixed ID.
 *
 * Container ID: container-a43b4584a8c9a26bff900f3543d3ca80
 */

const CONTAINER_ID = "container-a43b4584a8c9a26bff900f3543d3ca80";
const SCRIPT_SRC = "https://pl30318327.effectivecpmnetwork.com/a43b4584a8c9a26bff900f3543d3ca80/invoke.js";

function NativeBannerBase({
  className,
  label = "Advertisement",
}: {
  className?: string;
  label?: string;
}) {
  useEffect(() => {
    // Inject the invoke.js script directly into the container after mount.
    // This ensures the script runs after the container div exists in the DOM.
    const container = document.getElementById(CONTAINER_ID);
    if (!container) return;

    // Clear any existing content
    container.innerHTML = "";

    // Create and inject the script directly into the container
    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = SCRIPT_SRC;
    container.appendChild(script);

    return () => {
      // Cleanup on unmount
      container.innerHTML = "";
    };
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

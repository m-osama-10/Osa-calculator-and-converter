"use client";

import { useEffect, useRef, memo } from "react";
import { cn } from "@/lib/utils";

/**
 * Google AdSense Ad Unit Component
 *
 * Renders an AdSense ad. The AdSense script is loaded globally in layout.tsx.
 * Each instance pushes to the adsbygoogle queue to initialize the ad.
 *
 * @param slot - The ad slot ID (optional for auto-ads; required for specific ad units)
 * @param format - Ad format (auto, horizontal, vertical, rectangle, fluid)
 * @param layout - Optional layout key
 * @param layoutKey - Optional layout key value
 * @param responsive - Whether the ad is responsive (default true)
 * @param className - Optional extra CSS classes for the container
 * @param label - Optional label to show above the ad (e.g. "Advertisement")
 */

export interface AdSenseAdProps {
  slot?: string;
  format?: string;
  layout?: string;
  layoutKey?: string;
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  label?: string;
  /** Minimum height to reserve while the ad loads, prevents layout shift */
  minHeight?: number;
}

const AD_CLIENT = "ca-pub-3474575203383848";

function AdSenseAdBase({
  slot = "auto",
  format = "auto",
  layout,
  layoutKey,
  responsive = true,
  className,
  style,
  label = "Advertisement",
  minHeight = 120,
}: AdSenseAdProps) {
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // Push to the adsbygoogle queue to initialize this ad unit.
    // The queue is created by the global AdSense script.
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      if (!w.adsbygoogle) w.adsbygoogle = [];
      (w.adsbygoogle as unknown[]).push({});
    } catch {
      // Silently fail — ads are a progressive enhancement
    }
  }, []);

  return (
    <div
      className={cn(
        "ad-container w-full flex flex-col items-center justify-center",
        "border border-dashed border-muted-foreground/20 rounded-lg",
        "bg-muted/20 overflow-hidden my-3 no-print",
        className
      )}
      style={{ minHeight }}
      aria-label="Advertisement"
    >
      {label && (
        <span className="text-[9px] uppercase tracking-wider text-muted-foreground/50 pt-1.5 select-none">
          {label}
        </span>
      )}
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block", width: "100%", ...style }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
        {...(layout ? { "data-ad-layout": layout } : {})}
        {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
      />
    </div>
  );
}

export const AdSenseAd = memo(AdSenseAdBase);

/**
 * Compact banner ad — good for header/footer/sidebar placements.
 */
export function AdBanner({ className, label }: { className?: string; label?: string }) {
  return (
    <AdSenseAd
      slot="auto"
      format="horizontal"
      responsive
      className={className}
      label={label}
      minHeight={90}
      style={{ minHeight: 90 }}
    />
  );
}

/**
 * Square/rectangle ad — good for inline content placement.
 */
export function AdSquare({ className, label }: { className?: string; label?: string }) {
  return (
    <AdSenseAd
      slot="auto"
      format="rectangle"
      responsive
      className={className}
      label={label}
      minHeight={250}
    />
  );
}

/**
 * In-feed ad — designed to sit between cards in a grid or list.
 */
export function AdInFeed({ className, label }: { className?: string; label?: string }) {
  return (
    <AdSenseAd
      slot="auto"
      format="fluid"
      layout="in-article"
      responsive
      className={className}
      label={label}
      minHeight={150}
    />
  );
}

/**
 * Vertical ad for sidebar.
 */
export function AdVertical({ className, label }: { className?: string; label?: string }) {
  return (
    <AdSenseAd
      slot="auto"
      format="vertical"
      responsive
      className={className}
      label={label}
      minHeight={300}
    />
  );
}

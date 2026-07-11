"use client";

import { useEffect, useRef, memo } from "react";
import { cn } from "@/lib/utils";

/**
 * HighPerformanceFormat 468x60 Banner Ad
 *
 * Renders a 468x60 banner ad. Should be placed ONLY ONCE per page.
 *
 * Ad key: 85e39e91f2ba4011335641ab0060de3b
 */

const AD_KEY = "85e39e91f2ba4011335641ab0060de3b";
const AD_SCRIPT_SRC = `https://www.highperformanceformat.com/${AD_KEY}/invoke.js`;

function HPFBanner468Base({
  className,
  label = "Advertisement",
}: {
  className?: string;
  label?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const w = window as unknown as { atOptions?: Record<string, unknown> };
    w.atOptions = {
      key: AD_KEY,
      format: "iframe",
      height: 60,
      width: 468,
      params: {},
    };

    const script = document.createElement("script");
    script.src = AD_SCRIPT_SRC;
    script.async = true;
    script.type = "text/javascript";

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div
      className={cn(
        "ad-container-hpf468 w-full flex flex-col items-center justify-center",
        "border border-dashed border-muted-foreground/20 rounded-lg",
        "bg-muted/20 overflow-hidden my-3 no-print",
        className
      )}
      style={{ minHeight: 60 }}
      aria-label="Advertisement"
    >
      {label && (
        <span className="text-[9px] uppercase tracking-wider text-muted-foreground/50 pt-1.5 select-none">
          {label}
        </span>
      )}
      <div ref={containerRef} className="w-full flex justify-center" />
    </div>
  );
}

export const HPFBanner468 = memo(HPFBanner468Base);

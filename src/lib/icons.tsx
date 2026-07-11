"use client";

import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";
import { createElement, memo } from "react";

/** Lookup an icon component by name. */
function lookup(name: string): LucideIcon {
  return (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Square;
}

/** Icon component — wraps a Lucide icon by name. Safe to render inline. */
export const Icon = memo(function Icon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  // Use createElement to avoid the "components created during render" lint rule
  return createElement(lookup(name), { className });
});

/** Direct accessor for cases needing the component reference. */
export function getIconComponent(name: string): LucideIcon {
  return lookup(name);
}

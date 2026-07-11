// ============================================================================
// Calculator utility helpers
// ============================================================================

import type { Language } from "./i18n";

/** Parse a string to number, treating empty/invalid as NaN. */
export function num(v: string | number | boolean | undefined | null): number {
  if (typeof v === "number") return v;
  if (typeof v === "boolean") return v ? 1 : 0;
  if (v == null || v === "") return NaN;
  const n = Number(String(v).replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : NaN;
}

/** Format number with given precision. Returns "—" for NaN. */
export function fmt(n: number, precision = 4): string {
  if (!Number.isFinite(n)) return "—";
  if (Number.isInteger(n) && Math.abs(n) < 1e15) return n.toLocaleString("en-US");
  // Avoid trailing zeros
  const rounded = Number(n.toFixed(precision));
  return rounded.toLocaleString("en-US", { maximumFractionDigits: precision });
}

/** Format in scientific notation when number is very large/small. */
export function fmtSci(n: number, precision = 4): string {
  if (!Number.isFinite(n)) return "—";
  if (n === 0) return "0";
  const abs = Math.abs(n);
  if (abs >= 1e6 || abs < 1e-3) {
    return n.toExponential(precision);
  }
  return fmt(n, precision);
}

/** Localized "not a number" message. */
export function nanMessage(lang: Language): string {
  return lang === "ar"
    ? "الرجاء إدخال قيم صالحة"
    : "Please enter valid numeric values";
}

/** Convert a Formula string with placeholders to a display string. */
export function renderFormula(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? ""));
}

/** Clamp a number to [min,max]. */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

/** Safe eval of basic arithmetic expressions (+ - * / ^ ( ) and numbers). */
export function safeEval(expr: string): number {
  // Only allow numbers, operators, parentheses, decimal point, spaces, and common math fns
  const cleaned = expr
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/\^/g, "**")
    .replace(/π/g, String(Math.PI))
    .replace(/τ/g, String(2 * Math.PI))
    // Percentage: number followed by % → (number / 100)
    .replace(/(\d+(?:\.\d+)?)%/g, "($1/100)")
    .replace(/√\(/g, "Math.sqrt(")
    .replace(/√(\d+(\.\d+)?)/g, "Math.sqrt($1)")
    .replace(/\bsqrt\(/g, "Math.sqrt(")
    .replace(/\bsin\(/g, "Math.sin(")
    .replace(/\bcos\(/g, "Math.cos(")
    .replace(/\btan\(/g, "Math.tan(")
    .replace(/\basin\(/g, "Math.asin(")
    .replace(/\bacos\(/g, "Math.acos(")
    .replace(/\batan\(/g, "Math.atan(")
    .replace(/\blog\(/g, "Math.log10(")
    .replace(/\bln\(/g, "Math.log(")
    .replace(/\bexp\(/g, "Math.exp(")
    .replace(/\babs\(/g, "Math.abs(")
    .replace(/\be\b/g, String(Math.E))
    .replace(/(\d+(?:\.\d+)?)!/g, (_, n) => String(factorial(Number(n))));

  if (!/^[\d+\-*/().\s,ePMath(a-z)*]+$/i.test(cleaned)) {
    return NaN;
  }
  try {
    const fn = new Function(`"use strict"; return (${cleaned});`);
    const v = fn();
    return typeof v === "number" ? v : NaN;
  } catch {
    return NaN;
  }
}

export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

/** Format a Date as YYYY-MM-DD. */
export function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Days between two dates (b - a). */
export function daysBetween(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime();
  return Math.floor(ms / 86_400_000);
}

/** Round to N decimals, returning a number. */
export function round(n: number, decimals = 4): number {
  const f = Math.pow(10, decimals);
  return Math.round(n * f) / f;
}

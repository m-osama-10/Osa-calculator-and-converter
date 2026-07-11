// ============================================================================
// Zoma Calculator and OSA Converter — Core Calculator Framework Types
// ============================================================================
// A "calculator" is just data + a pure compute function. The UI is rendered
// dynamically from the input schema, so adding a new calculator requires NO
// new UI code — just register a new entry.
// ============================================================================

import type { Language } from "./i18n";

export type CategoryId =
  | "basic"
  | "converters"
  | "chemistry"
  | "physics"
  | "math"
  | "health"
  | "nutrition"
  | "finance"
  | "engineering"
  | "laboratory"
  | "computer"
  | "datetime"
  | "construction"
  | "everyday";

export interface Category {
  id: CategoryId;
  names: Record<Language, string>;
  description: Record<Language, string>;
  /** Lucide icon name (string). We map to component in the UI. */
  icon: string;
  color: string; // tailwind gradient stops e.g. "from-rose-500 to-orange-500"
}

// ---------------------------------------------------------------------------
// Input field schema — drives dynamic form rendering
// ---------------------------------------------------------------------------
export type FieldType = "number" | "text" | "select" | "boolean" | "date";

export interface FieldOption {
  value: string;
  label: Record<Language, string>;
}

export interface Field {
  /** Stable key — used as the key in the input values object */
  key: string;
  names: Record<Language, string>;
  type: FieldType;
  /** Placeholder (text/number) */
  placeholder?: Record<Language, string>;
  /** Default value */
  default?: string | number | boolean;
  /** Options for select type */
  options?: FieldOption[];
  /** Min/max for number */
  min?: number;
  max?: number;
  step?: number;
  /** Unit suffix shown after the input e.g. "kg", "m/s" */
  unit?: Record<Language, string>;
  /** Help text */
  help?: Record<Language, string>;
  /** Whether field is required (default true) */
  required?: boolean;
}

// ---------------------------------------------------------------------------
// Result — what compute() returns
// ---------------------------------------------------------------------------
export interface ResultLine {
  /** Label e.g. "BMI" */
  label: Record<Language, string>;
  /** Numeric or textual value (already formatted) */
  value: string;
  /** Optional unit */
  unit?: Record<Language, string>;
  /** Optional emphasis: highlight as the main result */
  primary?: boolean;
  /** Optional status indicator for color coding */
  status?: "neutral" | "good" | "warning" | "bad";
}

export interface ResultChart {
  type: "bar" | "line" | "pie" | "donut" | "gauge";
  title: Record<Language, string>;
  /** For bar/line: {label, value} pairs; for pie/donut: {label, value} */
  data: Array<{ label: string; value: number; color?: string }>;
  unit?: Record<Language, string>;
}

export interface CalcStep {
  description: Record<Language, string>;
  expression?: string;
}

export interface ComputeResult {
  results: ResultLine[];
  formula?: string; // raw formula text (language-agnostic, LaTeX-ish or plain)
  steps?: CalcStep[];
  explanation?: Record<Language, string>;
  chart?: ResultChart;
  /** Optional error message (validation errors etc.) */
  error?: Record<Language, string>;
}

// ---------------------------------------------------------------------------
// The Calculator interface
// ---------------------------------------------------------------------------
export interface Calculator {
  /** Stable slug — used as id & URL hash */
  id: string;
  category: CategoryId;
  names: Record<Language, string>;
  descriptions: Record<Language, string>;
  /** Search keywords (English + Arabic) */
  keywords: string[];
  /** Lucide icon name */
  icon: string;
  /** Input fields */
  fields: Field[];
  /** Pure compute function. Returns ComputeResult. */
  compute: (values: Record<string, string | number | boolean>) => ComputeResult;
  /** Optional: don't render the "Calculate" button — compute live on every input change */
  live?: boolean;
}

// Registry types
export interface RegistryEntry {
  calculator: Calculator;
  category: Category;
}

// ============================================================================
// Calculator Registry — combines all categories
// ============================================================================

import type { Calculator, RegistryEntry, CategoryId } from "./types";
import { CATEGORIES, CATEGORY_MAP } from "./categories";
import { basicCalculators } from "./calculators/basic";
import { converterCalculators } from "./calculators/converters";
import { chemistryCalculators } from "./calculators/chemistry";
import { physicsCalculators } from "./calculators/physics";
import { mathCalculators } from "./calculators/math";
import { healthCalculators } from "./calculators/health";
import { financeCalculators } from "./calculators/finance";
import {
  computerCalculators,
  datetimeCalculators,
  constructionCalculators,
  everydayCalculators,
  engineeringCalculators,
  laboratoryCalculators,
  nutritionCalculators,
} from "./calculators/misc";
import { homeExperimentCalculators } from "./calculators/home-experiments";
import { molecularBiologyCalculators } from "./calculators/molecular-biology";
import { geneticsCalculators } from "./calculators/genetics";
import { dnaToolsCalculators } from "./calculators/dna-tools";
import { periodicTableCalculator } from "./calculators/periodic-table-viewer";
import { agricultureCalculators } from "./calculators/agriculture";

const allCalcs: Calculator[] = [
  ...basicCalculators,
  ...converterCalculators,
  ...chemistryCalculators,
  ...physicsCalculators,
  ...mathCalculators,
  ...healthCalculators,
  ...financeCalculators,
  ...engineeringCalculators,
  ...laboratoryCalculators,
  ...computerCalculators,
  ...datetimeCalculators,
  ...constructionCalculators,
  ...everydayCalculators,
  ...nutritionCalculators,
  ...homeExperimentCalculators,
  ...molecularBiologyCalculators,
  ...geneticsCalculators,
  ...dnaToolsCalculators,
  periodicTableCalculator,
  ...agricultureCalculators,
];

export const REGISTRY: RegistryEntry[] = allCalcs.map((calc) => ({
  calculator: calc,
  category: CATEGORY_MAP[calc.category],
}));

export const ALL_CALCULATORS: Calculator[] = allCalcs;

export function getCalculatorById(id: string): Calculator | undefined {
  return allCalcs.find((c) => c.id === id);
}

export function getByCategory(catId: CategoryId): Calculator[] {
  return allCalcs.filter((c) => c.category === catId);
}

export function searchCalculators(query: string, limit = 20): RegistryEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const tokens = q.split(/\s+/);
  const scored: Array<{ entry: RegistryEntry; score: number }> = [];
  for (const entry of REGISTRY) {
    const nameEn = entry.calculator.names.en.toLowerCase();
    const nameAr = entry.calculator.names.ar.toLowerCase();
    const descEn = entry.calculator.descriptions.en.toLowerCase();
    const descAr = entry.calculator.descriptions.ar.toLowerCase();
    const cat = entry.category.names.en.toLowerCase() + " " + entry.category.names.ar.toLowerCase();
    const keywords = entry.calculator.keywords.join(" ").toLowerCase();
    let score = 0;
    if (nameEn === q || nameAr === q) score += 100;
    if (nameEn.startsWith(q) || nameAr.startsWith(q)) score += 60;
    if (nameEn.includes(q) || nameAr.includes(q)) score += 40;
    if (keywords.includes(q)) score += 30;
    if (descEn.includes(q) || descAr.includes(q)) score += 15;
    if (cat.includes(q)) score += 20;
    // token coverage (multi-word queries)
    for (const tok of tokens) {
      if (nameEn.includes(tok) || nameAr.includes(tok) || keywords.includes(tok)) score += 5;
    }
    if (score > 0) scored.push({ entry, score });
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, limit).map((s) => s.entry);
}

export function getPopularCalculators(): Calculator[] {
  // Curated popular list
  const popularIds = [
    "bmi", "loan-emi", "compound-interest", "standard", "molar-mass", "ph",
    "percentage", "conv-length", "conv-temperature", "age", "vat", "tip",
  ];
  return popularIds.map((id) => getCalculatorById(id)).filter(Boolean) as Calculator[];
}

export { CATEGORIES };

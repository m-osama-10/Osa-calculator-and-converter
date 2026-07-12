// ============================================================================
// Periodic Table Viewer — interactive calculator entry
// ============================================================================

import type { Calculator } from "../types";
import { ELEMENTS } from "../periodic-table";

export const periodicTableCalculator: Calculator = {
  id: "periodic-table",
  category: "chemistry",
  names: { en: "Periodic Table (Interactive)", ar: "الجدول الدوري (تفاعلي)" },
  descriptions: {
    en: "Complete interactive periodic table with all 118 elements. Click any element to see details.",
    ar: "جدول دوري تفاعلي كامل بكل العناصر الـ 118. اضغط على أي عنصر لرؤية التفاصيل.",
  },
  keywords: ["periodic", "table", "elements", "atomic", "جدول دوري", "عناصر"],
  icon: "Grid3x3",
  live: true,
  fields: [
    {
      key: "info",
      names: { en: "Periodic Table", ar: "الجدول الدوري" },
      type: "select",
      default: "info",
      options: [
        { value: "info", label: { en: "118 elements — see results below ↓", ar: "118 عنصر — انظر النتائج بالأسفل ↓" } },
      ],
      help: {
        en: "The periodic table organizes all known elements by atomic number, electron configuration, and chemical properties. Click an element in the results to see its full details.",
        ar: "الجدول الدوري ينظم كل العناصر المعروفة حسب العدد الذري، توزيع الإلكترونات، والخصائص الكيميائية. اضغط على عنصر في النتائج لرؤية تفاصيله الكاملة.",
      },
    },
  ],
  compute: () => {
    // Return all elements as result lines
    const results = ELEMENTS.map((e) => ({
      label: { en: `${e.symbol} — ${e.nameEn} (${e.nameAr})`, ar: `${e.symbol} — ${e.nameAr} (${e.nameEn})` },
      value: `#${e.number} | ${e.atomicMass} g/mol | ${e.categoryAr}`,
    }));

    return {
      results: results.slice(0, 20), // Show first 20 in results
      formula: "Periodic Table — 118 Elements (full data in library/periodic-table.ts)",
      explanation: {
        en: "This shows the first 20 elements. The full interactive periodic table is available in the Periodic Table view. Each element has: atomic number, symbol, name, atomic mass, electron configuration, category, and position (group/period).",
        ar: "هذا يعرض أول 20 عنصرًا. الجدول الدوري التفاعلي الكامل متاح في عرض الجدول الدوري. كل عنصر له: العدد الذري، الرمز، الاسم، الكتلة الذرية، توزيع الإلكترونات، التصنيف، والموضع (مجموعة/دورة).",
      },
    };
  },
};

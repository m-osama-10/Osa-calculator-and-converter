// ============================================================================
// Molecular Genetics Calculators
// ============================================================================

import type { Calculator } from "../types";
import { num, fmt } from "../calculator-utils";

export const geneticsCalculators: Calculator[] = [
  // Hardy-Weinberg Equilibrium
  {
    id: "gen-hardy-weinberg",
    category: "genetics",
    names: { en: "Hardy-Weinberg Equilibrium", ar: "توازن هاردي-واينبرغ" },
    descriptions: {
      en: "Calculate allele and genotype frequencies under Hardy-Weinberg equilibrium: p² + 2pq + q² = 1.",
      ar: "احسب ترددات الأليل والتركيب الوراثي في توازن هاردي-واينبرغ: p² + 2pq + q² = 1.",
    },
    keywords: ["hardy", "weinberg", "equilibrium", "allele", "genotype", "هاردي", "واينبرغ"],
    icon: "Gene",
    live: true,
    fields: [
      {
        key: "input",
        names: { en: "What you know", ar: "ما تعرفه" },
        type: "select",
        default: "q",
        options: [
          { value: "q", label: { en: "Recessive phenotype frequency (q²)", ar: "تردد الصفة المتنحية (q²)" } },
          { value: "p", label: { en: "Dominant allele frequency (p)", ar: "تردد الأليل السائد (p)" } },
          { value: "pq", label: { en: "Heterozygote frequency (2pq)", ar: "تردد المتغاير (2pq)" } },
        ],
        help: { en: "Choose what you have and enter its value below.", ar: "اختر ما لديك وأدخل قيمته بالأسفل." },
      },
      { key: "value", names: { en: "Value", ar: "القيمة" }, type: "number", default: 0.04, help: { en: "Enter as decimal (0.04 = 4%)", ar: "أدخل كنسبة عشرية (0.04 = 4%)" } },
    ],
    compute: (v) => {
      const val = num(v.value);
      if (Number.isNaN(val) || val < 0 || val > 1) return { results: [], error: { en: "Enter a value between 0 and 1", ar: "أدخل قيمة بين 0 و 1" } };
      let p: number, q: number;
      const mode = String(v.input);
      if (mode === "q") {
        q = Math.sqrt(val);
        p = 1 - q;
      } else if (mode === "p") {
        p = val;
        q = 1 - p;
      } else {
        // 2pq = val, solve for p and q
        // q = (1 - sqrt(1 - 2*val)) / 2 ... complex; use approximation
        // Actually: 2pq = val, p+q=1 → 2p(1-p)=val → 2p - 2p² = val → 2p² - 2p + val = 0
        // p = (2 ± sqrt(4 - 8*val)) / 4 = (1 ± sqrt(1 - 2*val)) / 2
        const disc = 1 - 2 * val;
        if (disc < 0) return { results: [], error: { en: "Invalid 2pq value", ar: "قيمة 2pq غير صالحة" } };
        p = (1 + Math.sqrt(disc)) / 2;
        q = 1 - p;
      }
      const p2 = p * p;
      const q2 = q * q;
      const twoPQ = 2 * p * q;
      return {
        results: [
          { label: { en: "p (dominant allele)", ar: "p (الأليل السائد)" }, value: fmt(p, 4) + " (" + fmt(p * 100, 2) + "%)", primary: true },
          { label: { en: "q (recessive allele)", ar: "q (الأليل المتنحي)" }, value: fmt(q, 4) + " (" + fmt(q * 100, 2) + "%)", primary: true },
          { label: { en: "p² (AA homozygous dominant)", ar: "p² (AA سائد متماثل)" }, value: fmt(p2, 4) + " (" + fmt(p2 * 100, 2) + "%)" },
          { label: { en: "2pq (Aa heterozygous)", ar: "2pq (Aa متغاير)" }, value: fmt(twoPQ, 4) + " (" + fmt(twoPQ * 100, 2) + "%)" },
          { label: { en: "q² (aa homozygous recessive)", ar: "q² (aa متنحي متماثل)" }, value: fmt(q2, 4) + " (" + fmt(q2 * 100, 2) + "%)" },
        ],
        formula: `p² + 2pq + q² = 1, p + q = 1`,
        steps: [
          { description: { en: `Given: ${mode === "q" ? "q² = " + val : mode === "p" ? "p = " + val : "2pq = " + val}`, ar: `معطى: ${mode === "q" ? "q² = " + val : mode === "p" ? "p = " + val : "2pq = " + val}` } },
          { description: { en: `p = ${fmt(p, 4)}, q = ${fmt(q, 4)}`, ar: `p = ${fmt(p, 4)}، q = ${fmt(q, 4)}` } },
          { description: { en: `p² = ${fmt(p2, 4)}, 2pq = ${fmt(twoPQ, 4)}, q² = ${fmt(q2, 4)}`, ar: `p² = ${fmt(p2, 4)}، 2pq = ${fmt(twoPQ, 4)}، q² = ${fmt(q2, 4)}` } },
        ],
        explanation: {
          en: "Hardy-Weinberg equilibrium assumes: no mutation, no migration, no selection, random mating, large population. If observed genotype frequencies differ significantly from expected, the population is evolving.",
          ar: "توازن هاردي-واينبرغ يفترض: لا طفرات، لا هجرة، لا انتقاء، تزاوج عشوائي، مجتمع كبير. إذا اختلفت الترددات المرصودة عن المتوقعة بشكل كبير، فالمجتمع يتطور.",
        },
      };
    },
  },

  // Punnett Square
  {
    id: "gen-punnett",
    category: "genetics",
    names: { en: "Punnett Square (Monohybrid)", ar: "مربع بنيت (أحادي الهجين)" },
    descriptions: {
      en: "Generate a Punnett square for a monohybrid cross and calculate offspring genotype & phenotype ratios.",
      ar: "أنشئ مربع بنيت لتزاوج أحادي الهجين واحسب نسب التركيب الوراثي والصفات للأبناء.",
    },
    keywords: ["punnett", "square", "monohybrid", "cross", "genetics", "بنيت"],
    icon: "Grid2x2",
    live: true,
    fields: [
      {
        key: "parent1",
        names: { en: "Parent 1 genotype", ar: "التركيب الوراثي للأب 1" },
        type: "select",
        default: "Aa",
        options: [
          { value: "AA", label: { en: "AA (homozygous dominant)", ar: "AA (سائد متماثل)" } },
          { value: "Aa", label: { en: "Aa (heterozygous)", ar: "Aa (متغاير)" } },
          { value: "aa", label: { en: "aa (homozygous recessive)", ar: "aa (متنحي متماثل)" } },
        ],
      },
      {
        key: "parent2",
        names: { en: "Parent 2 genotype", ar: "التركيب الوراثي للأب 2" },
        type: "select",
        default: "Aa",
        options: [
          { value: "AA", label: { en: "AA (homozygous dominant)", ar: "AA (سائد متماثل)" } },
          { value: "Aa", label: { en: "Aa (heterozygous)", ar: "Aa (متغاير)" } },
          { value: "aa", label: { en: "aa (homozygous recessive)", ar: "aa (متنحي متماثل)" } },
        ],
      },
    ],
    compute: (v) => {
      const p1 = String(v.parent1);
      const p2 = String(v.parent2);
      const alleles1 = p1.split("");
      const alleles2 = p2.split("");
      const offspring: string[] = [];
      for (const a1 of alleles1) {
        for (const a2 of alleles2) {
          // Sort so dominant (uppercase) comes first
          const pair = (a1 >= a2) ? a1 + a2 : a2 + a1;
          offspring.push(pair);
        }
      }
      // Count genotypes
      const counts: Record<string, number> = {};
      for (const g of offspring) counts[g] = (counts[g] || 0) + 1;
      const total = offspring.length;
      const dominantPheno = (counts["AA"] || 0) + (counts["Aa"] || 0);
      const recessivePheno = counts["aa"] || 0;

      const square = [
        `${alleles1[0]}${alleles2[0]}`, `${alleles1[0]}${alleles2[1]}`,
        `${alleles1[1]}${alleles2[0]}`, `${alleles1[1]}${alleles2[1]}`,
      ].map((g) => (g[0] >= g[1] ? g : g[1] + g[0]));

      return {
        results: [
          { label: { en: "Cross", ar: "التزاوج" }, value: `${p1} × ${p2}`, primary: true },
          { label: { en: "Punnett square", ar: "مربع بنيت" }, value: `      ${alleles2[0]}   ${alleles2[1]}\n${alleles1[0]}   ${square[0]}    ${square[1]}\n${alleles1[1]}   ${square[2]}    ${square[3]}` },
          { label: { en: "Genotype ratio", ar: "نسبة التركيب الوراثي" }, value: Object.entries(counts).map(([g, c]) => `${g}: ${c}/${total}`).join(", ") },
          { label: { en: "Phenotype ratio (dom:rec)", ar: "نسبة الصفات (سائد:متنحي)" }, value: `${dominantPheno}/${total} : ${recessivePheno}/${total}`, primary: true },
        ],
        formula: `${p1} × ${p2} → ${Object.entries(counts).map(([g, c]) => `${g}=${c}/${total}`).join(", ")}`,
        steps: [
          { description: { en: `Parent 1 gametes: ${alleles1.join(", ")}`, ar: `أمشاج الأب 1: ${alleles1.join(", ")}` } },
          { description: { en: `Parent 2 gametes: ${alleles2.join(", ")}`, ar: `أمشاج الأب 2: ${alleles2.join(", ")}` } },
          { description: { en: `Offspring: ${square.join(" | ")}`, ar: `الأبناء: ${square.join(" | ")}` } },
        ],
        explanation: {
          en: "A Punnett square shows all possible offspring from a cross. For Aa × Aa: 1 AA : 2 Aa : 1 aa (genotype), 3 dominant : 1 recessive (phenotype). For test cross (Aa × aa): 1 Aa : 1 aa.",
          ar: "مربع بنيت يعرض كل الأبناء الممكنة من تزاوج. لـ Aa × Aa: 1 AA : 2 Aa : 1 aa (تركيب وراثي)، 3 سائد : 1 متنحي (صفة). للتزاوج الاختباري (Aa × aa): 1 Aa : 1 aa.",
        },
      };
    },
  },

  // Allele Frequency Change
  {
    id: "gen-allele-freq",
    category: "genetics",
    names: { en: "Allele Frequency from Genotype Counts", ar: "تردد الأليل من أعداد التركيب الوراثي" },
    descriptions: {
      en: "Calculate allele frequencies (p and q) from observed genotype counts in a population.",
      ar: "احسب ترددات الأليل (p و q) من أعداد التركيب الوراثي المرصودة في مجتمع.",
    },
    keywords: ["allele", "frequency", "population", "genotype", "تردد", "أليل"],
    icon: "BarChart3",
    live: true,
    fields: [
      { key: "aa", names: { en: "Count of AA", ar: "عدد AA" }, type: "number", default: 36 },
      { key: "Aa", names: { en: "Count of Aa", ar: "عدد Aa" }, type: "number", default: 48 },
      { key: "aaa", names: { en: "Count of aa", ar: "عدد aa" }, type: "number", default: 16 },
    ],
    compute: (v) => {
      const AA = num(v.aa);
      const Aa = num(v.Aa);
      const aa = num(v.aaa);
      if ([AA, Aa, aa].some(Number.isNaN) || AA < 0 || Aa < 0 || aa < 0) return { results: [], error: { en: "Enter non-negative counts", ar: "أدخل أعدادًا غير سالبة" } };
      const N = AA + Aa + aa;
      if (N === 0) return { results: [], error: { en: "Total cannot be zero", ar: "الإجمالي لا يمكن أن يكون صفرًا" } };
      const p = (2 * AA + Aa) / (2 * N);
      const q = (2 * aa + Aa) / (2 * N);
      // Expected under HWE
      const expAA = p * p * N;
      const expAa = 2 * p * q * N;
      const expaa = q * q * N;
      // Chi-square
      const chi2 = ((AA - expAA) ** 2 / expAA) + ((Aa - expAa) ** 2 / expAa) + ((aa - expaa) ** 2 / expaa);
      return {
        results: [
          { label: { en: "Population size (N)", ar: "حجم المجتمع (N)" }, value: String(N) },
          { label: { en: "p (A allele frequency)", ar: "p (تردد أليل A)" }, value: fmt(p, 4) + " (" + fmt(p * 100, 2) + "%)", primary: true },
          { label: { en: "q (a allele frequency)", ar: "q (تردد أليل a)" }, value: fmt(q, 4) + " (" + fmt(q * 100, 2) + "%)", primary: true },
          { label: { en: "Expected AA (under HWE)", ar: "AA المتوقع (تحت HWE)" }, value: fmt(expAA, 1) },
          { label: { en: "Expected Aa", ar: "Aa المتوقع" }, value: fmt(expAa, 1) },
          { label: { en: "Expected aa", ar: "aa المتوقع" }, value: fmt(expaa, 1) },
          { label: { en: "Chi-square (χ²)", ar: "مربع كاي (χ²)" }, value: fmt(chi2, 4), help: { en: "If χ² < 3.84, population is in HWE (p>0.05)", ar: "إذا χ² < 3.84، المجتمع في توازن HWE" } as never },
        ],
        formula: `p = (2×AA + Aa) / 2N, q = (2×aa + Aa) / 2N`,
        steps: [
          { description: { en: `N = ${AA} + ${Aa} + ${aa} = ${N}`, ar: `N = ${AA} + ${Aa} + ${aa} = ${N}` } },
          { description: { en: `p = (2×${AA} + ${Aa}) / (2×${N}) = ${fmt(p, 4)}`, ar: `p = (2×${AA} + ${Aa}) / (2×${N}) = ${fmt(p, 4)}` } },
          { description: { en: `q = (2×${aa} + ${Aa}) / (2×${N}) = ${fmt(q, 4)}`, ar: `q = (2×${aa} + ${Aa}) / (2×${N}) = ${fmt(q, 4)}` } },
        ],
        explanation: {
          en: "Chi-square test with 1 degree of freedom: critical value 3.84 at p=0.05. If χ² > 3.84, the population is NOT in Hardy-Weinberg equilibrium (may be evolving).",
          ar: "اختبار مربع كاي بدرجة حرية 1: القيمة الحرجة 3.84 عند p=0.05. إذا χ² > 3.84، المجتمع ليس في توازن هاردي-واينبرغ (قد يكون يتطور).",
        },
      };
    },
  },

  // Mutation Rate
  {
    id: "gen-mutation-rate",
    category: "genetics",
    names: { en: "Mutation Rate Calculator", ar: "حاسبة معدل الطفرات" },
    descriptions: {
      en: "Calculate mutation rate per generation or per base pair from observed mutations.",
      ar: "احسب معدل الطفرات لكل جيل أو لكل زوج قاعدي من الطفرات المرصودة.",
    },
    keywords: ["mutation", "rate", "evolution", "طفرات", "معدل"],
    icon: "Shuffle",
    live: true,
    fields: [
      { key: "mutants", names: { en: "Number of mutants", ar: "عدد الطفرات" }, type: "number", default: 5 },
      { key: "total", names: { en: "Total individuals screened", ar: "إجمالي الأفراد المفحوصين" }, type: "number", default: 100000 },
      { key: "generations", names: { en: "Number of generations", ar: "عدد الأجيال" }, type: "number", default: 1 },
    ],
    compute: (v) => {
      const m = num(v.mutants);
      const t = num(v.total);
      const g = num(v.generations);
      if ([m, t, g].some(Number.isNaN) || t <= 0 || g <= 0) return { results: [], error: { en: "Enter valid positive values", ar: "أدخل قيمًا موجبة صالحة" } };
      const rate = m / (t * g);
      return {
        results: [
          { label: { en: "Mutation rate (per generation)", ar: "معدل الطفرات (لكل جيل)" }, value: fmt(rate, 6) + " (" + fmt(rate * 100, 4) + "%)", primary: true },
          { label: { en: "1 mutation per", ar: "1 طفرة لكل" }, value: fmt(1 / rate, 0) + " individuals" },
          { label: { en: "In scientific notation", ar: "بالصيغة العلمية" }, value: rate.toExponential(3) },
        ],
        formula: `μ = mutants / (total × generations) = ${m} / (${t} × ${g}) = ${fmt(rate, 6)}`,
        steps: [
          { description: { en: `Mutants = ${m}`, ar: `الطفرات = ${m}` } },
          { description: { en: `Total screened = ${t} × ${g} generations = ${fmt(t * g, 0)}`, ar: `الإجمالي المفحوص = ${t} × ${g} جيل = ${fmt(t * g, 0)}` } },
          { description: { en: `μ = ${m} / ${fmt(t * g, 0)} = ${fmt(rate, 6)}`, ar: `μ = ${m} / ${fmt(t * g, 0)} = ${fmt(rate, 6)}` } },
        ],
        explanation: {
          en: "Typical mutation rates: E. coli ~2×10⁻¹⁰/generation/bp, human ~1.3×10⁻⁸/generation/bp, HIV ~3×10⁻⁵/generation/bp. Higher rates in viruses due to error-prone replication.",
          ar: "معدلات الطفرات النموذجية: E. coli ~2×10⁻¹⁰/جيل/زوج قاعدي، الإنسان ~1.3×10⁻⁸/جيل/زوج قاعدي، HIV ~3×10⁻⁵/جيل/زوج قاعدي. معدلات أعلى في الفيروسات بسبب النسخ المعرض للأخطاء.",
        },
      };
    },
  },
];

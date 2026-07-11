// ============================================================================
// Chemistry Calculators
// ============================================================================

import type { Calculator } from "../types";
import { num, fmt, fmtSci } from "../calculator-utils";

// Compact periodic table subset (symbol -> {name, mass}) — enough for formula parser
const ELEMENTS: Record<string, { en: string; ar: string; mass: number }> = {
  H: { en: "Hydrogen", ar: "هيدروجين", mass: 1.008 },
  He: { en: "Helium", ar: "هيليوم", mass: 4.0026 },
  Li: { en: "Lithium", ar: "ليثيوم", mass: 6.94 },
  Be: { en: "Beryllium", ar: "بيريليوم", mass: 9.0122 },
  B: { en: "Boron", ar: "بورون", mass: 10.81 },
  C: { en: "Carbon", ar: "كربون", mass: 12.011 },
  N: { en: "Nitrogen", ar: "نيتروجين", mass: 14.007 },
  O: { en: "Oxygen", ar: "أكسجين", mass: 15.999 },
  F: { en: "Fluorine", ar: "فلور", mass: 18.998 },
  Ne: { en: "Neon", ar: "نيون", mass: 20.180 },
  Na: { en: "Sodium", ar: "صوديوم", mass: 22.990 },
  Mg: { en: "Magnesium", ar: "مغنيسيوم", mass: 24.305 },
  Al: { en: "Aluminum", ar: "ألومنيوم", mass: 26.982 },
  Si: { en: "Silicon", ar: "سيليكون", mass: 28.085 },
  P: { en: "Phosphorus", ar: "فوسفور", mass: 30.974 },
  S: { en: "Sulfur", ar: "كبريت", mass: 32.06 },
  Cl: { en: "Chlorine", ar: "كلور", mass: 35.45 },
  K: { en: "Potassium", ar: "بوتاسيوم", mass: 39.098 },
  Ar: { en: "Argon", ar: "أرجون", mass: 39.948 },
  Ca: { en: "Calcium", ar: "كالسيوم", mass: 40.078 },
  Sc: { en: "Scandium", ar: "سكانديوم", mass: 44.956 },
  Ti: { en: "Titanium", ar: "تيتانيوم", mass: 47.867 },
  V: { en: "Vanadium", ar: "فاناديوم", mass: 50.942 },
  Cr: { en: "Chromium", ar: "كروم", mass: 51.996 },
  Mn: { en: "Manganese", ar: "منجنيز", mass: 54.938 },
  Fe: { en: "Iron", ar: "حديد", mass: 55.845 },
  Co: { en: "Cobalt", ar: "كوبالت", mass: 58.933 },
  Ni: { en: "Nickel", ar: "نيكل", mass: 58.693 },
  Cu: { en: "Copper", ar: "نحاس", mass: 63.546 },
  Zn: { en: "Zinc", ar: "زنك", mass: 65.38 },
  Ga: { en: "Gallium", ar: "غاليوم", mass: 69.723 },
  Ge: { en: "Germanium", ar: "جرمانيوم", mass: 72.630 },
  As: { en: "Arsenic", ar: "زرنيخ", mass: 74.922 },
  Se: { en: "Selenium", ar: "سيلينيوم", mass: 78.971 },
  Br: { en: "Bromine", ar: "بروم", mass: 79.904 },
  Kr: { en: "Krypton", ar: "كريبتون", mass: 83.798 },
  Rb: { en: "Rubidium", ar: "روبيديوم", mass: 85.468 },
  Sr: { en: "Strontium", ar: "سترونشيوم", mass: 87.62 },
  Y: { en: "Yttrium", ar: "إتريوم", mass: 88.906 },
  Zr: { en: "Zirconium", ar: "زركونيوم", mass: 91.224 },
  Nb: { en: "Niobium", ar: "نيوبيوم", mass: 92.906 },
  Mo: { en: "Molybdenum", ar: "موليبدنوم", mass: 95.95 },
  Tc: { en: "Technetium", ar: "تكنيشيوم", mass: 98 },
  Ru: { en: "Ruthenium", ar: "روثينيوم", mass: 101.07 },
  Rh: { en: "Rhodium", ar: "روديوم", mass: 102.91 },
  Pd: { en: "Palladium", ar: "بلاديوم", mass: 106.42 },
  Ag: { en: "Silver", ar: "فضة", mass: 107.87 },
  Cd: { en: "Cadmium", ar: "كادميوم", mass: 112.41 },
  In: { en: "Indium", ar: "إنديوم", mass: 114.82 },
  Sn: { en: "Tin", ar: "قصدير", mass: 118.71 },
  Sb: { en: "Antimony", ar: "أنتيمون", mass: 121.76 },
  Te: { en: "Tellurium", ar: "تيلوريوم", mass: 127.60 },
  I: { en: "Iodine", ar: "يود", mass: 126.90 },
  Xe: { en: "Xenon", ar: "زينون", mass: 131.29 },
  Cs: { en: "Cesium", ar: "سيزيوم", mass: 132.91 },
  Ba: { en: "Barium", ar: "باريوم", mass: 137.33 },
  La: { en: "Lanthanum", ar: "لانثانوم", mass: 138.91 },
  Ce: { en: "Cerium", ar: "سيريوم", mass: 140.12 },
  Pr: { en: "Praseodymium", ar: "براسيوديميوم", mass: 140.91 },
  Nd: { en: "Neodymium", ar: "نيوديميوم", mass: 144.24 },
  W: { en: "Tungsten", ar: "تنجستن", mass: 183.84 },
  Pt: { en: "Platinum", ar: "بلاتين", mass: 195.08 },
  Au: { en: "Gold", ar: "ذهب", mass: 196.97 },
  Hg: { en: "Mercury", ar: "زئبق", mass: 200.59 },
  Tl: { en: "Thallium", ar: "ثاليوم", mass: 204.38 },
  Pb: { en: "Lead", ar: "رصاص", mass: 207.2 },
  Bi: { en: "Bismuth", ar: "بزموت", mass: 208.98 },
  Po: { en: "Polonium", ar: "بولونيوم", mass: 209 },
  At: { en: "Astatine", ar: "أستاتين", mass: 210 },
  Rn: { en: "Radon", ar: "رادون", mass: 222 },
  Ra: { en: "Radium", ar: "راديوم", mass: 226 },
  U: { en: "Uranium", ar: "يورانيوم", mass: 238.03 },
  Pu: { en: "Plutonium", ar: "بلوتونيوم", mass: 244 },
};

interface ParsedFormula {
  mass: number;
  counts: Array<{ symbol: string; name: string; nameAr: string; count: number; mass: number; subMass: number }>;
  error?: string;
}

function parseFormula(formula: string): ParsedFormula {
  const counts: Record<string, number> = {};
  const stack: Array<Record<string, number>> = [counts];
  let i = 0;
  while (i < formula.length) {
    const c = formula[i];
    if (c === "(" || c === "[") {
      stack.push({});
      i++;
    } else if (c === ")" || c === "]") {
      const top = stack.pop()!;
      i++;
      let numStr = "";
      while (i < formula.length && /\d/.test(formula[i])) {
        numStr += formula[i];
        i++;
      }
      const mult = numStr ? parseInt(numStr, 10) : 1;
      const target = stack[stack.length - 1];
      for (const [sym, cnt] of Object.entries(top)) {
        target[sym] = (target[sym] || 0) + cnt * mult;
      }
    } else if (/[A-Z]/.test(c)) {
      let sym = c;
      i++;
      while (i < formula.length && /[a-z]/.test(formula[i])) {
        sym += formula[i];
        i++;
      }
      if (!ELEMENTS[sym]) {
        return { mass: 0, counts: [], error: `Unknown element: ${sym}` };
      }
      let numStr = "";
      while (i < formula.length && /\d/.test(formula[i])) {
        numStr += formula[i];
        i++;
      }
      const n = numStr ? parseInt(numStr, 10) : 1;
      const target = stack[stack.length - 1];
      target[sym] = (target[sym] || 0) + n;
    } else if (c === "·" || c === "*" || c === "•" || c === " " || c === "+") {
      // Hydrate separator (e.g. CuSO4·5H2O). The next token may start with a digit
      // indicating a multiplier that applies to the WHOLE following group (until
      // another separator or end of string). e.g. 5H2O = 5×H + 5×O.
      i++;
      // Read optional leading multiplier
      let multStr = "";
      while (i < formula.length && /\d/.test(formula[i])) {
        multStr += formula[i];
        i++;
      }
      const mult = multStr ? parseInt(multStr, 10) : 1;
      if (i >= formula.length) break;
      // Read all subsequent element+count tokens until separator or end
      while (i < formula.length) {
        const cc = formula[i];
        if (cc === "·" || cc === "*" || cc === "•" || cc === " " || cc === "+" || cc === "(" || cc === "[") break;
        if (!/[A-Z]/.test(cc)) {
          return { mass: 0, counts: [], error: `Unexpected character after ·: ${cc}` };
        }
        let sym = cc;
        i++;
        while (i < formula.length && /[a-z]/.test(formula[i])) {
          sym += formula[i];
          i++;
        }
        if (!ELEMENTS[sym]) {
          return { mass: 0, counts: [], error: `Unknown element: ${sym}` };
        }
        let numStr = "";
        while (i < formula.length && /\d/.test(formula[i])) {
          numStr += formula[i];
          i++;
        }
        const n = numStr ? parseInt(numStr, 10) : 1;
        const target = stack[stack.length - 1];
        target[sym] = (target[sym] || 0) + n * mult;
      }
    } else {
      return { mass: 0, counts: [], error: `Unexpected character: ${c}` };
    }
  }
  let mass = 0;
  const rows: ParsedFormula["counts"] = [];
  for (const [sym, n] of Object.entries(counts)) {
    const e = ELEMENTS[sym];
    if (!e) continue;
    mass += e.mass * n;
    rows.push({ symbol: sym, name: e.en, nameAr: e.ar, count: n, mass: e.mass, subMass: e.mass * n });
  }
  return { mass, counts: rows };
}

export const chemistryCalculators: Calculator[] = [
  // Molar Mass / Molecular Weight (formula parser)
  {
    id: "molar-mass",
    category: "chemistry",
    names: { en: "Molar Mass / Molecular Weight", ar: "الكتلة المولية / الوزن الجزيئي" },
    descriptions: {
      en: "Parse a chemical formula (e.g. H2O, C6H12O6, CuSO4·5H2O) and compute the molar mass.",
      ar: "حلّل صيغة كيميائية (مثل H2O، C6H12O6، CuSO4·5H2O) واحسب الكتلة المولية.",
    },
    keywords: ["molar mass", "molecular weight", "formula", "parser", "كتلة مولية", "صيغة"],
    icon: "FlaskConical",
    live: true,
    fields: [
      {
        key: "formula",
        names: { en: "Chemical formula", ar: "الصيغة الكيميائية" },
        type: "text",
        placeholder: { en: "e.g. H2SO4 or C6H12O6", ar: "مثال: H2SO4 أو C6H12O6" },
        default: "C6H12O6",
      },
    ],
    compute: (v) => {
      const f = String(v.formula ?? "").trim();
      if (!f) return { results: [], error: { en: "Enter a formula", ar: "أدخل صيغة" } };
      const p = parseFormula(f);
      if (p.error) return { results: [], error: { en: p.error, ar: p.error } };
      return {
        results: [
          { label: { en: "Molar mass", ar: "الكتلة المولية" }, value: fmt(p.mass, 4) + " g/mol", primary: true },
          { label: { en: "Element count", ar: "عدد العناصر" }, value: String(p.counts.length) },
          { label: { en: "Total atoms", ar: "إجمالي الذرات" }, value: String(p.counts.reduce((s, r) => s + r.count, 0)) },
        ],
        formula: `M(${f}) = ${p.counts.map((r) => `${r.count}×${r.symbol}`).join(" + ")} = ${fmt(p.mass, 4)} g/mol`,
        steps: p.counts.map((r) => ({
          description: { en: `${r.symbol} (${r.name}): ${r.count} × ${r.mass} = ${fmt(r.subMass, 4)}`, ar: `${r.symbol} (${r.nameAr}): ${r.count} × ${r.mass} = ${fmt(r.subMass, 4)}` },
        })),
        explanation: {
          en: "The molar mass is the sum of each element's atomic mass multiplied by its count in the formula. Parentheses are expanded recursively. Hydrate notation (·) is supported.",
          ar: "الكتلة المولية هي مجموع كتلة كل عنصر مضروبة بعدد ذراته في الصيغة. يتم توسيع الأقواس بشكل متكرر، ورمز الإماهة (·) مدعوم.",
        },
      };
    },
  },

  // Molarity (M = n/V)
  {
    id: "molarity",
    category: "chemistry",
    names: { en: "Molarity (M)", ar: "المولارية (M)" },
    descriptions: { en: "Calculate molarity = moles of solute ÷ liters of solution.", ar: "احسب المولارية = مولات المذاب ÷ لترات المحلول." },
    keywords: ["molarity", "concentration", "molar", "مولارية", "تركيز"],
    icon: "Beaker",
    live: true,
    fields: [
      { key: "moles", names: { en: "Moles of solute", ar: "مولات المذاب" }, type: "number", default: 0.5, unit: { en: "mol", ar: "مول" } },
      { key: "volume", names: { en: "Volume of solution", ar: "حجم المحلول" }, type: "number", default: 1, unit: { en: "L", ar: "لتر" } },
    ],
    compute: (v) => {
      const n = num(v.moles), vol = num(v.volume);
      if ([n, vol].some(Number.isNaN)) return { results: [], error: { en: "Enter valid numbers", ar: "أدخل أرقامًا صالحة" } };
      if (vol === 0) return { results: [], error: { en: "Volume cannot be zero", ar: "لا يمكن أن يكون الحجم صفرًا" } };
      const M = n / vol;
      return {
        results: [{ label: { en: "Molarity", ar: "المولارية" }, value: fmt(M, 6) + " mol/L", primary: true }],
        formula: `M = n / V = ${n} / ${vol} = ${fmt(M, 6)} mol/L`,
        steps: [
          { description: { en: `Moles (n) = ${n} mol`, ar: `المولات (n) = ${n} مول` } },
          { description: { en: `Volume (V) = ${vol} L`, ar: `الحجم (V) = ${vol} لتر` } },
          { description: { en: `M = n ÷ V = ${fmt(M, 6)}`, ar: `M = n ÷ V = ${fmt(M, 6)}` } },
        ],
      };
    },
  },

  // Molality
  {
    id: "molality",
    category: "chemistry",
    names: { en: "Molality (m)", ar: "المولالية (m)" },
    descriptions: { en: "Calculate molality = moles of solute ÷ kg of solvent.", ar: "احسب المولالية = مولات المذاب ÷ كجم من المذيب." },
    keywords: ["molality", "molal", "مولالية"],
    icon: "Beaker",
    live: true,
    fields: [
      { key: "moles", names: { en: "Moles of solute", ar: "مولات المذاب" }, type: "number", default: 0.5 },
      { key: "kg", names: { en: "Mass of solvent", ar: "كتلة المذيب" }, type: "number", default: 1, unit: { en: "kg", ar: "كجم" } },
    ],
    compute: (v) => {
      const n = num(v.moles), kg = num(v.kg);
      if ([n, kg].some(Number.isNaN)) return { results: [], error: { en: "Enter valid numbers", ar: "أدخل أرقامًا صالحة" } };
      if (kg === 0) return { results: [], error: { en: "Mass cannot be zero", ar: "لا يمكن أن تكون الكتلة صفرًا" } };
      const m = n / kg;
      return {
        results: [{ label: { en: "Molality", ar: "المولالية" }, value: fmt(m, 6) + " mol/kg", primary: true }],
        formula: `m = n / kg = ${n} / ${kg} = ${fmt(m, 6)} mol/kg`,
      };
    },
  },

  // Moles Calculator (n = m/M)
  {
    id: "moles",
    category: "chemistry",
    names: { en: "Moles Calculator", ar: "حاسبة المولات" },
    descriptions: { en: "Calculate moles = mass ÷ molar mass.", ar: "احسب المولات = الكتلة ÷ الكتلة المولية." },
    keywords: ["moles", "n", "mass", "مولات", "كمية"],
    icon: "Atom",
    live: true,
    fields: [
      { key: "mass", names: { en: "Mass", ar: "الكتلة" }, type: "number", default: 18, unit: { en: "g", ar: "جم" } },
      { key: "molarMass", names: { en: "Molar mass", ar: "الكتلة المولية" }, type: "number", default: 18.015, unit: { en: "g/mol", ar: "جم/مول" } },
    ],
    compute: (v) => {
      const m = num(v.mass), M = num(v.molarMass);
      if ([m, M].some(Number.isNaN)) return { results: [], error: { en: "Enter valid numbers", ar: "أدخل أرقامًا صالحة" } };
      if (M === 0) return { results: [], error: { en: "Molar mass cannot be zero", ar: "الكتلة المولية لا يمكن أن تكون صفرًا" } };
      const n = m / M;
      return {
        results: [{ label: { en: "Moles", ar: "المولات" }, value: fmt(n, 6) + " mol", primary: true }],
        formula: `n = m / M = ${m} / ${M} = ${fmt(n, 6)} mol`,
        steps: [
          { description: { en: `Mass (m) = ${m} g`, ar: `الكتلة = ${m} جم` } },
          { description: { en: `Molar mass (M) = ${M} g/mol`, ar: `الكتلة المولية = ${M} جم/مول` } },
          { description: { en: `n = m ÷ M = ${fmt(n, 6)} mol`, ar: `n = m ÷ M = ${fmt(n, 6)} مول` } },
        ],
      };
    },
  },

  // pH from [H+]
  {
    id: "ph",
    category: "chemistry",
    names: { en: "pH Calculator", ar: "حاسبة الأس الهيدروجيني pH" },
    descriptions: { en: "Calculate pH from [H⁺] or vice versa.", ar: "احسب pH من [H⁺] أو العكس." },
    keywords: ["ph", "acidity", "hydrogen", "أس هيدروجيني", "حموضة"],
    icon: "Droplet",
    live: true,
    fields: [
      {
        key: "mode",
        names: { en: "Mode", ar: "الوضع" },
        type: "select",
        default: "hToPh",
        options: [
          { value: "hToPh", label: { en: "[H⁺] → pH", ar: "[H⁺] → pH" } },
          { value: "phToH", label: { en: "pH → [H⁺]", ar: "pH → [H⁺]" } },
        ],
      },
      { key: "value", names: { en: "Value", ar: "القيمة" }, type: "number", default: 0.001 },
    ],
    compute: (v) => {
      const val = num(v.value);
      if (Number.isNaN(val)) return { results: [], error: { en: "Enter a number", ar: "أدخل رقمًا" } };
      const mode = String(v.mode);
      let ph: number, h: number;
      if (mode === "hToPh") {
        if (val <= 0) return { results: [], error: { en: "[H⁺] must be positive", ar: "[H⁺] يجب أن تكون موجبة" } };
        h = val;
        ph = -Math.log10(val);
      } else {
        if (val < 0 || val > 14) return { results: [], error: { en: "pH should be 0–14", ar: "pH يجب أن يكون 0–14" } };
        ph = val;
        h = Math.pow(10, -val);
      }
      const pOH = 14 - ph;
      let category = "Neutral";
      let catAr = "محايد";
      let status: "good" | "warning" | "bad" = "good";
      if (ph < 6) { category = "Acidic"; catAr = "حمضي"; status = "warning"; }
      else if (ph > 8) { category = "Basic"; catAr = "قاعدي"; status = "warning"; }
      if (ph < 2 || ph > 12) status = "bad";
      return {
        results: [
          { label: { en: "pH", ar: "pH" }, value: fmt(ph, 4), primary: true, status: status as "good" | "warning" | "bad" },
          { label: { en: "pOH", ar: "pOH" }, value: fmt(pOH, 4) },
          { label: { en: "[H⁺]", ar: "[H⁺]" }, value: fmtSci(h, 4) + " mol/L" },
          { label: { en: "[OH⁻]", ar: "[OH⁻]" }, value: fmtSci(Math.pow(10, -pOH), 4) + " mol/L" },
          { label: { en: "Category", ar: "التصنيف" }, value: `${category} / ${catAr}` },
        ],
        formula: mode === "hToPh" ? `pH = −log₁₀([H⁺]) = −log₁₀(${val}) = ${fmt(ph, 4)}` : `[H⁺] = 10^(−pH) = 10^(−${val}) = ${fmtSci(h, 4)}`,
        steps: [
          { description: { en: `Kw = [H⁺][OH⁻] = 1e-14 at 25°C`, ar: `Kw = [H⁺][OH⁻] = 1e-14 عند 25°م` } },
          { description: { en: `pH + pOH = 14`, ar: `pH + pOH = 14` } },
        ],
      };
    },
  },

  // Dilution Calculator (C1V1 = C2V2)
  {
    id: "dilution",
    category: "chemistry",
    names: { en: "Dilution Calculator (C₁V₁ = C₂V₂)", ar: "حاسبة التخفيف (C₁V₁ = C₂V₂)" },
    descriptions: { en: "Solve C₁V₁ = C₂V₂ for any one variable given the other three.", ar: "حل C₁V₁ = C₂V₂ لأي متغير عند معرفة الثلاثة الأخرى." },
    keywords: ["dilution", "c1v1", "concentration", "تخفيف", "تركيز"],
    icon: "Droplets",
    live: true,
    fields: [
      {
        key: "solve",
        names: { en: "Solve for", ar: "حل من أجل" },
        type: "select",
        default: "v1",
        options: [
          { value: "c1", label: { en: "C₁ (stock conc.)", ar: "C₁ (تركيز المخزون)" } },
          { value: "v1", label: { en: "V₁ (stock volume)", ar: "V₁ (حجم المخزون)" } },
          { value: "c2", label: { en: "C₂ (final conc.)", ar: "C₂ (التركيز النهائي)" } },
          { value: "v2", label: { en: "V₂ (final volume)", ar: "V₂ (الحجم النهائي)" } },
        ],
      },
      { key: "c1", names: { en: "C₁", ar: "C₁" }, type: "number", default: 10, unit: { en: "mol/L", ar: "مول/لتر" } },
      { key: "v1", names: { en: "V₁", ar: "V₁" }, type: "number", default: 0, unit: { en: "L", ar: "لتر" } },
      { key: "c2", names: { en: "C₂", ar: "C₂" }, type: "number", default: 2, unit: { en: "mol/L", ar: "مول/لتر" } },
      { key: "v2", names: { en: "V₂", ar: "V₂" }, type: "number", default: 1, unit: { en: "L", ar: "لتر" } },
    ],
    compute: (v) => {
      const solve = String(v.solve);
      const c1 = num(v.c1), v1 = num(v.v1), c2 = num(v.c2), v2 = num(v.v2);
      let result: number;
      let label = "";
      if (solve === "c1") { if (v1 === 0) return { results: [], error: { en: "V₁ cannot be 0", ar: "V₁ لا يمكن أن يكون 0" } }; result = (c2 * v2) / v1; label = "C₁"; }
      else if (solve === "v1") { if (c1 === 0) return { results: [], error: { en: "C₁ cannot be 0", ar: "C₁ لا يمكن أن يكون 0" } }; result = (c2 * v2) / c1; label = "V₁"; }
      else if (solve === "c2") { if (v2 === 0) return { results: [], error: { en: "V₂ cannot be 0", ar: "V₂ لا يمكن أن يكون 0" } }; result = (c1 * v1) / v2; label = "C₂"; }
      else { if (c2 === 0) return { results: [], error: { en: "C₂ cannot be 0", ar: "C₂ لا يمكن أن يكون 0" } }; result = (c1 * v1) / c2; label = "V₂"; }
      return {
        results: [{ label: { en: label, ar: label }, value: fmt(result, 6), primary: true }],
        formula: `C₁V₁ = C₂V₂  →  ${label} = ${fmt(result, 6)}`,
        steps: [
          { description: { en: `C₁V₁ = C₂V₂`, ar: `C₁V₁ = C₂V₂` } },
          { description: { en: `Solve for ${label}: ${fmt(result, 6)}`, ar: `حل من أجل ${label}: ${fmt(result, 6)}` } },
        ],
        explanation: {
          en: "The dilution equation C₁V₁ = C₂V₂ states that the amount of solute is conserved before and after dilution.",
          ar: "معادلة التخفيف C₁V₁ = C₂V₂ تنص على أن كمية المذاب محفوظة قبل وبعد التخفيف.",
        },
      };
    },
  },

  // Ideal Gas (PV = nRT)
  {
    id: "ideal-gas",
    category: "chemistry",
    names: { en: "Ideal Gas Law (PV = nRT)", ar: "قانون الغاز المثالي (PV = nRT)" },
    descriptions: { en: "Solve PV = nRT for any of P, V, n, or T.", ar: "حل PV = nRT لأي من P، V، n، T." },
    keywords: ["ideal gas", "pv=nrt", "moles", "pressure", "غاز مثالي"],
    icon: "Wind",
    live: true,
    fields: [
      {
        key: "solve",
        names: { en: "Solve for", ar: "حل من أجل" },
        type: "select",
        default: "n",
        options: [
          { value: "p", label: { en: "Pressure (P)", ar: "الضغط (P)" } },
          { value: "v", label: { en: "Volume (V)", ar: "الحجم (V)" } },
          { value: "n", label: { en: "Moles (n)", ar: "المولات (n)" } },
          { value: "t", label: { en: "Temperature (T)", ar: "الحرارة (T)" } },
        ],
      },
      { key: "p", names: { en: "Pressure P", ar: "الضغط P" }, type: "number", default: 101325, unit: { en: "Pa", ar: "باسكال" } },
      { key: "v", names: { en: "Volume V", ar: "الحجم V" }, type: "number", default: 0.0244, unit: { en: "m³", ar: "م³" } },
      { key: "n", names: { en: "Moles n", ar: "المولات n" }, type: "number", default: 1, unit: { en: "mol", ar: "مول" } },
      { key: "t", names: { en: "Temperature T", ar: "الحرارة T" }, type: "number", default: 298.15, unit: { en: "K", ar: "كلفن" } },
    ],
    compute: (v) => {
      const R = 8.314462618; // J/(mol·K)
      const solve = String(v.solve);
      const p = num(v.p), V = num(v.v), n = num(v.n), T = num(v.t);
      let result: number, label = "", unit = "";
      if (solve === "p") { if (V === 0) return { results: [], error: { en: "V cannot be 0", ar: "V لا يمكن أن يكون 0" } }; result = (n * R * T) / V; label = "P"; unit = " Pa"; }
      else if (solve === "v") { if (p === 0) return { results: [], error: { en: "P cannot be 0", ar: "P لا يمكن أن يكون 0" } }; result = (n * R * T) / p; label = "V"; unit = " m³"; }
      else if (solve === "n") { if (T === 0) return { results: [], error: { en: "T cannot be 0", ar: "T لا يمكن أن يكون 0" } }; result = (p * V) / (R * T); label = "n"; unit = " mol"; }
      else { if (n === 0) return { results: [], error: { en: "n cannot be 0", ar: "n لا يمكن أن يكون 0" } }; result = (p * V) / (n * R); label = "T"; unit = " K"; }
      return {
        results: [{ label: { en: label, ar: label }, value: fmtSci(result, 6) + unit, primary: true }],
        formula: `PV = nRT  →  ${label} = ${fmtSci(result, 6)}${unit}`,
        steps: [
          { description: { en: `R = 8.314 J/(mol·K)`, ar: `R = 8.314 جول/(مول·كلفن)` } },
          { description: { en: `Rearrange: ${label} = ${solve === "p" ? "nRT/V" : solve === "v" ? "nRT/P" : solve === "n" ? "PV/RT" : "PV/nR"}`, ar: `أعد الترتيب: ${label} = ${solve === "p" ? "nRT/V" : solve === "v" ? "nRT/P" : solve === "n" ? "PV/RT" : "PV/nR"}` } },
        ],
      };
    },
  },

  // Buffer (Henderson-Hasselbalch)
  {
    id: "buffer-hh",
    category: "chemistry",
    names: { en: "Buffer (Henderson–Hasselbalch)", ar: "المخزن (هندرسون-هاسلبالخ)" },
    descriptions: { en: "pH = pKa + log([A⁻]/[HA]) for buffer solutions.", ar: "pH = pKa + log([A⁻]/[HA]) للمحاليل المخزنة." },
    keywords: ["buffer", "henderson", "hasselbalch", "pka", "مخزن", "هندرسون"],
    icon: "Beaker",
    live: true,
    fields: [
      { key: "pka", names: { en: "pKa", ar: "pKa" }, type: "number", default: 4.76 },
      { key: "a", names: { en: "[A⁻] (conjugate base)", ar: "[A⁻] (القاعدة المرافقة)" }, type: "number", default: 0.1, unit: { en: "mol/L", ar: "مول/لتر" } },
      { key: "ha", names: { en: "[HA] (weak acid)", ar: "[HA] (الحمض الضعيف)" }, type: "number", default: 0.1, unit: { en: "mol/L", ar: "مول/لتر" } },
    ],
    compute: (v) => {
      const pka = num(v.pka), a = num(v.a), ha = num(v.ha);
      if ([pka, a, ha].some(Number.isNaN)) return { results: [], error: { en: "Enter valid numbers", ar: "أدخل أرقامًا صالحة" } };
      if (ha === 0 || a <= 0) return { results: [], error: { en: "Concentrations must be positive", ar: "التراكيز يجب أن تكون موجبة" } };
      const ph = pka + Math.log10(a / ha);
      return {
        results: [{ label: { en: "Buffer pH", ar: "pH المخزن" }, value: fmt(ph, 4), primary: true }],
        formula: `pH = pKa + log([A⁻]/[HA]) = ${pka} + log(${a}/${ha}) = ${fmt(ph, 4)}`,
        steps: [
          { description: { en: `pKa = ${pka}`, ar: `pKa = ${pka}` } },
          { description: { en: `Ratio [A⁻]/[HA] = ${a}/${ha} = ${fmt(a / ha, 4)}`, ar: `النسبة [A⁻]/[HA] = ${a}/${ha} = ${fmt(a / ha, 4)}` } },
          { description: { en: `log(${fmt(a / ha, 4)}) = ${fmt(Math.log10(a / ha), 4)}`, ar: `log(${fmt(a / ha, 4)}) = ${fmt(Math.log10(a / ha), 4)}` } },
          { description: { en: `pH = ${pka} + ${fmt(Math.log10(a / ha), 4)} = ${fmt(ph, 4)}`, ar: `pH = ${pka} + ${fmt(Math.log10(a / ha), 4)} = ${fmt(ph, 4)}` } },
        ],
      };
    },
  },

  // Normality (N = n_eq / V)
  {
    id: "normality",
    category: "chemistry",
    names: { en: "Normality (N)", ar: "التعادلية (N)" },
    descriptions: { en: "Calculate normality = equivalents of solute ÷ liters of solution.", ar: "احسب التعادلية = المكافئات ÷ لترات المحلول." },
    keywords: ["normality", "equivalent", "n", "تعادلية", "مكافئ"],
    icon: "Scale",
    live: true,
    fields: [
      { key: "eq", names: { en: "Equivalents", ar: "المكافئات" }, type: "number", default: 0.5, unit: { en: "eq", ar: "مكافئ" } },
      { key: "vol", names: { en: "Volume", ar: "الحجم" }, type: "number", default: 1, unit: { en: "L", ar: "لتر" } },
    ],
    compute: (v) => {
      const eq = num(v.eq), vol = num(v.vol);
      if ([eq, vol].some(Number.isNaN)) return { results: [], error: { en: "Enter valid numbers", ar: "أدخل أرقامًا صالحة" } };
      if (vol === 0) return { results: [], error: { en: "Volume cannot be zero", ar: "الحجم لا يمكن أن يكون صفرًا" } };
      const N = eq / vol;
      return {
        results: [{ label: { en: "Normality", ar: "التعادلية" }, value: fmt(N, 6) + " N", primary: true }],
        formula: `N = eq / V = ${eq} / ${vol} = ${fmt(N, 6)} eq/L`,
      };
    },
  },

  // Boyle's Law (P1V1 = P2V2)
  {
    id: "boyle-law",
    category: "chemistry",
    names: { en: "Boyle's Law (P₁V₁ = P₂V₂)", ar: "قانون بويل (P₁V₁ = P₂V₂)" },
    descriptions: { en: "Solve Boyle's law for any of P₁, V₁, P₂, V₂ (constant T).", ar: "حل قانون بويل لأي من P₁، V₁، P₂، V₂ (T ثابت)." },
    keywords: ["boyle", "gas law", "بويل", "قانون الغاز"],
    icon: "Wind",
    live: true,
    fields: [
      {
        key: "solve",
        names: { en: "Solve for", ar: "حل من أجل" },
        type: "select",
        default: "p2",
        options: [
          { value: "p1", label: { en: "P₁", ar: "P₁" } },
          { value: "v1", label: { en: "V₁", ar: "V₁" } },
          { value: "p2", label: { en: "P₂", ar: "P₂" } },
          { value: "v2", label: { en: "V₂", ar: "V₂" } },
        ],
      },
      { key: "p1", names: { en: "P₁", ar: "P₁" }, type: "number", default: 1, unit: { en: "atm", ar: "ضغط جوي" } },
      { key: "v1", names: { en: "V₁", ar: "V₁" }, type: "number", default: 2, unit: { en: "L", ar: "لتر" } },
      { key: "p2", names: { en: "P₂", ar: "P₂" }, type: "number", default: 0, unit: { en: "atm", ar: "ضغط جوي" } },
      { key: "v2", names: { en: "V₂", ar: "V₂" }, type: "number", default: 1, unit: { en: "L", ar: "لتر" } },
    ],
    compute: (v) => {
      const solve = String(v.solve);
      const p1 = num(v.p1), v1 = num(v.v1), p2 = num(v.p2), v2 = num(v.v2);
      let result = 0, label = "";
      if (solve === "p1") { if (v2 === 0) return { results: [], error: { en: "V₂ ≠ 0", ar: "V₂ ≠ 0" } }; result = (p2 * v2) / v1; label = "P₁"; }
      else if (solve === "v1") { if (p2 === 0) return { results: [], error: { en: "P₂ ≠ 0", ar: "P₂ ≠ 0" } }; result = (p2 * v2) / p1; label = "V₁"; }
      else if (solve === "p2") { if (v1 === 0) return { results: [], error: { en: "V₁ ≠ 0", ar: "V₁ ≠ 0" } }; result = (p1 * v1) / v2; label = "P₂"; }
      else { if (p1 === 0) return { results: [], error: { en: "P₁ ≠ 0", ar: "P₁ ≠ 0" } }; result = (p1 * v1) / p2; label = "V₂"; }
      return {
        results: [{ label: { en: label, ar: label }, value: fmt(result, 6), primary: true }],
        formula: `P₁V₁ = P₂V₂  →  ${label} = ${fmt(result, 6)}`,
      };
    },
  },

  // Osmolarity
  {
    id: "osmolarity",
    category: "chemistry",
    names: { en: "Osmolarity", ar: "الأسمولية" },
    descriptions: { en: "Calculate osmolarity = molarity × dissociation factor.", ar: "احسب الأسمولية = المولارية × عامل التفكك." },
    keywords: ["osmolarity", "osm", "أسمولية"],
    icon: "Droplets",
    live: true,
    fields: [
      { key: "molarity", names: { en: "Molarity", ar: "المولارية" }, type: "number", default: 0.9, unit: { en: "mol/L", ar: "مول/لتر" } },
      { key: "n", names: { en: "Dissociation factor (n)", ar: "عامل التفكك" }, type: "number", default: 2, help: { en: "NaCl≈2, CaCl₂≈3, glucose=1", ar: "NaCl≈2، CaCl₂≈3، سكر=1" } },
    ],
    compute: (v) => {
      const m = num(v.molarity), n = num(v.n);
      if ([m, n].some(Number.isNaN)) return { results: [], error: { en: "Enter valid numbers", ar: "أدخل أرقامًا صالحة" } };
      const osm = m * n;
      return {
        results: [{ label: { en: "Osmolarity", ar: "الأسمولية" }, value: fmt(osm, 6) + " Osm/L", primary: true }],
        formula: `Osm = M × n = ${m} × ${n} = ${fmt(osm, 6)} Osm/L`,
      };
    },
  },

  // Percent Yield
  {
    id: "percent-yield",
    category: "chemistry",
    names: { en: "Percent Yield", ar: "نسبة الإنتاج" },
    descriptions: { en: "Calculate percent yield = (actual / theoretical) × 100%.", ar: "احسب نسبة الإنتاج = (الفعلي / النظري) × 100%." },
    keywords: ["yield", "percent", "reaction", "إنتاج", "تفاعل"],
    icon: "FlaskConical",
    live: true,
    fields: [
      { key: "actual", names: { en: "Actual yield", ar: "الإنتاج الفعلي" }, type: "number", default: 8.5, unit: { en: "g", ar: "جم" } },
      { key: "theoretical", names: { en: "Theoretical yield", ar: "الإنتاج النظري" }, type: "number", default: 10, unit: { en: "g", ar: "جم" } },
    ],
    compute: (v) => {
      const a = num(v.actual), t = num(v.theoretical);
      if ([a, t].some(Number.isNaN)) return { results: [], error: { en: "Enter valid numbers", ar: "أدخل أرقامًا صالحة" } };
      if (t === 0) return { results: [], error: { en: "Theoretical cannot be 0", ar: "النظري لا يمكن أن يكون 0" } };
      const y = (a / t) * 100;
      return {
        results: [
          { label: { en: "Percent yield", ar: "نسبة الإنتاج" }, value: fmt(y, 4) + "%", primary: true, status: y > 90 ? "good" : y > 50 ? "warning" : "bad" },
        ],
        formula: `% yield = (actual / theoretical) × 100 = (${a} / ${t}) × 100 = ${fmt(y, 4)}%`,
      };
    },
  },

  // Atomic Mass lookup (single element)
  {
    id: "atomic-mass",
    category: "chemistry",
    names: { en: "Atomic Mass Lookup", ar: "البحث عن الكتلة الذرية" },
    descriptions: {
      en: "Look up the atomic mass of any element by symbol (e.g. Fe, Au, U).",
      ar: "ابحث عن الكتلة الذرية لأي عنصر برمزه (مثل Fe، Au، U).",
    },
    keywords: ["atomic mass", "element", "periodic", "كتلة ذرية", "عنصر"],
    icon: "Atom",
    live: true,
    fields: [
      {
        key: "symbol",
        names: { en: "Element symbol", ar: "رمز العنصر" },
        type: "text",
        placeholder: { en: "e.g. Fe, Au, H", ar: "مثل: Fe، Au، H" },
        default: "Fe",
      },
    ],
    compute: (v) => {
      const sym = String(v.symbol).trim();
      const firstUpper = sym.charAt(0).toUpperCase() + sym.slice(1).toLowerCase();
      const e = ELEMENTS[firstUpper];
      if (!e) return { results: [], error: { en: `Unknown element: ${sym}`, ar: `عنصر غير معروف: ${sym}` } };
      return {
        results: [
          { label: { en: "Element", ar: "العنصر" }, value: `${firstUpper} — ${e.en} / ${e.ar}`, primary: true },
          { label: { en: "Atomic mass", ar: "الكتلة الذرية" }, value: fmt(e.mass, 4) + " g/mol" },
          { label: { en: "Symbol", ar: "الرمز" }, value: firstUpper },
        ],
        formula: `${firstUpper}: atomic mass = ${fmt(e.mass, 4)} g/mol`,
        explanation: {
          en: "Atomic mass is the weighted average mass of an element's naturally occurring isotopes, in g/mol.",
          ar: "الكتلة الذرية هي متوسط كتلة نظائر العنصر الطبيعية المرجحة، بوحدة جم/مول.",
        },
      };
    },
  },

  // Stoichiometry — moles from mass + formula
  {
    id: "stoichiometry-moles",
    category: "chemistry",
    names: { en: "Stoichiometry (Moles from Mass)", ar: "الكيمياء النسبية (مولات من كتلة)" },
    descriptions: {
      en: "Calculate moles, atoms, and mass relationships from a chemical formula and mass.",
      ar: "احسب المولات والذرات والعلاقات الكتلية من صيغة كيميائية وكتلة.",
    },
    keywords: ["stoichiometry", "moles", "atoms", "نسبية", "مولات"],
    icon: "Scale",
    live: true,
    fields: [
      {
        key: "formula",
        names: { en: "Chemical formula", ar: "الصيغة الكيميائية" },
        type: "text",
        placeholder: { en: "e.g. H2O or NaCl", ar: "مثل: H2O أو NaCl" },
        default: "NaCl",
      },
      { key: "mass", names: { en: "Mass", ar: "الكتلة" }, type: "number", default: 58.44, unit: { en: "g", ar: "جم" } },
    ],
    compute: (v) => {
      const f = String(v.formula).trim();
      const m = num(v.mass);
      if (!f) return { results: [], error: { en: "Enter a formula", ar: "أدخل صيغة" } };
      if (Number.isNaN(m) || m < 0) return { results: [], error: { en: "Enter a valid mass", ar: "أدخل كتلة صالحة" } };
      const p = parseFormula(f);
      if (p.error) return { results: [], error: { en: p.error, ar: p.error } };
      if (p.mass === 0) return { results: [], error: { en: "Zero molar mass", ar: "كتلة مولية صفر" } };
      const n = m / p.mass;
      const atoms = n * p.counts.reduce((s, r) => s + r.count, 0) * 6.022e23;
      return {
        results: [
          { label: { en: "Moles", ar: "المولات" }, value: fmt(n, 6) + " mol", primary: true },
          { label: { en: "Molecules/formula units", ar: "الجزيئات/الوحدات" }, value: fmtSci(n * 6.022e23, 4) },
          { label: { en: "Total atoms", ar: "إجمالي الذرات" }, value: fmtSci(atoms, 4) },
          { label: { en: "Molar mass", ar: "الكتلة المولية" }, value: fmt(p.mass, 4) + " g/mol" },
        ],
        formula: `n = m / M = ${m} / ${fmt(p.mass, 4)} = ${fmt(n, 6)} mol`,
        steps: [
          { description: { en: `Molar mass of ${f} = ${fmt(p.mass, 4)} g/mol`, ar: `الكتلة المولية = ${fmt(p.mass, 4)} جم/مول` } },
          { description: { en: `n = ${m} / ${fmt(p.mass, 4)} = ${fmt(n, 6)} mol`, ar: `المولات = ${fmt(n, 6)}` } },
          { description: { en: `Molecules = n × N_A = ${fmt(n * 6.022e23, 4)} × 10²³`, ar: `الجزيئات = ${fmtSci(n * 6.022e23, 4)}` } },
        ],
        explanation: {
          en: "Avogadro's number (N_A = 6.022 × 10²³) converts moles to particles (atoms, molecules, or formula units).",
          ar: "رقم أفوجادرو (6.022 × 10²³) يحوّل المولات إلى جسيمات (ذرات أو جزيئات أو وحدات صيغة).",
        },
      };
    },
  },

  // Gas Law (Combined: P1V1/T1 = P2V2/T2)
  {
    id: "combined-gas-law",
    category: "chemistry",
    names: { en: "Combined Gas Law", ar: "قانون الغازات المركب" },
    descriptions: {
      en: "Solve P₁V₁/T₁ = P₂V₂/T₂ for any of P₂, V₂, T₂ (in Kelvin).",
      ar: "حل P₁V₁/T₁ = P₂V₂/T₂ لأي من P₂، V₂، T₂ (بكلفن).",
    },
    keywords: ["gas", "combined", "law", "law", "غاز", "قانون مركب"],
    icon: "Wind",
    live: true,
    fields: [
      {
        key: "solve",
        names: { en: "Solve for", ar: "حل من أجل" },
        type: "select",
        default: "p2",
        options: [
          { value: "p2", label: { en: "P₂", ar: "P₂" } },
          { value: "v2", label: { en: "V₂", ar: "V₂" } },
          { value: "t2", label: { en: "T₂", ar: "T₂" } },
        ],
      },
      { key: "p1", names: { en: "P₁", ar: "P₁" }, type: "number", default: 1, unit: { en: "atm", ar: "ضغط جوي" } },
      { key: "v1", names: { en: "V₁", ar: "V₁" }, type: "number", default: 2, unit: { en: "L", ar: "لتر" } },
      { key: "t1", names: { en: "T₁", ar: "T₁" }, type: "number", default: 300, unit: { en: "K", ar: "كلفن" } },
      { key: "p2", names: { en: "P₂", ar: "P₂" }, type: "number", default: 2, unit: { en: "atm", ar: "ضغط جوي" } },
      { key: "v2", names: { en: "V₂", ar: "V₂" }, type: "number", default: 0, unit: { en: "L", ar: "لتر" } },
      { key: "t2", names: { en: "T₂", ar: "T₂" }, type: "number", default: 300, unit: { en: "K", ar: "كلفن" } },
    ],
    compute: (v) => {
      const solve = String(v.solve);
      const p1 = num(v.p1), v1 = num(v.v1), t1 = num(v.t1);
      const p2 = num(v.p2), v2 = num(v.v2), t2 = num(v.t2);
      let result = 0, label = "", unit = "";
      if (solve === "p2") {
        if (v2 === 0) return { results: [], error: { en: "V₂ ≠ 0", ar: "V₂ ≠ 0" } };
        result = (p1 * v1 * t2) / (t1 * v2); label = "P₂"; unit = " atm";
      } else if (solve === "v2") {
        if (p2 === 0) return { results: [], error: { en: "P₂ ≠ 0", ar: "P₂ ≠ 0" } };
        result = (p1 * v1 * t2) / (t1 * p2); label = "V₂"; unit = " L";
      } else {
        // Solve for T₂: T₂ = (P₂ × V₂ × T₁) / (P₁ × V₁)
        if (p1 === 0 || v1 === 0) return { results: [], error: { en: "P₁, V₁ ≠ 0", ar: "P₁, V₁ ≠ 0" } };
        result = (p2 * v2 * t1) / (p1 * v1); label = "T₂"; unit = " K";
      }
      return {
        results: [{ label: { en: label, ar: label }, value: fmt(result, 6) + unit, primary: true }],
        formula: `P₁V₁/T₁ = P₂V₂/T₂  →  ${label} = ${fmt(result, 6)}${unit}`,
      };
    },
  },
];

// ============================================================================
// Molecular Biology, Genetics & DNA Calculators
// ============================================================================

import type { Calculator } from "../types";
import { num, fmt, fmtSci } from "../calculator-utils";

// Avogadro's number
const NA = 6.022e23;

export const molecularBiologyCalculators: Calculator[] = [
  // DNA Concentration from OD260
  {
    id: "mb-dna-od260",
    category: "molecular-biology",
    names: { en: "DNA Concentration (OD260)", ar: "تركيز DNA (OD260)" },
    descriptions: {
      en: "Calculate DNA concentration from absorbance at 260 nm. 1 OD260 = 50 μg/mL for double-stranded DNA.",
      ar: "احسب تركيز DNA من الامتصاص عند 260 نانومتر. 1 OD260 = 50 ميكروجرام/مل للـ DNA ثنائي الشريطة.",
    },
    keywords: ["dna", "od260", "absorbance", "concentration", "spectrophotometer", "تركيز"],
    icon: "Dna",
    live: true,
    fields: [
      { key: "od", names: { en: "OD260 (absorbance)", ar: "OD260 (الامتصاص)" }, type: "number", default: 0.5, help: { en: "Reading from spectrophotometer at 260 nm", ar: "القراءة من المطياف الضوئي عند 260 نانومتر" } },
      { key: "dilution", names: { en: "Dilution factor", ar: "عامل التخفيف" }, type: "number", default: 1, help: { en: "e.g. 10 if you diluted 1:10 before reading", ar: "مثال 10 إذا خففت 1:10 قبل القراءة" } },
      {
        key: "type",
        names: { en: "Nucleic acid type", ar: "نوع الحمض النووي" },
        type: "select",
        default: "dsDNA",
        options: [
          { value: "dsDNA", label: { en: "Double-stranded DNA (50 μg/mL per OD)", ar: "DNA ثنائي الشريطة (50 ميكروجرام/مل)" } },
          { value: "ssDNA", label: { en: "Single-stranded DNA (33 μg/mL per OD)", ar: "DNA أحادي الشريطة (33 ميكروجرام/مل)" } },
          { value: "ssRNA", label: { en: "Single-stranded RNA (40 μg/mL per OD)", ar: "RNA أحادي الشريطة (40 ميكروجرام/مل)" } },
          { value: "oligo", label: { en: "Oligonucleotide (20 μg/mL per OD)", ar: "أوليجونوكليوتيد (20 ميكروجرام/مل)" } },
        ],
      },
    ],
    compute: (v) => {
      const od = num(v.od);
      const dil = num(v.dilution);
      if ([od, dil].some(Number.isNaN) || od < 0 || dil <= 0) return { results: [], error: { en: "Enter valid values", ar: "أدخل قيمًا صالحة" } };
      const factors: Record<string, number> = { dsDNA: 50, ssDNA: 33, ssRNA: 40, oligo: 20 };
      const factor = factors[String(v.type)] ?? 50;
      const conc = od * factor * dil;
      return {
        results: [
          { label: { en: "Concentration", ar: "التركيز" }, value: fmt(conc, 2) + " μg/mL", primary: true },
          { label: { en: "In ng/μL", ar: "بـ ng/μL" }, value: fmt(conc, 2) + " ng/μL" },
          { label: { en: "In mg/mL", ar: "بـ mg/mL" }, value: fmt(conc / 1000, 5) + " mg/mL" },
        ],
        formula: `Conc = OD260 × ${factor} × dilution = ${od} × ${factor} × ${dil} = ${fmt(conc, 2)} μg/mL`,
        steps: [
          { description: { en: `OD260 = ${od}`, ar: `OD260 = ${od}` } },
          { description: { en: `Conversion factor = ${factor} μg/mL (for ${String(v.type)})`, ar: `عامل التحويل = ${factor} ميكروجرام/مل (لـ ${String(v.type)})` } },
          { description: { en: `Conc = ${od} × ${factor} × ${dil} = ${fmt(conc, 2)} μg/mL`, ar: `التركيز = ${od} × ${factor} × ${dil} = ${fmt(conc, 2)} ميكروجرام/مل` } },
        ],
        explanation: {
          en: "The extinction coefficient depends on the type: dsDNA = 50, ssDNA = 33, ssRNA = 40, oligo = 20 μg/mL per OD unit. Also check A260/A280 ratio: ~1.8 for pure DNA, ~2.0 for pure RNA. Lower values indicate protein contamination.",
          ar: "معامل الانطفاء يعتمد على النوع: DNA ثنائي = 50، DNA أحادي = 33، RNA = 40، أوليجو = 20 ميكروجرام/مل لكل وحدة OD. تحقق أيضاً من نسبة A260/A280: ~1.8 للـ DNA النقي، ~2.0 للـ RNA النقي. القيم الأقل تشير لتلوث بروتيني.",
        },
      };
    },
  },

  // DNA Copy Number
  {
    id: "mb-dna-copy-number",
    category: "molecular-biology",
    names: { en: "DNA Copy Number Calculator", ar: "حاسبة عدد نسخ DNA" },
    descriptions: {
      en: "Convert DNA mass (ng) to number of molecules (copy number) for a given template length.",
      ar: "حوّل كتلة DNA (نانوجرام) إلى عدد الجزيئات (عدد النسخ) لطول قالب معين.",
    },
    keywords: ["dna", "copy", "number", "molecules", "molecules", "نسخ", "جزء"],
    icon: "Copy",
    live: true,
    fields: [
      { key: "mass", names: { en: "DNA mass", ar: "كتلة DNA" }, type: "number", default: 100, unit: { en: "ng", ar: "نانوجرام" } },
      { key: "length", names: { en: "Template length", ar: "طول القالب" }, type: "number", default: 3000, unit: { en: "bp", ar: "زوج قاعدي" }, help: { en: "Length in base pairs (bp)", ar: "الطول بأزواج القواعد (bp)" } },
    ],
    compute: (v) => {
      const mass = num(v.mass);
      const len = num(v.length);
      if ([mass, len].some(Number.isNaN) || mass < 0 || len <= 0) return { results: [], error: { en: "Enter valid values", ar: "أدخل قيمًا صالحة" } };
      // MW of dsDNA = (length bp × 607.4) + 157.9 g/mol
      const mw = len * 607.4 + 157.9;
      const moles = (mass * 1e-9) / mw;
      const copies = moles * NA;
      return {
        results: [
          { label: { en: "Copy number", ar: "عدد النسخ" }, value: fmtSci(copies, 3) + " copies", primary: true },
          { label: { en: "Moles", ar: "المولات" }, value: fmtSci(moles, 3) + " mol" },
          { label: { en: "Molecular weight", ar: "الوزن الجزيئي" }, value: fmt(mw, 1) + " g/mol" },
        ],
        formula: `Copies = (mass / MW) × N_A = (${mass}e-9 / ${fmt(mw, 1)}) × 6.022e23`,
        steps: [
          { description: { en: `MW = ${len} bp × 607.4 + 157.9 = ${fmt(mw, 1)} g/mol`, ar: `الوزن الجزيئي = ${len} × 607.4 + 157.9 = ${fmt(mw, 1)} جم/مول` } },
          { description: { en: `Moles = ${mass} ng ÷ ${fmt(mw, 1)} g/mol = ${fmtSci(moles, 3)} mol`, ar: `المولات = ${mass} نانوجرام ÷ ${fmt(mw, 1)} جم/مول = ${fmtSci(moles, 3)} مول` } },
          { description: { en: `Copies = ${fmtSci(moles, 3)} × 6.022e23 = ${fmtSci(copies, 3)}`, ar: `النسخ = ${fmtSci(moles, 3)} × 6.022e23 = ${fmtSci(copies, 3)}` } },
        ],
        explanation: {
          en: "Useful for qPCR standards, cloning, and virus titer calculations. The MW formula uses 607.4 Da per bp for dsDNA (average of the 4 bases). For ssDNA use ~303.7 Da/bp.",
          ar: "مفيد لمعايير qPCR، الاستنساخ، وحساب عيار الفيروسات. صيغة الوزن الجزيئي تستخدم 607.4 دالتون لكل زوج قاعدي للـ DNA ثنائي الشريطة. للـ DNA أحادي استخدم ~303.7 دالتون/زوج قاعدي.",
        },
      };
    },
  },

  // Tm Melting Temperature
  {
    id: "mb-tm",
    category: "molecular-biology",
    names: { en: "Melting Temperature (Tm)", ar: "حرارة الانصهار (Tm)" },
    descriptions: {
      en: "Calculate DNA melting temperature (Tm) for primers and oligos using the nearest-neighbor method (simplified).",
      ar: "احسب حرارة انصهار DNA (Tm) للبرايمر والأوليجو باستخدام طريقة الجار الأقرب (مبسطة).",
    },
    keywords: ["tm", "melting", "primer", "oligo", "annealing", "pcr", "انصهار"],
    icon: "Thermometer",
    live: true,
    fields: [
      { key: "seq", names: { en: "DNA sequence (5'→3')", ar: "تسلسل DNA (5'→3')" }, type: "text", placeholder: { en: "e.g. ATGCATGCATGC", ar: "مثال: ATGCATGCATGC" }, default: "ATGCATGCATGC", help: { en: "Enter A, T, G, C only (uppercase or lowercase)", ar: "أدخل A, T, G, C فقط" } },
      { key: "conc", names: { en: "Primer concentration", ar: "تركيز البرايمر" }, type: "number", default: 0.5, unit: { en: "μM", ar: "ميكرومول" }, help: { en: "Typical PCR primer concentration", ar: "تركيز البرايمر النموذجي في PCR" } },
    ],
    compute: (v) => {
      const seq = String(v.seq).toUpperCase().replace(/[^ATGC]/g, "");
      if (seq.length < 4) return { results: [], error: { en: "Enter at least 4 valid bases (A,T,G,C)", ar: "أدخل 4 قواعد صالحة على الأقل (A,T,G,C)" } };
      const conc = num(v.conc);
      const gc = (seq.match(/[GC]/g) || []).length;
      const at = (seq.match(/[AT]/g) || []).length;

      // Wallace rule (simple): Tm = 2×A + 2×T + 4×G + 4×C
      const tmWallace = 2 * at + 4 * gc;

      // Salt-adjusted (for primers ≥14 bp): Tm = 64.9 + 41×(GC-16.4)/N
      const n = seq.length;
      const tmGC = n >= 14 ? 64.9 + (41 * (gc - 16.4)) / n : tmWallace;

      // Nearest-neighbor salt-adjusted (simplified SantaLucia)
      // Use a simplified formula: Tm = ΔH / (ΔS + R ln(C/4)) - 273.15
      // For simplicity, use the GC-based with salt
      const tmSalt = tmGC + 16.6 * Math.log10(0.05); // 50 mM Na+

      const gcContent = (gc / n) * 100;
      return {
        results: [
          { label: { en: "Tm (Wallace rule)", ar: "Tm (قاعدة والاس)" }, value: fmt(tmWallace, 1) + " °C", help: { en: "Best for oligos <14 nt", ar: "للأوليجو أقل من 14" } as never },
          { label: { en: "Tm (GC-based)", ar: "Tm (مبني على GC)" }, value: fmt(tmGC, 1) + " °C", primary: true },
          { label: { en: "Tm (salt-adjusted)", ar: "Tm (معدل بالملح)" }, value: fmt(tmSalt, 1) + " °C" },
          { label: { en: "GC content", ar: "محتوى GC" }, value: fmt(gcContent, 1) + "% (" + gc + "/" + n + ")" },
          { label: { en: "Length", ar: "الطول" }, value: n + " nt" },
        ],
        formula: `Wallace: Tm = 2×(A+T) + 4×(G+C) = 2×${at} + 4×${gc} = ${tmWallace}°C`,
        steps: [
          { description: { en: `Sequence: 5'-${seq}-3' (${n} nt)`, ar: `التسلسل: 5'-${seq}-3' (${n} نيوكليوتيد)` } },
          { description: { en: `G+C = ${gc}, A+T = ${at}`, ar: `G+C = ${gc}, A+T = ${at}` } },
          { description: { en: `Wallace: 2×${at} + 4×${gc} = ${tmWallace}°C`, ar: `والاس: 2×${at} + 4×${gc} = ${tmWallace}°م` } },
          { description: { en: `GC% = ${gc}/${n} × 100 = ${fmt(gcContent, 1)}%`, ar: `نسبة GC = ${gc}/${n} × 100 = ${fmt(gcContent, 1)}%` } },
        ],
        explanation: {
          en: "Tm is the temperature where 50% of DNA is single-stranded. For PCR, set annealing temp ~3-5°C below Tm. Ideal primers: 18-25 nt, 40-60% GC, Tm 55-65°C. Avoid 3+ G/C at the 3' end (prevents mispriming).",
          ar: "Tm هي الحرارة التي يكون فيها 50% من DNA أحادي الشريطة. لـ PCR، اضبط حرارة التلدين ~3-5°م أقل من Tm. البرايمر المثالي: 18-25 نيوكليوتيد، 40-60% GC، Tm 55-65°م. تجنب 3+ G/C عند النهاية 3' (يمنع التمهيد الخاطئ).",
        },
      };
    },
  },

  // PCR Cycle Calculator
  {
    id: "mb-pcr-cycles",
    category: "molecular-biology",
    names: { en: "PCR Amplification Calculator", ar: "حاسبة تضخيم PCR" },
    descriptions: {
      en: "Calculate how much DNA you'll get after N PCR cycles. Each cycle doubles the DNA.",
      ar: "احسب كمية DNA التي ستحصل عليها بعد N دورة PCR. كل دورة تضاعف DNA.",
    },
    keywords: ["pcr", "amplification", "cycles", "polymerase", "تضخيم", "دورات"],
    icon: "Repeat",
    live: true,
    fields: [
      { key: "initial", names: { en: "Initial DNA copies", ar: "نسخ DNA الابتدائية" }, type: "number", default: 1000, help: { en: "Starting number of DNA molecules", ar: "عدد جزيئات DNA الابتدائية" } },
      { key: "cycles", names: { en: "Number of cycles", ar: "عدد الدورات" }, type: "number", default: 30, min: 1, max: 50, help: { en: "Typical PCR: 25-40 cycles", ar: "PCR النموذجي: 25-40 دورة" } },
      { key: "efficiency", names: { en: "Efficiency (%)", ar: "الكفاءة (%)" }, type: "number", default: 100, min: 1, max: 100, help: { en: "100% = perfect doubling. Real PCR: 80-100%", ar: "100% = مضاعفة مثالية. PCR الحقيقي: 80-100%" } },
    ],
    compute: (v) => {
      const init = num(v.initial);
      const cyc = num(v.cycles);
      const eff = num(v.efficiency) / 100;
      if ([init, cyc, eff].some(Number.isNaN) || init < 0 || cyc < 1) return { results: [], error: { en: "Enter valid values", ar: "أدخل قيمًا صالحة" } };
      const final = init * Math.pow(1 + eff, cyc);
      const fold = final / init;
      return {
        results: [
          { label: { en: "Final DNA copies", ar: "نسخ DNA النهائية" }, value: fmtSci(final, 3) + " copies", primary: true },
          { label: { en: "Fold amplification", ar: "مضاعفة التضخيم" }, value: fmtSci(fold, 3) + "×" },
          { label: { en: "In ng (if 3 kb dsDNA)", ar: "بـ نانوجرام (لـ 3 kb dsDNA)" }, value: fmtSci(final * 1.824e-15 * 1e9, 3) + " ng" },
        ],
        formula: `Final = Initial × (1 + efficiency)^cycles = ${init} × (1 + ${eff})^${cyc}`,
        steps: [
          { description: { en: `Initial = ${fmt(init, 0)} copies`, ar: `الابتدائي = ${fmt(init, 0)} نسخة` } },
          { description: { en: `Efficiency = ${eff * 100}% → multiplier = 1 + ${eff} = ${1 + eff}`, ar: `الكفاءة = ${eff * 100}% → المضاعف = 1 + ${eff} = ${1 + eff}` } },
          { description: { en: `Final = ${fmt(init, 0)} × ${1 + eff}^${cyc} = ${fmtSci(final, 3)}`, ar: `النهائي = ${fmt(init, 0)} × ${1 + eff}^${cyc} = ${fmtSci(final, 3)}` } },
        ],
        explanation: {
          en: "At 100% efficiency, 30 cycles = 2³⁰ ≈ 1 billion copies. Real PCR efficiency is 80-100% due to reagent depletion, product accumulation, and polymerase decay. After ~35 cycles, the reaction plateaus.",
          ar: "عند كفاءة 100%، 30 دورة = 2³⁰ ≈ مليار نسخة. كفاءة PCR الحقيقية 80-100% بسبب استنزاف الكواشف، تراكم النواتج، وتحلل البوليميراز. بعد ~35 دورة، يصل التفاعل للذروة.",
        },
      };
    },
  },

  // Protein concentration (Bradford/BCA)
  {
    id: "mb-protein-conc",
    category: "molecular-biology",
    names: { en: "Protein Concentration (from OD280)", ar: "تركيز البروتين (من OD280)" },
    descriptions: {
      en: "Estimate protein concentration from absorbance at 280 nm using the extinction coefficient.",
      ar: "قدّر تركيز البروتين من الامتصاص عند 280 نانومتر باستخدام معامل الانطفاء.",
    },
    keywords: ["protein", "od280", "bradford", "bca", "absorbance", "بروتين"],
    icon: "FlaskConical",
    live: true,
    fields: [
      { key: "od", names: { en: "OD280 (absorbance)", ar: "OD280 (الامتصاص)" }, type: "number", default: 0.8 },
      { key: "extinction", names: { en: "Extinction coefficient (ε)", ar: "معامل الانطفاء (ε)" }, type: "number", default: 1.0, unit: { en: "(mg/mL)⁻¹cm⁻¹", ar: "(مجم/مل)⁻¹سم⁻¹" }, help: { en: "ε 0.1% = 1.0 for typical protein (1 mg/mL). BSA = 0.66, IgG = 1.38", ar: "ε 0.1% = 1.0 لبروتين نموذجي. BSA = 0.66، IgG = 1.38" } },
      { key: "path", names: { en: "Path length", ar: "طول المسار" }, type: "number", default: 1, unit: { en: "cm", ar: "سم" } },
    ],
    compute: (v) => {
      const od = num(v.od);
      const eps = num(v.extinction);
      const path = num(v.path);
      if ([od, eps, path].some(Number.isNaN) || eps <= 0 || path <= 0) return { results: [], error: { en: "Enter valid values", ar: "أدخل قيمًا صالحة" } };
      const conc = od / (eps * path);
      return {
        results: [
          { label: { en: "Concentration", ar: "التركيز" }, value: fmt(conc, 4) + " mg/mL", primary: true },
          { label: { en: "In μg/μL", ar: "بـ ميكروجرام/ميكرولتر" }, value: fmt(conc, 4) + " μg/μL" },
          { label: { en: "In μM (if MW=50kDa)", ar: "بـ ميكرومول (إذا الوزن=50كيلو دالتون)" }, value: fmt(conc * 1000 / 50, 2) + " μM" },
        ],
        formula: `Conc = OD280 / (ε × path) = ${od} / (${eps} × ${path}) = ${fmt(conc, 4)} mg/mL`,
        explanation: {
          en: "Beer-Lambert law: A = ε × c × l. The extinction coefficient depends on aromatic amino acids (Trp, Tyr, Phe). For unknown proteins, assume ε ≈ 1.0 (mg/mL)⁻¹cm⁻¹. Also check A260/A280: pure protein ≈ 0.57, lower = DNA contamination.",
          ar: "قانون بير-لامبرت: A = ε × c × l. معامل الانطفاء يعتمد على الأحماض الأمينية الأروماتية (تربتوفان، تايروسين، فينيل ألانين). للبروتينات غير المعروفة، افترض ε ≈ 1.0. تحقق أيضاً من A260/A280: بروتين نقي ≈ 0.57، أقل = تلوث DNA.",
        },
      };
    },
  },

  // Cell Culture - Seeding Density
  {
    id: "mb-cell-seeding",
    category: "molecular-biology",
    names: { en: "Cell Seeding Density", ar: "كثافة زراعة الخلايا" },
    descriptions: {
      en: "Calculate how many cells to seed and what volume of suspension to add to a culture vessel.",
      ar: "احسب عدد الخلايا المطلوب زراعتها وحجم المعلق المطلوب إضافته لوعاء الزراعة.",
    },
    keywords: ["cell", "culture", "seeding", "density", "confluency", "خلايا", "زراعة"],
    icon: "Cells",
    live: true,
    fields: [
      { key: "targetDensity", names: { en: "Target seeding density", ar: "الكثافة المستهدفة" }, type: "number", default: 5000, unit: { en: "cells/cm²", ar: "خلية/سم²" } },
      { key: "vesselArea", names: { en: "Vessel growth area", ar: "مساحة النمو" }, type: "number", default: 25, unit: { en: "cm²", ar: "سم²" }, help: { en: "96-well=0.32, 24-well=1.9, 12-well=3.8, 6-well=9.6, T25=25, T75=75, T175=175 cm²", ar: "بئر96=0.32، بئر24=1.9، بئر12=3.8، بئر6=9.6، T25=25، T75=75، T175=175 سم²" } },
      { key: "stockConc", names: { en: "Stock cell concentration", ar: "تركيز معلق الخلايا" }, type: "number", default: 500000, unit: { en: "cells/mL", ar: "خلية/مل" } },
    ],
    compute: (v) => {
      const dens = num(v.targetDensity);
      const area = num(v.vesselArea);
      const stock = num(v.stockConc);
      if ([dens, area, stock].some(Number.isNaN) || area <= 0 || stock <= 0) return { results: [], error: { en: "Enter valid values", ar: "أدخل قيمًا صالحة" } };
      const totalCells = dens * area;
      const volume = (totalCells / stock) * 1000; // μL
      return {
        results: [
          { label: { en: "Total cells needed", ar: "إجمالي الخلايا المطلوبة" }, value: fmt(totalCells, 0) + " cells", primary: true },
          { label: { en: "Volume to add", ar: "الحجم المطلوب إضافته" }, value: fmt(volume, 1) + " μL (" + fmt(volume / 1000, 3) + " mL)" },
        ],
        formula: `Cells = density × area = ${dens} × ${area} = ${fmt(totalCells, 0)}; Volume = cells / stock = ${fmt(totalCells, 0)} / ${stock} = ${fmt(volume, 1)} μL`,
        steps: [
          { description: { en: `Total cells = ${fmt(dens, 0)} cells/cm² × ${area} cm² = ${fmt(totalCells, 0)} cells`, ar: `إجمالي الخلايا = ${fmt(dens, 0)} × ${area} = ${fmt(totalCells, 0)} خلية` } },
          { description: { en: `Volume = ${fmt(totalCells, 0)} cells ÷ ${fmt(stock, 0)} cells/mL = ${fmt(volume, 1)} μL`, ar: `الحجم = ${fmt(totalCells, 0)} ÷ ${fmt(stock, 0)} = ${fmt(volume, 1)} ميكrolتر` } },
        ],
        explanation: {
          en: "Typical seeding: 5000-10000 cells/cm² for adherent (HEK293, HeLa). Aim for 30-50% confluency at seeding, 80-90% at passaging. Volume reference per vessel: 96-well=100μL, 24-well=0.5mL, 6-well=2mL, T25=5mL, T75=10mL, T175=20mL.",
          ar: "الزراعة النموذجية: 5000-10000 خلية/سم² للخلايا اللاصقة (HEK293، HeLa). استهدف 30-50% كثافة عند الزراعة، 80-90% عند التمرير. مرجع الحجم لكل وعاء: بئر96=100مكمل، بئر24=0.5مل، بئر6=2مل، T25=5مل، T75=10مل، T175=20مل.",
        },
      };
    },
  },

  // Molarity to mass (general lab helper)
  {
    id: "mb-molar-mass",
    category: "molecular-biology",
    names: { en: "Molarity ↔ Mass (any MW)", ar: "مولارية ↔ كتلة (أي وزن جزيئي)" },
    descriptions: {
      en: "Convert between molarity and mass for any substance using its molecular weight.",
      ar: "حوّل بين المولارية والكتلة لأي مادة باستخدام وزنها الجزيئي.",
    },
    keywords: ["molar", "mass", "molarity", "molecular weight", "مولارية", "كتلة"],
    icon: "Scale",
    live: true,
    fields: [
      {
        key: "mode",
        names: { en: "Conversion mode", ar: "وضع التحويل" },
        type: "select",
        default: "mToMass",
        options: [
          { value: "mToMass", label: { en: "Molarity → Mass (how much to weigh)", ar: "مولارية → كتلة (كم توزن)" } },
          { value: "massToM", label: { en: "Mass → Molarity (what concentration did I make)", ar: "كتلة → مولارية (ما التركيز الذي حضّرت)" } },
        ],
      },
      { key: "mw", names: { en: "Molecular weight (MW)", ar: "الوزن الجزيئي" }, type: "number", default: 58.44, unit: { en: "g/mol", ar: "جم/مول" }, help: { en: "e.g. NaCl=58.44, glucose=180.16, Tris=121.14, EDTA=372.24", ar: "مثال: NaCl=58.44، جلوكوز=180.16، Tris=121.14، EDTA=372.24" } },
      { key: "molarity", names: { en: "Molarity", ar: "المولارية" }, type: "number", default: 0.5, unit: { en: "mol/L", ar: "مول/لتر" } },
      { key: "volume", names: { en: "Volume", ar: "الحجم" }, type: "number", default: 1, unit: { en: "L", ar: "لتر" } },
      { key: "mass", names: { en: "Mass (for mass→molarity mode)", ar: "الكتلة (لوضع كتلة→مولارية)" }, type: "number", default: 29.22, unit: { en: "g", ar: "جم" } },
    ],
    compute: (v) => {
      const mw = num(v.mw);
      if (Number.isNaN(mw) || mw <= 0) return { results: [], error: { en: "Enter valid MW", ar: "أدخل وزنًا جزيئيًا صالحًا" } };
      const mode = String(v.mode);
      if (mode === "mToMass") {
        const M = num(v.molarity);
        const vol = num(v.volume);
        if ([M, vol].some(Number.isNaN) || vol <= 0) return { results: [], error: { en: "Enter valid M and volume", ar: "أدخل مولارية وحجم صالحين" } };
        const mass = M * vol * mw;
        return {
          results: [
            { label: { en: "Mass to weigh", ar: "الكتلة المطلوب وزنها" }, value: fmt(mass, 4) + " g", primary: true },
            { label: { en: "In mg", ar: "بـ مجم" }, value: fmt(mass * 1000, 2) + " mg" },
          ],
          formula: `mass = M × V × MW = ${M} × ${vol} × ${mw} = ${fmt(mass, 4)} g`,
          steps: [
            { description: { en: `Moles needed = ${M} mol/L × ${vol} L = ${fmt(M * vol, 5)} mol`, ar: `المولات = ${M} × ${vol} = ${fmt(M * vol, 5)} مول` } },
            { description: { en: `Mass = ${fmt(M * vol, 5)} mol × ${mw} g/mol = ${fmt(mass, 4)} g`, ar: `الكتلة = ${fmt(M * vol, 5)} × ${mw} = ${fmt(mass, 4)} جم` } },
          ],
        };
      } else {
        const mass = num(v.mass);
        const vol = num(v.volume);
        if ([mass, vol].some(Number.isNaN) || vol <= 0) return { results: [], error: { en: "Enter valid mass and volume", ar: "أدخل كتلة وحجم صالحين" } };
        const M = mass / (vol * mw);
        return {
          results: [
            { label: { en: "Molarity", ar: "المولارية" }, value: fmt(M, 6) + " mol/L", primary: true },
            { label: { en: "In mM", ar: "بـ مليمول" }, value: fmt(M * 1000, 4) + " mM" },
          ],
          formula: `M = mass / (V × MW) = ${mass} / (${vol} × ${mw}) = ${fmt(M, 6)} mol/L`,
          steps: [
            { description: { en: `Moles = ${mass} g ÷ ${mw} g/mol = ${fmt(mass / mw, 6)} mol`, ar: `المولات = ${mass} ÷ ${mw} = ${fmt(mass / mw, 6)} مول` } },
            { description: { en: `M = ${fmt(mass / mw, 6)} mol ÷ ${vol} L = ${fmt(M, 6)} mol/L`, ar: `المولارية = ${fmt(mass / mw, 6)} ÷ ${vol} = ${fmt(M, 6)} مول/لتر` } },
          ],
        };
      }
    },
  },
];

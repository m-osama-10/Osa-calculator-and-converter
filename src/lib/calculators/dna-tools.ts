// ============================================================================
// DNA & RNA Tools Calculators
// ============================================================================

import type { Calculator } from "../types";
import { num, fmt, fmtSci } from "../calculator-utils";

export const dnaToolsCalculators: Calculator[] = [
  // DNA/RNA Molecular Weight
  {
    id: "dna-mw",
    category: "dna",
    names: { en: "DNA/RNA Molecular Weight", ar: "الوزن الجزيئي للـ DNA/RNA" },
    descriptions: {
      en: "Calculate molecular weight of DNA or RNA from sequence length.",
      ar: "احسب الوزن الجزيئي للـ DNA أو RNA من طول التسلسل.",
    },
    keywords: ["dna", "rna", "molecular weight", "mw", "وزن جزيئي"],
    icon: "Dna",
    live: true,
    fields: [
      { key: "length", names: { en: "Sequence length", ar: "طول التسلسل" }, type: "number", default: 1000, unit: { en: "bp (or nt)", ar: "زوج قاعدي (أو نيوكليوتيد)" } },
      {
        key: "type",
        names: { en: "Nucleic acid type", ar: "نوع الحمض النووي" },
        type: "select",
        default: "dsDNA",
        options: [
          { value: "dsDNA", label: { en: "Double-stranded DNA (660 Da/bp)", ar: "DNA ثنائي الشريطة (660 دالتون/زوج)" } },
          { value: "ssDNA", label: { en: "Single-stranded DNA (330 Da/nt)", ar: "DNA أحادي الشريطة (330 دالتون/نيوكليوتيد)" } },
          { value: "ssRNA", label: { en: "Single-stranded RNA (340 Da/nt)", ar: "RNA أحادي الشريطة (340 دالتون/نيوكليوتيد)" } },
        ],
      },
    ],
    compute: (v) => {
      const len = num(v.length);
      if (Number.isNaN(len) || len <= 0) return { results: [], error: { en: "Enter valid length", ar: "أدخل طولًا صالحًا" } };
      const factors: Record<string, { da: number; en: string; ar: string }> = {
        dsDNA: { da: 660, en: "660 Da/bp", ar: "660 دالتون/زوج قاعدي" },
        ssDNA: { da: 330, en: "330 Da/nt", ar: "330 دالتون/نيوكليوتيد" },
        ssRNA: { da: 340, en: "340 Da/nt", ar: "340 دالتون/نيوكليوتيد" },
      };
      const f = factors[String(v.type)] ?? factors.dsDNA;
      const mw = len * f.da;
      return {
        results: [
          { label: { en: "Molecular weight", ar: "الوزن الجزيئي" }, value: fmtSci(mw, 4) + " Da", primary: true },
          { label: { en: "In kDa", ar: "بـ كيلو دالتون" }, value: fmt(mw / 1000, 2) + " kDa" },
          { label: { en: "In g/mol", ar: "بـ جم/مول" }, value: fmtSci(mw, 4) + " g/mol" },
        ],
        formula: `MW = ${len} × ${f.en} = ${fmtSci(mw, 4)} Da`,
        steps: [
          { description: { en: `Length = ${len} ${String(v.type).includes("ds") ? "bp" : "nt"}`, ar: `الطول = ${len}` } },
          { description: { en: `Factor = ${f.en}`, ar: `العامل = ${f.ar}` } },
          { description: { en: `MW = ${len} × ${f.da} = ${fmtSci(mw, 4)} Da`, ar: `الوزن = ${len} × ${f.da} = ${fmtSci(mw, 4)} دالتون` } },
        ],
        explanation: {
          en: "Average MW: dsDNA = 660 Da/bp, ssDNA = 330 Da/nt, ssRNA = 340 Da/nt. For exact MW, use base composition (dA=313.21, dT=304.2, dG=329.21, dC=289.18 for ssDNA; subtract 61 for dsDNA internal pairs).",
          ar: "متوسط الوزن الجزيئي: DNA ثنائي = 660، DNA أحادي = 330، RNA = 340 دالتون. للوزن الدقيق، استخدم تركيب القواعد.",
        },
      };
    },
  },

  // DNA Dilution for PCR
  {
    id: "dna-dilution-pcr",
    category: "dna",
    names: { en: "DNA Dilution for PCR", ar: "تخفيف DNA لـ PCR" },
    descriptions: {
      en: "Calculate how to dilute your DNA stock to the required concentration for PCR or other reactions.",
      ar: "احسب كيفية تخفيف مخزون DNA إلى التركيز المطلوب لـ PCR أو تفاعلات أخرى.",
    },
    keywords: ["dna", "dilution", "pcr", "c1v1", "تخفيف", "PCR"],
    icon: "Pipette",
    live: true,
    fields: [
      { key: "stockConc", names: { en: "Stock concentration (C₁)", ar: "تركيز المخزون (C₁)" }, type: "number", default: 200, unit: { en: "ng/μL", ar: "نانوجرام/ميكرولتر" } },
      { key: "targetConc", names: { en: "Target concentration (C₂)", ar: "التركيز المستهدف (C₂)" }, type: "number", default: 20, unit: { en: "ng/μL", ar: "نانوجرام/ميكرولتر" } },
      { key: "targetVol", names: { en: "Target volume (V₂)", ar: "الحجم المستهدف (V₂)" }, type: "number", default: 50, unit: { en: "μL", ar: "ميكرولتر" } },
    ],
    compute: (v) => {
      const c1 = num(v.stockConc);
      const c2 = num(v.targetConc);
      const v2 = num(v.targetVol);
      if ([c1, c2, v2].some(Number.isNaN) || c1 <= 0 || c2 <= 0 || v2 <= 0)
        return { results: [], error: { en: "Enter positive values", ar: "أدخل قيمًا موجبة" } };
      if (c2 > c1) return { results: [], error: { en: "Target concentration > stock (can't dilute up)", ar: "التركيز المستهدف > المخزون (لا يمكن التخفيف للأعلى)" } };
      const v1 = (c2 * v2) / c1;
      const water = v2 - v1;
      return {
        results: [
          { label: { en: "Stock volume to use (V₁)", ar: "حجم المخزون المطلوب (V₁)" }, value: fmt(v1, 2) + " μL", primary: true },
          { label: { en: "Water/buffer to add", ar: "ماء/بفر لإضافته" }, value: fmt(water, 2) + " μL", primary: true },
          { label: { en: "Total volume", ar: "الحجم الكلي" }, value: fmt(v2, 1) + " μL" },
        ],
        formula: `C₁V₁ = C₂V₂ → V₁ = (C₂ × V₂) / C₁ = (${c2} × ${v2}) / ${c1} = ${fmt(v1, 2)} μL`,
        steps: [
          { description: { en: `C₁ = ${c1} ng/μL, C₂ = ${c2} ng/μL, V₂ = ${v2} μL`, ar: `C₁ = ${c1}، C₂ = ${c2}، V₂ = ${v2} ميكrolتر` } },
          { description: { en: `V₁ = (${c2} × ${v2}) / ${c1} = ${fmt(v1, 2)} μL`, ar: `V₁ = (${c2} × ${v2}) / ${c1} = ${fmt(v1, 2)} ميكrolتر` } },
          { description: { en: `Water = ${v2} − ${fmt(v1, 2)} = ${fmt(water, 2)} μL`, ar: `الماء = ${v2} − ${fmt(v1, 2)} = ${fmt(water, 2)} ميكrolتر` } },
        ],
        explanation: {
          en: "PCR template: typically 10-100 ng genomic DNA, 1-10 pg plasmid. Too much DNA inhibits PCR. Use nuclease-free water or TE buffer for dilution.",
          ar: "قالب PCR: عادة 10-100 نانوجرام DNA جينومي، 1-10 بيكوجرام بلازميد. DNA الزائد يثبط PCR. استخدم ماء خالٍ من النوكلياز أو TE buffer للتخفيف.",
        },
      };
    },
  },

  // Ligation Calculator
  {
    id: "dna-ligation",
    category: "dna",
    names: { en: "Ligation Insert:Vector Ratio", ar: "نسبة الإدخال:الناقل للربط" },
    descriptions: {
      en: "Calculate how much insert DNA to add to a ligation reaction for a target insert:vector molar ratio.",
      ar: "احسب كمية DNA الإدخال لإضافتها لتفاعل الربط للوصول لنسبة مولية إدخال:ناقل مستهدفة.",
    },
    keywords: ["ligation", "insert", "vector", "cloning", "molar ratio", "ربط", "استنساخ"],
    icon: "Link",
    live: true,
    fields: [
      { key: "vectorMass", names: { en: "Vector mass", ar: "كتلة الناقل" }, type: "number", default: 50, unit: { en: "ng", ar: "نانوجرام" } },
      { key: "vectorSize", names: { en: "Vector size", ar: "حجم الناقل" }, type: "number", default: 3000, unit: { en: "bp", ar: "زوج قاعدي" } },
      { key: "insertSize", names: { en: "Insert size", ar: "حجم الإدخال" }, type: "number", default: 1000, unit: { en: "bp", ar: "زوج قاعدي" } },
      { key: "ratio", names: { en: "Insert:Vector molar ratio", ar: "النسبة المولية إدخال:ناقل" }, type: "number", default: 3, help: { en: "Typical: 3:1 for sticky-end, 5:1 for blunt-end", ar: "نموذجي: 3:1 للنهاية اللاصقة، 5:1 للنهاية الحادة" } },
    ],
    compute: (v) => {
      const vm = num(v.vectorMass);
      const vs = num(v.vectorSize);
      const is = num(v.insertSize);
      const r = num(v.ratio);
      if ([vm, vs, is, r].some(Number.isNaN) || vm <= 0 || vs <= 0 || is <= 0 || r <= 0)
        return { results: [], error: { en: "Enter positive values", ar: "أدخل قيمًا موجبة" } };
      // Molar ratio: (insert ng / insert bp) / (vector ng / vector bp) = ratio
      // → insert ng = ratio × (vector ng / vector bp) × insert bp
      const insertMass = (r * vm * is) / vs;
      return {
        results: [
          { label: { en: "Insert DNA to add", ar: "DNA الإدخال المطلوب" }, value: fmt(insertMass, 2) + " ng", primary: true },
          { label: { en: "Vector DNA", ar: "DNA الناقل" }, value: fmt(vm, 1) + " ng" },
          { label: { en: "Molar ratio (I:V)", ar: "النسبة المولية (إدخال:ناقل)" }, value: `${r}:1` },
        ],
        formula: `Insert ng = ratio × (vector ng × insert bp) / vector bp = ${r} × (${vm} × ${is}) / ${vs}`,
        steps: [
          { description: { en: `Vector: ${vm} ng, ${vs} bp`, ar: `الناقل: ${vm} نانوجرام، ${vs} زوج قاعدي` } },
          { description: { en: `Insert: ${is} bp, target ratio = ${r}:1`, ar: `الإدخال: ${is} زوج قاعدي، النسبة المستهدفة = ${r}:1` } },
          { description: { en: `Insert ng = ${r} × ${vm} × ${is} / ${vs} = ${fmt(insertMass, 2)} ng`, ar: `الإدخال = ${r} × ${vm} × ${is} / ${vs} = ${fmt(insertMass, 2)} نانوجرام` } },
        ],
        explanation: {
          en: "For sticky-end ligation: 3:1 ratio, 50 ng vector, 10-20 μL reaction. For blunt-end: 5:1 ratio. Too much insert causes multiple inserts or background. T4 DNA ligase works best at 16°C overnight for sticky ends, room temp for blunt.",
          ar: "للربط بالنهاية اللاصقة: نسبة 3:1، 50 نانوجرام ناقل، تفاعل 10-20 ميكrolتر. للنهاية الحادة: 5:1. الإدخال الزائد يسبب إدخالات متعددة أو خلفية. T4 DNA ligase يعمل أفضل عند 16°م طوال الليل للنهاية اللاصقة، حرارة الغرفة للحادة.",
        },
      };
    },
  },

  // OD600 to Cell Density
  {
    id: "dna-od600",
    category: "dna",
    names: { en: "OD600 → Cell Density", ar: "OD600 → كثافة الخلايا" },
    descriptions: {
      en: "Convert OD600 reading to cells/mL for bacterial cultures (E. coli).",
      ar: "حوّل قراءة OD600 إلى خلايا/مل لمزارع البكتيريا (E. coli).",
    },
    keywords: ["od600", "cell", "density", "bacteria", "e coli", "خلايا", "بكتيريا"],
    icon: "Microscope",
    live: true,
    fields: [
      { key: "od", names: { en: "OD600 reading", ar: "قراءة OD600" }, type: "number", default: 0.5 },
      { key: "dilution", names: { en: "Dilution factor", ar: "عامل التخفيف" }, type: "number", default: 1, help: { en: "e.g. 10 if diluted 1:10 before reading", ar: "مثال 10 إذا خففت 1:10" } },
      {
        key: "organism",
        names: { en: "Organism", ar: "الكائن" },
        type: "select",
        default: "ecoli",
        options: [
          { value: "ecoli", label: { en: "E. coli (1 OD = 8×10⁸ cells/mL)", ar: "E. coli (1 OD = 8×10⁸ خلية/مل)" } },
          { value: "yeast", label: { en: "Yeast (1 OD = 1×10⁷ cells/mL)", ar: "خميرة (1 OD = 1×10⁷ خلية/مل)" } },
          { value: "mammalian", label: { en: "Mammalian (1 OD = 2×10⁵ cells/mL)", ar: "ثديي (1 OD = 2×10⁵ خلية/مل)" } },
        ],
      },
    ],
    compute: (v) => {
      const od = num(v.od);
      const dil = num(v.dilution);
      if ([od, dil].some(Number.isNaN) || od < 0 || dil <= 0) return { results: [], error: { en: "Enter valid values", ar: "أدخل قيمًا صالحة" } };
      const factors: Record<string, number> = { ecoli: 8e8, yeast: 1e7, mammalian: 2e5 };
      const factor = factors[String(v.organism)] ?? 8e8;
      const cells = od * dil * factor;
      return {
        results: [
          { label: { en: "Cell density", ar: "كثافة الخلايا" }, value: fmtSci(cells, 3) + " cells/mL", primary: true },
          { label: { en: "In culture (10 mL)", ar: "في المزرعة (10 مل)" }, value: fmtSci(cells * 10, 3) + " cells" },
        ],
        formula: `cells/mL = OD600 × dilution × ${fmtSci(factor, 2)} = ${od} × ${dil} × ${fmtSci(factor, 2)}`,
        steps: [
          { description: { en: `OD600 = ${od}, dilution = ${dil}`, ar: `OD600 = ${od}، تخفيف = ${dil}` } },
          { description: { en: `Factor = ${fmtSci(factor, 2)} cells/mL per OD`, ar: `العامل = ${fmtSci(factor, 2)} خلية/مل لكل OD` } },
          { description: { en: `cells/mL = ${od} × ${dil} × ${fmtSci(factor, 2)} = ${fmtSci(cells, 3)}`, ar: `خلايا/مل = ${od} × ${dil} × ${fmtSci(factor, 2)} = ${fmtSci(cells, 3)}` } },
        ],
        explanation: {
          en: "OD600 measures light scattering (not absorbance). Linear range: 0.1-0.8. Above 0.8, dilute your sample. For exact counts, use a hemocytometer or flow cytometer. Note: OD depends on path length (1 cm standard) and spectrophotometer model.",
          ar: "OD600 يقيس تشتت الضوء (ليس الامتصاص). المدى الخطي: 0.1-0.8. فوق 0.8، خفف العينة. للعد الدقيق، استخدم عداد الخلايا أو مقياس التدفق الخلوي. ملاحظة: OD يعتمد على طول المسار (1 سم قياسي) وموديل المطياف.",
        },
      };
    },
  },

  // GC Content
  {
    id: "dna-gc-content",
    category: "dna",
    names: { en: "GC Content Analyzer", ar: "محلل محتوى GC" },
    descriptions: {
      en: "Calculate GC content, AT content, and base composition of a DNA sequence.",
      ar: "احسب محتوى GC، محتوى AT، وتركيب القواعد لتسلسل DNA.",
    },
    keywords: ["gc", "content", "composition", "sequence", "dna", "محتوى GC"],
    icon: "BarChart3",
    live: true,
    fields: [
      { key: "seq", names: { en: "DNA sequence", ar: "تسلسل DNA" }, type: "text", placeholder: { en: "e.g. ATGCGATCGATCG", ar: "مثال: ATGCGATCGATCG" }, default: "ATGCGATCGATCGATCGATCG", help: { en: "Enter A, T, G, C only", ar: "أدخل A, T, G, C فقط" } },
    ],
    compute: (v) => {
      const seq = String(v.seq).toUpperCase().replace(/[^ATGC]/g, "");
      if (seq.length === 0) return { results: [], error: { en: "Enter a valid DNA sequence", ar: "أدخل تسلسل DNA صالح" } };
      const a = (seq.match(/A/g) || []).length;
      const t = (seq.match(/T/g) || []).length;
      const g = (seq.match(/G/g) || []).length;
      const c = (seq.match(/C/g) || []).length;
      const total = seq.length;
      const gc = ((g + c) / total) * 100;
      const at = ((a + t) / total) * 100;
      const tm = 2 * (a + t) + 4 * (g + c);
      return {
        results: [
          { label: { en: "GC content", ar: "محتوى GC" }, value: fmt(gc, 2) + "%", primary: true },
          { label: { en: "AT content", ar: "محتوى AT" }, value: fmt(at, 2) + "%" },
          { label: { en: "Sequence length", ar: "طول التسلسل" }, value: total + " nt" },
          { label: { en: "A", ar: "A" }, value: `${a} (${fmt((a / total) * 100, 1)}%)` },
          { label: { en: "T", ar: "T" }, value: `${t} (${fmt((t / total) * 100, 1)}%)` },
          { label: { en: "G", ar: "G" }, value: `${g} (${fmt((g / total) * 100, 1)}%)` },
          { label: { en: "C", ar: "C" }, value: `${c} (${fmt((c / total) * 100, 1)}%)` },
          { label: { en: "Tm (Wallace)", ar: "Tm (والاس)" }, value: fmt(tm, 0) + " °C" },
        ],
        formula: `GC% = (G+C)/(A+T+G+C) × 100 = (${g}+${c})/${total} × 100 = ${fmt(gc, 2)}%`,
        steps: [
          { description: { en: `A=${a}, T=${t}, G=${g}, C=${c}, total=${total}`, ar: `A=${a}، T=${t}، G=${g}، C=${c}، الإجمالي=${total}` } },
          { description: { en: `GC = ${g + c}/${total} = ${fmt(gc, 2)}%`, ar: `GC = ${g + c}/${total} = ${fmt(gc, 2)}%` } },
          { description: { en: `AT = ${a + t}/${total} = ${fmt(at, 2)}%`, ar: `AT = ${a + t}/${total} = ${fmt(at, 2)}%` } },
        ],
        explanation: {
          en: "GC content affects DNA stability: G-C pairs have 3 hydrogen bonds vs 2 for A-T. Higher GC = higher melting temp. Bacterial genomes: E. coli ~50%, Streptomyces ~72%, Mycoplasma ~25%. Used for primer design, species identification, and DNA barcoding.",
          ar: "محتوى GC يؤثر على استقرار DNA: روابط G-C لها 3 روابط هيدروجينية مقابل 2 لـ A-T. GC أعلى = حرارة انصهار أعلى. الجينومات البكتيرية: E. coli ~50%، Streptomyces ~72%، Mycoplasma ~25%. يستخدم لتصميم البرايمر، تحديد الأنواع، والبصمة الوراثية.",
        },
      };
    },
  },

  // Protein MW from AA sequence
  {
    id: "dna-protein-mw",
    category: "dna",
    names: { en: "Protein MW from Amino Acids", ar: "وزن البروتين من الأحماض الأمينية" },
    descriptions: {
      en: "Estimate protein molecular weight from number of amino acids or sequence.",
      ar: "قدّر الوزن الجزيئي للبروتين من عدد الأحماض الأمينية أو التسلسل.",
    },
    keywords: ["protein", "molecular weight", "amino acid", "mw", "بروتين", "أحماض أمينية"],
    icon: "FlaskConical",
    live: true,
    fields: [
      { key: "aa", names: { en: "Number of amino acids", ar: "عدد الأحماض الأمينية" }, type: "number", default: 300, help: { en: "Or paste sequence below and length will be auto-counted", ar: "أو الصق التسلسل بالأسفل وسيُحسب الطول تلقائيًا" } },
      { key: "seq", names: { en: "OR: Paste protein sequence", ar: "أو: الصق تسلسل البروتين" }, type: "text", placeholder: { en: "MKVLWAALLVT...", ar: "MKVLWAALLVT..." }, help: { en: "Single-letter amino acid code", ar: "رمز الحمض الأميني بحرف واحد" } },
    ],
    compute: (v) => {
      let aaCount = num(v.aa);
      const seq = String(v.seq).toUpperCase().replace(/[^ACDEFGHIKLMNPQRSTVWY]/g, "");
      if (seq.length > 0) aaCount = seq.length;
      if (Number.isNaN(aaCount) || aaCount <= 0) return { results: [], error: { en: "Enter amino acid count or sequence", ar: "أدخل عدد الأحماض الأمينية أو التسلسل" } };
      // Average AA MW ≈ 110 Da (after water loss in peptide bond)
      const mw = aaCount * 110;
      return {
        results: [
          { label: { en: "Protein MW (approx)", ar: "وزن البروتين (تقريبي)" }, value: fmt(mw, 0) + " Da (" + fmt(mw / 1000, 2) + " kDa)", primary: true },
          { label: { en: "Amino acid count", ar: "عدد الأحماض الأمينية" }, value: String(aaCount) },
          { label: { en: "Codons needed", ar: "الكودونات المطلوبة" }, value: String(aaCount * 3) + " bp" },
        ],
        formula: `MW ≈ AA count × 110 Da = ${aaCount} × 110 = ${fmt(mw, 0)} Da`,
        steps: [
          { description: { en: `Amino acids = ${aaCount}`, ar: `الأحماض الأمينية = ${aaCount}` } },
          { description: { en: `Average AA MW ≈ 110 Da (after dehydration)`, ar: `متوسط وزن الحمض الأميني ≈ 110 دالتون (بعد الجفاف)` } },
          { description: { en: `MW = ${aaCount} × 110 = ${fmt(mw, 0)} Da`, ar: `الوزن = ${aaCount} × 110 = ${fmt(mw, 0)} دالتون` } },
        ],
        explanation: {
          en: "Average amino acid residue MW = 110 Da (range 75-204). This is an estimate; for exact MW, sum individual residue weights. Common markers: BSA=66.5 kDa, IgG=150 kDa, GFP=27 kDa, actin=42 kDa, tubulin=55 kDa.",
          ar: "متوسط وزن بقايا الحمض الأميني = 110 دالتون (مدى 75-204). هذا تقدير؛ للوزن الدقيق، اجمع أوزان البقايا الفردية. علامات شائعة: BSA=66.5، IgG=150، GFP=27، أكتين=42، توبولين=55 كيلو دالتون.",
        },
      };
    },
  },
];

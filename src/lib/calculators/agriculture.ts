// ============================================================================
// Agriculture & Farming Calculators
// ============================================================================

import type { Calculator, Field } from "../types";
import { num, fmt } from "../calculator-utils";

// Constants
// 1 feddan = 4200 m² = 1.038 acres = 0.42 hectare
// 1 acre = 4047 m² = 0.966 feddan
// 1 hectare = 10000 m² = 2.38 feddan

// Conversion to m²
const TO_M2: Record<string, number> = {
  feddan: 4200,
  acre: 4046.86,
  hectare: 10000,
  m2: 1,
  dunam: 1000,
};

const AREA_UNIT_LABELS: Record<string, { en: string; ar: string }> = {
  feddan: { en: "feddan", ar: "فدان" },
  acre: { en: "acre", ar: "أكر" },
  hectare: { en: "hectare", ar: "هكتار" },
  m2: { en: "m²", ar: "م²" },
  dunam: { en: "dunam", ar: "دونم" },
};

/** Shared area unit selector field */
const AREA_FIELD: Field = {
  key: "areaUnit",
  names: { en: "Area unit", ar: "وحدة المساحة" },
  type: "select",
  default: "feddan",
  options: [
    { value: "feddan", label: { en: "Feddan (فدان) — 4200 m²", ar: "فدان — 4200 م²" } },
    { value: "acre", label: { en: "Acre (أكر) — 4047 m²", ar: "أكر — 4047 م²" } },
    { value: "hectare", label: { en: "Hectare (هكتار) — 10000 m²", ar: "هكتار — 10000 م²" } },
    { value: "m2", label: { en: "Square meter (م²)", ar: "متر مربع" } },
    { value: "dunam", label: { en: "Dunam (دونم) — 1000 m²", ar: "دونم — 1000 م²" } },
  ],
  help: { en: "Choose your area unit. All results will adapt to your selection.", ar: "اختر وحدة المساحة. كل النتائج ستتكيف مع اختيارك." },
};

/** Convert area value to m² */
function areaToM2(value: number, unit: string): number {
  return value * (TO_M2[unit] ?? 4200);
}

export const agricultureCalculators: Calculator[] = [
  // -------------------------------------------------------------------------
  // Area Converter (Feddan / Acre / Hectare / m²)
  // -------------------------------------------------------------------------
  {
    id: "agri-area-converter",
    category: "agriculture",
    names: { en: "Land Area Converter", ar: "محوّل مساحة الأراضي" },
    descriptions: {
      en: "Convert between feddan, acre, hectare, m², and dunam.",
      ar: "تحويل بين الفدان، الأكر، الهكتار، المتر المربع، والدونم.",
    },
    keywords: ["area", "feddan", "acre", "hectare", "land", "مساحة", "فدان", "أكر", "هكتار"],
    icon: "LandPlot",
    live: true,
    fields: [
      { key: "value", names: { en: "Value", ar: "القيمة" }, type: "number", default: 1 },
      {
        key: "from",
        names: { en: "From", ar: "من" },
        type: "select",
        default: "feddan",
        options: [
          { value: "feddan", label: { en: "Feddan (فدان)", ar: "فدان" } },
          { value: "acre", label: { en: "Acre (أكر)", ar: "أكر" } },
          { value: "hectare", label: { en: "Hectare (هكتار)", ar: "هكتار" } },
          { value: "m2", label: { en: "Square meter (م²)", ar: "متر مربع" } },
          { value: "dunam", label: { en: "Dunam (دونم)", ar: "دونم" } },
        ],
        help: { en: "1 feddan = 4200 m² = 1.038 acre = 0.42 hectare. 1 dunam = 1000 m².", ar: "1 فدان = 4200 م² = 1.038 أكر = 0.42 هكتار. 1 دونم = 1000 م²." },
      },
    ],
    compute: (v) => {
      const val = num(v.value);
      const from = String(v.from);
      if (Number.isNaN(val)) return { results: [], error: { en: "Enter a number", ar: "أدخل رقمًا" } };
      const m2 = areaToM2(val, from);
      const feddan = m2 / 4200;
      const acre = m2 / 4046.86;
      const hectare = m2 / 10000;
      const dunam = m2 / 1000;
      return {
        results: [
          { label: { en: "Feddan (فدان)", ar: "فدان" }, value: fmt(feddan, 4) + " feddan", primary: from !== "feddan" },
          { label: { en: "Acre (أكر)", ar: "أكر" }, value: fmt(acre, 4) + " acre", primary: from === "feddan" },
          { label: { en: "Hectare (هكتار)", ar: "هكتار" }, value: fmt(hectare, 4) + " ha" },
          { label: { en: "Square meters (م²)", ar: "متر مربع" }, value: fmt(m2, 2) + " m²" },
          { label: { en: "Dunam (دونم)", ar: "دونم" }, value: fmt(dunam, 4) + " dunam" },
        ],
        formula: `${val} ${from} = ${fmt(feddan, 4)} feddan = ${fmt(acre, 4)} acre = ${fmt(hectare, 4)} ha = ${fmt(m2, 0)} m²`,
        steps: [
          { description: { en: `Convert ${val} ${from} to m²: ${val} × ${TO_M2[from]} = ${fmt(m2, 0)} m²`, ar: `حوّل ${val} ${from} إلى م²: ${val} × ${TO_M2[from]} = ${fmt(m2, 0)} م²` } },
          { description: { en: `Then: ${fmt(feddan, 4)} feddan, ${fmt(acre, 4)} acre, ${fmt(hectare, 4)} ha`, ar: `ثم: ${fmt(feddan, 4)} فدان، ${fmt(acre, 4)} أكر، ${fmt(hectare, 4)} هكتار` } },
        ],
        explanation: {
          en: "The feddan is the traditional unit of land area in Egypt and Sudan = 4200 m². An acre (used in US/UK) = 4046.86 m². A hectare (SI unit) = 10,000 m². A dunam (used in the Levant/Turkey) = 1,000 m².",
          ar: "الفدان هو وحدة مساحة الأراضي التقليدية في مصر والسودان = 4200 م². الأكر (يستخدم في أمريكا/بريطانيا) = 4046.86 م². الهكتار (وحدة دولية) = 10000 م². الدونم (يستخدم في بلاد الشام/تركيا) = 1000 م².",
        },
      };
    },
  },

  // -------------------------------------------------------------------------
  // Seeds per Area
  // -------------------------------------------------------------------------
  {
    id: "agri-seeds-per-feddan",
    category: "agriculture",
    names: { en: "Seeds per Area", ar: "كمية البذور للمساحة" },
    descriptions: {
      en: "Calculate seed quantity needed per area (feddan/acre/hectare) based on plant spacing, row spacing, and germination rate.",
      ar: "احسب كمية البذور المطلوبة للمساحة (فدان/أكر/هكتار) بناءً على المسافة بين النباتات، المسافة بين الصفوف، ونسبة الإنبات.",
    },
    keywords: ["seeds", "feddan", "planting", "spacing", "بذور", "فدان", "زراعة"],
    icon: "Sprout",
    live: true,
    fields: [
      AREA_FIELD,
      { key: "area", names: { en: "Area to plant", ar: "المساحة المطلوب زراعتها" }, type: "number", default: 1, help: { en: "Enter the area in the unit selected above", ar: "أدخل المساحة بالوحدة المختارة بالأعلى" } },
      {
        key: "crop",
        names: { en: "Crop type", ar: "نوع المحصول" },
        type: "select",
        default: "wheat",
        options: [
          { value: "wheat", label: { en: "Wheat (قمح)", ar: "قمح" } },
          { value: "corn", label: { en: "Corn (ذرة)", ar: "ذرة" } },
          { value: "rice", label: { en: "Rice (أرز)", ar: "أرز" } },
          { value: "cotton", label: { en: "Cotton (قطن)", ar: "قطن" } },
          { value: "sunflower", label: { en: "Sunflower (عباد الشمس)", ar: "عباد الشمس" } },
          { value: "custom", label: { en: "Custom", ar: "مخصص" } },
        ],
        help: { en: "Choose your crop — spacing is pre-filled. Change spacing if needed.", ar: "اختر المحصول — المسافات مُعبأة مسبقًا. غيّرها حسب الحاجة." },
      },
      { key: "plantSpacing", names: { en: "Plant spacing (within row)", ar: "المسافة بين النباتات" }, type: "number", default: 15, unit: { en: "cm", ar: "سم" }, help: { en: "Wheat=2-3cm, Corn=25cm, Cotton=20cm, Rice=15cm", ar: "قمح=2-3سم، ذرة=25سم، قطن=20سم، أرز=15سم" } },
      { key: "rowSpacing", names: { en: "Row spacing", ar: "المسافة بين الصفوف" }, type: "number", default: 20, unit: { en: "cm", ar: "سم" }, help: { en: "Wheat=15-20cm, Corn=70cm, Cotton=60cm, Rice=20cm", ar: "قمح=15-20سم، ذرة=70سم، قطن=60سم، أرز=20سم" } },
      { key: "seedsPerHill", names: { en: "Seeds per hill", ar: "بذور لكل جورة" }, type: "number", default: 1, help: { en: "Corn=2-3, Cotton=3-4, Wheat=1 (drill)", ar: "ذرة=2-3، قطن=3-4، قمح=1 (عفير)" } },
      { key: "germination", names: { en: "Germination rate (%)", ar: "نسبة الإنبات (%)" }, type: "number", default: 90, min: 1, max: 100, help: { en: "Usually 85-95% for good quality seeds.", ar: "عادة 85-95% للبذور الجيدة." } },
      { key: "seedWeight", names: { en: "Weight per 1000 seeds", ar: "وزن 1000 بذرة" }, type: "number", default: 40, unit: { en: "g", ar: "جم" }, help: { en: "Wheat≈40g, Corn≈300g, Rice≈25g, Cotton≈100g, Sunflower≈80g", ar: "قمح≈40جم، ذرة≈300جم، أرز≈25جم، قطن≈100جم، عباد شمس≈80جم" } },
    ],
    compute: (v) => {
      const areaUnit = String(v.areaUnit ?? "feddan");
      const area = num(v.area);
      const ps = num(v.plantSpacing);
      const rs = num(v.rowSpacing);
      const sph = num(v.seedsPerHill);
      const germ = num(v.germination) / 100;
      const sw = num(v.seedWeight);
      if ([area, ps, rs, sph, sw].some(Number.isNaN) || area <= 0 || ps <= 0 || rs <= 0 || sph <= 0 || sw <= 0)
        return { results: [], error: { en: "Enter valid positive values", ar: "أدخل قيمًا موجبة" } };

      const m2 = areaToM2(area, areaUnit);
      const areaCm2 = m2 * 10000;
      const plantArea = ps * rs;
      const plants = Math.floor(areaCm2 / plantArea);
      const hills = Math.floor(plants / sph);
      const totalSeeds = Math.ceil(hills * sph / germ);
      const totalWeightKg = (totalSeeds * sw) / 1_000_000;
      const recommended = totalWeightKg * 1.15;
      const unitLabel = AREA_UNIT_LABELS[areaUnit];

      return {
        results: [
          { label: { en: `Plants per ${unitLabel.en}`, ar: `نباتات لكل ${unitLabel.ar}` }, value: fmt(plants, 0) + " plants", primary: true },
          { label: { en: `Hills per ${unitLabel.en}`, ar: `جور لكل ${unitLabel.ar}` }, value: fmt(hills, 0) + " hills" },
          { label: { en: "Total seeds needed", ar: "إجمالي البذور" }, value: fmt(totalSeeds, 0) + " seeds", primary: true },
          { label: { en: "Seed weight", ar: "وزن البذور" }, value: fmt(totalWeightKg, 2) + " kg" },
          { label: { en: "Recommended (+15% loss)", ar: "الموصى به (+15% فاقد)" }, value: fmt(recommended, 2) + " kg" },
          { label: { en: "Total area", ar: "إجمالي المساحة" }, value: `${fmt(area, 2)} ${unitLabel.en} (${fmt(m2, 0)} m²)` },
        ],
        formula: `Plants = ${fmt(m2, 0)} m² ÷ (${ps}cm × ${rs}cm / 10000) = ${fmt(plants, 0)} → Seeds = ${fmt(totalSeeds, 0)} → ${fmt(totalWeightKg, 2)} kg`,
        steps: [
          { description: { en: `Area = ${fmt(area, 2)} ${unitLabel.en} = ${fmt(m2, 0)} m²`, ar: `المساحة = ${fmt(area, 2)} ${unitLabel.ar} = ${fmt(m2, 0)} م²` } },
          { description: { en: `Plants = ${fmt(areaCm2, 0)} cm² ÷ ${fmt(plantArea, 0)} cm² = ${fmt(plants, 0)}`, ar: `النباتات = ${fmt(areaCm2, 0)} ÷ ${fmt(plantArea, 0)} = ${fmt(plants, 0)}` } },
          { description: { en: `Seeds = ${fmt(hills, 0)} × ${sph} ÷ ${germ} = ${fmt(totalSeeds, 0)}`, ar: `البذور = ${fmt(hills, 0)} × ${sph} ÷ ${germ} = ${fmt(totalSeeds, 0)}` } },
          { description: { en: `Weight = ${fmt(totalSeeds, 0)} × ${sw}g / 1000 = ${fmt(totalWeightKg, 2)} kg`, ar: `الوزن = ${fmt(totalSeeds, 0)} × ${sw}جم / 1000 = ${fmt(totalWeightKg, 2)} كجم` } },
        ],
        explanation: {
          en: "The calculation accounts for germination rate and 15% field losses. For broadcast crops (rice, some wheat), use the recommended rate from seed supplier (typically 50-70 kg/feddan for wheat, 120-150 for rice).",
          ar: "الحساب يراعي نسبة الإنبات و15% فاقد ميداني. للمحاصيل البدار (الأرز، بعض القمح)، استخدم المعدل الموصى به من المورد (عادة 50-70 كجم/فدان للقمح، 120-150 للأرز).",
        },
      };
    },
  },

  // -------------------------------------------------------------------------
  // Seedlings per Area
  // -------------------------------------------------------------------------
  {
    id: "agri-seedlings",
    category: "agriculture",
    names: { en: "Seedlings per Area", ar: "عدد الشتلات للمساحة" },
    descriptions: {
      en: "Calculate how many seedlings (transplants) you need per area for vegetable and tree crops.",
      ar: "احسب عدد الشتلات المطلوبة للمساحة لمحاصيل الخضروات والأشجار.",
    },
    keywords: ["seedlings", "transplants", "nursery", "vegetables", "trees", "شتلات", "مشتل"],
    icon: "TreePine",
    live: true,
    fields: [
      AREA_FIELD,
      { key: "area", names: { en: "Area to plant", ar: "المساحة المطلوب زراعتها" }, type: "number", default: 1, help: { en: "Enter the area in the unit selected above", ar: "أدخل المساحة بالوحدة المختارة بالأعلى" } },
      {
        key: "crop",
        names: { en: "Crop type", ar: "نوع المحصول" },
        type: "select",
        default: "tomato",
        options: [
          { value: "tomato", label: { en: "Tomato (طماطم)", ar: "طماطم" } },
          { value: "pepper", label: { en: "Pepper (فلفل)", ar: "فلفل" } },
          { value: "eggplant", label: { en: "Eggplant (باذنجان)", ar: "باذنجان" } },
          { value: "cucumber", label: { en: "Cucumber (خيار)", ar: "خيار" } },
          { value: "watermelon", label: { en: "Watermelon (بطيخ)", ar: "بطيخ" } },
          { value: "strawberry", label: { en: "Strawberry (فراولة)", ar: "فراولة" } },
          { value: "orange", label: { en: "Orange tree (برتقال)", ar: "برتقال" } },
          { value: "mango", label: { en: "Mango tree (مانجو)", ar: "مانجو" } },
          { value: "palm", label: { en: "Date palm (نخيل)", ar: "نخيل" } },
          { value: "olive", label: { en: "Olive (زيتون)", ar: "زيتون" } },
          { value: "custom", label: { en: "Custom spacing", ar: "مسافات مخصصة" } },
        ],
        help: { en: "Select your crop — spacing is auto-filled.", ar: "اختر المحصول — المسافات تُملأ تلقائيًا." },
      },
      { key: "plantSpacing", names: { en: "Plant spacing", ar: "المسافة بين الشتلات" }, type: "number", default: 50, unit: { en: "cm", ar: "سم" }, help: { en: "Tomato=50, Pepper=40, Cucumber=30, Watermelon=100, Strawberry=30, Orange=500, Mango=700, Palm=800, Olive=600", ar: "طماطم=50، فلفل=40، خيار=30، بطيخ=100، فراولة=30، برتقال=500، مانجو=700، نخيل=800، زيتون=600" } },
      { key: "rowSpacing", names: { en: "Row spacing", ar: "المسافة بين الصفوف" }, type: "number", default: 100, unit: { en: "cm", ar: "سم" }, help: { en: "Tomato=100, Pepper=80, Cucumber=100, Watermelon=200, Strawberry=100, Orange=600, Mango=800, Palm=800, Olive=700", ar: "طماطم=100، فلفل=80، خيار=100، بطيخ=200، فراولة=100، برتقال=600، مانجو=800، نخيل=800، زيتون=700" } },
      { key: "extra", names: { en: "Extra seedlings (%)", ar: "شتلات إضافية (%)" }, type: "number", default: 10, help: { en: "Extra to cover mortality during transplanting (5-15%).", ar: "إضافية لتعويض الفاقد أثناء الشتل (5-15%)." } },
    ],
    compute: (v) => {
      const areaUnit = String(v.areaUnit ?? "feddan");
      const area = num(v.area);
      const ps = num(v.plantSpacing);
      const rs = num(v.rowSpacing);
      const extra = num(v.extra) / 100;
      if ([area, ps, rs].some(Number.isNaN) || area <= 0 || ps <= 0 || rs <= 0)
        return { results: [], error: { en: "Enter valid positive values", ar: "أدخل قيمًا موجبة" } };

      const m2 = areaToM2(area, areaUnit);
      const areaCm2 = m2 * 10000;
      const plantArea = ps * rs;
      const seedlings = Math.floor(areaCm2 / plantArea);
      const withExtra = Math.ceil(seedlings * (1 + extra));
      const traySize = 209;
      const trays = Math.ceil(withExtra / traySize);
      const unitLabel = AREA_UNIT_LABELS[areaUnit];

      return {
        results: [
          { label: { en: `Seedlings per ${unitLabel.en}`, ar: `شتلات لكل ${unitLabel.ar}` }, value: fmt(seedlings, 0) + " seedlings", primary: true },
          { label: { en: `With extra (+${num(v.extra)}%)`, ar: `مع الإضافي (+${num(v.extra)}%)` }, value: fmt(withExtra, 0) + " seedlings", primary: true },
          { label: { en: "Nursery trays (209-cell)", ar: "صواني المشتل (209 عين)" }, value: fmt(trays, 0) + " trays" },
          { label: { en: "Total area", ar: "إجمالي المساحة" }, value: `${fmt(area, 2)} ${unitLabel.en} (${fmt(m2, 0)} m²)` },
          { label: { en: "Spacing", ar: "المسافات" }, value: `${ps} × ${rs} cm` },
        ],
        formula: `Seedlings = ${fmt(m2, 0)} m² ÷ (${ps}×${rs}/10000) = ${fmt(seedlings, 0)} → ${fmt(withExtra, 0)} with extra`,
        steps: [
          { description: { en: `Area = ${fmt(area, 2)} ${unitLabel.en} = ${fmt(m2, 0)} m²`, ar: `المساحة = ${fmt(area, 2)} ${unitLabel.ar} = ${fmt(m2, 0)} م²` } },
          { description: { en: `Seedlings = ${fmt(m2, 0)} ÷ ${fmt(ps * rs / 10000, 4)} = ${fmt(seedlings, 0)}`, ar: `الشتلات = ${fmt(m2, 0)} ÷ ${fmt(ps * rs / 10000, 4)} = ${fmt(seedlings, 0)}` } },
          { description: { en: `With extra: ${fmt(seedlings, 0)} × 1.${String(num(v.extra)).padStart(2, "0")} = ${fmt(withExtra, 0)}`, ar: `مع الإضافي: ${fmt(seedlings, 0)} × 1.${String(num(v.extra)).padStart(2, "0")} = ${fmt(withExtra, 0)}` } },
        ],
        explanation: {
          en: "Buy 10% extra to replace dead seedlings. Nursery trays typically have 209 or 84 cells. Tomatoes: ~8000-8400/feddan, Cucumber: ~14000/feddan, Strawberry: ~14000/feddan.",
          ar: "اشترِ 10% إضافية لتعويض الشتلات الميتة. صواني المشتل عادة بها 209 أو 84 عين. الطماطم: ~8000-8400/فدان، الخيار: ~14000/فدان، الفراولة: ~14000/فدان.",
        },
      };
    },
  },

  // -------------------------------------------------------------------------
  // Fertilizer per Area
  // -------------------------------------------------------------------------
  {
    id: "agri-fertilizer",
    category: "agriculture",
    names: { en: "Fertilizer per Area", ar: "الأسمدة للمساحة" },
    descriptions: {
      en: "Calculate how much fertilizer to apply per area based on NPK recommendation and fertilizer analysis.",
      ar: "احسب كمية السماد المطلوبة للمساحة بناءً على توصية NPK وتحليل السماد.",
    },
    keywords: ["fertilizer", "npk", "nitrogen", "phosphorus", "potassium", "سماد", "نيتروجين"],
    icon: "Leaf",
    live: true,
    fields: [
      AREA_FIELD,
      { key: "area", names: { en: "Area to fertilize", ar: "المساحة المطلوب تسميدها" }, type: "number", default: 1, help: { en: "Enter the area in the unit selected above", ar: "أدخل المساحة بالوحدة المختارة بالأعلى" } },
      {
        key: "nutrient",
        names: { en: "Target nutrient", ar: "العنصر المستهدف" },
        type: "select",
        default: "N",
        options: [
          { value: "N", label: { en: "Nitrogen (N)", ar: "نيتروجين (N)" } },
          { value: "P2O5", label: { en: "Phosphorus (P₂O₅)", ar: "فوسفور (P₂O₅)" } },
          { value: "K2O", label: { en: "Potassium (K₂O)", ar: "بوتاسيوم (K₂O)" } },
        ],
        help: { en: "Which nutrient do you want to apply?", ar: "أي عنصر تريد إضافته؟" },
      },
      { key: "recommendation", names: { en: "Recommendation", ar: "التوصية" }, type: "number", default: 80, unit: { en: "kg/feddan", ar: "كجم/فدان" }, help: { en: "From soil analysis. Wheat N=60-80, Corn N=120-150, Cotton N=80-100, Rice N=70-90", ar: "من تحليل التربة. قمح N=60-80، ذرة N=120-150، قطن N=80-100، أرز N=70-90" } },
      {
        key: "fertilizer",
        names: { en: "Fertilizer type", ar: "نوع السماد" },
        type: "select",
        default: "urea",
        options: [
          { value: "urea", label: { en: "Urea (46% N)", ar: "يوريا (46% N)" } },
          { value: "ammonium_nitrate", label: { en: "Ammonium Nitrate (33.5% N)", ar: "نترات أمونيوم (33.5% N)" } },
          { value: "ammonium_sulfate", label: { en: "Ammonium Sulfate (20.6% N)", ar: "سلفات أمونيوم (20.6% N)" } },
          { value: "superphosphate", label: { en: "Single Superphosphate (15% P₂O₅)", ar: "سوبر فوسفات أحادي (15% P₂O₅)" } },
          { value: "triple_super", label: { en: "Triple Superphosphate (46% P₂O₅)", ar: "سوبر فوسفات ثلاثي (46% P₂O₅)" } },
          { value: "dap", label: { en: "DAP (18% N, 46% P₂O₅)", ar: "DAP (18% N، 46% P₂O₅)" } },
          { value: "mop", label: { en: "Muriate of Potash (60% K₂O)", ar: "كلوريد بوتاسيوم (60% K₂O)" } },
          { value: "sop", label: { en: "Sulfate of Potash (50% K₂O)", ar: "سلفات بوتاسيوم (50% K₂O)" } },
          { value: "npk_19_19_19", label: { en: "NPK 19-19-19", ar: "NPK 19-19-19" } },
          { value: "custom", label: { en: "Custom", ar: "مخصص" } },
        ],
      },
      { key: "nutrientPct", names: { en: "Nutrient content (%)", ar: "محتوى العنصر (%)" }, type: "number", default: 46, min: 1, max: 100, help: { en: "Urea=46, Am.Nitrate=33.5, Am.Sulfate=20.6, Super=15, Triple=46, MOP=60, SOP=50", ar: "يوريا=46، نترات=33.5، سلفات=20.6، سوبر=15، ثلاثي=46، كلوريد بوتاسيوم=60، سلفات بوتاسيوم=50" } },
    ],
    compute: (v) => {
      const areaUnit = String(v.areaUnit ?? "feddan");
      const area = num(v.area);
      const rec = num(v.recommendation); // kg per feddan
      const pct = num(v.nutrientPct) / 100;
      if ([area, rec, pct].some(Number.isNaN) || area <= 0 || rec <= 0 || pct <= 0)
        return { results: [], error: { en: "Enter valid values", ar: "أدخل قيمًا صالحة" } };

      // Convert area to feddan equivalent
      const m2 = areaToM2(area, areaUnit);
      const feddanEquiv = m2 / 4200;
      const fertilizerPerFeddan = rec / pct;
      const totalFertilizer = fertilizerPerFeddan * feddanEquiv;
      const bags50 = Math.ceil(totalFertilizer / 50);
      const bags25 = Math.ceil(totalFertilizer / 25);
      const unitLabel = AREA_UNIT_LABELS[areaUnit];

      return {
        results: [
          { label: { en: `Fertilizer per ${unitLabel.en}`, ar: `السماد لكل ${unitLabel.ar}` }, value: fmt(fertilizerPerFeddan, 1) + " kg", primary: true },
          { label: { en: "Total fertilizer needed", ar: "إجمالي السماد المطلوب" }, value: fmt(totalFertilizer, 1) + " kg", primary: true },
          { label: { en: "In 50 kg bags", ar: "بأكياس 50 كجم" }, value: fmt(bags50, 0) + " bags" },
          { label: { en: "In 25 kg bags", ar: "بأكياس 25 كجم" }, value: fmt(bags25, 0) + " bags" },
          { label: { en: "Total area", ar: "إجمالي المساحة" }, value: `${fmt(area, 2)} ${unitLabel.en} (${fmt(m2, 0)} m² = ${fmt(feddanEquiv, 4)} feddan)` },
        ],
        formula: `Per ${unitLabel.en} = ${rec} ÷ ${pct * 100}% = ${fmt(fertilizerPerFeddan, 1)} kg; Total = ${fmt(fertilizerPerFeddan, 1)} × ${fmt(feddanEquiv, 4)} = ${fmt(totalFertilizer, 1)} kg`,
        steps: [
          { description: { en: `Area = ${fmt(area, 2)} ${unitLabel.en} = ${fmt(feddanEquiv, 4)} feddan`, ar: `المساحة = ${fmt(area, 2)} ${unitLabel.ar} = ${fmt(feddanEquiv, 4)} فدان` } },
          { description: { en: `Fertilizer/${unitLabel.en} = ${rec} ÷ ${pct} = ${fmt(fertilizerPerFeddan, 1)} kg`, ar: `السماد/${unitLabel.ar} = ${rec} ÷ ${pct} = ${fmt(fertilizerPerFeddan, 1)} كجم` } },
          { description: { en: `Total = ${fmt(fertilizerPerFeddan, 1)} × ${fmt(feddanEquiv, 4)} = ${fmt(totalFertilizer, 1)} kg`, ar: `الإجمالي = ${fmt(fertilizerPerFeddan, 1)} × ${fmt(feddanEquiv, 4)} = ${fmt(totalFertilizer, 1)} كجم` } },
        ],
        explanation: {
          en: "Recommendations are in kg of nutrient per feddan. To find actual fertilizer, divide by nutrient %. The total adapts to your area unit automatically. Example: 80 kg N with urea (46%) = 173.9 kg urea/feddan. For 2 feddan = 347.8 kg total.",
          ar: "التوصيات بـ كجم عنصر للفدان. لمعرفة السماد الفعلي، اقسم على نسبة العنصر. الإجمالي يتكيف مع وحدة مساحتك تلقائيًا. مثال: 80 كجم N بيوريا (46%) = 173.9 كجم يوريا/فدان. لـ 2 فدان = 347.8 كجم.",
        },
      };
    },
  },

  // -------------------------------------------------------------------------
  // Pesticide / Spray Calculator
  // -------------------------------------------------------------------------
  {
    id: "agri-pesticide",
    category: "agriculture",
    names: { en: "Pesticide Spray Calculator", ar: "حاسبة رش المبيدات" },
    descriptions: {
      en: "Calculate pesticide amount and water volume for spraying per area.",
      ar: "احسب كمية المبيد وحجم الماء للرش للمساحة.",
    },
    keywords: ["pesticide", "spray", "insecticide", "fungicide", "herbicide", "مبيد", "رش"],
    icon: "Bug",
    live: true,
    fields: [
      AREA_FIELD,
      { key: "area", names: { en: "Area to spray", ar: "المساحة المراد رشها" }, type: "number", default: 1, help: { en: "Enter the area in the unit selected above", ar: "أدخل المساحة بالوحدة المختارة بالأعلى" } },
      { key: "rate", names: { en: "Recommended rate", ar: "معدل الاستخدام" }, type: "number", default: 1, unit: { en: "L or kg/feddan", ar: "لتر أو كجم/فدان" }, help: { en: "From pesticide label. e.g. 1 L/feddan, 750 mL/feddan, 0.5 kg/feddan", ar: "من ملصق المبيد. مثال: 1 لتر/فدان، 750 مل/فدان، 0.5 كجم/فدان" } },
      { key: "waterRate", names: { en: "Water volume", ar: "حجم الماء" }, type: "number", default: 200, unit: { en: "L/feddan", ar: "لتر/فدان" }, help: { en: "Ground sprayer=200L, Aerial=40-60L, Knapsack=100-200L, Fogger=10-20L", ar: "أرضي=200لتر، جوي=40-60لتر، ظهري=100-200لتر، ضبابي=10-20لتر" } },
    ],
    compute: (v) => {
      const areaUnit = String(v.areaUnit ?? "feddan");
      const area = num(v.area);
      const rate = num(v.rate);
      const water = num(v.waterRate);
      if ([area, rate, water].some(Number.isNaN) || area <= 0 || rate <= 0 || water <= 0)
        return { results: [], error: { en: "Enter valid positive values", ar: "أدخل قيمًا موجبة" } };

      const m2 = areaToM2(area, areaUnit);
      const feddanEquiv = m2 / 4200;
      const totalPesticide = rate * feddanEquiv;
      const totalWater = water * feddanEquiv;
      const pesticidePer100L = (rate / water) * 100;
      const pesticidePer20L = (rate / water) * 20;
      const unitLabel = AREA_UNIT_LABELS[areaUnit];

      return {
        results: [
          { label: { en: `Pesticide per ${unitLabel.en}`, ar: `المبيد لكل ${unitLabel.ar}` }, value: fmt(rate, 3) + " L/kg", primary: true },
          { label: { en: "Total pesticide needed", ar: "إجمالي المبيد" }, value: fmt(totalPesticide, 3) + " L/kg", primary: true },
          { label: { en: "Total water needed", ar: "إجمالي الماء" }, value: fmt(totalWater, 0) + " L" },
          { label: { en: "Per 100 L water", ar: "لكل 100 لتر ماء" }, value: fmt(pesticidePer100L, 3) + " L/kg" },
          { label: { en: "Per 20 L knapsack", ar: "لكل 20 لتر (ظهري)" }, value: fmt(pesticidePer20L, 3) + " L/kg" },
          { label: { en: "Total area", ar: "إجمالي المساحة" }, value: `${fmt(area, 2)} ${unitLabel.en} (${fmt(feddanEquiv, 4)} feddan)` },
        ],
        formula: `Per ${unitLabel.en} = ${rate} L/kg; Total = ${rate} × ${fmt(feddanEquiv, 4)} = ${fmt(totalPesticide, 3)} L/kg; Water = ${water} × ${fmt(feddanEquiv, 4)} = ${fmt(totalWater, 0)} L`,
        steps: [
          { description: { en: `Area = ${fmt(area, 2)} ${unitLabel.en} = ${fmt(feddanEquiv, 4)} feddan`, ar: `المساحة = ${fmt(area, 2)} ${unitLabel.ar} = ${fmt(feddanEquiv, 4)} فدان` } },
          { description: { en: `Total pesticide = ${rate} × ${fmt(feddanEquiv, 4)} = ${fmt(totalPesticide, 3)} L/kg`, ar: `إجمالي المبيد = ${rate} × ${fmt(feddanEquiv, 4)} = ${fmt(totalPesticide, 3)} لتر/كجم` } },
          { description: { en: `Total water = ${water} × ${fmt(feddanEquiv, 4)} = ${fmt(totalWater, 0)} L`, ar: `إجمالي الماء = ${water} × ${fmt(feddanEquiv, 4)} = ${fmt(totalWater, 0)} لتر` } },
        ],
        explanation: {
          en: "Always read the pesticide label for the correct rate. The rate is given per feddan — the total adapts to your area unit. Wear protective equipment. Re-entry interval: 24-48 hours. Pre-harvest interval: check label (7-21 days).",
          ar: "اقرأ دائمًا ملصق المبيد. المعدل يُعطى للفدان — الإجمالي يتكيف مع وحدة مساحتك. ارتدِ معدات الوقاية. فترة إعادة الدخول: 24-48 ساعة. فترة ما قبل الحصاد: راجع الملصق (7-21 يوم).",
        },
      };
    },
  },

  // -------------------------------------------------------------------------
  // Irrigation Water Calculator
  // -------------------------------------------------------------------------
  {
    id: "agri-irrigation",
    category: "agriculture",
    names: { en: "Irrigation Water Calculator", ar: "حاسبة ماء الري" },
    descriptions: {
      en: "Calculate irrigation water volume and duration based on crop water requirement and irrigation system.",
      ar: "احسب حجم ماء الري والمدة بناءً على احتياج المحصول ونظام الري.",
    },
    keywords: ["irrigation", "water", "drip", "sprinkler", "flood", "ري", "ماء", "تنقيط"],
    icon: "Droplets",
    live: true,
    fields: [
      AREA_FIELD,
      { key: "area", names: { en: "Area to irrigate", ar: "المساحة المطلوب ريهّا" }, type: "number", default: 1, help: { en: "Enter the area in the unit selected above", ar: "أدخل المساحة بالوحدة المختارة بالأعلى" } },
      { key: "eto", names: { en: "Daily water need (ETc)", ar: "الاحتياج اليومي (ETc)" }, type: "number", default: 6, unit: { en: "mm/day", ar: "مم/يوم" }, help: { en: "Summer=6-8mm, Winter=3-5mm, Tomatoes=5-7mm, Citrus=4-6mm", ar: "صيفي=6-8مم، شتوي=3-5مم، طماطم=5-7مم، حمضيات=4-6مم" } },
      {
        key: "system",
        names: { en: "Irrigation system", ar: "نظام الري" },
        type: "select",
        default: "drip",
        options: [
          { value: "drip", label: { en: "Drip (90% efficiency) — تنقيط", ar: "تنقيط (كفاءة 90%)" } },
          { value: "sprinkler", label: { en: "Sprinkler (75%) — رشاشات", ar: "رشاشات (75%)" } },
          { value: "flood", label: { en: "Flood/Furrow (60%) — غمر", ar: "غمر (60%)" } },
        ],
      },
      { key: "interval", names: { en: "Irrigation interval", ar: "فترة الري" }, type: "number", default: 3, unit: { en: "days", ar: "يوم" }, help: { en: "Drip=1-3 days, Sprinkler=3-5 days, Flood=7-14 days", ar: "تنقيط=1-3 أيام، رشاشات=3-5 أيام، غمر=7-14 يوم" } },
      { key: "flowRate", names: { en: "System flow rate", ar: "معدل تدفق النظام" }, type: "number", default: 50, unit: { en: "m³/hour", ar: "م³/ساعة" }, help: { en: "For drip: ~20-50 m³/hr per feddan", ar: "للتنقيط: ~20-50 م³/ساعة للفدان" } },
    ],
    compute: (v) => {
      const areaUnit = String(v.areaUnit ?? "feddan");
      const area = num(v.area);
      const eto = num(v.eto);
      const interval = num(v.interval);
      const flowRate = num(v.flowRate);
      if ([area, eto, interval, flowRate].some(Number.isNaN) || area <= 0 || eto <= 0 || interval <= 0 || flowRate <= 0)
        return { results: [], error: { en: "Enter valid positive values", ar: "أدخل قيمًا موجبة" } };

      const efficiency: Record<string, number> = { drip: 0.9, sprinkler: 0.75, flood: 0.6 };
      const eff = efficiency[String(v.system)] ?? 0.9;
      const m2 = areaToM2(area, areaUnit);
      const feddanEquiv = m2 / 4200;
      // 1 mm over 1 feddan (4200 m²) = 4.2 m³
      const waterPerIrrigation = (eto * interval * 4.2 * feddanEquiv) / eff;
      const waterPerDay = (eto * 4.2 * feddanEquiv) / eff;
      const irrigationHours = waterPerIrrigation / flowRate;
      const unitLabel = AREA_UNIT_LABELS[areaUnit];

      return {
        results: [
          { label: { en: `Water per irrigation`, ar: `ماء كل رية` }, value: fmt(waterPerIrrigation, 1) + " m³", primary: true },
          { label: { en: "Daily water need", ar: "الاحتياج اليومي" }, value: fmt(waterPerDay, 1) + " m³/day" },
          { label: { en: "Irrigation duration", ar: "مدة الري" }, value: fmt(irrigationHours, 1) + " hours", primary: true },
          { label: { en: "Per irrigation (liters)", ar: "كل رية (لتر)" }, value: fmt(waterPerIrrigation * 1000, 0) + " L" },
          { label: { en: "Season total (120 days)", ar: "إجمالي الموسم (120 يوم)" }, value: fmt(waterPerDay * 120, 0) + " m³" },
          { label: { en: "Total area", ar: "إجمالي المساحة" }, value: `${fmt(area, 2)} ${unitLabel.en} (${fmt(feddanEquiv, 4)} feddan)` },
        ],
        formula: `Water = ${eto}mm × ${interval}d × 4.2 × ${fmt(feddanEquiv, 4)} ÷ ${eff} = ${fmt(waterPerIrrigation, 1)} m³`,
        steps: [
          { description: { en: `Area = ${fmt(area, 2)} ${unitLabel.en} = ${fmt(feddanEquiv, 4)} feddan`, ar: `المساحة = ${fmt(area, 2)} ${unitLabel.ar} = ${fmt(feddanEquiv, 4)} فدان` } },
          { description: { en: `Net = ${eto} × ${interval} = ${fmt(eto * interval, 1)} mm`, ar: `الصافي = ${eto} × ${interval} = ${fmt(eto * interval, 1)} مم` } },
          { description: { en: `Gross = ${fmt((eto * interval) / eff, 1)} mm × ${fmt(feddanEquiv, 4)} = ${fmt(waterPerIrrigation, 1)} m³`, ar: `الإجمالي = ${fmt((eto * interval) / eff, 1)} مم × ${fmt(feddanEquiv, 4)} = ${fmt(waterPerIrrigation, 1)} م³` } },
          { description: { en: `Duration = ${fmt(waterPerIrrigation, 1)} ÷ ${flowRate} = ${fmt(irrigationHours, 1)} hr`, ar: `المدة = ${fmt(waterPerIrrigation, 1)} ÷ ${flowRate} = ${fmt(irrigationHours, 1)} ساعة` } },
        ],
        explanation: {
          en: "1 mm water over 1 feddan = 4.2 m³. Drip saves 30-50% vs flood. Best time: early morning (5-8 AM). The total adapts to your area unit.",
          ar: "1 مم على فدان = 4.2 م³. التنقيط يوفر 30-50% مقارنة بالغمر. أفضل وقت: الصباح الباكر (5-8 ص). الإجمالي يتكيف مع وحدة مساحتك.",
        },
      };
    },
  },

  // -------------------------------------------------------------------------
  // Crop Yield & Productivity
  // -------------------------------------------------------------------------
  {
    id: "agri-yield",
    category: "agriculture",
    names: { en: "Crop Yield Calculator", ar: "حاسبة إنتاجية المحصول" },
    descriptions: {
      en: "Calculate crop yield per area and total production with expected revenue.",
      ar: "احسب إنتاجية المحصول للمساحة والإنتاج الكلي مع الإيراد المتوقع.",
    },
    keywords: ["yield", "production", "harvest", "revenue", "إنتاج", "محصول", "حصاد"],
    icon: "Wheat",
    live: true,
    fields: [
      AREA_FIELD,
      { key: "area", names: { en: "Total area", ar: "إجمالي المساحة" }, type: "number", default: 10, help: { en: "Enter the area in the unit selected above", ar: "أدخل المساحة بالوحدة المختارة بالأعلى" } },
      {
        key: "crop",
        names: { en: "Crop", ar: "المحصول" },
        type: "select",
        default: "wheat",
        options: [
          { value: "wheat", label: { en: "Wheat (قمح)", ar: "قمح" } },
          { value: "corn", label: { en: "Corn (ذرة)", ar: "ذرة" } },
          { value: "rice", label: { en: "Rice (أرز)", ar: "أرز" } },
          { value: "cotton", label: { en: "Cotton (قطن)", ar: "قطن" } },
          { value: "tomato", label: { en: "Tomato (طماطم)", ar: "طماطم" } },
          { value: "potato", label: { en: "Potato (بطاطس)", ar: "بطاطس" } },
          { value: "sunflower", label: { en: "Sunflower (عباد الشمس)", ar: "عباد الشمس" } },
          { value: "custom", label: { en: "Custom", ar: "مخصص" } },
        ],
      },
      { key: "yieldPerFeddan", names: { en: "Yield per feddan", ar: "الإنتاج للفدان" }, type: "number", default: 2400, unit: { en: "kg/feddan", ar: "كجم/فدان" }, help: { en: "Wheat=2400, Corn=3000, Rice=3500, Cotton=1200, Tomato=30000, Potato=20000", ar: "قمح=2400، ذرة=3000، أرز=3500، قطن=1200، طماطم=30000، بطاطس=20000" } },
      { key: "price", names: { en: "Selling price", ar: "سعر البيع" }, type: "number", default: 12, unit: { en: "per kg", ar: "لكل كجم" } },
    ],
    compute: (v) => {
      const areaUnit = String(v.areaUnit ?? "feddan");
      const area = num(v.area);
      const yieldPerFeddan = num(v.yieldPerFeddan);
      const price = num(v.price);
      if ([area, yieldPerFeddan, price].some(Number.isNaN) || area <= 0 || yieldPerFeddan <= 0 || price <= 0)
        return { results: [], error: { en: "Enter valid positive values", ar: "أدخل قيمًا موجبة" } };

      const m2 = areaToM2(area, areaUnit);
      const feddanEquiv = m2 / 4200;
      const yieldPerUnit = yieldPerFeddan * (4200 / (TO_M2[areaUnit] ?? 4200));
      const totalYield = yieldPerFeddan * feddanEquiv;
      const revenue = totalYield * price;
      const unitLabel = AREA_UNIT_LABELS[areaUnit];

      return {
        results: [
          { label: { en: `Yield per ${unitLabel.en}`, ar: `الإنتاج لكل ${unitLabel.ar}` }, value: fmt(yieldPerUnit, 0) + " kg", primary: true },
          { label: { en: "Total production", ar: "إجمالي الإنتاج" }, value: fmt(totalYield, 0) + " kg (" + fmt(totalYield / 1000, 2) + " tons)", primary: true },
          { label: { en: "Expected revenue", ar: "الإيراد المتوقع" }, value: fmt(revenue, 0) + " currency" },
          { label: { en: "Revenue per feddan", ar: "الإيراد للفدان" }, value: fmt(yieldPerFeddan * price, 0) + " currency" },
          { label: { en: "Total area", ar: "إجمالي المساحة" }, value: `${fmt(area, 2)} ${unitLabel.en} (${fmt(feddanEquiv, 4)} feddan)` },
        ],
        formula: `Yield/${unitLabel.en} = ${fmt(yieldPerUnit, 0)} kg; Total = ${fmt(yieldPerFeddan, 0)} × ${fmt(feddanEquiv, 4)} = ${fmt(totalYield, 0)} kg; Revenue = ${fmt(totalYield, 0)} × ${price} = ${fmt(revenue, 0)}`,
        steps: [
          { description: { en: `Area = ${fmt(area, 2)} ${unitLabel.en} = ${fmt(feddanEquiv, 4)} feddan`, ar: `المساحة = ${fmt(area, 2)} ${unitLabel.ar} = ${fmt(feddanEquiv, 4)} فدان` } },
          { description: { en: `Yield/${unitLabel.en} = ${fmt(yieldPerUnit, 0)} kg`, ar: `الإنتاج/${unitLabel.ar} = ${fmt(yieldPerUnit, 0)} كجم` } },
          { description: { en: `Total = ${fmt(yieldPerFeddan, 0)} × ${fmt(feddanEquiv, 4)} = ${fmt(totalYield, 0)} kg`, ar: `الإجمالي = ${fmt(yieldPerFeddan, 0)} × ${fmt(feddanEquiv, 4)} = ${fmt(totalYield, 0)} كجم` } },
          { description: { en: `Revenue = ${fmt(totalYield, 0)} × ${price} = ${fmt(revenue, 0)}`, ar: `الإيراد = ${fmt(totalYield, 0)} × ${price} = ${fmt(revenue, 0)}` } },
        ],
        explanation: {
          en: "Yield varies with variety, soil, irrigation, and management. The yield is entered per feddan but results show per your selected unit and total. 1 ardab (wheat) ≈ 150 kg, (rice) ≈ 145 kg.",
          ar: "الإنتاج يختلف حسب الصنف، التربة، الري، والإدارة. يُدخل الإنتاج للفدان لكن النتائج تظهر لوحدتك والإجمالي. 1 أردب (قمح) ≈ 150 كجم، (أرز) ≈ 145 كجم.",
        },
      };
    },
  },

  // -------------------------------------------------------------------------
  // Plant Population Density
  // -------------------------------------------------------------------------
  {
    id: "agri-plant-density",
    category: "agriculture",
    names: { en: "Plant Population Density", ar: "كثافة النباتات" },
    descriptions: {
      en: "Calculate plant population per feddan, hectare, and acre from spacing.",
      ar: "احسب كثافة النباتات للفدان، الهكتار، والأكر من المسافات.",
    },
    keywords: ["plant", "population", "density", "spacing", "كثافة", "نباتات"],
    icon: "Grid2x2",
    live: true,
    fields: [
      { key: "plantSpacing", names: { en: "Plant spacing", ar: "المسافة بين النباتات" }, type: "number", default: 25, unit: { en: "cm", ar: "سم" } },
      { key: "rowSpacing", names: { en: "Row spacing", ar: "المسافة بين الصفوف" }, type: "number", default: 70, unit: { en: "cm", ar: "سم" } },
    ],
    compute: (v) => {
      const ps = num(v.plantSpacing);
      const rs = num(v.rowSpacing);
      if ([ps, rs].some(Number.isNaN) || ps <= 0 || rs <= 0)
        return { results: [], error: { en: "Enter valid spacing", ar: "أدخل مسافات صالحة" } };

      const areaPerPlantM2 = (ps * rs) / 10000;
      const perFeddan = Math.floor(4200 / areaPerPlantM2);
      const perHectare = Math.floor(10000 / areaPerPlantM2);
      const perAcre = Math.floor(4046.86 / areaPerPlantM2);

      return {
        results: [
          { label: { en: "Plants per feddan", ar: "نباتات للفدان" }, value: fmt(perFeddan, 0) + " plants", primary: true },
          { label: { en: "Plants per hectare", ar: "نباتات للهكتار" }, value: fmt(perHectare, 0) + " plants/ha" },
          { label: { en: "Plants per acre", ar: "نباتات للأكر" }, value: fmt(perAcre, 0) + " plants/acre" },
          { label: { en: "Area per plant", ar: "مساحة النبات" }, value: fmt(areaPerPlantM2, 4) + " m²" },
        ],
        formula: `Density = area ÷ (plant spacing × row spacing) = 4200 ÷ (${ps}×${rs}/10000) = ${fmt(perFeddan, 0)}`,
        steps: [
          { description: { en: `Area per plant = ${ps}cm × ${rs}cm = ${fmt(areaPerPlantM2, 4)} m²`, ar: `مساحة النبات = ${ps}سم × ${rs}سم = ${fmt(areaPerPlantM2, 4)} م²` } },
          { description: { en: `Per feddan = 4200 ÷ ${fmt(areaPerPlantM2, 4)} = ${fmt(perFeddan, 0)}`, ar: `للفدان = 4200 ÷ ${fmt(areaPerPlantM2, 4)} = ${fmt(perFeddan, 0)}` } },
        ],
        explanation: {
          en: "Corn: 24,000-28,000/feddan. Cotton: 28,000-33,000. Wheat: 2-3 million (drill). Tomato: 8,000-10,000. Too dense = competition, disease; too sparse = weeds, low yield.",
          ar: "ذرة: 24000-28000/فدان. قطن: 28000-33000. قمح: 2-3 مليون (عفير). طماطم: 8000-10000. كثافة عالية = منافسة، مرض؛ منخفضة = حشائش، إنتاج قليل.",
        },
      };
    },
  },
];

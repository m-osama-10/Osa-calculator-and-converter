// ============================================================================
// Agriculture & Farming Calculators
// ============================================================================

import type { Calculator } from "../types";
import { num, fmt } from "../calculator-utils";

// Constants
// 1 feddan = 4200 m² = 1.038 acres = 0.42 hectare
// 1 acre = 4047 m² = 0.966 feddan
// 1 hectare = 10000 m² = 2.38 feddan

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
      // Convert to m² first
      const toM2: Record<string, number> = {
        feddan: 4200,
        acre: 4046.86,
        hectare: 10000,
        m2: 1,
        dunam: 1000,
      };
      const m2 = val * toM2[from];
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
          { description: { en: `Convert ${val} ${from} to m²: ${val} × ${toM2[from]} = ${fmt(m2, 0)} m²`, ar: `حوّل ${val} ${from} إلى م²: ${val} × ${toM2[from]} = ${fmt(m2, 0)} م²` } },
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
  // Seeds per Feddan
  // -------------------------------------------------------------------------
  {
    id: "agri-seeds-per-feddan",
    category: "agriculture",
    names: { en: "Seeds per Feddan", ar: "كمية البذور للفدان" },
    descriptions: {
      en: "Calculate seed quantity needed per feddan based on plant spacing, row spacing, and germination rate.",
      ar: "احسب كمية البذور المطلوبة للفدان بناءً على المسافة بين النباتات، المسافة بين الصفوف، ونسبة الإنبات.",
    },
    keywords: ["seeds", "feddan", "planting", "spacing", "بذور", "فدان", "زراعة", "تقaries"],
    icon: "Sprout",
    live: true,
    fields: [
      {
        key: "crop",
        names: { en: "Crop type", ar: "نوع المحصول" },
        type: "select",
        default: "wheat",
        options: [
          { value: "wheat", label: { en: "Wheat (قمح) — drill planting", ar: "قمح — زراعة عفير" } },
          { value: "corn", label: { en: "Corn (ذرة) — hill planting", ar: "ذرة — زراعة جور" } },
          { value: "rice", label: { en: "Rice (أرز) — broadcast", ar: "أرز — زراعة بدار" } },
          { value: "cotton", label: { en: "Cotton (قطن) — hill planting", ar: "قطن — زراعة جور" } },
          { value: "sunflower", label: { en: "Sunflower (عباد الشمس)", ar: "عباد الشمس" } },
          { value: "custom", label: { en: "Custom (enter spacing manually)", ar: "مخصص (أدخل المسافات يدويًا)" } },
        ],
        help: { en: "Choose your crop or enter custom spacing below.", ar: "اختر المحصول أو أدخل المسافات يدويًا." },
      },
      { key: "plantSpacing", names: { en: "Plant spacing (within row)", ar: "المسافة بين النباتات" }, type: "number", default: 15, unit: { en: "cm", ar: "سم" }, help: { en: "Distance between plants in the same row. Wheat=2-3cm, Corn=25cm, Cotton=20cm, Rice=15cm", ar: "المسافة بين النباتات في نفس الصف. قمح=2-3سم، ذرة=25سم، قطن=20سم، أرز=15سم" } },
      { key: "rowSpacing", names: { en: "Row spacing", ar: "المسافة بين الصفوف" }, type: "number", default: 20, unit: { en: "cm", ar: "سم" }, help: { en: "Distance between rows. Wheat=15-20cm, Corn=70cm, Cotton=60cm, Rice=20cm", ar: "المسافة بين الصفوف. قمح=15-20سم، ذرة=70سم، قطن=60سم، أرز=20سم" } },
      { key: "seedsPerHill", names: { en: "Seeds per hill", ar: "بذور لكل جورة" }, type: "number", default: 1, help: { en: "Number of seeds per hole/jore. Corn=2-3, Cotton=3-4, Wheat=1 (drill)", ar: "عدد البذور في الجورة. ذرة=2-3، قطن=3-4، قمح=1 (عفير)" } },
      { key: "germination", names: { en: "Germination rate (%)", ar: "نسبة الإنبات (%)" }, type: "number", default: 90, min: 1, max: 100, help: { en: "What % of seeds will sprout? Usually 85-95% for good quality seeds.", ar: "كم نسبة البذور التي ستنبت؟ عادة 85-95% للبذور الجيدة." } },
      { key: "seedWeight", names: { en: "Weight per 1000 seeds", ar: "وزن 1000 بذرة" }, type: "number", default: 40, unit: { en: "g", ar: "جم" }, help: { en: "Wheat≈40g, Corn≈300g, Rice≈25g, Cotton≈100g, Sunflower≈80g", ar: "قمح≈40جم، ذرة≈300جم، أرز≈25جم، قطن≈100جم، عباد شمس≈80جم" } },
    ],
    compute: (v) => {
      const ps = num(v.plantSpacing);
      const rs = num(v.rowSpacing);
      const sph = num(v.seedsPerHill);
      const germ = num(v.germination) / 100;
      const sw = num(v.seedWeight);
      if ([ps, rs, sph, sw].some(Number.isNaN) || ps <= 0 || rs <= 0 || sph <= 0 || sw <= 0)
        return { results: [], error: { en: "Enter valid positive values", ar: "أدخل قيمًا موجبة" } };

      // Feddan = 4200 m² = 42,000,000 cm²
      const areaCm2 = 4200 * 10000;
      const plantArea = ps * rs; // cm² per plant
      const plantsPerFeddan = Math.floor(areaCm2 / plantArea);
      const hillsPerFeddan = Math.floor(plantsPerFeddan / sph);
      const totalSeeds = Math.ceil(hillsPerFeddan * sph / germ); // account for germination
      const totalWeightG = (totalSeeds * sw) / 1000;
      const totalWeightKg = totalWeightG / 1000;

      // Recommended extra 10-15% for losses
      const recommended = totalWeightKg * 1.15;

      return {
        results: [
          { label: { en: "Plants per feddan", ar: "عدد النباتات للفدان" }, value: fmt(plantsPerFeddan, 0) + " plants", primary: true },
          { label: { en: "Hills (jorat) per feddan", ar: "عدد الجور للفدان" }, value: fmt(hillsPerFeddan, 0) + " hills" },
          { label: { en: "Total seeds needed", ar: "إجمالي البذور المطلوبة" }, value: fmt(totalSeeds, 0) + " seeds", primary: true },
          { label: { en: "Seed weight", ar: "وزن البذور" }, value: fmt(totalWeightKg, 2) + " kg (" + fmt(totalWeightG, 0) + " g)" },
          { label: { en: "Recommended (+15% loss)", ar: "الموصى به (+15% فاقد)" }, value: fmt(recommended, 2) + " kg", help: { en: "", ar: "" } as never },
          { label: { en: "Per acre", ar: "لكل أكر" }, value: fmt(recommended * 0.966, 2) + " kg/acre" },
        ],
        formula: `Plants = 4200 m² ÷ (${ps}cm × ${rs}cm / 10000) = ${fmt(plantsPerFeddan, 0)} → Seeds = ${fmt(totalSeeds, 0)} → ${fmt(totalWeightKg, 2)} kg`,
        steps: [
          { description: { en: `Area per plant = ${ps} cm × ${rs} cm = ${fmt(plantArea, 0)} cm²`, ar: `مساحة النبات = ${ps} سم × ${rs} سم = ${fmt(plantArea, 0)} سم²` } },
          { description: { en: `Plants = 42,000,000 cm² ÷ ${fmt(plantArea, 0)} = ${fmt(plantsPerFeddan, 0)} plants`, ar: `النباتات = 42,000,000 ÷ ${fmt(plantArea, 0)} = ${fmt(plantsPerFeddan, 0)} نبات` } },
          { description: { en: `Seeds = ${fmt(hillsPerFeddan, 0)} hills × ${sph} / ${germ} = ${fmt(totalSeeds, 0)} seeds`, ar: `البذور = ${fmt(hillsPerFeddan, 0)} جورة × ${sph} / ${germ} = ${fmt(totalSeeds, 0)} بذرة` } },
          { description: { en: `Weight = ${fmt(totalSeeds, 0)} × ${sw}g / 1000 = ${fmt(totalWeightKg, 2)} kg`, ar: `الوزن = ${fmt(totalSeeds, 0)} × ${sw}جم / 1000 = ${fmt(totalWeightKg, 2)} كجم` } },
        ],
        explanation: {
          en: "The calculation accounts for germination rate (add extra seeds to compensate for non-sprouting). The 15% extra covers field losses, bird damage, and uneven planting. For broadcast crops (rice, some wheat), the calculation differs — use the recommended rate from seed supplier (typically 50-70 kg/feddan for wheat, 120-150 for rice).",
          ar: "الحساب يراعي نسبة الإنبات (إضافة بذور إضافية لتعويض عدم الإنبات). الـ 15% الإضافية تغطي الفاقد الميداني، أضرار الطيور، والزراعة غير المنتظمة. للمحاصيل البدار (الأرز، بعض القمح)، الحساب مختلف — استخدم المعدل الموصى به من المورد (عادة 50-70 كجم/فدان للقمح، 120-150 للأرز).",
        },
      };
    },
  },

  // -------------------------------------------------------------------------
  // Seedlings per Feddan
  // -------------------------------------------------------------------------
  {
    id: "agri-seedlings",
    category: "agriculture",
    names: { en: "Seedlings per Feddan", ar: "عدد الشتلات للفدان" },
    descriptions: {
      en: "Calculate how many seedlings (transplants) you need per feddan for vegetable and tree crops.",
      ar: "احسب عدد الشتلات المطلوبة للفدان لمحاصيل الخضروات والأشجار.",
    },
    keywords: ["seedlings", "transplants", "nursery", "vegetables", "trees", "شتلات", "مشتل", "خضروات"],
    icon: "TreePine",
    live: true,
    fields: [
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
        help: { en: "Select your crop — spacing is auto-filled. Change spacing if needed.", ar: "اختر المحصول — تُملأ المسافات تلقائيًا. غيّر المسافات حسب الحاجة." },
      },
      { key: "plantSpacing", names: { en: "Plant spacing", ar: "المسافة بين الشتلات" }, type: "number", default: 50, unit: { en: "cm", ar: "سم" }, help: { en: "Tomato=50cm, Pepper=40cm, Cucumber=30cm, Watermelon=100cm, Strawberry=30cm, Orange=500cm, Mango=700cm, Palm=800cm, Olive=600cm", ar: "طماطم=50سم، فلفل=40سم، خيار=30سم، بطيخ=100سم، فراولة=30سم، برتقال=500سم، مانجو=700سم، نخيل=800سم، زيتون=600سم" } },
      { key: "rowSpacing", names: { en: "Row spacing", ar: "المسافة بين الصفوف" }, type: "number", default: 100, unit: { en: "cm", ar: "سم" }, help: { en: "Tomato=100cm, Pepper=80cm, Cucumber=100cm, Watermelon=200cm, Strawberry=100cm, Orange=600cm, Mango=800cm, Palm=800cm, Olive=700cm", ar: "طماطم=100سم، فلفل=80سم، خيار=100سم، بطيخ=200سم، فراولة=100سم، برتقال=600سم، مانجو=800سم، نخيل=800سم، زيتون=700سم" } },
      { key: "extra", names: { en: "Extra seedlings (%)", ar: "شتلات إضافية (%)" }, type: "number", default: 10, help: { en: "Extra seedlings to cover mortality during transplanting. Usually 5-15%.", ar: "شتلات إضافية لتعويض الفاقد أثناء الشتل. عادة 5-15%." } },
    ],
    compute: (v) => {
      const ps = num(v.plantSpacing);
      const rs = num(v.rowSpacing);
      const extra = num(v.extra) / 100;
      if ([ps, rs].some(Number.isNaN) || ps <= 0 || rs <= 0)
        return { results: [], error: { en: "Enter valid positive spacing", ar: "أدخل مسافات موجبة" } };

      const areaCm2 = 4200 * 10000;
      const plantArea = ps * rs;
      const seedlings = Math.floor(areaCm2 / plantArea);
      const withExtra = Math.ceil(seedlings * (1 + extra));
      const perAcre = Math.floor((areaCm2 * 0.966) / plantArea);

      // Seed trays needed (typical tray = 209 cells)
      const traySize = 209;
      const trays = Math.ceil(withExtra / traySize);

      return {
        results: [
          { label: { en: "Seedlings per feddan", ar: "شتلات للفدان" }, value: fmt(seedlings, 0) + " seedlings", primary: true },
          { label: { en: "With extra (+% extra)".replace("%", String(num(v.extra))), ar: "مع الإضافي (+" + num(v.extra) + "%)" }, value: fmt(withExtra, 0) + " seedlings", primary: true },
          { label: { en: "Per acre", ar: "لكل أكر" }, value: fmt(perAcre, 0) + " seedlings" },
          { label: { en: "Nursery trays needed (209-cell)", ar: "صواني المشتل المطلوبة (209 عين)" }, value: fmt(trays, 0) + " trays" },
          { label: { en: "Spacing", ar: "المسافات" }, value: `${ps} × ${rs} cm` },
        ],
        formula: `Seedlings = 4200 m² ÷ (${ps}cm × ${rs}cm / 10000) = ${fmt(seedlings, 0)} → ${fmt(withExtra, 0)} with extra`,
        steps: [
          { description: { en: `Area per seedling = ${ps} × ${rs} = ${fmt(plantArea, 0)} cm² = ${fmt(plantArea / 10000, 2)} m²`, ar: `مساحة الشتلة = ${ps} × ${rs} = ${fmt(plantArea, 0)} سم² = ${fmt(plantArea / 10000, 2)} م²` } },
          { description: { en: `Seedlings = 4200 m² ÷ ${fmt(plantArea / 10000, 2)} m² = ${fmt(seedlings, 0)}`, ar: `الشتلات = 4200 م² ÷ ${fmt(plantArea / 10000, 2)} م² = ${fmt(seedlings, 0)}` } },
          { description: { en: `With extra: ${fmt(seedlings, 0)} × 1.${String(num(v.extra)).padStart(2, "0")} = ${fmt(withExtra, 0)}`, ar: `مع الإضافي: ${fmt(seedlings, 0)} × 1.${String(num(v.extra)).padStart(2, "0")} = ${fmt(withExtra, 0)}` } },
          { description: { en: `Trays = ${fmt(withExtra, 0)} ÷ 209 = ${fmt(trays, 0)} trays`, ar: `الصواني = ${fmt(withExtra, 0)} ÷ 209 = ${fmt(trays, 0)} صينية` } },
        ],
        explanation: {
          en: "Seedlings are transplanted from nursery to field. Spacing depends on crop: vegetables need closer spacing (30-100cm), trees need wider (5-8m). Buy 10% extra to replace dead seedlings. Nursery trays typically have 209 or 84 cells. Tomatoes: ~8000-8400/feddan, Cucumber: ~14000/feddan, Strawberry: ~14000/feddan.",
          ar: "تُشتل الشتلات من المشتل إلى الحقل. المسافات تعتمد على المحصول: الخضروات تحتاج مسافات قريبة (30-100سم)، الأشجار تحتاج أوسع (5-8م). اشترِ 10% إضافية لتعويض الشتلات الميتة. صواني المشتل عادة بها 209 أو 84 عين. الطماطم: ~8000-8400/فدان، الخيار: ~14000/فدان، الفراولة: ~14000/فدان.",
        },
      };
    },
  },

  // -------------------------------------------------------------------------
  // Fertilizer Calculator
  // -------------------------------------------------------------------------
  {
    id: "agri-fertilizer",
    category: "agriculture",
    names: { en: "Fertilizer per Feddan", ar: "الأسمدة للفدان" },
    descriptions: {
      en: "Calculate how much fertilizer to apply per feddan based on NPK recommendation and fertilizer analysis.",
      ar: "احسب كمية السماد المطلوبة للفدان بناءً على توصية NPK وتحليل السماد.",
    },
    keywords: ["fertilizer", "npk", "nitrogen", "phosphorus", "potassium", "سماد", "نيتروجين"],
    icon: "Leaf",
    live: true,
    fields: [
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
          { value: "urea", label: { en: "Urea (46% N) — يوريا", ar: "يوريا (46% N)" } },
          { value: "ammonium_nitrate", label: { en: "Ammonium Nitrate (33.5% N) — نترات أمونيوم", ar: "نترات أمونيوم (33.5% N)" } },
          { value: "ammonium_sulfate", label: { en: "Ammonium Sulfate (20.6% N) — سلفات أمونيوم", ar: "سلفات أمونيوم (20.6% N)" } },
          { value: "superphosphate", label: { en: "Single Superphosphate (15% P₂O₅)", ar: "سوبر فوسفات أحادي (15% P₂O₅)" } },
          { value: "triple_super", label: { en: "Triple Superphosphate (46% P₂O₅)", ar: "سوبر فوسفات ثلاثي (46% P₂O₅)" } },
          { value: "dap", label: { en: "DAP (18% N, 46% P₂O₅)", ar: "DAP (18% N، 46% P₂O₅)" } },
          { value: "mop", label: { en: "Muriate of Potash (60% K₂O) — سلفات بوتاسيوم", ar: "كلوريد بوتاسيوم (60% K₂O)" } },
          { value: "sop", label: { en: "Sulfate of Potash (50% K₂O)", ar: "سلفات بوتاسيوم (50% K₂O)" } },
          { value: "npk_19_19_19", label: { en: "NPK 19-19-19", ar: "NPK 19-19-19" } },
          { value: "custom", label: { en: "Custom (enter % below)", ar: "مخصص (أدخل النسبة)" } },
        ],
        help: { en: "Choose your fertilizer or enter custom nutrient % below.", ar: "اختر السماد أو أدخل النسبة يدويًا." },
      },
      { key: "nutrientPct", names: { en: "Nutrient content in fertilizer (%)", ar: "محتوى العنصر في السماد (%)" }, type: "number", default: 46, min: 1, max: 100, help: { en: "Urea=46% N, Ammonium Nitrate=33.5%, Ammonium Sulfate=20.6%, Superphosphate=15%, Triple Super=46%, MOP=60%, SOP=50%", ar: "يوريا=46%، نترات أمونيوم=33.5%، سلفات أمونيوم=20.6%، سوبر فوسفات=15%، ثلاثي=46%، كلوريد بوتاسيوم=60%، سلفات بوتاسيوم=50%" } },
    ],
    compute: (v) => {
      const rec = num(v.recommendation);
      const pct = num(v.nutrientPct) / 100;
      if ([rec, pct].some(Number.isNaN) || rec <= 0 || pct <= 0)
        return { results: [], error: { en: "Enter valid values", ar: "أدخل قيمًا صالحة" } };

      const fertilizerNeeded = rec / pct;
      const perAcre = fertilizerNeeded * 0.966;
      // In 50kg bags
      const bags50 = Math.ceil(fertilizerNeeded / 50);
      // In 25kg bags
      const bags25 = Math.ceil(fertilizerNeeded / 25);

      return {
        results: [
          { label: { en: "Fertilizer per feddan", ar: "السماد للفدان" }, value: fmt(fertilizerNeeded, 1) + " kg/feddan", primary: true },
          { label: { en: "Per acre", ar: "لكل أكر" }, value: fmt(perAcre, 1) + " kg/acre" },
          { label: { en: "In 50 kg bags", ar: "بأكياس 50 كجم" }, value: fmt(bags50, 0) + " bags" },
          { label: { en: "In 25 kg bags", ar: "بأكياس 25 كجم" }, value: fmt(bags25, 0) + " bags" },
          { label: { en: "Actual nutrient supplied", ar: "العنصر الفعلي المضاف" }, value: fmt(rec, 1) + " kg " + String(v.nutrient) },
        ],
        formula: `Fertilizer = recommendation ÷ nutrient% = ${rec} ÷ ${pct * 100}% = ${fmt(fertilizerNeeded, 1)} kg`,
        steps: [
          { description: { en: `Recommendation = ${rec} kg ${String(v.nutrient)} per feddan`, ar: `التوصية = ${rec} كجم ${String(v.nutrient)} للفدان` } },
          { description: { en: `Fertilizer has ${pct * 100}% ${String(v.nutrient)}`, ar: `السماد يحتوي على ${pct * 100}% ${String(v.nutrient)}` } },
          { description: { en: `Fertilizer needed = ${rec} ÷ ${pct} = ${fmt(fertilizerNeeded, 1)} kg`, ar: `السماد المطلوب = ${rec} ÷ ${pct} = ${fmt(fertilizerNeeded, 1)} كجم` } },
        ],
        explanation: {
          en: "Fertilizer recommendations are given in kg of pure nutrient (N, P₂O₅, or K₂O) per feddan. To find how much actual fertilizer to apply, divide by the nutrient percentage. Example: 80 kg N recommendation with urea (46% N) = 80/0.46 = 173.9 kg urea/feddan. Split application: 1/3 at planting, 1/3 at tillering, 1/3 at booting for wheat.",
          ar: "تُعطى توصيات الأسمدة بـ كجم من العنصر النقي (N أو P₂O₅ أو K₂O) للفدان. لمعرفة كمية السماد الفعلية، اقسم على نسبة العنصر. مثال: توصية 80 كجم N بيوريا (46%) = 80/0.46 = 173.9 كجم يوريا/فدان. التقسيم: 1/3 عند الزراعة، 1/3 عند التفريع، 1/3 عند التزهير للقمح.",
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
      en: "Calculate pesticide amount and water volume for spraying per feddan.",
      ar: "احسب كمية المبيد وحجم الماء للرش للفدان.",
    },
    keywords: ["pesticide", "spray", "insecticide", "fungicide", "herbicide", "مبيد", "رش"],
    icon: "Bug",
    live: true,
    fields: [
      { key: "rate", names: { en: "Recommended rate", ar: "معدل الاستخدام" }, type: "number", default: 1, unit: { en: "L or kg/feddan", ar: "لتر أو كجم/فدان" }, help: { en: "From pesticide label. e.g. 1 L/feddan, 750 mL/feddan, 0.5 kg/feddan", ar: "من ملصق المبيد. مثال: 1 لتر/فدان، 750 مل/فدان، 0.5 كجم/فدان" } },
      { key: "waterRate", names: { en: "Water volume", ar: "حجم الماء" }, type: "number", default: 200, unit: { en: "L/feddan", ar: "لتر/فدان" }, help: { en: "Spray volume per feddan. Ground sprayer=200L, Aerial=40-60L, Knapsack=100-200L, Fogger=10-20L", ar: "حجم الرش للفدان. رشاش أرضي=200لتر، جوي=40-60لتر، ظهرية=100-200لتر، ضبابي=10-20لتر" } },
      { key: "area", names: { en: "Area to spray", ar: "المساحة المراد رشها" }, type: "number", default: 1, unit: { en: "feddan", ar: "فدان" } },
    ],
    compute: (v) => {
      const rate = num(v.rate);
      const water = num(v.waterRate);
      const area = num(v.area);
      if ([rate, water, area].some(Number.isNaN) || rate <= 0 || water <= 0 || area <= 0)
        return { results: [], error: { en: "Enter valid positive values", ar: "أدخل قيمًا موجبة" } };

      const totalPesticide = rate * area;
      const totalWater = water * area;
      const pesticidePer100L = (rate / water) * 100;
      const pesticidePer20L = (rate / water) * 20; // for knapsack sprayer

      return {
        results: [
          { label: { en: "Pesticide needed", ar: "المبيد المطلوب" }, value: fmt(totalPesticide, 3) + " L/kg", primary: true },
          { label: { en: "Water needed", ar: "الماء المطلوب" }, value: fmt(totalWater, 0) + " L", primary: true },
          { label: { en: "Pesticide per 100 L water", ar: "المبيد لكل 100 لتر ماء" }, value: fmt(pesticidePer100L, 3) + " L/kg per 100L" },
          { label: { en: "Per 20 L knapsack sprayer", ar: "لكل 20 لتر (رشاش ظهري)" }, value: fmt(pesticidePer20L, 3) + " L/kg per 20L" },
        ],
        formula: `Total pesticide = ${rate} × ${area} = ${fmt(totalPesticide, 3)}; Concentration = ${rate}/${water} × 100 = ${fmt(pesticidePer100L, 3)} per 100L`,
        steps: [
          { description: { en: `Rate = ${rate} L/kg per feddan, Water = ${water} L/feddan`, ar: `المعدل = ${rate} لتر/كجم للفدان، الماء = ${water} لتر/فدان` } },
          { description: { en: `Total pesticide = ${rate} × ${area} feddan = ${fmt(totalPesticide, 3)} L/kg`, ar: `إجمالي المبيد = ${rate} × ${area} فدان = ${fmt(totalPesticide, 3)} لتر/كجم` } },
          { description: { en: `Total water = ${water} × ${area} = ${fmt(totalWater, 0)} L`, ar: `إجمالي الماء = ${water} × ${area} = ${fmt(totalWater, 0)} لتر` } },
          { description: { en: `Concentration = ${rate} ÷ ${water} × 100 = ${fmt(pesticidePer100L, 3)} per 100L`, ar: `التركيز = ${rate} ÷ ${water} × 100 = ${fmt(pesticidePer100L, 3)} لكل 100 لتر` } },
        ],
        explanation: {
          en: "Always read the pesticide label for the correct rate. Spray early morning or late afternoon to avoid evaporation. Wear protective equipment (gloves, mask, goggles). Don't spray before rain. Re-entry interval: wait at least 24-48 hours after spraying. Pre-harvest interval: check label (usually 7-21 days).",
          ar: "اقرأ دائمًا ملصق المبيد لمعرفة المعدل الصحيح. رش في الصباح الباكر أو المساء لتجنب التبخر. ارتدِ معدات الوقاية (قفازات، كمامة، نظارات). لا ترش قبل المطر. فترة إعادة الدخول: انتظر 24-48 ساعة بعد الرش. فترة ما قبل الحصاد: راجع الملصق (عادة 7-21 يوم).",
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
      ar: "احسب حجم ماء الري والمدة بناءً على احتياج المحصول للماء ونظام الري.",
    },
    keywords: ["irrigation", "water", "drip", "sprinkler", "flood", "ري", "ماء", "تنقيط"],
    icon: "Droplets",
    live: true,
    fields: [
      { key: "eto", names: { en: "Daily water need (ETc)", ar: "الاحتياج اليومي للماء (ETc)" }, type: "number", default: 6, unit: { en: "mm/day", ar: "مم/يوم" }, help: { en: "Evapotranspiration. Summer crops=6-8mm, Winter crops=3-5mm, Tomatoes=5-7mm, Citrus=4-6mm", ar: "التبخر-نتح. محاصيل صيفي=6-8مم، شتوي=3-5مم، طماطم=5-7مم، حمضيات=4-6مم" } },
      { key: "area", names: { en: "Area", ar: "المساحة" }, type: "number", default: 1, unit: { en: "feddan", ar: "فدان" } },
      {
        key: "system",
        names: { en: "Irrigation system", ar: "نظام الري" },
        type: "select",
        default: "drip",
        options: [
          { value: "drip", label: { en: "Drip (90% efficiency) — تنقيط", ar: "تنقيط (كفاءة 90%)" } },
          { value: "sprinkler", label: { en: "Sprinkler (75% efficiency) — رشاشات", ar: "رشاشات (كفاءة 75%)" } },
          { value: "flood", label: { en: "Flood/Furrow (60% efficiency) — غمر", ar: "غمر (كفاءة 60%)" } },
        ],
        help: { en: "Efficiency: Drip=90%, Sprinkler=75%, Flood=60%. Drip saves the most water.", ar: "الكفاءة: تنقيط=90%، رشاشات=75%، غمر=60%. التنقيط يوفر أكبر كمية ماء." },
      },
      { key: "interval", names: { en: "Irrigation interval", ar: "فترة الري" }, type: "number", default: 3, unit: { en: "days", ar: "يوم" }, help: { en: "How often you irrigate. Drip=1-3 days, Sprinkler=3-5 days, Flood=7-14 days", ar: "كم مرة تروي. تنقيط=1-3 أيام، رشاشات=3-5 أيام، غمر=7-14 يوم" } },
      { key: "flowRate", names: { en: "System flow rate", ar: "معدل تدفق النظام" }, type: "number", default: 50, unit: { en: "m³/hour", ar: "م³/ساعة" }, help: { en: "Total flow rate of your irrigation system. For drip: ~20-50 m³/hr per feddan", ar: "إجمالي معدل تدفق نظام الري. للتنقيط: ~20-50 م³/ساعة للفدان" } },
    ],
    compute: (v) => {
      const eto = num(v.eto);
      const area = num(v.area);
      const interval = num(v.interval);
      const flowRate = num(v.flowRate);
      if ([eto, area, interval, flowRate].some(Number.isNaN) || eto <= 0 || area <= 0 || interval <= 0 || flowRate <= 0)
        return { results: [], error: { en: "Enter valid positive values", ar: "أدخل قيمًا موجبة" } };

      const efficiency: Record<string, number> = { drip: 0.9, sprinkler: 0.75, flood: 0.6 };
      const eff = efficiency[String(v.system)] ?? 0.9;

      // Water per irrigation = ETc × interval × area / efficiency
      // 1 mm over 1 feddan (4200 m²) = 4.2 m³
      const waterPerIrrigation = (eto * interval * 4.2 * area) / eff; // m³
      const waterPerDay = (eto * 4.2 * area) / eff; // m³/day
      const irrigationHours = waterPerIrrigation / flowRate; // hours

      return {
        results: [
          { label: { en: "Water per irrigation", ar: "ماء كل رية" }, value: fmt(waterPerIrrigation, 1) + " m³", primary: true },
          { label: { en: "Daily water need", ar: "الاحتياج اليومي" }, value: fmt(waterPerDay, 1) + " m³/day" },
          { label: { en: "Irrigation duration", ar: "مدة الري" }, value: fmt(irrigationHours, 1) + " hours", primary: true },
          { label: { en: "Per irrigation (liters)", ar: "كل رية (لتر)" }, value: fmt(waterPerIrrigation * 1000, 0) + " L" },
          { label: { en: "Season total (120 days)", ar: "إجمالي الموسم (120 يوم)" }, value: fmt(waterPerDay * 120, 0) + " m³" },
        ],
        formula: `Water = ETc × interval × 4.2 × area ÷ efficiency = ${eto} × ${interval} × 4.2 × ${area} ÷ ${eff} = ${fmt(waterPerIrrigation, 1)} m³`,
        steps: [
          { description: { en: `ETc = ${eto} mm/day, interval = ${interval} days`, ar: `ETc = ${eto} مم/يوم، الفترة = ${interval} أيام` } },
          { description: { en: `Net water = ${eto} × ${interval} = ${fmt(eto * interval, 1)} mm`, ar: `صافي الماء = ${eto} × ${interval} = ${fmt(eto * interval, 1)} مم` } },
          { description: { en: `Gross water (÷ ${eff} efficiency) = ${fmt((eto * interval) / eff, 1)} mm = ${fmt(waterPerIrrigation, 1)} m³`, ar: `إجمالي الماء (÷ ${eff} كفاءة) = ${fmt((eto * interval) / eff, 1)} مم = ${fmt(waterPerIrrigation, 1)} م³` } },
          { description: { en: `Duration = ${fmt(waterPerIrrigation, 1)} m³ ÷ ${flowRate} m³/hr = ${fmt(irrigationHours, 1)} hours`, ar: `المدة = ${fmt(waterPerIrrigation, 1)} م³ ÷ ${flowRate} م³/ساعة = ${fmt(irrigationHours, 1)} ساعة` } },
        ],
        explanation: {
          en: "1 mm of water over 1 feddan (4200 m²) = 4.2 m³. The system efficiency accounts for water losses: drip loses 10%, sprinkler 25%, flood 40%. Drip irrigation saves 30-50% water compared to flood. Best time to irrigate: early morning (5-8 AM) to reduce evaporation. Monitor soil moisture with tensiometer or simply check soil at root depth.",
          ar: "1 مم ماء على فدان (4200 م²) = 4.2 م³. كفاءة النظام تراعي الفاقد: تنقيط يفقد 10%، رشاشات 25%، غمر 40%. ري التنقيط يوفر 30-50% من الماء مقارنة بالغمر. أفضل وقت للري: الصباح الباكر (5-8 صباحًا) لتقليل التبخر. راقب رطوبة التربة بمقياس التوردنسيومomter أو افحص التربة عند عمق الجذر.",
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
      en: "Calculate crop yield per feddan, per hectare, and total production with expected revenue.",
      ar: "احسب إنتاجية المحصول للفدان، للهكتار، والإنتاج الكلي مع الإيراد المتوقع.",
    },
    keywords: ["yield", "production", "harvest", "revenue", "إنتاج", "محصول", "حصاد"],
    icon: "Wheat",
    live: true,
    fields: [
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
        help: { en: "Average yields (kg/feddan): Wheat=2400, Corn=3000, Rice=3500, Cotton=1200, Tomato=30000, Potato=20000", ar: "متوسط الإنتاج (كجم/فدان): قمح=2400، ذرة=3000، أرز=3500، قطن=1200، طماطم=30000، بطاطس=20000" },
      },
      { key: "yieldPerFeddan", names: { en: "Yield per feddan", ar: "الإنتاج للفدان" }, type: "number", default: 2400, unit: { en: "kg/feddan", ar: "كجم/فدان" } },
      { key: "area", names: { en: "Total area", ar: "إجمالي المساحة" }, type: "number", default: 10, unit: { en: "feddan", ar: "فدان" } },
      { key: "price", names: { en: "Selling price", ar: "سعر البيع" }, type: "number", default: 12, unit: { en: "EGP/kg (or your currency)", ar: "جنيه/كجم (أو عملتك)" } },
    ],
    compute: (v) => {
      const yieldPerFeddan = num(v.yieldPerFeddan);
      const area = num(v.area);
      const price = num(v.price);
      if ([yieldPerFeddan, area, price].some(Number.isNaN) || yieldPerFeddan <= 0 || area <= 0 || price <= 0)
        return { results: [], error: { en: "Enter valid positive values", ar: "أدخل قيمًا موجبة" } };

      const totalYield = yieldPerFeddan * area;
      const yieldPerAcre = yieldPerFeddan * 0.966;
      const yieldPerHectare = yieldPerFeddan * 2.381;
      const revenue = totalYield * price;
      const yieldPerTon = totalYield / 1000;

      return {
        results: [
          { label: { en: "Total production", ar: "إجمالي الإنتاج" }, value: fmt(yieldPerTon, 2) + " tons (" + fmt(totalYield, 0) + " kg)", primary: true },
          { label: { en: "Yield per feddan", ar: "الإنتاج للفدان" }, value: fmt(yieldPerFeddan, 0) + " kg/feddan" },
          { label: { en: "Yield per acre", ar: "الإنتاج للأكر" }, value: fmt(yieldPerAcre, 0) + " kg/acre" },
          { label: { en: "Yield per hectare", ar: "الإنتاج للهكتار" }, value: fmt(yieldPerHectare, 0) + " kg/ha" },
          { label: { en: "Expected revenue", ar: "الإيراد المتوقع" }, value: fmt(revenue, 0) + " " + (String(v.crop) === "wheat" ? "EGP" : "currency"), primary: true },
          { label: { en: "Revenue per feddan", ar: "الإيراد للفدان" }, value: fmt(yieldPerFeddan * price, 0) + " currency" },
        ],
        formula: `Total = ${yieldPerFeddan} × ${area} = ${fmt(totalYield, 0)} kg; Revenue = ${fmt(totalYield, 0)} × ${price} = ${fmt(revenue, 0)}`,
        steps: [
          { description: { en: `Yield/feddan = ${fmt(yieldPerFeddan, 0)} kg`, ar: `الإنتاج/فدان = ${fmt(yieldPerFeddan, 0)} كجم` } },
          { description: { en: `Total = ${fmt(yieldPerFeddan, 0)} × ${area} feddan = ${fmt(totalYield, 0)} kg = ${fmt(yieldPerTon, 2)} tons`, ar: `الإجمالي = ${fmt(yieldPerFeddan, 0)} × ${area} فدان = ${fmt(totalYield, 0)} كجم = ${fmt(yieldPerTon, 2)} طن` } },
          { description: { en: `Revenue = ${fmt(totalYield, 0)} kg × ${price}/kg = ${fmt(revenue, 0)}`, ar: `الإيراد = ${fmt(totalYield, 0)} كجم × ${price}/كجم = ${fmt(revenue, 0)}` } },
        ],
        explanation: {
          en: "Yield varies with variety, soil, irrigation, fertilization, and pest control. Good wheat yields: 2400-3000 kg/feddan. Excellent: 3000-4000. Tomato can reach 40,000+ kg/feddan with good management. To convert kg to ardab (for wheat): 1 ardab ≈ 150 kg. For rice: 1 ardab ≈ 145 kg.",
          ar: "الإنتاج يختلف حسب الصنف، التربة، الري، التسميد، ومكافحة الآفات. إنتاج القمح الجيد: 2400-3000 كجم/فدان. الممتاز: 3000-4000. الطماطم قد تصل 40000+ كجم/فدان بإدارة جيدة. لتحويل كجم إلى أردب (للقمح): 1 أردب ≈ 150 كجم. للأرز: 1 أردب ≈ 145 كجم.",
        },
      };
    },
  },

  // -------------------------------------------------------------------------
  // Planting Density Calculator
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
          { description: { en: `Area per plant = ${ps}cm × ${rs}cm = ${fmt(ps * rs, 0)} cm² = ${fmt(areaPerPlantM2, 4)} m²`, ar: `مساحة النبات = ${ps}سم × ${rs}سم = ${fmt(areaPerPlantM2, 4)} م²` } },
          { description: { en: `Per feddan = 4200 ÷ ${fmt(areaPerPlantM2, 4)} = ${fmt(perFeddan, 0)}`, ar: `للفدان = 4200 ÷ ${fmt(areaPerPlantM2, 4)} = ${fmt(perFeddan, 0)}` } },
        ],
        explanation: {
          en: "Plant density affects yield, competition, and management. Higher density = more plants but smaller individual. Corn: 24,000-28,000/feddan. Cotton: 28,000-33,000. Wheat: 2-3 million (drill). Tomato: 8,000-10,000. Too dense = competition, disease; too sparse = weeds, low yield.",
          ar: "كثافة النباتات تؤثر على الإنتاج، المنافسة، والإدارة. كثافة أعلى = نباتات أكثر لكن أصغر. ذرة: 24000-28000/فدان. قطن: 28000-33000. قمح: 2-3 مليون (عفير). طماطم: 8000-10000. كثافة عالية جدًا = منافسة، مرض؛ منخفضة جدًا = حشائش، إنتاج قليل.",
        },
      };
    },
  },
];

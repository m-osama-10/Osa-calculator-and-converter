// ============================================================================
// Safe Home Experiments — calculators for household chemistry experiments
// ============================================================================

import type { Calculator } from "../types";
import { num, fmt, fmtSci } from "../calculator-utils";

export const homeExperimentCalculators: Calculator[] = [
  // Saltwater Solution (various concentrations)
  {
    id: "home-salt-solution",
    category: "home-experiments",
    names: { en: "Salt Solution Maker", ar: "مُحضّر محلول ملحي" },
    descriptions: {
      en: "Calculate how much table salt (NaCl) and water you need to make a salt solution of any concentration. Great for brine, saline, or density experiments.",
      ar: "احسب كمية ملح الطعام (NaCl) والماء اللازمة لتحضير محلول ملحي بأي تركيز. مثالي للملح والمحلول الملحي أو تجارب الكثافة.",
    },
    keywords: ["salt", "solution", "nacl", "brine", "saline", "home", "ملح", "محلول"],
    icon: "Droplet",
    live: true,
    fields: [
      {
        key: "mode",
        names: { en: "Concentration mode", ar: "وضع التركيز" },
        type: "select",
        default: "percent",
        options: [
          { value: "percent", label: { en: "Percentage (%) — grams of salt per 100g solution", ar: "نسبة مئوية (%) — جرام ملح لكل 100 جم محلول" } },
          { value: "molar", label: { en: "Molarity (mol/L) — moles of salt per liter", ar: "مولارية (مول/لتر) — مولات ملح لكل لتر" } },
          { value: "massvol", label: { en: "Mass/Volume (g/L) — grams of salt per liter", ar: "كتلة/حجم (جم/لتر) — جرام ملح لكل لتر" } },
        ],
        help: {
          en: "% = weight/weight (e.g. 3% saline = 3g salt in 97g water). Molarity = moles per liter. g/L = grams per liter.",
          ar: "% = وزن/وزن (مثال 3% = 3 جم ملح في 97 جم ماء). المولارية = مول لكل لتر. جم/لتر = جرام لكل لتر.",
        },
      },
      { key: "conc", names: { en: "Target concentration", ar: "التركيز المستهدف" }, type: "number", default: 3, help: { en: "Enter the value (e.g. 3 for 3%, or 0.5 for 0.5 mol/L)", ar: "أدخل القيمة (مثال 3 لـ 3% أو 0.5 لـ 0.5 مول/لتر)" } },
      { key: "volume", names: { en: "Solution volume to make", ar: "حجم المحلول المطلوب تحضيره" }, type: "number", default: 500, unit: { en: "mL", ar: "مل" }, help: { en: "How much solution do you want to prepare? (in milliliters)", ar: "كم تريد تحضير محلول؟ (بالمليلتر)" } },
    ],
    compute: (v) => {
      const conc = num(v.conc);
      const vol = num(v.volume);
      if ([conc, vol].some(Number.isNaN) || vol <= 0) return { results: [], error: { en: "Enter positive values", ar: "أدخل قيمًا موجبة" } };
      const mode = String(v.mode);
      const NaCl_MW = 58.44;
      let saltG = 0;
      let waterG = 0;
      let steps: { description: { en: string; ar: string }; expression?: string }[] = [];

      if (mode === "percent") {
        // w/w percentage: salt% of total mass, assume density ~1 g/mL
        const totalMass = vol; // grams (assume 1 mL ≈ 1 g)
        saltG = (totalMass * conc) / 100;
        waterG = totalMass - saltG;
        steps = [
          { description: { en: `Total mass = ${vol} mL × 1 g/mL = ${fmt(totalMass, 1)} g`, ar: `الكتلة الكلية = ${vol} مل × 1 جم/مل = ${fmt(totalMass, 1)} جم` } },
          { description: { en: `Salt = ${fmt(totalMass, 1)} g × ${conc}% = ${fmt(saltG, 2)} g`, ar: `الملح = ${fmt(totalMass, 1)} جم × ${conc}% = ${fmt(saltG, 2)} جم` } },
          { description: { en: `Water = ${fmt(totalMass, 1)} − ${fmt(saltG, 2)} = ${fmt(waterG, 2)} g (${fmt(waterG, 1)} mL)`, ar: `الماء = ${fmt(totalMass, 1)} − ${fmt(saltG, 2)} = ${fmt(waterG, 2)} جم (${fmt(waterG, 1)} مل)` } },
        ];
      } else if (mode === "molar") {
        const moles = conc * (vol / 1000);
        saltG = moles * NaCl_MW;
        waterG = vol - saltG / 1.0; // approximate (salt adds ~volume)
        steps = [
          { description: { en: `Moles NaCl = ${conc} mol/L × ${vol / 1000} L = ${fmt(moles, 5)} mol`, ar: `مولات NaCl = ${conc} مول/لتر × ${vol / 1000} لتر = ${fmt(moles, 5)} مول` } },
          { description: { en: `Salt mass = ${fmt(moles, 5)} mol × ${NaCl_MW} g/mol = ${fmt(saltG, 3)} g`, ar: `كتلة الملح = ${fmt(moles, 5)} مول × ${NaCl_MW} جم/مول = ${fmt(saltG, 3)} جم` } },
          { description: { en: `Dissolve in water and bring total volume to ${fmt(vol, 1)} mL`, ar: `أذب في الماء وأكمل الحجم الكلي إلى ${fmt(vol, 1)} مل` } },
        ];
      } else {
        // mass/volume g/L
        saltG = (conc * vol) / 1000;
        steps = [
          { description: { en: `Salt mass = ${conc} g/L × ${vol / 1000} L = ${fmt(saltG, 3)} g`, ar: `كتلة الملح = ${conc} جم/لتر × ${vol / 1000} لتر = ${fmt(saltG, 3)} جم` } },
          { description: { en: `Dissolve ${fmt(saltG, 2)} g salt and bring to ${fmt(vol, 1)} mL`, ar: `أذب ${fmt(saltG, 2)} جم ملح وأكمل إلى ${fmt(vol, 1)} مل` } },
        ];
      }

      return {
        results: [
          { label: { en: "Table salt (NaCl) needed", ar: "ملح الطعام المطلوب (NaCl)" }, value: fmt(saltG, 3) + " g", primary: true },
          { label: { en: "≈ teaspoons", ar: "≈ ملاعق صغيرة" }, value: fmt(saltG / 5.9, 2) + " tsp", help: { en: "", ar: "" } as never },
          { label: { en: "Water (approx)", ar: "الماء (تقريبي)" }, value: fmt(Math.max(0, vol - saltG), 1) + " mL" },
        ],
        formula: `Salt = ${fmt(saltG, 3)} g, Water = ${fmt(Math.max(0, vol - saltG), 1)} mL → ${fmt(vol, 1)} mL solution`,
        steps,
        explanation: {
          en: "Instructions: 1) Weigh the salt. 2) Add to a container. 3) Add most of the water and stir until dissolved. 4) Add remaining water to reach the target volume. Tip: warm water dissolves salt faster. NaCl molar mass = 58.44 g/mol.",
          ar: "الخطوات: 1) وزن الملح. 2) ضعه في وعاء. 3) أضف معظم الماء وقلب حتى الذوبان. 4) أضف الماء المتبقي للوصول للحجم المطلوب. نصيحة: الماء الدافئ يذيب الملح أسرع. الكتلة المولية لـ NaCl = 58.44 جم/مول.",
        },
      };
    },
  },

  // Vinegar + Baking Soda Volcano
  {
    id: "home-volcano",
    category: "home-experiments",
    names: { en: "Volcano (Vinegar + Baking Soda)", ar: "بركان (خل + بيكربونات)" },
    descriptions: {
      en: "Calculate CO₂ gas produced when vinegar (acetic acid) reacts with baking soda (sodium bicarbonate). Classic volcano experiment!",
      ar: "احسب غاز CO₂ الناتج عند تفاعل الخل (حمض الخليك) مع بيكربونات الصوديوم. تجربة البركان الكلاسيكية!",
    },
    keywords: ["volcano", "vinegar", "baking soda", "co2", "gas", "بركان", "خل"],
    icon: "Flame",
    live: true,
    fields: [
      { key: "vinegar", names: { en: "Vinegar volume", ar: "حجم الخل" }, type: "number", default: 100, unit: { en: "mL", ar: "مل" }, help: { en: "Household vinegar is ~5% acetic acid (CH₃COOH)", ar: "الخل المنزلي ~5% حمض الخليك (CH₃COOH)" } },
      { key: "bakingSoda", names: { en: "Baking soda mass", ar: "كتلة بيكربونات الصوديوم" }, type: "number", default: 10, unit: { en: "g", ar: "جم" }, help: { en: "NaHCO₃ (sodium bicarbonate)", ar: "NaHCO₃ (بيكربونات الصوديوم)" } },
    ],
    compute: (v) => {
      const vinegar_mL = num(v.vinegar);
      const bs_g = num(v.bakingSoda);
      if ([vinegar_mL, bs_g].some(Number.isNaN) || vinegar_mL <= 0 || bs_g <= 0)
        return { results: [], error: { en: "Enter positive values", ar: "أدخل قيمًا موجبة" } };

      // CH3COOH + NaHCO3 → CH3COONa + H2O + CO2
      const CH3COOH_MW = 60.05;
      const NaHCO3_MW = 84.01;
      const CO2_MW = 44.01;

      // Vinegar is ~5% acetic acid by mass; density ~1.01 g/mL
      const vinegarMass = vinegar_mL * 1.01;
      const aceticMass = vinegarMass * 0.05;
      const aceticMoles = aceticMass / CH3COOH_MW;
      const bsMoles = bs_g / NaHCO3_MW;

      // Limiting reagent
      const limiting = aceticMoles < bsMoles ? "vinegar (acetic acid)" : "baking soda (NaHCO₃)";
      const limitingAr = aceticMoles < bsMoles ? "الخل (حمض الخليك)" : "بيكربونات الصوديوم (NaHCO₃)";
      const co2_moles = Math.min(aceticMoles, bsMoles);
      const co2_g = co2_moles * CO2_MW;
      // CO2 gas volume at STP (1 mol = 22.4 L)
      const co2_L = co2_moles * 22.4;
      const co2_mL = co2_L * 1000;

      return {
        results: [
          { label: { en: "CO₂ gas produced", ar: "غاز CO₂ الناتج" }, value: fmt(co2_g, 2) + " g", primary: true },
          { label: { en: "CO₂ volume (at STP)", ar: "حجم CO₂ (عند STP)" }, value: fmt(co2_mL, 0) + " mL" },
          { label: { en: "Acetic acid available", ar: "حمض الخليك المتاح" }, value: fmt(aceticMoles, 5) + " mol" },
          { label: { en: "Baking soda available", ar: "بيكربونات الصوديوم المتاح" }, value: fmt(bsMoles, 5) + " mol" },
          { label: { en: "Limiting reagent", ar: "المتفاعل المحدد" }, value: `${limiting} / ${limitingAr}` },
        ],
        formula: `CH₃COOH + NaHCO₃ → CH₃COONa + H₂O + CO₂`,
        steps: [
          { description: { en: `Vinegar mass = ${vinegar_mL} mL × 1.01 g/mL = ${fmt(vinegarMass, 1)} g`, ar: `كتلة الخل = ${vinegar_mL} مل × 1.01 جم/مل = ${fmt(vinegarMass, 1)} جم` } },
          { description: { en: `Acetic acid mass = ${fmt(vinegarMass, 1)} g × 5% = ${fmt(aceticMass, 2)} g → ${fmt(aceticMoles, 5)} mol`, ar: `كتلة حمض الخليك = ${fmt(vinegarMass, 1)} جم × 5% = ${fmt(aceticMass, 2)} جم → ${fmt(aceticMoles, 5)} مول` } },
          { description: { en: `Baking soda = ${bs_g} g ÷ ${NaHCO3_MW} = ${fmt(bsMoles, 5)} mol`, ar: `بيكربونات الصوديوم = ${bs_g} جم ÷ ${NaHCO3_MW} = ${fmt(bsMoles, 5)} مول` } },
          { description: { en: `Limiting: ${limiting} → CO₂ = ${fmt(co2_moles, 5)} mol × ${CO2_MW} = ${fmt(co2_g, 2)} g`, ar: `المحدد: ${limitingAr} → CO₂ = ${fmt(co2_moles, 5)} مول × ${CO2_MW} = ${fmt(co2_g, 2)} جم` } },
        ],
        explanation: {
          en: "Safety: Do this in a sink or outdoors. The reaction produces CO₂ gas which causes the fizzing. Add dish soap for longer-lasting foam. Red food coloring makes it look like lava!",
          ar: "الأمان: قم بذلك في حوض أو في الخارج. التفاعل ينتج غاز CO₂ الذي يسبب الفوران. أضف صابون أطباق لرغوة تدوم أطول. ملون الطعام الأحمر يجعلها تبدو كالحمم!",
        },
      };
    },
  },

  // Crystal Growing (saturation)
  {
    id: "home-crystals",
    category: "home-experiments",
    names: { en: "Crystal Growing (Saturation)", ar: "زراعة البلورات (تشبع)" },
    descriptions: {
      en: "Calculate how much salt/sugar/alum you can dissolve to make a supersaturated solution for growing crystals.",
      ar: "احسب كمية الملح/السكر/الشب التي يمكنك إذابتها لتحضير محلول فوق مشبع لزراعة البلورات.",
    },
    keywords: ["crystal", "growing", "saturation", "supersaturated", "بلورات", "تشبع"],
    icon: "Gem",
    live: true,
    fields: [
      {
        key: "substance",
        names: { en: "Substance", ar: "المادة" },
        type: "select",
        default: "NaCl",
        options: [
          { value: "NaCl", label: { en: "Table Salt (NaCl) — cubic crystals", ar: "ملح الطعام (NaCl) — بلورات مكعبة" } },
          { value: "C12H22O11", label: { en: "Sugar (Sucrose) — rock candy", ar: "السكر (السكروز) — حلوى صخرية" } },
          { value: "CuSO4", label: { en: "Copper Sulfate (blue crystals)", ar: "كبريتات النحاس (بلورات زرقاء)" } },
          { value: "KAl(SO4)2", label: { en: "Alum (KAl(SO₄)₂) — octahedral", ar: "الشب (KAl(SO₄)₂) — ثماني الأوجه" } },
          { value: "MgSO4", label: { en: "Epsom Salt (MgSO₄)", ar: "ملح إبسوم (MgSO₄)" } },
        ],
        help: { en: "Choose what you want to grow crystals from.", ar: "اختر ما تريد زراعة بلورات منه." },
      },
      { key: "water", names: { en: "Water volume", ar: "حجم الماء" }, type: "number", default: 200, unit: { en: "mL", ar: "مل" }, help: { en: "Hot water dissolves more solute.", ar: "الماء الساخن يذيب مادة أكثر." } },
      { key: "temp", names: { en: "Water temperature", ar: "حرارة الماء" }, type: "number", default: 60, unit: { en: "°C", ar: "°م" }, help: { en: "Higher temp = more solute can dissolve.", ar: "حرارة أعلى = مادة أكثر تذوب." } },
    ],
    compute: (v) => {
      const water = num(v.water);
      const temp = num(v.temp);
      if ([water, temp].some(Number.isNaN) || water <= 0) return { results: [], error: { en: "Enter valid values", ar: "أدخل قيمًا صالحة" } };

      // Approximate solubility at given temp (g per 100 mL water)
      const solubility: Record<string, (t: number) => number> = {
        "NaCl": (t) => 35.7 + 0.02 * (t - 20),          // ~35.7 g/100mL at 20°C, slight increase
        "C12H22O11": (t) => 203.9 + 0.8 * (t - 20),     // ~204 g/100mL at 20°C, strong increase
        "CuSO4": (t) => 20.7 + 0.42 * (t - 20),         // ~20.7 g/100mL at 20°C
        "KAl(SO4)2": (t) => 5.7 + 0.35 * (t - 20),       // ~5.7 g/100mL at 20°C
        "MgSO4": (t) => 35.1 + 0.18 * (t - 20),          // ~35.1 g/100mL at 20°C
      };
      const names: Record<string, string> = {
        "NaCl": "Table Salt (NaCl)",
        "C12H22O11": "Sugar (Sucrose)",
        "CuSO4": "Copper Sulfate (CuSO₄)",
        "KAl(SO4)2": "Alum (KAl(SO₄)₂)",
        "MgSO4": "Epsom Salt (MgSO₄)",
      };

      const substance = String(v.substance);
      const solPer100 = solubility[substance] ? solubility[substance](temp) : 35;
      const totalSolute = (solPer100 * water) / 100;

      return {
        results: [
          { label: { en: "Max solute to dissolve", ar: "أقصى مادة تذوب" }, value: fmt(totalSolute, 1) + " g", primary: true },
          { label: { en: "Solubility at " + temp + "°C", ar: "الذوبانية عند " + temp + "°م" }, value: fmt(solPer100, 1) + " g/100mL" },
          { label: { en: "≈ teaspoons", ar: "≈ ملاعق صغيرة" }, value: fmt(totalSolute / 5.9, 1) + " tsp" },
        ],
        formula: `Solubility(${names[substance]}, ${temp}°C) = ${fmt(solPer100, 1)} g/100mL → ${fmt(totalSolute, 1)} g in ${water} mL`,
        steps: [
          { description: { en: `Heat ${water} mL water to ${temp}°C`, ar: `سخن ${water} مل ماء إلى ${temp}°م` } },
          { description: { en: `Slowly add ${fmt(totalSolute, 1)} g of ${names[substance]}, stirring until dissolved`, ar: `أضف ببطء ${fmt(totalSolute, 1)} جم من ${names[substance]} مع التقليب حتى الذوبان` } },
          { description: { en: `Pour into a clean jar, suspend a seed crystal on a string, and let cool slowly`, ar: `صب في برطمان نظيف، علّق بلورة بذرة على خيط، واتركه يبرد ببطء` } },
        ],
        explanation: {
          en: "Tip: For best crystals, let the solution cool slowly (hours/days). A rough surface or dust can cause many small crystals instead of one big one. For rock candy, dip a string in sugar first as seed crystals.",
          ar: "نصيحة: للحصول على أفضل البلورات، اترك المحلول يبرد ببطء (ساعات/أيام). السطح الخشن أو الغبار قد يسبب بلورات صغيرة كثيرة بدلاً من بلورة كبيرة واحدة. لحلوى الصخر، اغمس خيطًا في السكر أولاً كبلورات بذرة.",
        },
      };
    },
  },

  // Density Column (layering liquids)
  {
    id: "home-density-column",
    category: "home-experiments",
    names: { en: "Density Column (Layering Liquids)", ar: "عمود الكثافة (طبقات السوائل)" },
    descriptions: {
      en: "Plan a colorful density column using household liquids (honey, syrup, dish soap, water, oil, alcohol).",
      ar: "خطط لعمود كثافة ملون باستخدام سوائل منزلية (عسل، شراب، صابون، ماء، زيت، كحول).",
    },
    keywords: ["density", "column", "layers", "liquids", "كثافة", "طبقات"],
    icon: "Layers",
    live: true,
    fields: [
      {
        key: "info",
        names: { en: "Density reference", ar: "مرجع الكثافة" },
        type: "select",
        default: "info",
        options: [{ value: "info", label: { en: "See densities below ↓", ar: "انظر الكثافات بالأسفل ↓" } }],
        help: {
          en: "Densities (g/mL): Honey 1.42, Corn Syrup 1.38, Dish Soap 1.06, Milk 1.03, Water 1.00, Vegetable Oil 0.92, Rubbing Alcohol 0.79, Lamp Oil 0.78. Pour heaviest first!",
          ar: "الكثافات (جم/مل): العسل 1.42، شراب الذرة 1.38، صابون الأطباق 1.06، الحليب 1.03، الماء 1.00، زيت نباتي 0.92، الكحول الطبي 0.79، زيت المصباح 0.78. اسكب الأثقل أولاً!",
        },
      },
    ],
    compute: () => {
      return {
        results: [
          { label: { en: "1 (bottom, heaviest)", ar: "1 (الأسفل، الأثقل)" }, value: "Honey — 1.42 g/mL", primary: true },
          { label: { en: "2", ar: "2" }, value: "Corn Syrup — 1.38 g/mL" },
          { label: { en: "3", ar: "3" }, value: "Dish Soap — 1.06 g/mL" },
          { label: { en: "4", ar: "4" }, value: "Milk — 1.03 g/mL" },
          { label: { en: "5", ar: "5" }, value: "Water (colored) — 1.00 g/mL" },
          { label: { en: "6", ar: "6" }, value: "Vegetable Oil — 0.92 g/mL" },
          { label: { en: "7 (top, lightest)", ar: "7 (الأعلى، الأخف)" }, value: "Rubbing Alcohol — 0.79 g/mL" },
        ],
        formula: "Density = mass ÷ volume. Heavier liquids sink, lighter ones float.",
        explanation: {
          en: "Instructions: Pour slowly down the side of a tall glass. Add food coloring to water and alcohol for contrast. Drop in small objects (grape, plastic bead, cork) — they'll float at different layers!",
          ar: "الخطوات: اسكب ببطء على جانب كوب طويل. أضف ملون طعام للماء والكحول للتباين. ألقِ أشياء صغيرة (عنب، خرزة بلاستيك، فلين) — ستطفو في طبقات مختلفة!",
        },
      };
    },
  },

  // pH of household items
  {
    id: "home-ph",
    category: "home-experiments",
    names: { en: "pH of Household Items", ar: "درجة pH للمواد المنزلية" },
    descriptions: {
      en: "Look up the pH of common household substances. Useful for acid-base experiments with red cabbage indicator.",
      ar: "ابحث عن درجة pH للمواد المنزلية الشائعة. مفيد لتجارب الحمض-القاعدة مع مؤشر الملفوف الأحمر.",
    },
    keywords: ["ph", "acid", "base", "household", "cabbage", "pH", "حمض", "قاعدة"],
    icon: "Droplet",
    live: true,
    fields: [
      {
        key: "item",
        names: { en: "Household item", ar: "المادة المنزلية" },
        type: "select",
        default: "vinegar",
        options: [
          { value: "lemon", label: { en: "Lemon juice (pH ~2)", ar: "عصير الليمون (pH ~2)" } },
          { value: "vinegar", label: { en: "Vinegar (pH ~2.5)", ar: "الخل (pH ~2.5)" } },
          { value: "soda", label: { en: "Cola/Soda (pH ~2.5)", ar: "كولا/صودا (pH ~2.5)" } },
          { value: "orange", label: { en: "Orange juice (pH ~3.5)", ar: "عصير برتقال (pH ~3.5)" } },
          { value: "coffee", label: { en: "Coffee (pH ~5)", ar: "قهوة (pH ~5)" } },
          { value: "rain", label: { en: "Clean rain water (pH ~5.6)", ar: "مطر نقي (pH ~5.6)" } },
          { value: "milk", label: { en: "Milk (pH ~6.5)", ar: "حليب (pH ~6.5)" } },
          { value: "water", label: { en: "Pure water (pH 7)", ar: "ماء نقي (pH 7)" } },
          { value: "blood", label: { en: "Human blood (pH ~7.4)", ar: "دم بشري (pH ~7.4)" } },
          { value: "baking", label: { en: "Baking soda solution (pH ~8.3)", ar: "محلول بيكربونات (pH ~8.3)" } },
          { value: "soap", label: { en: "Hand soap (pH ~9-10)", ar: "صابون اليدين (pH ~9-10)" } },
          { value: "ammonia", label: { en: "Ammonia cleaner (pH ~11)", ar: "منظف الأمونيا (pH ~11)" } },
          { value: "bleach", label: { en: "Bleach (pH ~12.5)", ar: "مبيض (pH ~12.5)" } },
          { value: "lye", label: { en: "Drain cleaner/Lye (pH ~13-14)", ar: "منظف بالوعات/صودا كاوية (pH ~13-14)" } },
        ],
        help: { en: "pH scale: 0-6 = acid, 7 = neutral, 8-14 = base. Red cabbage juice changes color across the whole range!", ar: "مقياس pH: 0-6 = حمض، 7 = متعادل، 8-14 = قاعدة. عصير الملفوف الأحمر يغير لونه عبر المقياس كله!" },
      },
    ],
    compute: (v) => {
      const phMap: Record<string, { ph: number; nameEn: string; nameAr: string; colorEn: string; colorAr: string }> = {
        lemon: { ph: 2.0, nameEn: "Lemon juice", nameAr: "عصير الليمون", colorEn: "Red (acid)", colorAr: "أحمر (حمض)" },
        vinegar: { ph: 2.5, nameEn: "Vinegar", nameAr: "الخل", colorEn: "Red-pink", colorAr: "أحمر-وردي" },
        soda: { ph: 2.5, nameEn: "Cola", nameAr: "كولا", colorEn: "Red-pink", colorAr: "أحمر-وردي" },
        orange: { ph: 3.5, nameEn: "Orange juice", nameAr: "عصير برتقال", colorEn: "Pink-orange", colorAr: "وردي-برتقالي" },
        coffee: { ph: 5.0, nameEn: "Coffee", nameAr: "قهوة", colorEn: "Purple-pink", colorAr: "بنفسجي-وردي" },
        rain: { ph: 5.6, nameEn: "Rain water", nameAr: "مطر", colorEn: "Purple", colorAr: "بنفسجي" },
        milk: { ph: 6.5, nameEn: "Milk", nameAr: "حليب", colorEn: "Light purple", colorAr: "بنفسجي فاتح" },
        water: { ph: 7.0, nameEn: "Pure water", nameAr: "ماء نقي", colorEn: "Purple (neutral)", colorAr: "بنفسجي (متعادل)" },
        blood: { ph: 7.4, nameEn: "Blood", nameAr: "دم", colorEn: "Blue-purple", colorAr: "أزرق-بنفسجي" },
        baking: { ph: 8.3, nameEn: "Baking soda", nameAr: "بيكربونات", colorEn: "Blue-green", colorAr: "أزرق-أخضر" },
        soap: { ph: 9.5, nameEn: "Hand soap", nameAr: "صابون", colorEn: "Green", colorAr: "أخضر" },
        ammonia: { ph: 11.0, nameEn: "Ammonia", nameAr: "أمونيا", colorEn: "Yellow-green", colorAr: "أصفر-أخضر" },
        bleach: { ph: 12.5, nameEn: "Bleach", nameAr: "مبيض", colorEn: "Yellow", colorAr: "أصفر" },
        lye: { ph: 13.5, nameEn: "Drain cleaner", nameAr: "منظف بالوعات", colorEn: "Yellow (strong base)", colorAr: "أصفر (قاعدة قوية)" },
      };
      const item = phMap[String(v.item)];
      if (!item) return { results: [], error: { en: "Select an item", ar: "اختر مادة" } };
      const category = item.ph < 6 ? "Acidic" : item.ph <= 7.5 ? "Neutral" : "Basic";
      const categoryAr = item.ph < 6 ? "حمضي" : item.ph <= 7.5 ? "متعادل" : "قاعدي";
      const [h] = [Math.pow(10, -item.ph)];
      return {
        results: [
          { label: { en: "pH value", ar: "قيمة pH" }, value: String(item.ph), primary: true },
          { label: { en: "Category", ar: "التصنيف" }, value: `${category} / ${categoryAr}` },
          { label: { en: "[H⁺] concentration", ar: "تركيز [H⁺]" }, value: fmtSci(h, 3) + " mol/L" },
          { label: { en: "Cabbage indicator color", ar: "لون مؤشر الملفوف" }, value: `${item.colorEn} / ${item.colorAr}` },
        ],
        formula: `pH = -log₁₀([H⁺]) → [H⁺] = 10^(-pH) = ${fmtSci(h, 3)} mol/L`,
        explanation: {
          en: "Make red cabbage indicator: Blend red cabbage with water, strain. Add a few drops to any liquid — it changes color based on pH! Acids turn red/pink, bases turn green/yellow.",
          ar: "لتحضير مؤشر الملفوف الأحمر: اخلط الملفوف الأحمر مع الماء، صفِّه. أضف بضع قطرات لأي سائل — يغير لونه حسب الـ pH! الأحماض تحوله لأحمر/وردي، والقواعد لأخضر/أصفر.",
        },
      };
    },
  },
];

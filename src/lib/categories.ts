// ============================================================================
// Calculator Categories
// ============================================================================

import type { Category } from "./types";

export const CATEGORIES: Category[] = [
  {
    id: "basic",
    names: { en: "Basic Calculators", ar: "الحاسبات الأساسية" },
    description: {
      en: "Standard, scientific, programmer & percentage tools",
      ar: "حاسبات قياسية وعلمية وبرمجية ونسب مئوية",
    },
    icon: "Calculator",
    color: "from-violet-500 to-purple-600",
  },
  {
    id: "converters",
    names: { en: "Unit Converters", ar: "محوّلات الوحدات" },
    description: {
      en: "Length, weight, area, volume, temperature, data & more",
      ar: "الطول، الوزن، المساحة، الحجم، الحرارة، البيانات والمزيد",
    },
    icon: "Ruler",
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: "chemistry",
    names: { en: "Chemistry", ar: "الكيمياء" },
    description: {
      en: "Molar mass, molarity, pH, gas laws & stoichiometry",
      ar: "الكتلة المولية، المولارية، الأس الهيدروجيني، قوانين الغازات",
    },
    icon: "FlaskConical",
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "physics",
    names: { en: "Physics", ar: "الفيزياء" },
    description: {
      en: "Velocity, force, energy, momentum & projectile motion",
      ar: "السرعة، القوة، الطاقة، الزخم وحركة المقذوفات",
    },
    icon: "Atom",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "math",
    names: { en: "Mathematics", ar: "الرياضيات" },
    description: {
      en: "Algebra, geometry, trigonometry, calculus & matrices",
      ar: "الجبر، الهندسة، حساب المثلثات، التفاضل والمصفوفات",
    },
    icon: "Sigma",
    color: "from-rose-500 to-pink-600",
  },
  {
    id: "health",
    names: { en: "Health & Fitness", ar: "الصحة واللياقة" },
    description: {
      en: "BMI, BMR, body fat, water intake & heart rate zones",
      ar: "مؤشر كتلة الجسم، معدل الأيض، نسبة الدهون، الماء ومعدل النبض",
    },
    icon: "HeartPulse",
    color: "from-red-500 to-rose-600",
  },
  {
    id: "nutrition",
    names: { en: "Nutrition", ar: "التغذية" },
    description: {
      en: "Calories, macros, fiber, vitamins & glycemic index",
      ar: "السعرات، العناصر الغذائية، الألياف، الفيتامينات",
    },
    icon: "Apple",
    color: "from-lime-500 to-green-600",
  },
  {
    id: "finance",
    names: { en: "Finance", ar: "المالية" },
    description: {
      en: "Loans, mortgage, EMI, interest, ROI & taxes",
      ar: "القروض، الرهن، القسط، الفائدة، العائد والضرائب",
    },
    icon: "Landmark",
    color: "from-amber-500 to-yellow-600",
  },
  {
    id: "engineering",
    names: { en: "Engineering", ar: "الهندسة" },
    description: {
      en: "Mechanical, electrical, civil, HVAC & fluid mechanics",
      ar: "ميكانيكية، كهربائية، مدنية، تكييف وميكانيكا الموائع",
    },
    icon: "Cog",
    color: "from-slate-500 to-gray-700",
  },
  {
    id: "laboratory",
    names: { en: "Laboratory Tools", ar: "أدوات المختبر" },
    description: {
      en: "Solution prep, dilutions, buffers & reagent calculators",
      ar: "تحضير المحاليل، التخفيف، المختزن والكواشف",
    },
    icon: "TestTube",
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: "computer",
    names: { en: "Computer", ar: "الحاسوب" },
    description: {
      en: "Binary, hex, IP, storage, download time & network speed",
      ar: "الثنائي، السداسي عشر، IP، التخزين، وقت التنزيل",
    },
    icon: "Cpu",
    color: "from-rose-500 to-pink-600",
  },
  {
    id: "datetime",
    names: { en: "Date & Time", ar: "التاريخ والوقت" },
    description: {
      en: "Age, date difference, business days, countdown & timezone",
      ar: "العمر، فرق التاريخ، أيام العمل، العد التنازلي",
    },
    icon: "CalendarClock",
    color: "from-sky-500 to-indigo-500",
  },
  {
    id: "construction",
    names: { en: "Construction", ar: "البناء" },
    description: {
      en: "Concrete, cement, bricks, tiles, paint & steel",
      ar: "الخرسانة، الأسمنت، الطوب، البلاط، الطلاء والصلب",
    },
    icon: "Hammer",
    color: "from-stone-500 to-amber-700",
  },
  {
    id: "everyday",
    names: { en: "Everyday", ar: "يوميات" },
    description: {
      en: "Fuel cost, bills, tip, split bill & travel cost",
      ar: "تكلفة الوقود، الفواتير، البقشيش، تقسيم الفاتورة",
    },
    icon: "Wallet",
    color: "from-fuchsia-500 to-purple-600",
  },
  {
    id: "home-experiments",
    names: { en: "Safe Home Experiments", ar: "تجارب منزلية آمنة" },
    description: {
      en: "Safe chemistry experiments using household materials (salt, vinegar, baking soda, etc.)",
      ar: "تجارب كيميائية آمنة باستخدام مواد منزلية (ملح، خل، بيكربونات الصوديوم، إلخ)",
    },
    icon: "Home",
    color: "from-lime-500 to-green-600",
  },
  {
    id: "molecular-biology",
    names: { en: "Molecular Biology", ar: "البيولوجيا الجزيئية" },
    description: {
      en: "DNA, RNA, protein concentration, PCR, OD260, cell culture & bioinformatics calculators",
      ar: "حاسبات DNA و RNA وتركيز البروتين و PCR و OD260 وزراعة الخلايا والمعلوماتية الحيوية",
    },
    icon: "Dna",
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "genetics",
    names: { en: "Molecular Genetics", ar: "الوراثة الجزيئية" },
    description: {
      en: "Hardy-Weinberg, Punnett squares, allele frequency, genetic probability & mutation rate",
      ar: "هاردي-واينبرغ، مربعات بنيت، تردد الأليل، الاحتمالات الوراثية ومعدل الطفرات",
    },
    icon: "Gene",
    color: "from-purple-500 to-indigo-600",
  },
  {
    id: "dna",
    names: { en: "DNA & RNA Tools", ar: "أدوات DNA و RNA" },
    description: {
      en: "DNA/RNA concentration, melting temp (Tm), molecular weight, copy number & primer design",
      ar: "تركيز DNA/RNA، حرارة الانصهار (Tm)، الوزن الجزيئي، عدد النسخ وتصميم البرايمر",
    },
    icon: "Dna",
    color: "from-teal-500 to-cyan-600",
  },
  {
    id: "agriculture",
    names: { en: "Agriculture & Farming", ar: "الزراعة والمحاصيل" },
    description: {
      en: "Seedlings, seeds per feddan, fertilizers, pesticides, irrigation & crop yield calculators",
      ar: "حاسبات الشتلات، كمية البذور للفدان، الأسمدة، المبيدات، الري وإنتاجية المحاصيل",
    },
    icon: "Sprout",
    color: "from-green-500 to-lime-600",
  },
];

export const CATEGORY_MAP: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c])
);

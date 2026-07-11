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
    color: "from-blue-700 to-blue-900",
  },
  {
    id: "converters",
    names: { en: "Unit Converters", ar: "محوّلات الوحدات" },
    description: {
      en: "Length, weight, area, volume, temperature, data & more",
      ar: "الطول، الوزن، المساحة، الحجم، الحرارة، البيانات والمزيد",
    },
    icon: "Ruler",
    color: "from-cyan-600 to-blue-800",
  },
  {
    id: "chemistry",
    names: { en: "Chemistry", ar: "الكيمياء" },
    description: {
      en: "Molar mass, molarity, pH, gas laws & stoichiometry",
      ar: "الكتلة المولية، المولارية، الأس الهيدروجيني، قوانين الغازات",
    },
    icon: "FlaskConical",
    color: "from-teal-600 to-blue-900",
  },
  {
    id: "physics",
    names: { en: "Physics", ar: "الفيزياء" },
    description: {
      en: "Velocity, force, energy, momentum & projectile motion",
      ar: "السرعة، القوة، الطاقة، الزخم وحركة المقذوفات",
    },
    icon: "Atom",
    color: "from-blue-500 to-blue-800",
  },
  {
    id: "math",
    names: { en: "Mathematics", ar: "الرياضيات" },
    description: {
      en: "Algebra, geometry, trigonometry, calculus & matrices",
      ar: "الجبر، الهندسة، حساب المثلثات، التفاضل والمصفوفات",
    },
    icon: "Sigma",
    color: "from-indigo-600 to-blue-900",
  },
  {
    id: "health",
    names: { en: "Health & Fitness", ar: "الصحة واللياقة" },
    description: {
      en: "BMI, BMR, body fat, water intake & heart rate zones",
      ar: "مؤشر كتلة الجسم، معدل الأيض، نسبة الدهون، الماء ومعدل النبض",
    },
    icon: "HeartPulse",
    color: "from-blue-600 to-blue-900",
  },
  {
    id: "nutrition",
    names: { en: "Nutrition", ar: "التغذية" },
    description: {
      en: "Calories, macros, fiber, vitamins & glycemic index",
      ar: "السعرات، العناصر الغذائية، الألياف، الفيتامينات",
    },
    icon: "Apple",
    color: "from-green-600 to-blue-900",
  },
  {
    id: "finance",
    names: { en: "Finance", ar: "المالية" },
    description: {
      en: "Loans, mortgage, EMI, interest, ROI & taxes",
      ar: "القروض، الرهن، القسط، الفائدة، العائد والضرائب",
    },
    icon: "Landmark",
    color: "from-amber-600 to-blue-900",
  },
  {
    id: "engineering",
    names: { en: "Engineering", ar: "الهندسة" },
    description: {
      en: "Mechanical, electrical, civil, HVAC & fluid mechanics",
      ar: "ميكانيكية، كهربائية، مدنية، تكييف وميكانيكا الموائع",
    },
    icon: "Cog",
    color: "from-slate-600 to-blue-900",
  },
  {
    id: "laboratory",
    names: { en: "Laboratory Tools", ar: "أدوات المختبر" },
    description: {
      en: "Solution prep, dilutions, buffers & reagent calculators",
      ar: "تحضير المحاليل، التخفيف، المختزن والكواشف",
    },
    icon: "TestTube",
    color: "from-cyan-600 to-blue-800",
  },
  {
    id: "computer",
    names: { en: "Computer", ar: "الحاسوب" },
    description: {
      en: "Binary, hex, IP, storage, download time & network speed",
      ar: "الثنائي، السداسي عشر، IP، التخزين، وقت التنزيل",
    },
    icon: "Cpu",
    color: "from-indigo-600 to-blue-900",
  },
  {
    id: "datetime",
    names: { en: "Date & Time", ar: "التاريخ والوقت" },
    description: {
      en: "Age, date difference, business days, countdown & timezone",
      ar: "العمر، فرق التاريخ، أيام العمل، العد التنازلي",
    },
    icon: "CalendarClock",
    color: "from-sky-600 to-blue-900",
  },
  {
    id: "construction",
    names: { en: "Construction", ar: "البناء" },
    description: {
      en: "Concrete, cement, bricks, tiles, paint & steel",
      ar: "الخرسانة، الأسمنت، الطوب، البلاط، الطلاء والصلب",
    },
    icon: "Hammer",
    color: "from-stone-600 to-blue-900",
  },
  {
    id: "everyday",
    names: { en: "Everyday", ar: "يوميات" },
    description: {
      en: "Fuel cost, bills, tip, split bill & travel cost",
      ar: "تكلفة الوقود، الفواتير، البقشيش، تقسيم الفاتورة",
    },
    icon: "Wallet",
    color: "from-blue-600 to-indigo-900",
  },
];

export const CATEGORY_MAP: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c])
);

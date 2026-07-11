// Internationalization (i18n) - Arabic & English
export type Language = "en" | "ar";

export type Direction = "ltr" | "rtl";

export const LANGUAGE_DIRECTION: Record<Language, Direction> = {
  en: "ltr",
  ar: "rtl",
};

// Compact, frequently used translation keys. The rest of UI text can be embedded per component for simplicity.
type TranslationKey =
  | "appName"
  | "tagline"
  | "search"
  | "searchPlaceholder"
  | "allCategories"
  | "favorites"
  | "history"
  | "home"
  | "noFavorites"
  | "noHistory"
  | "noResults"
  | "clearHistory"
  | "removeFromFavorites"
  | "addToFavorites"
  | "copy"
  | "share"
  | "print"
  | "exportPdf"
  | "exportExcel"
  | "save"
  | "result"
  | "formula"
  | "steps"
  | "explanation"
  | "inputs"
  | "calculate"
  | "clear"
  | "reset"
  | "back"
  | "theme"
  | "lightMode"
  | "darkMode"
  | "language"
  | "english"
  | "arabic"
  | "calculators"
  | "popular"
  | "recent"
  | "smartSuggestions"
  | "aiFinder"
  | "askAi"
  | "totalCalculators"
  | "categories"
  | "allCalculators"
  | "footerText"
  | "madeWith"
  | "settings"
  | "about"
  | "offlineReady"
  | "yes"
  | "no"
  | "true"
  | "false"
  | "selectCategory"
  | "viewAll"
  | "tryNow"
  | "trending";

type Dictionary = Record<TranslationKey, string>;

export const translations: Record<Language, Dictionary> = {
  en: {
    appName: "Universal Calculator Hub",
    tagline: "Hundreds of calculators & converters in one place",
    search: "Search",
    searchPlaceholder: "Search 500+ calculators… e.g. BMI, molarity, EMI",
    allCategories: "All Categories",
    favorites: "Favorites",
    history: "History",
    home: "Home",
    noFavorites: "No favorites yet. Tap the star on any calculator to save it here.",
    noHistory: "No calculations yet. Your recent calculations will appear here.",
    noResults: "No calculators found. Try a different keyword.",
    clearHistory: "Clear history",
    removeFromFavorites: "Remove from favorites",
    addToFavorites: "Add to favorites",
    copy: "Copy",
    share: "Share",
    print: "Print",
    exportPdf: "Export PDF",
    exportExcel: "Export Excel",
    save: "Save",
    result: "Result",
    formula: "Formula",
    steps: "Steps",
    explanation: "Explanation",
    inputs: "Inputs",
    calculate: "Calculate",
    clear: "Clear",
    reset: "Reset",
    back: "Back",
    theme: "Theme",
    lightMode: "Light",
    darkMode: "Dark",
    language: "Language",
    english: "English",
    arabic: "العربية",
    calculators: "Calculators",
    popular: "Popular",
    recent: "Recent",
    smartSuggestions: "Smart suggestions",
    aiFinder: "AI Finder",
    askAi: "Describe what you want to calculate…",
    totalCalculators: "Total Calculators",
    categories: "Categories",
    allCalculators: "All Calculators",
    footerText: "All-in-one calculator & converter platform",
    madeWith: "Built with Next.js, TypeScript & shadcn/ui",
    settings: "Settings",
    about: "About",
    offlineReady: "Offline ready",
    yes: "Yes",
    no: "No",
    true: "True",
    false: "False",
    selectCategory: "Select a category",
    viewAll: "View all",
    tryNow: "Try now",
    trending: "Trending",
  },
  ar: {
    appName: "مركز الحاسبات الشامل",
    tagline: "مئات الحاسبات والمحولات في مكان واحد",
    search: "بحث",
    searchPlaceholder: "ابحث في أكثر من 500 حاسبة… مثل: مؤشر كتلة الجسم، المولارية، القسط",
    allCategories: "كل الفئات",
    favorites: "المفضلة",
    history: "السجل",
    home: "الرئيسية",
    noFavorites: "لا توجد مفضلات بعد. اضغط على النجمة في أي حاسبة لحفظها هنا.",
    noHistory: "لا توجد حسابات بعد. ستظهر حساباتك الأخيرة هنا.",
    noResults: "لم يتم العثور على حاسبات. جرب كلمة مختلفة.",
    clearHistory: "مسح السجل",
    removeFromFavorites: "إزالة من المفضلة",
    addToFavorites: "إضافة إلى المفضلة",
    copy: "نسخ",
    share: "مشاركة",
    print: "طباعة",
    exportPdf: "تصدير PDF",
    exportExcel: "تصدير Excel",
    save: "حفظ",
    result: "النتيجة",
    formula: "الصيغة",
    steps: "الخطوات",
    explanation: "الشرح",
    inputs: "المدخلات",
    calculate: "احسب",
    clear: "مسح",
    reset: "إعادة تعيين",
    back: "رجوع",
    theme: "المظهر",
    lightMode: "فاتح",
    darkMode: "داكن",
    language: "اللغة",
    english: "English",
    arabic: "العربية",
    calculators: "الحاسبات",
    popular: "شائع",
    recent: "الأخيرة",
    smartSuggestions: "اقتراحات ذكية",
    aiFinder: "البحث الذكي",
    askAi: "صف ما تريد حسابه…",
    totalCalculators: "إجمالي الحاسبات",
    categories: "الفئات",
    allCalculators: "كل الحاسبات",
    footerText: "منصة شاملة للحاسبات والمحولات",
    madeWith: "بُنيت باستخدام Next.js و TypeScript و shadcn/ui",
    settings: "الإعدادات",
    about: "حول",
    offlineReady: "يعمل دون اتصال",
    yes: "نعم",
    no: "لا",
    true: "صحيح",
    false: "خطأ",
    selectCategory: "اختر فئة",
    viewAll: "عرض الكل",
    tryNow: "جرّب الآن",
    trending: "رائج",
  },
};

export function t(lang: Language, key: TranslationKey): string {
  return translations[lang][key] ?? key;
}

// Localized category & calculator names — kept inline in registry for simplicity.

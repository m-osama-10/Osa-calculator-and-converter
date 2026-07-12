// ============================================================================
// Complete Periodic Table Data — all 118 elements
// ============================================================================

export interface Element {
  number: number;
  symbol: string;
  nameEn: string;
  nameAr: string;
  atomicMass: number;
  category: string;
  categoryAr: string;
  group: number | null;
  period: number;
  electronConfig: string;
  color: string;       // Tailwind gradient class for the element card
}

const CAT_COLORS: Record<string, string> = {
  "alkali-metal": "bg-red-500/80",
  "alkaline-earth": "bg-orange-500/80",
  "transition": "bg-yellow-500/80",
  "post-transition": "bg-green-500/80",
  "metalloid": "bg-teal-500/80",
  "nonmetal": "bg-blue-500/80",
  "halogen": "bg-indigo-500/80",
  "noble-gas": "bg-purple-500/80",
  "lanthanide": "bg-pink-500/80",
  "actinide": "bg-rose-500/80",
  "unknown": "bg-gray-500/80",
};

export const ELEMENTS: Element[] = [
  { number: 1, symbol: "H", nameEn: "Hydrogen", nameAr: "هيدروجين", atomicMass: 1.008, category: "nonmetal", categoryAr: "لا فلز", group: 1, period: 1, electronConfig: "1s¹", color: CAT_COLORS["nonmetal"] },
  { number: 2, symbol: "He", nameEn: "Helium", nameAr: "هيليوم", atomicMass: 4.0026, category: "noble-gas", categoryAr: "غاز نبيل", group: 18, period: 1, electronConfig: "1s²", color: CAT_COLORS["noble-gas"] },
  { number: 3, symbol: "Li", nameEn: "Lithium", nameAr: "ليثيوم", atomicMass: 6.94, category: "alkali-metal", categoryAr: "فلز قلوي", group: 1, period: 2, electronConfig: "[He] 2s¹", color: CAT_COLORS["alkali-metal"] },
  { number: 4, symbol: "Be", nameEn: "Beryllium", nameAr: "بيريليوم", atomicMass: 9.0122, category: "alkaline-earth", categoryAr: "فلز قلوي ترابي", group: 2, period: 2, electronConfig: "[He] 2s²", color: CAT_COLORS["alkaline-earth"] },
  { number: 5, symbol: "B", nameEn: "Boron", nameAr: "بورون", atomicMass: 10.81, category: "metalloid", categoryAr: "أشباه الفلزات", group: 13, period: 2, electronConfig: "[He] 2s² 2p¹", color: CAT_COLORS["metalloid"] },
  { number: 6, symbol: "C", nameEn: "Carbon", nameAr: "كربون", atomicMass: 12.011, category: "nonmetal", categoryAr: "لا فلز", group: 14, period: 2, electronConfig: "[He] 2s² 2p²", color: CAT_COLORS["nonmetal"] },
  { number: 7, symbol: "N", nameEn: "Nitrogen", nameAr: "نيتروجين", atomicMass: 14.007, category: "nonmetal", categoryAr: "لا فلز", group: 15, period: 2, electronConfig: "[He] 2s² 2p³", color: CAT_COLORS["nonmetal"] },
  { number: 8, symbol: "O", nameEn: "Oxygen", nameAr: "أكسجين", atomicMass: 15.999, category: "nonmetal", categoryAr: "لا فلز", group: 16, period: 2, electronConfig: "[He] 2s² 2p⁴", color: CAT_COLORS["nonmetal"] },
  { number: 9, symbol: "F", nameEn: "Fluorine", nameAr: "فلور", atomicMass: 18.998, category: "halogen", categoryAr: "هالوجين", group: 17, period: 2, electronConfig: "[He] 2s² 2p⁵", color: CAT_COLORS["halogen"] },
  { number: 10, symbol: "Ne", nameEn: "Neon", nameAr: "نيون", atomicMass: 20.180, category: "noble-gas", categoryAr: "غاز نبيل", group: 18, period: 2, electronConfig: "[He] 2s² 2p⁶", color: CAT_COLORS["noble-gas"] },
  { number: 11, symbol: "Na", nameEn: "Sodium", nameAr: "صوديوم", atomicMass: 22.990, category: "alkali-metal", categoryAr: "فلز قلوي", group: 1, period: 3, electronConfig: "[Ne] 3s¹", color: CAT_COLORS["alkali-metal"] },
  { number: 12, symbol: "Mg", nameEn: "Magnesium", nameAr: "مغنيسيوم", atomicMass: 24.305, category: "alkaline-earth", categoryAr: "فلز قلوي ترابي", group: 2, period: 3, electronConfig: "[Ne] 3s²", color: CAT_COLORS["alkaline-earth"] },
  { number: 13, symbol: "Al", nameEn: "Aluminum", nameAr: "ألومنيوم", atomicMass: 26.982, category: "post-transition", categoryAr: "فلز ما بعد انتقالي", group: 13, period: 3, electronConfig: "[Ne] 3s² 3p¹", color: CAT_COLORS["post-transition"] },
  { number: 14, symbol: "Si", nameEn: "Silicon", nameAr: "سيليكون", atomicMass: 28.085, category: "metalloid", categoryAr: "أشباه الفلزات", group: 14, period: 3, electronConfig: "[Ne] 3s² 3p²", color: CAT_COLORS["metalloid"] },
  { number: 15, symbol: "P", nameEn: "Phosphorus", nameAr: "فوسفور", atomicMass: 30.974, category: "nonmetal", categoryAr: "لا فلز", group: 15, period: 3, electronConfig: "[Ne] 3s² 3p³", color: CAT_COLORS["nonmetal"] },
  { number: 16, symbol: "S", nameEn: "Sulfur", nameAr: "كبريت", atomicMass: 32.06, category: "nonmetal", categoryAr: "لا فلز", group: 16, period: 3, electronConfig: "[Ne] 3s² 3p⁴", color: CAT_COLORS["nonmetal"] },
  { number: 17, symbol: "Cl", nameEn: "Chlorine", nameAr: "كلور", atomicMass: 35.45, category: "halogen", categoryAr: "هالوجين", group: 17, period: 3, electronConfig: "[Ne] 3s² 3p⁵", color: CAT_COLORS["halogen"] },
  { number: 18, symbol: "Ar", nameEn: "Argon", nameAr: "أرجون", atomicMass: 39.948, category: "noble-gas", categoryAr: "غاز نبيل", group: 18, period: 3, electronConfig: "[Ne] 3s² 3p⁶", color: CAT_COLORS["noble-gas"] },
  { number: 19, symbol: "K", nameEn: "Potassium", nameAr: "بوتاسيوم", atomicMass: 39.098, category: "alkali-metal", categoryAr: "فلز قلوي", group: 1, period: 4, electronConfig: "[Ar] 4s¹", color: CAT_COLORS["alkali-metal"] },
  { number: 20, symbol: "Ca", nameEn: "Calcium", nameAr: "كالسيوم", atomicMass: 40.078, category: "alkaline-earth", categoryAr: "فلز قلوي ترابي", group: 2, period: 4, electronConfig: "[Ar] 4s²", color: CAT_COLORS["alkaline-earth"] },
  { number: 21, symbol: "Sc", nameEn: "Scandium", nameAr: "سكانديوم", atomicMass: 44.956, category: "transition", categoryAr: "فلز انتقالي", group: 3, period: 4, electronConfig: "[Ar] 3d¹ 4s²", color: CAT_COLORS["transition"] },
  { number: 22, symbol: "Ti", nameEn: "Titanium", nameAr: "تيتانيوم", atomicMass: 47.867, category: "transition", categoryAr: "فلز انتقالي", group: 4, period: 4, electronConfig: "[Ar] 3d² 4s²", color: CAT_COLORS["transition"] },
  { number: 23, symbol: "V", nameEn: "Vanadium", nameAr: "فاناديوم", atomicMass: 50.942, category: "transition", categoryAr: "فلز انتقالي", group: 5, period: 4, electronConfig: "[Ar] 3d³ 4s²", color: CAT_COLORS["transition"] },
  { number: 24, symbol: "Cr", nameEn: "Chromium", nameAr: "كروم", atomicMass: 51.996, category: "transition", categoryAr: "فلز انتقالي", group: 6, period: 4, electronConfig: "[Ar] 3d⁵ 4s¹", color: CAT_COLORS["transition"] },
  { number: 25, symbol: "Mn", nameEn: "Manganese", nameAr: "منجنيز", atomicMass: 54.938, category: "transition", categoryAr: "فلز انتقالي", group: 7, period: 4, electronConfig: "[Ar] 3d⁵ 4s²", color: CAT_COLORS["transition"] },
  { number: 26, symbol: "Fe", nameEn: "Iron", nameAr: "حديد", atomicMass: 55.845, category: "transition", categoryAr: "فلز انتقالي", group: 8, period: 4, electronConfig: "[Ar] 3d⁶ 4s²", color: CAT_COLORS["transition"] },
  { number: 27, symbol: "Co", nameEn: "Cobalt", nameAr: "كوبالت", atomicMass: 58.933, category: "transition", categoryAr: "فلز انتقالي", group: 9, period: 4, electronConfig: "[Ar] 3d⁷ 4s²", color: CAT_COLORS["transition"] },
  { number: 28, symbol: "Ni", nameEn: "Nickel", nameAr: "نيكل", atomicMass: 58.693, category: "transition", categoryAr: "فلز انتقالي", group: 10, period: 4, electronConfig: "[Ar] 3d⁸ 4s²", color: CAT_COLORS["transition"] },
  { number: 29, symbol: "Cu", nameEn: "Copper", nameAr: "نحاس", atomicMass: 63.546, category: "transition", categoryAr: "فلز انتقالي", group: 11, period: 4, electronConfig: "[Ar] 3d¹⁰ 4s¹", color: CAT_COLORS["transition"] },
  { number: 30, symbol: "Zn", nameEn: "Zinc", nameAr: "زنك", atomicMass: 65.38, category: "transition", categoryAr: "فلز انتقالي", group: 12, period: 4, electronConfig: "[Ar] 3d¹⁰ 4s²", color: CAT_COLORS["transition"] },
  { number: 31, symbol: "Ga", nameEn: "Gallium", nameAr: "غاليوم", atomicMass: 69.723, category: "post-transition", categoryAr: "فلز ما بعد انتقالي", group: 13, period: 4, electronConfig: "[Ar] 3d¹⁰ 4s² 4p¹", color: CAT_COLORS["post-transition"] },
  { number: 32, symbol: "Ge", nameEn: "Germanium", nameAr: "جرمانيوم", atomicMass: 72.630, category: "metalloid", categoryAr: "أشباه الفلزات", group: 14, period: 4, electronConfig: "[Ar] 3d¹⁰ 4s² 4p²", color: CAT_COLORS["metalloid"] },
  { number: 33, symbol: "As", nameEn: "Arsenic", nameAr: "زرنيخ", atomicMass: 74.922, category: "metalloid", categoryAr: "أشباه الفلزات", group: 15, period: 4, electronConfig: "[Ar] 3d¹⁰ 4s² 4p³", color: CAT_COLORS["metalloid"] },
  { number: 34, symbol: "Se", nameEn: "Selenium", nameAr: "سيلينيوم", atomicMass: 78.971, category: "nonmetal", categoryAr: "لا فلز", group: 16, period: 4, electronConfig: "[Ar] 3d¹⁰ 4s² 4p⁴", color: CAT_COLORS["nonmetal"] },
  { number: 35, symbol: "Br", nameEn: "Bromine", nameAr: "بروم", atomicMass: 79.904, category: "halogen", categoryAr: "هالوجين", group: 17, period: 4, electronConfig: "[Ar] 3d¹⁰ 4s² 4p⁵", color: CAT_COLORS["halogen"] },
  { number: 36, symbol: "Kr", nameEn: "Krypton", nameAr: "كريبتون", atomicMass: 83.798, category: "noble-gas", categoryAr: "غاز نبيل", group: 18, period: 4, electronConfig: "[Ar] 3d¹⁰ 4s² 4p⁶", color: CAT_COLORS["noble-gas"] },
  { number: 37, symbol: "Rb", nameEn: "Rubidium", nameAr: "روبيديوم", atomicMass: 85.468, category: "alkali-metal", categoryAr: "فلز قلوي", group: 1, period: 5, electronConfig: "[Kr] 5s¹", color: CAT_COLORS["alkali-metal"] },
  { number: 38, symbol: "Sr", nameEn: "Strontium", nameAr: "سترونشيوم", atomicMass: 87.62, category: "alkaline-earth", categoryAr: "فلز قلوي ترابي", group: 2, period: 5, electronConfig: "[Kr] 5s²", color: CAT_COLORS["alkaline-earth"] },
  { number: 39, symbol: "Y", nameEn: "Yttrium", nameAr: "إتريوم", atomicMass: 88.906, category: "transition", categoryAr: "فلز انتقالي", group: 3, period: 5, electronConfig: "[Kr] 4d¹ 5s²", color: CAT_COLORS["transition"] },
  { number: 40, symbol: "Zr", nameEn: "Zirconium", nameAr: "زركونيوم", atomicMass: 91.224, category: "transition", categoryAr: "فلز انتقالي", group: 4, period: 5, electronConfig: "[Kr] 4d² 5s²", color: CAT_COLORS["transition"] },
  { number: 41, symbol: "Nb", nameEn: "Niobium", nameAr: "نيوبيوم", atomicMass: 92.906, category: "transition", categoryAr: "فلز انتقالي", group: 5, period: 5, electronConfig: "[Kr] 4d⁴ 5s¹", color: CAT_COLORS["transition"] },
  { number: 42, symbol: "Mo", nameEn: "Molybdenum", nameAr: "موليبدنوم", atomicMass: 95.95, category: "transition", categoryAr: "فلز انتقالي", group: 6, period: 5, electronConfig: "[Kr] 4d⁵ 5s¹", color: CAT_COLORS["transition"] },
  { number: 43, symbol: "Tc", nameEn: "Technetium", nameAr: "تكنيشيوم", atomicMass: 98, category: "transition", categoryAr: "فلز انتقالي", group: 7, period: 5, electronConfig: "[Kr] 4d⁵ 5s²", color: CAT_COLORS["transition"] },
  { number: 44, symbol: "Ru", nameEn: "Ruthenium", nameAr: "روثينيوم", atomicMass: 101.07, category: "transition", categoryAr: "فلز انتقالي", group: 8, period: 5, electronConfig: "[Kr] 4d⁷ 5s¹", color: CAT_COLORS["transition"] },
  { number: 45, symbol: "Rh", nameEn: "Rhodium", nameAr: "روديوم", atomicMass: 102.91, category: "transition", categoryAr: "فلز انتقالي", group: 9, period: 5, electronConfig: "[Kr] 4d⁸ 5s¹", color: CAT_COLORS["transition"] },
  { number: 46, symbol: "Pd", nameEn: "Palladium", nameAr: "بلاديوم", atomicMass: 106.42, category: "transition", categoryAr: "فلز انتقالي", group: 10, period: 5, electronConfig: "[Kr] 4d¹⁰", color: CAT_COLORS["transition"] },
  { number: 47, symbol: "Ag", nameEn: "Silver", nameAr: "فضة", atomicMass: 107.87, category: "transition", categoryAr: "فلز انتقالي", group: 11, period: 5, electronConfig: "[Kr] 4d¹⁰ 5s¹", color: CAT_COLORS["transition"] },
  { number: 48, symbol: "Cd", nameEn: "Cadmium", nameAr: "كادميوم", atomicMass: 112.41, category: "transition", categoryAr: "فلز انتقالي", group: 12, period: 5, electronConfig: "[Kr] 4d¹⁰ 5s²", color: CAT_COLORS["transition"] },
  { number: 49, symbol: "In", nameEn: "Indium", nameAr: "إنديوم", atomicMass: 114.82, category: "post-transition", categoryAr: "فلز ما بعد انتقالي", group: 13, period: 5, electronConfig: "[Kr] 4d¹⁰ 5s² 5p¹", color: CAT_COLORS["post-transition"] },
  { number: 50, symbol: "Sn", nameEn: "Tin", nameAr: "قصدير", atomicMass: 118.71, category: "post-transition", categoryAr: "فلز ما بعد انتقالي", group: 14, period: 5, electronConfig: "[Kr] 4d¹⁰ 5s² 5p²", color: CAT_COLORS["post-transition"] },
  { number: 51, symbol: "Sb", nameEn: "Antimony", nameAr: "أنتيمون", atomicMass: 121.76, category: "metalloid", categoryAr: "أشباه الفلزات", group: 15, period: 5, electronConfig: "[Kr] 4d¹⁰ 5s² 5p³", color: CAT_COLORS["metalloid"] },
  { number: 52, symbol: "Te", nameEn: "Tellurium", nameAr: "تيلوريوم", atomicMass: 127.60, category: "metalloid", categoryAr: "أشباه الفلزات", group: 16, period: 5, electronConfig: "[Kr] 4d¹⁰ 5s² 5p⁴", color: CAT_COLORS["metalloid"] },
  { number: 53, symbol: "I", nameEn: "Iodine", nameAr: "يود", atomicMass: 126.90, category: "halogen", categoryAr: "هالوجين", group: 17, period: 5, electronConfig: "[Kr] 4d¹⁰ 5s² 5p⁵", color: CAT_COLORS["halogen"] },
  { number: 54, symbol: "Xe", nameEn: "Xenon", nameAr: "زينون", atomicMass: 131.29, category: "noble-gas", categoryAr: "غاز نبيل", group: 18, period: 5, electronConfig: "[Kr] 4d¹⁰ 5s² 5p⁶", color: CAT_COLORS["noble-gas"] },
  { number: 55, symbol: "Cs", nameEn: "Cesium", nameAr: "سيزيوم", atomicMass: 132.91, category: "alkali-metal", categoryAr: "فلز قلوي", group: 1, period: 6, electronConfig: "[Xe] 6s¹", color: CAT_COLORS["alkali-metal"] },
  { number: 56, symbol: "Ba", nameEn: "Barium", nameAr: "باريوم", atomicMass: 137.33, category: "alkaline-earth", categoryAr: "فلز قلوي ترابي", group: 2, period: 6, electronConfig: "[Xe] 6s²", color: CAT_COLORS["alkaline-earth"] },
  // Lanthanides
  { number: 57, symbol: "La", nameEn: "Lanthanum", nameAr: "لانثانوم", atomicMass: 138.91, category: "lanthanide", categoryAr: "لانثانيد", group: null, period: 6, electronConfig: "[Xe] 5d¹ 6s²", color: CAT_COLORS["lanthanide"] },
  { number: 58, symbol: "Ce", nameEn: "Cerium", nameAr: "سيريوم", atomicMass: 140.12, category: "lanthanide", categoryAr: "لانثانيد", group: null, period: 6, electronConfig: "[Xe] 4f¹ 5d¹ 6s²", color: CAT_COLORS["lanthanide"] },
  { number: 59, symbol: "Pr", nameEn: "Praseodymium", nameAr: "براسيوديميوم", atomicMass: 140.91, category: "lanthanide", categoryAr: "لانثانيد", group: null, period: 6, electronConfig: "[Xe] 4f³ 6s²", color: CAT_COLORS["lanthanide"] },
  { number: 60, symbol: "Nd", nameEn: "Neodymium", nameAr: "نيوديميوم", atomicMass: 144.24, category: "lanthanide", categoryAr: "لانثانيد", group: null, period: 6, electronConfig: "[Xe] 4f⁴ 6s²", color: CAT_COLORS["lanthanide"] },
  { number: 61, symbol: "Pm", nameEn: "Promethium", nameAr: "بروميثيوم", atomicMass: 145, category: "lanthanide", categoryAr: "لانثانيد", group: null, period: 6, electronConfig: "[Xe] 4f⁵ 6s²", color: CAT_COLORS["lanthanide"] },
  { number: 62, symbol: "Sm", nameEn: "Samarium", nameAr: "ساماريوم", atomicMass: 150.36, category: "lanthanide", categoryAr: "لانثانيد", group: null, period: 6, electronConfig: "[Xe] 4f⁶ 6s²", color: CAT_COLORS["lanthanide"] },
  { number: 63, symbol: "Eu", nameEn: "Europium", nameAr: "يوروبيوم", atomicMass: 151.96, category: "lanthanide", categoryAr: "لانثانيد", group: null, period: 6, electronConfig: "[Xe] 4f⁷ 6s²", color: CAT_COLORS["lanthanide"] },
  { number: 64, symbol: "Gd", nameEn: "Gadolinium", nameAr: "غادولينيوم", atomicMass: 157.25, category: "lanthanide", categoryAr: "لانثانيد", group: null, period: 6, electronConfig: "[Xe] 4f⁷ 5d¹ 6s²", color: CAT_COLORS["lanthanide"] },
  { number: 65, symbol: "Tb", nameEn: "Terbium", nameAr: "تربيوم", atomicMass: 158.93, category: "lanthanide", categoryAr: "لانثانيد", group: null, period: 6, electronConfig: "[Xe] 4f⁹ 6s²", color: CAT_COLORS["lanthanide"] },
  { number: 66, symbol: "Dy", nameEn: "Dysprosium", nameAr: "ديسبروسيوم", atomicMass: 162.50, category: "lanthanide", categoryAr: "لانثانيد", group: null, period: 6, electronConfig: "[Xe] 4f¹⁰ 6s²", color: CAT_COLORS["lanthanide"] },
  { number: 67, symbol: "Ho", nameEn: "Holmium", nameAr: "هولميوم", atomicMass: 164.93, category: "lanthanide", categoryAr: "لانثانيد", group: null, period: 6, electronConfig: "[Xe] 4f¹¹ 6s²", color: CAT_COLORS["lanthanide"] },
  { number: 68, symbol: "Er", nameEn: "Erbium", nameAr: "إربيوم", atomicMass: 167.26, category: "lanthanide", categoryAr: "لانثانيد", group: null, period: 6, electronConfig: "[Xe] 4f¹² 6s²", color: CAT_COLORS["lanthanide"] },
  { number: 69, symbol: "Tm", nameEn: "Thulium", nameAr: "ثوليوم", atomicMass: 168.93, category: "lanthanide", categoryAr: "لانثانيد", group: null, period: 6, electronConfig: "[Xe] 4f¹³ 6s²", color: CAT_COLORS["lanthanide"] },
  { number: 70, symbol: "Yb", nameEn: "Ytterbium", nameAr: "إيتربيوم", atomicMass: 173.05, category: "lanthanide", categoryAr: "لانثانيد", group: null, period: 6, electronConfig: "[Xe] 4f¹⁴ 6s²", color: CAT_COLORS["lanthanide"] },
  { number: 71, symbol: "Lu", nameEn: "Lutetium", nameAr: "لوتيشيوم", atomicMass: 174.97, category: "lanthanide", categoryAr: "لانثانيد", group: 3, period: 6, electronConfig: "[Xe] 4f¹⁴ 5d¹ 6s²", color: CAT_COLORS["lanthanide"] },
  { number: 72, symbol: "Hf", nameEn: "Hafnium", nameAr: "هافنيوم", atomicMass: 178.49, category: "transition", categoryAr: "فلز انتقالي", group: 4, period: 6, electronConfig: "[Xe] 4f¹⁴ 5d² 6s²", color: CAT_COLORS["transition"] },
  { number: 73, symbol: "Ta", nameEn: "Tantalum", nameAr: "تنتالم", atomicMass: 180.95, category: "transition", categoryAr: "فلز انتقالي", group: 5, period: 6, electronConfig: "[Xe] 4f¹⁴ 5d³ 6s²", color: CAT_COLORS["transition"] },
  { number: 74, symbol: "W", nameEn: "Tungsten", nameAr: "تنجستن", atomicMass: 183.84, category: "transition", categoryAr: "فلز انتقالي", group: 6, period: 6, electronConfig: "[Xe] 4f¹⁴ 5d⁴ 6s²", color: CAT_COLORS["transition"] },
  { number: 75, symbol: "Re", nameEn: "Rhenium", nameAr: "رينيوم", atomicMass: 186.21, category: "transition", categoryAr: "فلز انتقالي", group: 7, period: 6, electronConfig: "[Xe] 4f¹⁴ 5d⁵ 6s²", color: CAT_COLORS["transition"] },
  { number: 76, symbol: "Os", nameEn: "Osmium", nameAr: "أوزميوم", atomicMass: 190.23, category: "transition", categoryAr: "فلز انتقالي", group: 8, period: 6, electronConfig: "[Xe] 4f¹⁴ 5d⁶ 6s²", color: CAT_COLORS["transition"] },
  { number: 77, symbol: "Ir", nameEn: "Iridium", nameAr: "إيريديوم", atomicMass: 192.22, category: "transition", categoryAr: "فلز انتقالي", group: 9, period: 6, electronConfig: "[Xe] 4f¹⁴ 5d⁷ 6s²", color: CAT_COLORS["transition"] },
  { number: 78, symbol: "Pt", nameEn: "Platinum", nameAr: "بلاتين", atomicMass: 195.08, category: "transition", categoryAr: "فلز انتقالي", group: 10, period: 6, electronConfig: "[Xe] 4f¹⁴ 5d⁹ 6s¹", color: CAT_COLORS["transition"] },
  { number: 79, symbol: "Au", nameEn: "Gold", nameAr: "ذهب", atomicMass: 196.97, category: "transition", categoryAr: "فلز انتقالي", group: 11, period: 6, electronConfig: "[Xe] 4f¹⁴ 5d¹⁰ 6s¹", color: CAT_COLORS["transition"] },
  { number: 80, symbol: "Hg", nameEn: "Mercury", nameAr: "زئبق", atomicMass: 200.59, category: "transition", categoryAr: "فلز انتقالي", group: 12, period: 6, electronConfig: "[Xe] 4f¹⁴ 5d¹⁰ 6s²", color: CAT_COLORS["transition"] },
  { number: 81, symbol: "Tl", nameEn: "Thallium", nameAr: "ثاليوم", atomicMass: 204.38, category: "post-transition", categoryAr: "فلز ما بعد انتقالي", group: 13, period: 6, electronConfig: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹", color: CAT_COLORS["post-transition"] },
  { number: 82, symbol: "Pb", nameEn: "Lead", nameAr: "رصاص", atomicMass: 207.2, category: "post-transition", categoryAr: "فلز ما بعد انتقالي", group: 14, period: 6, electronConfig: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²", color: CAT_COLORS["post-transition"] },
  { number: 83, symbol: "Bi", nameEn: "Bismuth", nameAr: "بزموت", atomicMass: 208.98, category: "post-transition", categoryAr: "فلز ما بعد انتقالي", group: 15, period: 6, electronConfig: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³", color: CAT_COLORS["post-transition"] },
  { number: 84, symbol: "Po", nameEn: "Polonium", nameAr: "بولونيوم", atomicMass: 209, category: "post-transition", categoryAr: "فلز ما بعد انتقالي", group: 16, period: 6, electronConfig: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴", color: CAT_COLORS["post-transition"] },
  { number: 85, symbol: "At", nameEn: "Astatine", nameAr: "أستاتين", atomicMass: 210, category: "halogen", categoryAr: "هالوجين", group: 17, period: 6, electronConfig: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵", color: CAT_COLORS["halogen"] },
  { number: 86, symbol: "Rn", nameEn: "Radon", nameAr: "رادون", atomicMass: 222, category: "noble-gas", categoryAr: "غاز نبيل", group: 18, period: 6, electronConfig: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶", color: CAT_COLORS["noble-gas"] },
  { number: 87, symbol: "Fr", nameEn: "Francium", nameAr: "فرانسيوم", atomicMass: 223, category: "alkali-metal", categoryAr: "فلز قلوي", group: 1, period: 7, electronConfig: "[Rn] 7s¹", color: CAT_COLORS["alkali-metal"] },
  { number: 88, symbol: "Ra", nameEn: "Radium", nameAr: "راديوم", atomicMass: 226, category: "alkaline-earth", categoryAr: "فلز قلوي ترابي", group: 2, period: 7, electronConfig: "[Rn] 7s²", color: CAT_COLORS["alkaline-earth"] },
  // Actinides
  { number: 89, symbol: "Ac", nameEn: "Actinium", nameAr: "أكتينيوم", atomicMass: 227, category: "actinide", categoryAr: "أكتينيد", group: null, period: 7, electronConfig: "[Rn] 6d¹ 7s²", color: CAT_COLORS["actinide"] },
  { number: 90, symbol: "Th", nameEn: "Thorium", nameAr: "ثوريوم", atomicMass: 232.04, category: "actinide", categoryAr: "أكتينيد", group: null, period: 7, electronConfig: "[Rn] 6d² 7s²", color: CAT_COLORS["actinide"] },
  { number: 91, symbol: "Pa", nameEn: "Protactinium", nameAr: "بروتكتينيوم", atomicMass: 231.04, category: "actinide", categoryAr: "أكتينيد", group: null, period: 7, electronConfig: "[Rn] 5f² 6d¹ 7s²", color: CAT_COLORS["actinide"] },
  { number: 92, symbol: "U", nameEn: "Uranium", nameAr: "يورانيوم", atomicMass: 238.03, category: "actinide", categoryAr: "أكتينيد", group: null, period: 7, electronConfig: "[Rn] 5f³ 6d¹ 7s²", color: CAT_COLORS["actinide"] },
  { number: 93, symbol: "Np", nameEn: "Neptunium", nameAr: "نبتونيوم", atomicMass: 237, category: "actinide", categoryAr: "أكتينيد", group: null, period: 7, electronConfig: "[Rn] 5f⁴ 6d¹ 7s²", color: CAT_COLORS["actinide"] },
  { number: 94, symbol: "Pu", nameEn: "Plutonium", nameAr: "بلوتونيوم", atomicMass: 244, category: "actinide", categoryAr: "أكتينيد", group: null, period: 7, electronConfig: "[Rn] 5f⁶ 7s²", color: CAT_COLORS["actinide"] },
  { number: 95, symbol: "Am", nameEn: "Americium", nameAr: "أمريكيوم", atomicMass: 243, category: "actinide", categoryAr: "أكتينيد", group: null, period: 7, electronConfig: "[Rn] 5f⁷ 7s²", color: CAT_COLORS["actinide"] },
  { number: 96, symbol: "Cm", nameEn: "Curium", nameAr: "كوريوم", atomicMass: 247, category: "actinide", categoryAr: "أكتينيد", group: null, period: 7, electronConfig: "[Rn] 5f⁷ 6d¹ 7s²", color: CAT_COLORS["actinide"] },
  { number: 97, symbol: "Bk", nameEn: "Berkelium", nameAr: "بركيليوم", atomicMass: 247, category: "actinide", categoryAr: "أكتينيد", group: null, period: 7, electronConfig: "[Rn] 5f⁹ 7s²", color: CAT_COLORS["actinide"] },
  { number: 98, symbol: "Cf", nameEn: "Californium", nameAr: "كاليفورنيوم", atomicMass: 251, category: "actinide", categoryAr: "أكتينيد", group: null, period: 7, electronConfig: "[Rn] 5f¹⁰ 7s²", color: CAT_COLORS["actinide"] },
  { number: 99, symbol: "Es", nameEn: "Einsteinium", nameAr: "أينشتاينيوم", atomicMass: 252, category: "actinide", categoryAr: "أكتينيد", group: null, period: 7, electronConfig: "[Rn] 5f¹¹ 7s²", color: CAT_COLORS["actinide"] },
  { number: 100, symbol: "Fm", nameEn: "Fermium", nameAr: "فيرميوم", atomicMass: 257, category: "actinide", categoryAr: "أكتينيد", group: null, period: 7, electronConfig: "[Rn] 5f¹² 7s²", color: CAT_COLORS["actinide"] },
  { number: 101, symbol: "Md", nameEn: "Mendelevium", nameAr: "مندليفيوم", atomicMass: 258, category: "actinide", categoryAr: "أكتينيد", group: null, period: 7, electronConfig: "[Rn] 5f¹³ 7s²", color: CAT_COLORS["actinide"] },
  { number: 102, symbol: "No", nameEn: "Nobelium", nameAr: "نوبليوم", atomicMass: 259, category: "actinide", categoryAr: "أكتينيد", group: null, period: 7, electronConfig: "[Rn] 5f¹⁴ 7s²", color: CAT_COLORS["actinide"] },
  { number: 103, symbol: "Lr", nameEn: "Lawrencium", nameAr: "لورنسيوم", atomicMass: 266, category: "actinide", categoryAr: "أكتينيد", group: 3, period: 7, electronConfig: "[Rn] 5f¹⁴ 7s² 7p¹", color: CAT_COLORS["actinide"] },
  { number: 104, symbol: "Rf", nameEn: "Rutherfordium", nameAr: "رذرفوريوم", atomicMass: 267, category: "transition", categoryAr: "فلز انتقالي", group: 4, period: 7, electronConfig: "[Rn] 5f¹⁴ 6d² 7s²", color: CAT_COLORS["transition"] },
  { number: 105, symbol: "Db", nameEn: "Dubnium", nameAr: "دبنيوم", atomicMass: 268, category: "transition", categoryAr: "فلز انتقالي", group: 5, period: 7, electronConfig: "[Rn] 5f¹⁴ 6d³ 7s²", color: CAT_COLORS["transition"] },
  { number: 106, symbol: "Sg", nameEn: "Seaborgium", nameAr: "سيبورغيوم", atomicMass: 269, category: "transition", categoryAr: "فلز انتقالي", group: 6, period: 7, electronConfig: "[Rn] 5f¹⁴ 6d⁴ 7s²", color: CAT_COLORS["transition"] },
  { number: 107, symbol: "Bh", nameEn: "Bohrium", nameAr: "بوريوم", atomicMass: 270, category: "transition", categoryAr: "فلز انتقالي", group: 7, period: 7, electronConfig: "[Rn] 5f¹⁴ 6d⁵ 7s²", color: CAT_COLORS["transition"] },
  { number: 108, symbol: "Hs", nameEn: "Hassium", nameAr: "هاسيوم", atomicMass: 269, category: "transition", categoryAr: "فلز انتقالي", group: 8, period: 7, electronConfig: "[Rn] 5f¹⁴ 6d⁶ 7s²", color: CAT_COLORS["transition"] },
  { number: 109, symbol: "Mt", nameEn: "Meitnerium", nameAr: "مايتنريوم", atomicMass: 278, category: "unknown", categoryAr: "غير معروف", group: 9, period: 7, electronConfig: "[Rn] 5f¹⁴ 6d⁷ 7s²", color: CAT_COLORS["unknown"] },
  { number: 110, symbol: "Ds", nameEn: "Darmstadtium", nameAr: "دارمشتاتيوم", atomicMass: 281, category: "unknown", categoryAr: "غير معروف", group: 10, period: 7, electronConfig: "[Rn] 5f¹⁴ 6d⁸ 7s²", color: CAT_COLORS["unknown"] },
  { number: 111, symbol: "Rg", nameEn: "Roentgenium", nameAr: "رونتجينيوم", atomicMass: 282, category: "unknown", categoryAr: "غير معروف", group: 11, period: 7, electronConfig: "[Rn] 5f¹⁴ 6d⁹ 7s²", color: CAT_COLORS["unknown"] },
  { number: 112, symbol: "Cn", nameEn: "Copernicium", nameAr: "كوبرنيسيوم", atomicMass: 285, category: "post-transition", categoryAr: "فلز ما بعد انتقالي", group: 12, period: 7, electronConfig: "[Rn] 5f¹⁴ 6d¹⁰ 7s²", color: CAT_COLORS["post-transition"] },
  { number: 113, symbol: "Nh", nameEn: "Nihonium", nameAr: "نيهونيوم", atomicMass: 286, category: "unknown", categoryAr: "غير معروف", group: 13, period: 7, electronConfig: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹", color: CAT_COLORS["unknown"] },
  { number: 114, symbol: "Fl", nameEn: "Flerovium", nameAr: "فليروفيوم", atomicMass: 289, category: "post-transition", categoryAr: "فلز ما بعد انتقالي", group: 14, period: 7, electronConfig: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²", color: CAT_COLORS["post-transition"] },
  { number: 115, symbol: "Mc", nameEn: "Moscovium", nameAr: "موسكوفيوم", atomicMass: 290, category: "unknown", categoryAr: "غير معروف", group: 15, period: 7, electronConfig: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³", color: CAT_COLORS["unknown"] },
  { number: 116, symbol: "Lv", nameEn: "Livermorium", nameAr: "ليفرموريوم", atomicMass: 293, category: "unknown", categoryAr: "غير معروف", group: 16, period: 7, electronConfig: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴", color: CAT_COLORS["unknown"] },
  { number: 117, symbol: "Ts", nameEn: "Tennessine", nameAr: "تينيسين", atomicMass: 294, category: "halogen", categoryAr: "هالوجين", group: 17, period: 7, electronConfig: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵", color: CAT_COLORS["halogen"] },
  { number: 118, symbol: "Og", nameEn: "Oganesson", nameAr: "أوغانيسون", atomicMass: 294, category: "noble-gas", categoryAr: "غاز نبيل", group: 18, period: 7, electronConfig: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶", color: CAT_COLORS["noble-gas"] },
];

export function getElementBySymbol(symbol: string): Element | undefined {
  return ELEMENTS.find((e) => e.symbol === symbol);
}

export function getElementByNumber(num: number): Element | undefined {
  return ELEMENTS.find((e) => e.number === num);
}

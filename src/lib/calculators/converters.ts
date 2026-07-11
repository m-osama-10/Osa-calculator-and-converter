// ============================================================================
// Unit Converters — Length, Weight/Mass, Area, Volume, Temperature, Time,
// Speed, Data Storage, Pressure, Energy, Power, Angle, Frequency, Fuel,
// Force, Torque, Acceleration, Density, Flow Rate, Viscosity, Internet Speed,
// Concentration, Radiation, Light, Sound, Magnetic, Electric, Currency (static)
// ============================================================================

import type { Calculator, Field } from "../types";
import { num, fmt } from "../calculator-utils";

// Static reference currency rates (1 unit = X USD)
const CURRENCY_RATES: Record<string, number> = {
  USD: 1,
  EUR: 1.08,
  GBP: 1.27,
  JPY: 0.0067,
  CHF: 1.12,
  CAD: 0.74,
  AUD: 0.66,
  CNY: 0.14,
  INR: 0.012,
  RUB: 0.011,
  BRL: 0.20,
  ZAR: 0.054,
  MXN: 0.059,
  KRW: 0.00075,
  SGD: 0.74,
  HKD: 0.13,
  NOK: 0.094,
  SEK: 0.096,
  DKK: 0.145,
  PLN: 0.25,
  TRY: 0.031,
  AED: 0.27,
  SAR: 0.27,
  EGP: 0.021,
  QAR: 0.27,
  KWD: 3.25,
  BHD: 2.65,
  OMR: 2.60,
  JOD: 1.41,
  LBP: 0.000011,
  IRR: 0.000024,
  IQD: 0.00076,
  PKR: 0.0036,
  IDR: 0.000063,
  MYR: 0.21,
  THB: 0.028,
  PHP: 0.017,
  VND: 0.000039,
  NZD: 0.61,
  CZK: 0.044,
  HUF: 0.0028,
  ILS: 0.27,
  CLP: 0.0011,
  ARS: 0.0011,
  COP: 0.00025,
  PEN: 0.27,
  UAH: 0.025,
  RON: 0.22,
  BGN: 0.55,
};

const CURRENCY_OPTIONS = Object.keys(CURRENCY_RATES).sort().map((code) => ({
  value: code,
  label: { en: code, ar: code },
}));

// ---------------------------------------------------------------------------
// Helper to build a "from-to" converter with a factor table
// ---------------------------------------------------------------------------
function makeFactorConverter(opts: {
  id: string;
  names: { en: string; ar: string };
  descriptions: { en: string; ar: string };
  keywords: string[];
  icon: string;
  units: Array<{ value: string; label: { en: string; ar: string }; factor: number }>;
  baseUnit: { en: string; ar: string };
}): Calculator {
  const unitOptions = opts.units.map((u) => ({ value: u.value, label: u.label }));
  const fields: Field[] = [
    {
      key: "value",
      names: { en: "Value", ar: "القيمة" },
      type: "number",
      default: 1,
    },
    {
      key: "from",
      names: { en: "From", ar: "من" },
      type: "select",
      default: opts.units[0].value,
      options: unitOptions,
    },
    {
      key: "to",
      names: { en: "To", ar: "إلى" },
      type: "select",
      default: opts.units[1]?.value ?? opts.units[0].value,
      options: unitOptions,
    },
  ];
  return {
    id: opts.id,
    category: "converters",
    names: opts.names,
    descriptions: opts.descriptions,
    keywords: opts.keywords,
    icon: opts.icon,
    live: true,
    fields,
    compute: (v) => {
      const value = num(v.value);
      const from = String(v.from);
      const to = String(v.to);
      if (Number.isNaN(value)) return { results: [], error: { en: "Enter a number", ar: "أدخل رقمًا" } };
      const fromU = opts.units.find((u) => u.value === from);
      const toU = opts.units.find((u) => u.value === to);
      if (!fromU || !toU) return { results: [], error: { en: "Invalid unit", ar: "وحدة غير صالحة" } };
      const result = (value * fromU.factor) / toU.factor;
      return {
        results: [
          {
            label: { en: `Result (${toU.label.en})`, ar: `النتيجة (${toU.label.ar})` },
            value: fmt(result, 8),
            primary: true,
          },
        ],
        formula: `${value} ${fromU.label.en} × (${fromU.factor} / ${toU.factor}) = ${fmt(result, 8)} ${toU.label.en}`,
        steps: [
          { description: { en: `Convert ${value} ${fromU.label.en} to base (${opts.baseUnit.en})`, ar: `حوّل ${value} ${fromU.label.ar} إلى الأساس (${opts.baseUnit.ar})` }, expression: `${value} × ${fromU.factor} = ${fmt(value * fromU.factor, 8)}` },
          { description: { en: `Convert from base to ${toU.label.en}`, ar: `حوّل من الأساس إلى ${toU.label.ar}` }, expression: `${fmt(value * fromU.factor, 8)} ÷ ${toU.factor} = ${fmt(result, 8)}` },
        ],
        explanation: {
          en: `All units are first converted to ${opts.baseUnit.en}, then to the target unit using the conversion factor.`,
          ar: `يتم تحويل جميع الوحدات أولاً إلى ${opts.baseUnit.ar}، ثم إلى الوحدة المستهدفة باستخدام معامل التحويل.`,
        },
      };
    },
  };
}

export const converterCalculators: Calculator[] = [
  // Length
  makeFactorConverter({
    id: "conv-length",
    names: { en: "Length Converter", ar: "محوّل الطول" },
    descriptions: { en: "Convert between metric and imperial length units.", ar: "تحويل بين وحدات الطول المترية والإمبراطورية." },
    keywords: ["length", "distance", "meter", "foot", "inch", "mile", "km", "طول", "مسافة"],
    icon: "Ruler",
    baseUnit: { en: "meter", ar: "متر" },
    units: [
      { value: "nm", label: { en: "Nanometer (nm)", ar: "نانومتر" }, factor: 1e-9 },
      { value: "um", label: { en: "Micrometer (µm)", ar: "ميكرومتر" }, factor: 1e-6 },
      { value: "mm", label: { en: "Millimeter (mm)", ar: "مليمتر" }, factor: 0.001 },
      { value: "cm", label: { en: "Centimeter (cm)", ar: "سنتيمتر" }, factor: 0.01 },
      { value: "m", label: { en: "Meter (m)", ar: "متر" }, factor: 1 },
      { value: "km", label: { en: "Kilometer (km)", ar: "كيلومتر" }, factor: 1000 },
      { value: "in", label: { en: "Inch (in)", ar: "بوصة" }, factor: 0.0254 },
      { value: "ft", label: { en: "Foot (ft)", ar: "قدم" }, factor: 0.3048 },
      { value: "yd", label: { en: "Yard (yd)", ar: "ياردة" }, factor: 0.9144 },
      { value: "mi", label: { en: "Mile (mi)", ar: "ميل" }, factor: 1609.344 },
      { value: "nmi", label: { en: "Nautical mile (nmi)", ar: "ميل بحري" }, factor: 1852 },
      { value: "ly", label: { en: "Light year", ar: "سنة ضوئية" }, factor: 9.4607e15 },
      { value: "au", label: { en: "Astronomical unit (AU)", ar: "وحدة فلكية" }, factor: 1.495978707e11 },
      { value: "parsec", label: { en: "Parsec", ar: "بارسيك" }, factor: 3.085677581e16 },
    ],
  }),

  // Weight / Mass
  makeFactorConverter({
    id: "conv-weight",
    names: { en: "Weight / Mass Converter", ar: "محوّل الوزن / الكتلة" },
    descriptions: { en: "Convert between metric and imperial mass units.", ar: "تحويل بين وحدات الكتلة المترية والإمبراطورية." },
    keywords: ["weight", "mass", "kg", "lb", "pound", "gram", "ounce", "وزن", "كتلة"],
    icon: "Scale",
    baseUnit: { en: "kilogram", ar: "كيلوجرام" },
    units: [
      { value: "ug", label: { en: "Microgram (µg)", ar: "ميكروجرام" }, factor: 1e-9 },
      { value: "mg", label: { en: "Milligram (mg)", ar: "مليجرام" }, factor: 1e-6 },
      { value: "g", label: { en: "Gram (g)", ar: "جرام" }, factor: 0.001 },
      { value: "kg", label: { en: "Kilogram (kg)", ar: "كيلوجرام" }, factor: 1 },
      { value: "t", label: { en: "Metric ton (t)", ar: "طن" }, factor: 1000 },
      { value: "oz", label: { en: "Ounce (oz)", ar: "أونصة" }, factor: 0.028349523125 },
      { value: "lb", label: { en: "Pound (lb)", ar: "رطل" }, factor: 0.45359237 },
      { value: "st", label: { en: "Stone (st)", ar: "ستون" }, factor: 6.35029318 },
      { value: "tonUS", label: { en: "US ton (short)", ar: "طن أمريكي" }, factor: 907.18474 },
      { value: "tonUK", label: { en: "UK ton (long)", ar: "طن بريطاني" }, factor: 1016.0469088 },
      { value: "carat", label: { en: "Carat (ct)", ar: "قيراط" }, factor: 0.0002 },
      { value: "amu", label: { en: "Atomic mass unit (u)", ar: "وحدة كتل ذرية" }, factor: 1.66053906660e-27 },
    ],
  }),

  // Area
  makeFactorConverter({
    id: "conv-area",
    names: { en: "Area Converter", ar: "محوّل المساحة" },
    descriptions: { en: "Convert between metric and imperial area units.", ar: "تحويل بين وحدات المساحة المترية والإمبراطورية." },
    keywords: ["area", "m2", "sqft", "acre", "hectare", "مساحة"],
    icon: "Square",
    baseUnit: { en: "square meter", ar: "متر مربع" },
    units: [
      { value: "mm2", label: { en: "Square millimeter (mm²)", ar: "مليمتر مربع" }, factor: 1e-6 },
      { value: "cm2", label: { en: "Square centimeter (cm²)", ar: "سنتيمتر مربع" }, factor: 1e-4 },
      { value: "m2", label: { en: "Square meter (m²)", ar: "متر مربع" }, factor: 1 },
      { value: "km2", label: { en: "Square kilometer (km²)", ar: "كيلومتر مربع" }, factor: 1e6 },
      { value: "ha", label: { en: "Hectare (ha)", ar: "هكتار" }, factor: 1e4 },
      { value: "acre", label: { en: "Acre", ar: "فدان إنجليزي" }, factor: 4046.8564224 },
      { value: "in2", label: { en: "Square inch (in²)", ar: "بوصة مربعة" }, factor: 0.00064516 },
      { value: "ft2", label: { en: "Square foot (ft²)", ar: "قدم مربعة" }, factor: 0.09290304 },
      { value: "yd2", label: { en: "Square yard (yd²)", ar: "ياردة مربعة" }, factor: 0.83612736 },
      { value: "mi2", label: { en: "Square mile (mi²)", ar: "ميل مربع" }, factor: 2589988.110336 },
      { value: "feddan", label: { en: "Feddan (Egypt)", ar: "فدان مصري" }, factor: 4200 },
      { value: "dunam", label: { en: "Dunam", ar: "دونم" }, factor: 1000 },
    ],
  }),

  // Volume
  makeFactorConverter({
    id: "conv-volume",
    names: { en: "Volume Converter", ar: "محوّل الحجم" },
    descriptions: { en: "Convert between metric and imperial volume units.", ar: "تحويل بين وحدات الحجم المترية والإمبراطورية." },
    keywords: ["volume", "liter", "gallon", "ml", "cubic", "حجم", "لتر"],
    icon: "Beaker",
    baseUnit: { en: "liter", ar: "لتر" },
    units: [
      { value: "ml", label: { en: "Milliliter (mL)", ar: "مليلتر" }, factor: 0.001 },
      { value: "l", label: { en: "Liter (L)", ar: "لتر" }, factor: 1 },
      { value: "m3", label: { en: "Cubic meter (m³)", ar: "متر مكعب" }, factor: 1000 },
      { value: "cm3", label: { en: "Cubic centimeter (cm³)", ar: "سنتيمتر مكعب" }, factor: 0.001 },
      { value: "mm3", label: { en: "Cubic millimeter (mm³)", ar: "مليمتر مكعب" }, factor: 1e-6 },
      { value: "ft3", label: { en: "Cubic foot (ft³)", ar: "قدم مكعب" }, factor: 28.316846592 },
      { value: "in3", label: { en: "Cubic inch (in³)", ar: "بوصة مكعبة" }, factor: 0.016387064 },
      { value: "tsp", label: { en: "Teaspoon (US)", ar: "ملعقة صغيرة" }, factor: 0.00492892159375 },
      { value: "tbsp", label: { en: "Tablespoon (US)", ar: "ملعقة كبيرة" }, factor: 0.01478676478125 },
      { value: "floz", label: { en: "Fluid ounce (US)", ar: "أونصة سائلة" }, factor: 0.0295735295625 },
      { value: "cup", label: { en: "Cup (US)", ar: "كوب" }, factor: 0.2365882365 },
      { value: "pt", label: { en: "Pint (US)", ar: "باينت" }, factor: 0.473176473 },
      { value: "qt", label: { en: "Quart (US)", ar: "كوارت" }, factor: 0.946352946 },
      { value: "galUS", label: { en: "Gallon (US)", ar: "جالون أمريكي" }, factor: 3.785411784 },
      { value: "galUK", label: { en: "Gallon (UK)", ar: "جالون بريطاني" }, factor: 4.54609 },
      { value: "bbl", label: { en: "Barrel (oil)", ar: "برميل نفط" }, factor: 158.987294928 },
    ],
  }),

  // Temperature — special: non-linear
  {
    id: "conv-temperature",
    category: "converters",
    names: { en: "Temperature Converter", ar: "محوّل الحرارة" },
    descriptions: { en: "Convert between Celsius, Fahrenheit, Kelvin and Rankine.", ar: "تحويل بين مئوية، فهرنهايت، كلفن ورانكين." },
    keywords: ["temperature", "celsius", "fahrenheit", "kelvin", "حرارة", "مئوية", "فهرنهايت"],
    icon: "Thermometer",
    live: true,
    fields: [
      { key: "value", names: { en: "Value", ar: "القيمة" }, type: "number", default: 25 },
      {
        key: "from",
        names: { en: "From", ar: "من" },
        type: "select",
        default: "c",
        options: [
          { value: "c", label: { en: "Celsius (°C)", ar: "مئوية" } },
          { value: "f", label: { en: "Fahrenheit (°F)", ar: "فهرنهايت" } },
          { value: "k", label: { en: "Kelvin (K)", ar: "كلفن" } },
          { value: "r", label: { en: "Rankine (°R)", ar: "رانكين" } },
        ],
      },
      {
        key: "to",
        names: { en: "To", ar: "إلى" },
        type: "select",
        default: "f",
        options: [
          { value: "c", label: { en: "Celsius (°C)", ar: "مئوية" } },
          { value: "f", label: { en: "Fahrenheit (°F)", ar: "فهرنهايت" } },
          { value: "k", label: { en: "Kelvin (K)", ar: "كلفن" } },
          { value: "r", label: { en: "Rankine (°R)", ar: "رانكين" } },
        ],
      },
    ],
    compute: (v) => {
      const value = num(v.value);
      const from = String(v.from);
      const to = String(v.to);
      if (Number.isNaN(value)) return { results: [], error: { en: "Enter a number", ar: "أدخل رقمًا" } };

      // Convert to Celsius first
      let c: number;
      switch (from) {
        case "c": c = value; break;
        case "f": c = (value - 32) * (5 / 9); break;
        case "k": c = value - 273.15; break;
        case "r": c = (value - 491.67) * (5 / 9); break;
        default: return { results: [], error: { en: "Invalid from unit", ar: "وحدة غير صالحة" } };
      }
      let result: number;
      let unitSym = "";
      switch (to) {
        case "c": result = c; unitSym = "°C"; break;
        case "f": result = c * (9 / 5) + 32; unitSym = "°F"; break;
        case "k": result = c + 273.15; unitSym = "K"; break;
        case "r": result = (c + 273.15) * (9 / 5); unitSym = "°R"; break;
        default: return { results: [], error: { en: "Invalid to unit", ar: "وحدة غير صالحة" } };
      }
      const labels: Record<string, { en: string; ar: string }> = {
        c: { en: "Celsius", ar: "مئوية" },
        f: { en: "Fahrenheit", ar: "فهرنهايت" },
        k: { en: "Kelvin", ar: "كلفن" },
        r: { en: "Rankine", ar: "رانكين" },
      };
      return {
        results: [
          { label: { en: `Result (${labels[to].en})`, ar: `النتيجة (${labels[to].ar})` }, value: fmt(result, 4) + " " + unitSym, primary: true },
        ],
        formula: `${value} ${labels[from].en} → ${fmt(result, 4)} ${labels[to].en}`,
        steps: [
          { description: { en: `Convert ${value} ${labels[from].en} to Celsius`, ar: `حوّل ${value} ${labels[from].ar} إلى مئوية` }, expression: `= ${fmt(c, 4)} °C` },
          { description: { en: `Convert Celsius to ${labels[to].en}`, ar: `حوّل مئوية إلى ${labels[to].ar}` }, expression: `= ${fmt(result, 4)} ${unitSym}` },
        ],
      };
    },
  },

  // Time
  makeFactorConverter({
    id: "conv-time",
    names: { en: "Time Converter", ar: "محوّل الوقت" },
    descriptions: { en: "Convert between seconds, minutes, hours, days, weeks, months and years.", ar: "تحويل بين ثانية، دقيقة، ساعة، يوم، أسبوع، شهر وسنة." },
    keywords: ["time", "seconds", "minutes", "hours", "days", "وقت", "زمن"],
    icon: "Clock",
    baseUnit: { en: "second", ar: "ثانية" },
    units: [
      { value: "ns", label: { en: "Nanosecond", ar: "نانوثانية" }, factor: 1e-9 },
      { value: "us", label: { en: "Microsecond", ar: "ميكروثانية" }, factor: 1e-6 },
      { value: "ms", label: { en: "Millisecond", ar: "ميلي ثانية" }, factor: 0.001 },
      { value: "s", label: { en: "Second", ar: "ثانية" }, factor: 1 },
      { value: "min", label: { en: "Minute", ar: "دقيقة" }, factor: 60 },
      { value: "h", label: { en: "Hour", ar: "ساعة" }, factor: 3600 },
      { value: "d", label: { en: "Day", ar: "يوم" }, factor: 86400 },
      { value: "wk", label: { en: "Week", ar: "أسبوع" }, factor: 604800 },
      { value: "mo", label: { en: "Month (30.44d)", ar: "شهر" }, factor: 2629800 },
      { value: "yr", label: { en: "Year (365.25d)", ar: "سنة" }, factor: 31557600 },
      { value: "dec", label: { en: "Decade", ar: "عقد" }, factor: 315576000 },
      { value: "cen", label: { en: "Century", ar: "قرن" }, factor: 3155760000 },
    ],
  }),

  // Speed
  makeFactorConverter({
    id: "conv-speed",
    names: { en: "Speed Converter", ar: "محوّل السرعة" },
    descriptions: { en: "Convert between m/s, km/h, mph, knots and mach.", ar: "تحويل بين م/ث، كم/ساعة، ميل/ساعة، عقدة وماخ." },
    keywords: ["speed", "velocity", "mph", "kmh", "knot", "mach", "سرعة"],
    icon: "Gauge",
    baseUnit: { en: "meter/second", ar: "متر/ثانية" },
    units: [
      { value: "mps", label: { en: "Meter/second (m/s)", ar: "متر/ثانية" }, factor: 1 },
      { value: "kmh", label: { en: "Kilometer/hour (km/h)", ar: "كيلومتر/ساعة" }, factor: 0.277777778 },
      { value: "mph", label: { en: "Mile/hour (mph)", ar: "ميل/ساعة" }, factor: 0.44704 },
      { value: "fts", label: { en: "Foot/second (ft/s)", ar: "قدم/ثانية" }, factor: 0.3048 },
      { value: "knot", label: { en: "Knot", ar: "عقدة" }, factor: 0.514444444 },
      { value: "mach", label: { en: "Mach (sea level)", ar: "ماخ" }, factor: 340.29 },
      { value: "lightspeed", label: { en: "Speed of light (c)", ar: "سرعة الضوء" }, factor: 299792458 },
    ],
  }),

  // Data Storage
  makeFactorConverter({
    id: "conv-data",
    names: { en: "Data Storage Converter", ar: "محوّل تخزين البيانات" },
    descriptions: { en: "Convert between bit, byte, KB, MB, GB, TB, PB and more.", ar: "تحويل بين بت، بايت، ك.ب، م.ب، ج.ب، ت.ب، ب.ب." },
    keywords: ["data", "storage", "byte", "gb", "mb", "tb", "بيانات", "تخزين"],
    icon: "HardDrive",
    baseUnit: { en: "bit", ar: "بت" },
    units: [
      { value: "bit", label: { en: "Bit (b)", ar: "بت" }, factor: 1 },
      { value: "kbit", label: { en: "Kilobit (kb)", ar: "كيلوبت" }, factor: 1000 },
      { value: "Mbit", label: { en: "Megabit (Mb)", ar: "ميجابت" }, factor: 1e6 },
      { value: "Gbit", label: { en: "Gigabit (Gb)", ar: "جيجابت" }, factor: 1e9 },
      { value: "B", label: { en: "Byte (B)", ar: "بايت" }, factor: 8 },
      { value: "KiB", label: { en: "Kibibyte (KiB)", ar: "كيبي بايت" }, factor: 8 * 1024 },
      { value: "MiB", label: { en: "Mebibyte (MiB)", ar: "ميبي بايت" }, factor: 8 * 1024 ** 2 },
      { value: "GiB", label: { en: "Gibibyte (GiB)", ar: "جيبي بايت" }, factor: 8 * 1024 ** 3 },
      { value: "TiB", label: { en: "Tebibyte (TiB)", ar: "تيبي بايت" }, factor: 8 * 1024 ** 4 },
      { value: "PiB", label: { en: "Pebibyte (PiB)", ar: "بيبي بايت" }, factor: 8 * 1024 ** 5 },
      { value: "KB", label: { en: "Kilobyte (KB, 1000 B)", ar: "كيلوبايت" }, factor: 8 * 1000 },
      { value: "MB", label: { en: "Megabyte (MB)", ar: "ميجابايت" }, factor: 8 * 1e6 },
      { value: "GB", label: { en: "Gigabyte (GB)", ar: "جيجابايت" }, factor: 8 * 1e9 },
      { value: "TB", label: { en: "Terabyte (TB)", ar: "تيرابايت" }, factor: 8 * 1e12 },
      { value: "PB", label: { en: "Petabyte (PB)", ar: "بيتابايت" }, factor: 8 * 1e15 },
    ],
  }),

  // Pressure
  makeFactorConverter({
    id: "conv-pressure",
    names: { en: "Pressure Converter", ar: "محوّل الضغط" },
    descriptions: { en: "Convert between Pascal, bar, atm, psi, mmHg and more.", ar: "تحويل بين باسكال، بار، ضغط جوي، psi، mmHg." },
    keywords: ["pressure", "pascal", "bar", "psi", "atm", "mmhg", "ضغط"],
    icon: "Gauge",
    baseUnit: { en: "Pascal", ar: "باسكال" },
    units: [
      { value: "Pa", label: { en: "Pascal (Pa)", ar: "باسكال" }, factor: 1 },
      { value: "hPa", label: { en: "Hectopascal (hPa)", ar: "هكتوباسكال" }, factor: 100 },
      { value: "kPa", label: { en: "Kilopascal (kPa)", ar: "كيلوباسكال" }, factor: 1000 },
      { value: "MPa", label: { en: "Megapascal (MPa)", ar: "ميجاباسكال" }, factor: 1e6 },
      { value: "bar", label: { en: "Bar", ar: "بار" }, factor: 1e5 },
      { value: "mbar", label: { en: "Millibar", ar: "مليبار" }, factor: 100 },
      { value: "atm", label: { en: "Atmosphere (atm)", ar: "ضغط جوي" }, factor: 101325 },
      { value: "psi", label: { en: "Pound/inch² (psi)", ar: "psi" }, factor: 6894.757293168 },
      { value: "mmHg", label: { en: "mmHg (Torr)", ar: "مم زئبق" }, factor: 133.322368421 },
      { value: "inHg", label: { en: "inch Hg", ar: "بوصة زئبق" }, factor: 3386.389 },
      { value: "dyne_cm2", label: { en: "Dyne/cm²", ar: "داين/سم²" }, factor: 0.1 },
    ],
  }),

  // Energy
  makeFactorConverter({
    id: "conv-energy",
    names: { en: "Energy Converter", ar: "محوّل الطاقة" },
    descriptions: { en: "Convert between Joule, calorie, kWh, BTU, eV and more.", ar: "تحويل بين جول، سعر، كيلوواط ساعة، BTU، eV." },
    keywords: ["energy", "joule", "calorie", "kwh", "btu", "ev", "طاقة", "جول"],
    icon: "Zap",
    baseUnit: { en: "Joule", ar: "جول" },
    units: [
      { value: "J", label: { en: "Joule (J)", ar: "جول" }, factor: 1 },
      { value: "kJ", label: { en: "Kilojoule (kJ)", ar: "كيلوجول" }, factor: 1000 },
      { value: "cal", label: { en: "Calorie (cal)", ar: "سعر حراري صغير" }, factor: 4.184 },
      { value: "kcal", label: { en: "Kilocalorie (kcal)", ar: "سعر حراري كبير" }, factor: 4184 },
      { value: "Wh", label: { en: "Watt-hour (Wh)", ar: "واط ساعة" }, factor: 3600 },
      { value: "kWh", label: { en: "Kilowatt-hour (kWh)", ar: "كيلوواط ساعة" }, factor: 3.6e6 },
      { value: "MWh", label: { en: "Megawatt-hour (MWh)", ar: "ميجاواط ساعة" }, factor: 3.6e9 },
      { value: "BTU", label: { en: "British Thermal Unit (BTU)", ar: "وحدة حرارية بريطانية" }, factor: 1055.05585262 },
      { value: "ftlb", label: { en: "Foot-pound (ft·lb)", ar: "قدم-رطل" }, factor: 1.3558179483314 },
      { value: "eV", label: { en: "Electronvolt (eV)", ar: "إلكترون فولت" }, factor: 1.602176634e-19 },
      { value: "erg", label: { en: "Erg", ar: "إرغ" }, factor: 1e-7 },
      { value: "tonTNT", label: { en: "Ton of TNT", ar: "طن TNT" }, factor: 4.184e9 },
    ],
  }),

  // Power
  makeFactorConverter({
    id: "conv-power",
    names: { en: "Power Converter", ar: "محوّل القدرة" },
    descriptions: { en: "Convert between Watt, kilowatt, horsepower, BTU/h and more.", ar: "تحويل بين واط، كيلوواط، حصان، BTU/ساعة." },
    keywords: ["power", "watt", "kw", "horsepower", "hp", "قدرة"],
    icon: "Zap",
    baseUnit: { en: "Watt", ar: "واط" },
    units: [
      { value: "mW", label: { en: "Milliwatt (mW)", ar: "ميلي واط" }, factor: 0.001 },
      { value: "W", label: { en: "Watt (W)", ar: "واط" }, factor: 1 },
      { value: "kW", label: { en: "Kilowatt (kW)", ar: "كيلوواط" }, factor: 1000 },
      { value: "MW", label: { en: "Megawatt (MW)", ar: "ميجاواط" }, factor: 1e6 },
      { value: "GW", label: { en: "Gigawatt (GW)", ar: "جيجاواط" }, factor: 1e9 },
      { value: "hpM", label: { en: "Metric horsepower (PS)", ar: "حصان ميتري" }, factor: 735.49875 },
      { value: "hpI", label: { en: "Mechanical horsepower (hp)", ar: "حصان ميكانيكي" }, factor: 745.6998715822702 },
      { value: "BTUh", label: { en: "BTU/hour", ar: "BTU/ساعة" }, factor: 0.29307107017 },
      { value: "ftlbfs", label: { en: "Foot-pound/second", ar: "قدم-رطل/ثانية" }, factor: 1.3558179483314 },
      { value: "calories", label: { en: "Calorie/second", ar: "سعر/ثانية" }, factor: 4.184 },
    ],
  }),

  // Angle
  makeFactorConverter({
    id: "conv-angle",
    names: { en: "Angle Converter", ar: "محوّل الزوايا" },
    descriptions: { en: "Convert between degree, radian, gradian, turn and more.", ar: "تحويل بين درجة، راديان، جراديان، دورة." },
    keywords: ["angle", "degree", "radian", "gradian", "زاوية", "درجة"],
    icon: "Compass",
    baseUnit: { en: "radian", ar: "راديان" },
    units: [
      { value: "rad", label: { en: "Radian (rad)", ar: "راديان" }, factor: 1 },
      { value: "deg", label: { en: "Degree (°)", ar: "درجة" }, factor: Math.PI / 180 },
      { value: "arcmin", label: { en: "Arcminute (′)", ar: "دقيقة قوسية" }, factor: Math.PI / 10800 },
      { value: "arcsec", label: { en: "Arcsecond (″)", ar: "ثانية قوسية" }, factor: Math.PI / 648000 },
      { value: "grad", label: { en: "Gradian (gon)", ar: "جراديان" }, factor: Math.PI / 200 },
      { value: "turn", label: { en: "Turn", ar: "دورة" }, factor: 2 * Math.PI },
      { value: "mil", label: { en: "NATO mil", ar: "ميل ناتو" }, factor: 2 * Math.PI / 6400 },
    ],
  }),

  // Frequency
  makeFactorConverter({
    id: "conv-frequency",
    names: { en: "Frequency Converter", ar: "محوّل التردد" },
    descriptions: { en: "Convert between Hertz, kHz, MHz, GHz, RPM and more.", ar: "تحويل بين هرتز، ك.هرتز، م.هرتز، ج.هرتز، RPM." },
    keywords: ["frequency", "hertz", "hz", "rpm", "تردد", "هرتز"],
    icon: "Radio",
    baseUnit: { en: "Hertz", ar: "هرتز" },
    units: [
      { value: "mHz", label: { en: "Millihertz (mHz)", ar: "ميلي هرتز" }, factor: 0.001 },
      { value: "Hz", label: { en: "Hertz (Hz)", ar: "هرتز" }, factor: 1 },
      { value: "kHz", label: { en: "Kilohertz (kHz)", ar: "كيلو هرتز" }, factor: 1000 },
      { value: "MHz", label: { en: "Megahertz (MHz)", ar: "ميجا هرتز" }, factor: 1e6 },
      { value: "GHz", label: { en: "Gigahertz (GHz)", ar: "جيجا هرتز" }, factor: 1e9 },
      { value: "THz", label: { en: "Terahertz (THz)", ar: "تيرا هرتز" }, factor: 1e12 },
      { value: "rpm", label: { en: "Revolutions/min (RPM)", ar: "لفة/دقيقة" }, factor: 1 / 60 },
      { value: "deg_s", label: { en: "Degree/second", ar: "درجة/ثانية" }, factor: 1 / 360 },
      { value: "rad_s", label: { en: "Radian/second", ar: "راديان/ثانية" }, factor: 1 / (2 * Math.PI) },
    ],
  }),

  // Force
  makeFactorConverter({
    id: "conv-force",
    names: { en: "Force Converter", ar: "محوّل القوة" },
    descriptions: { en: "Convert between Newton, dyne, kgf, lbf and more.", ar: "تحويل بين نيوتن، داين، كجم-قوة، رطل-قوة." },
    keywords: ["force", "newton", "dyne", "kgf", "lbf", "قوة", "نيوتن"],
    icon: "ArrowUpFromLine",
    baseUnit: { en: "Newton", ar: "نيوتن" },
    units: [
      { value: "N", label: { en: "Newton (N)", ar: "نيوتن" }, factor: 1 },
      { value: "kN", label: { en: "Kilonewton (kN)", ar: "كيلو نيوتن" }, factor: 1000 },
      { value: "MN", label: { en: "Meganewton (MN)", ar: "ميجا نيوتن" }, factor: 1e6 },
      { value: "dyn", label: { en: "Dyne (dyn)", ar: "داين" }, factor: 1e-5 },
      { value: "kgf", label: { en: "Kilogram-force (kgf)", ar: "كجم-قوة" }, factor: 9.80665 },
      { value: "gf", label: { en: "Gram-force (gf)", ar: "جم-قوة" }, factor: 0.00980665 },
      { value: "lbf", label: { en: "Pound-force (lbf)", ar: "رطل-قوة" }, factor: 4.4482216152605 },
      { value: "ozf", label: { en: "Ounce-force (ozf)", ar: "أونصة-قوة" }, factor: 0.27801385095378125 },
      { value: "pdl", label: { en: "Poundal (pdl)", ar: "باوندل" }, factor: 0.138254954376 },
      { value: "kip", label: { en: "Kip (kip)", ar: "كيب" }, factor: 4448.2216152605 },
    ],
  }),

  // Torque
  makeFactorConverter({
    id: "conv-torque",
    names: { en: "Torque Converter", ar: "محوّل عزم الدوران" },
    descriptions: { en: "Convert between N·m, ft·lbf, kgf·m and more.", ar: "تحويل بين نيوتن·متر، قدم·رطل-قوة، كجم·قوة·متر." },
    keywords: ["torque", "moment", "nm", "ftlb", "عزم", "دوران"],
    icon: "RotateCw",
    baseUnit: { en: "Newton-meter", ar: "نيوتن·متر" },
    units: [
      { value: "N_m", label: { en: "Newton-meter (N·m)", ar: "نيوتن·متر" }, factor: 1 },
      { value: "N_cm", label: { en: "Newton-centimeter", ar: "نيوتن·سم" }, factor: 0.01 },
      { value: "dyn_cm", label: { en: "Dyne-centimeter", ar: "داين·سم" }, factor: 1e-7 },
      { value: "kgf_m", label: { en: "Kilogram-force·meter", ar: "كجم-قوة·متر" }, factor: 9.80665 },
      { value: "kgf_cm", label: { en: "Kilogram-force·cm", ar: "كجم-قوة·سم" }, factor: 0.0980665 },
      { value: "ft_lbf", label: { en: "Foot-pound (ft·lbf)", ar: "قدم·رطل-قوة" }, factor: 1.3558179483314 },
      { value: "in_lbf", label: { en: "Inch-pound (in·lbf)", ar: "بوصة·رطل-قوة" }, factor: 0.1129848290276167 },
      { value: "in_ozf", label: { en: "Inch-ounce (in·ozf)", ar: "بوصة·أونصة-قوة" }, factor: 0.007061551814084 },
    ],
  }),

  // Acceleration
  makeFactorConverter({
    id: "conv-acceleration",
    names: { en: "Acceleration Converter", ar: "محوّل التسارع" },
    descriptions: { en: "Convert between m/s², g, ft/s² and Gal.", ar: "تحويل بين م/ث²، g، قدم/ث²، غال." },
    keywords: ["acceleration", "gravity", "g-force", "تسارع", "جاذبية"],
    icon: "TrendingUp",
    baseUnit: { en: "meter/second²", ar: "متر/ث²" },
    units: [
      { value: "m_s2", label: { en: "Meter/second² (m/s²)", ar: "متر/ث²" }, factor: 1 },
      { value: "km_s2", label: { en: "Kilometer/second²", ar: "كيلومتر/ث²" }, factor: 1000 },
      { value: "cm_s2", label: { en: "Centimeter/second² (Gal)", ar: "سم/ث² (غال)" }, factor: 0.01 },
      { value: "mm_s2", label: { en: "Millimeter/second²", ar: "مم/ث²" }, factor: 0.001 },
      { value: "ft_s2", label: { en: "Foot/second² (ft/s²)", ar: "قدم/ث²" }, factor: 0.3048 },
      { value: "in_s2", label: { en: "Inch/second² (in/s²)", ar: "بوصة/ث²" }, factor: 0.0254 },
      { value: "g", label: { en: "Standard gravity (g)", ar: "جاذبية قياسية" }, factor: 9.80665 },
    ],
  }),

  // Density
  makeFactorConverter({
    id: "conv-density",
    names: { en: "Density Converter", ar: "محوّل الكثافة" },
    descriptions: { en: "Convert between kg/m³, g/cm³, lb/ft³ and more.", ar: "تحويل بين كجم/م³، جم/سم³، رطل/قدم³." },
    keywords: ["density", "kgm3", "gcm3", "كثافة"],
    icon: "Layers",
    baseUnit: { en: "kilogram/meter³", ar: "كيلوجرام/متر³" },
    units: [
      { value: "kg_m3", label: { en: "Kilogram/meter³ (kg/m³)", ar: "كجم/م³" }, factor: 1 },
      { value: "g_cm3", label: { en: "Gram/centimeter³ (g/cm³)", ar: "جم/سم³" }, factor: 1000 },
      { value: "g_ml", label: { en: "Gram/milliliter (g/mL)", ar: "جم/مل" }, factor: 1000 },
      { value: "kg_l", label: { en: "Kilogram/liter (kg/L)", ar: "كجم/لتر" }, factor: 1000 },
      { value: "lb_ft3", label: { en: "Pound/foot³ (lb/ft³)", ar: "رطل/قدم³" }, factor: 16.018463373960142 },
      { value: "lb_in3", label: { en: "Pound/inch³ (lb/in³)", ar: "رطل/بوصة³" }, factor: 27679.904710203122 },
      { value: "lb_galUS", label: { en: "Pound/US gallon", ar: "رطل/جالون أمريكي" }, factor: 119.82642731689663 },
      { value: "t_m3", label: { en: "Metric ton/meter³", ar: "طن/م³" }, factor: 1000 },
    ],
  }),

  // Fuel Consumption
  makeFactorConverter({
    id: "conv-fuel",
    names: { en: "Fuel Consumption Converter", ar: "محوّل استهلاك الوقود" },
    descriptions: { en: "Convert between L/100km, mpg (US/UK), km/L.", ar: "تحويل بين لتر/100كم، ميل/جالون (US/UK)، كم/لتر." },
    keywords: ["fuel", "mpg", "l100km", "kml", "وقود", "استهلاك"],
    icon: "Fuel",
    baseUnit: { en: "km/L", ar: "كم/لتر" },
    units: [
      { value: "km_l", label: { en: "Kilometer/liter (km/L)", ar: "كم/لتر" }, factor: 1 },
      { value: "l_100km", label: { en: "Liter/100km", ar: "لتر/100كم" }, factor: 100, /* placeholder; we treat specially below */ },
      { value: "mpgUS", label: { en: "Miles/US gallon (mpg)", ar: "ميل/جالون أمريكي" }, factor: 0.4251437075 },
      { value: "mpgUK", label: { en: "Miles/UK gallon", ar: "ميل/جالون بريطاني" }, factor: 0.3540061899 },
    ],
  }),

  // Flow Rate (volume)
  makeFactorConverter({
    id: "conv-flow",
    names: { en: "Flow Rate Converter", ar: "محوّل معدل التدفق" },
    descriptions: { en: "Convert between L/s, L/min, m³/h, gpm, cfs and more.", ar: "تحويل بين لتر/ث، لتر/دقيقة، م³/ساعة، gpm." },
    keywords: ["flow", "rate", "lpm", "gpm", "cfs", "تدفق"],
    icon: "Waves",
    baseUnit: { en: "liter/second", ar: "لتر/ثانية" },
    units: [
      { value: "mL_s", label: { en: "Milliliter/second", ar: "مل/ث" }, factor: 0.001 },
      { value: "L_s", label: { en: "Liter/second (L/s)", ar: "لتر/ث" }, factor: 1 },
      { value: "L_min", label: { en: "Liter/minute (L/min)", ar: "لتر/دقيقة" }, factor: 1 / 60 },
      { value: "L_h", label: { en: "Liter/hour (L/h)", ar: "لتر/ساعة" }, factor: 1 / 3600 },
      { value: "m3_s", label: { en: "Cubic meter/second (m³/s)", ar: "م³/ث" }, factor: 1000 },
      { value: "m3_h", label: { en: "Cubic meter/hour (m³/h)", ar: "م³/ساعة" }, factor: 1000 / 3600 },
      { value: "ft3_s", label: { en: "Cubic foot/second (cfs)", ar: "قدم³/ث" }, factor: 28.316846592 },
      { value: "ft3_min", label: { en: "Cubic foot/minute (cfm)", ar: "قدم³/دقيقة" }, factor: 0.4719474432 },
      { value: "gpmUS", label: { en: "US gallon/minute (gpm)", ar: "جالون أمريكي/دقيقة" }, factor: 0.0630901964 },
      { value: "gpdUS", label: { en: "US gallon/day (gpd)", ar: "جالون أمريكي/يوم" }, factor: 4.3812636e-5 },
    ],
  }),

  // Internet Speed (data rate)
  makeFactorConverter({
    id: "conv-internet-speed",
    names: { en: "Internet Speed Converter", ar: "محوّل سرعة الإنترنت" },
    descriptions: { en: "Convert between bit/s, kbps, Mbps, Gbps and bytes/s.", ar: "تحويل بين بت/ث، ك.بت/ث، م.بت/ث، ج.بت/ث وبايت/ث." },
    keywords: ["internet", "speed", "bandwidth", "mbps", "kbps", "bps", "إنترنت", "سرعة"],
    icon: "Wifi",
    baseUnit: { en: "bit/second", ar: "بت/ثانية" },
    units: [
      { value: "bps", label: { en: "Bit/second (b/s)", ar: "بت/ث" }, factor: 1 },
      { value: "kbps", label: { en: "Kilobit/second (kb/s)", ar: "كيلوبت/ث" }, factor: 1000 },
      { value: "Mbps", label: { en: "Megabit/second (Mb/s)", ar: "ميجابت/ث" }, factor: 1e6 },
      { value: "Gbps", label: { en: "Gigabit/second (Gb/s)", ar: "جيجابت/ث" }, factor: 1e9 },
      { value: "Tbps", label: { en: "Terabit/second (Tb/s)", ar: "تيرابت/ث" }, factor: 1e12 },
      { value: "Bps", label: { en: "Byte/second (B/s)", ar: "بايت/ث" }, factor: 8 },
      { value: "KBps", label: { en: "Kilobyte/second (KB/s)", ar: "كيلوبايت/ث" }, factor: 8 * 1000 },
      { value: "MBps", label: { en: "Megabyte/second (MB/s)", ar: "ميجابايت/ث" }, factor: 8 * 1e6 },
      { value: "GBps", label: { en: "Gigabyte/second (GB/s)", ar: "جيجابايت/ث" }, factor: 8 * 1e9 },
    ],
  }),

  // Concentration (molar & mass/volume)
  makeFactorConverter({
    id: "conv-concentration",
    names: { en: "Concentration Converter", ar: "محوّل التركيز" },
    descriptions: { en: "Convert between %, ‰, ppm, ppb, ppt, mg/L, g/L.", ar: "تحويل بين %، ‰، ppm، ppb، ppt، مجم/لتر، جم/لتر." },
    keywords: ["concentration", "ppm", "ppb", "percentage", "تركيز"],
    icon: "FlaskConical",
    baseUnit: { en: "fraction (1 = 100%)", ar: "نسبة (1 = 100%)" },
    units: [
      { value: "pct", label: { en: "Percent (%)", ar: "بالمئة" }, factor: 0.01 },
      { value: "permille", label: { en: "Per mille (‰)", ar: "بالألف" }, factor: 0.001 },
      { value: "ppm", label: { en: "Parts per million (ppm)", ar: "جزء بالمليون" }, factor: 1e-6 },
      { value: "ppb", label: { en: "Parts per billion (ppb)", ar: "جزء بالمليار" }, factor: 1e-9 },
      { value: "ppt", label: { en: "Parts per trillion (ppt)", ar: "جزء بتريليون" }, factor: 1e-12 },
      { value: "g_L", label: { en: "Gram/liter (g/L)", ar: "جم/لتر" }, factor: 1 /* approx for water */ },
      { value: "mg_L", label: { en: "Milligram/liter (mg/L)", ar: "مجم/لتر" }, factor: 0.001 },
      { value: "ug_L", label: { en: "Microgram/liter (µg/L)", ar: "ميكروجرام/لتر" }, factor: 1e-6 },
    ],
  }),

  // Light (illuminance & luminance)
  makeFactorConverter({
    id: "conv-light",
    names: { en: "Light (Illuminance) Converter", ar: "محوّل الإضاءة" },
    descriptions: { en: "Convert between lux, foot-candle, phot, nox.", ar: "تحويل بين لوكس، قدم-شعلة، فوت، نوكس." },
    keywords: ["light", "lux", "illumination", "إضاءة", "لوكس"],
    icon: "Lightbulb",
    baseUnit: { en: "lux", ar: "لوكس" },
    units: [
      { value: "lux", label: { en: "Lux (lx)", ar: "لوكس" }, factor: 1 },
      { value: "klx", label: { en: "Kilolux (klx)", ar: "كيلو لوكس" }, factor: 1000 },
      { value: "fc", label: { en: "Foot-candle (fc)", ar: "قدم-شعلة" }, factor: 10.7639104167097 },
      { value: "phot", label: { en: "Phot (ph)", ar: "فوت" }, factor: 10000 },
      { value: "nox", label: { en: "Nox", ar: "نوكس" }, factor: 0.001 },
      { value: "lm_m2", label: { en: "Lumen/meter²", ar: "لومن/م²" }, factor: 1 },
    ],
  }),

  // Sound (level conversion — relative; we keep simple)
  makeFactorConverter({
    id: "conv-sound",
    names: { en: "Sound Level Converter", ar: "محوّل مستوى الصوت" },
    descriptions: { en: "Convert between bel, decibel and neper.", ar: "تحويل بين بل، ديسيبل ونيبر." },
    keywords: ["sound", "decibel", "db", "neper", "صوت", "ديسيبل"],
    icon: "Volume2",
    baseUnit: { en: "bel", ar: "بل" },
    units: [
      { value: "B", label: { en: "Bel (B)", ar: "بل" }, factor: 1 },
      { value: "dB", label: { en: "Decibel (dB)", ar: "ديسيبل" }, factor: 0.1 },
      { value: "Np", label: { en: "Neper (Np)", ar: "نيبر" }, factor: 0.8685889638 },
    ],
  }),

  // Radiation
  makeFactorConverter({
    id: "conv-radiation",
    names: { en: "Radiation (Dose) Converter", ar: "محوّل الجرعة الإشعاعية" },
    descriptions: { en: "Convert between Gray, Rad, Sievert, Rem and Roentgen.", ar: "تحويل بين جراي، راد، سيفرت، ريم ورونتجن." },
    keywords: ["radiation", "gray", "sievert", "rem", "roentgen", "إشعاع"],
    icon: "Radiation",
    baseUnit: { en: "Gray", ar: "جراي" },
    units: [
      { value: "Gy", label: { en: "Gray (Gy)", ar: "جراي" }, factor: 1 },
      { value: "kGy", label: { en: "Kilogray (kGy)", ar: "كيلو جراي" }, factor: 1000 },
      { value: "mGy", label: { en: "Milligray (mGy)", ar: "ميجا جراي" }, factor: 0.001 },
      { value: "rad", label: { en: "Rad", ar: "راد" }, factor: 0.01 },
      { value: "Sv", label: { en: "Sievert (Sv)", ar: "سيفرت" }, factor: 1 /* approximate */ },
      { value: "mSv", label: { en: "Millisievert (mSv)", ar: "ميلي سيفرت" }, factor: 0.001 },
      { value: "uSv", label: { en: "Microsievert (µSv)", ar: "ميكرو سيفرت" }, factor: 1e-6 },
      { value: "rem", label: { en: "Rem", ar: "ريم" }, factor: 0.01 },
      { value: "R", label: { en: "Roentgen (R)", ar: "رونتجن" }, factor: 0.00877 },
    ],
  }),

  // Viscosity (dynamic)
  makeFactorConverter({
    id: "conv-viscosity",
    names: { en: "Dynamic Viscosity Converter", ar: "محوّل اللزوجة الديناميكية" },
    descriptions: { en: "Convert between Pa·s, cP, P, lb/ft·s.", ar: "تحويل بين با·ث، سنتي بواز، بواز، رطل/قدم·ث." },
    keywords: ["viscosity", "dynamic", "poise", "pascal", "لزوجة"],
    icon: "Droplets",
    baseUnit: { en: "Pascal-second", ar: "باسكال·ثانية" },
    units: [
      { value: "Pa_s", label: { en: "Pascal-second (Pa·s)", ar: "باسكال·ث" }, factor: 1 },
      { value: "mPa_s", label: { en: "Millipascal-second", ar: "ميلي باسكال·ث" }, factor: 0.001 },
      { value: "P", label: { en: "Poise (P)", ar: "بواز" }, factor: 0.1 },
      { value: "cP", label: { en: "Centipoise (cP)", ar: "سنتي بواز" }, factor: 0.001 },
      { value: "lb_ft_s", label: { en: "Pound/foot-second", ar: "رطل/قدم·ث" }, factor: 1.4881639 },
      { value: "lb_ft_h", label: { en: "Pound/foot-hour", ar: "رطل/قدم·ساعة" }, factor: 0.0004133789 },
    ],
  }),

  // Magnetic field
  makeFactorConverter({
    id: "conv-magnetic",
    names: { en: "Magnetic Field Converter", ar: "محوّل المجال المغناطيسي" },
    descriptions: { en: "Convert between Tesla, Gauss, mT, µT and Gamma.", ar: "تحويل بين تسلا، جاوس، م.تسلا، ميكرو تسلا وغاما." },
    keywords: ["magnetic", "tesla", "gauss", "مغناطيسي", "تسلا"],
    icon: "Magnet",
    baseUnit: { en: "Tesla", ar: "تسلا" },
    units: [
      { value: "T", label: { en: "Tesla (T)", ar: "تسلا" }, factor: 1 },
      { value: "mT", label: { en: "Millitesla (mT)", ar: "ميلي تسلا" }, factor: 0.001 },
      { value: "uT", label: { en: "Microtesla (µT)", ar: "ميكرو تسلا" }, factor: 1e-6 },
      { value: "nT", label: { en: "Nanotesla (nT)", ar: "نانو تسلا" }, factor: 1e-9 },
      { value: "G", label: { en: "Gauss (G)", ar: "جاوس" }, factor: 1e-4 },
      { value: "mG", label: { en: "Milligauss (mG)", ar: "ميلي جاوس" }, factor: 1e-7 },
      { value: "gamma", label: { en: "Gamma (γ)", ar: "غاما" }, factor: 1e-9 },
    ],
  }),

  // Electric (charge, capacitance quick reference)
  makeFactorConverter({
    id: "conv-electric-charge",
    names: { en: "Electric Charge Converter", ar: "محوّل الشحنة الكهربائية" },
    descriptions: { en: "Convert between Coulomb, mAh, Ah, Faraday and statcoulomb.", ar: "تحويل بين كولوم، م.أ·س، أ·س، فاراداي." },
    keywords: ["charge", "coulomb", "ah", "mah", "شحنة", "كولوم"],
    icon: "BatteryCharging",
    baseUnit: { en: "Coulomb", ar: "كولوم" },
    units: [
      { value: "C", label: { en: "Coulomb (C)", ar: "كولوم" }, factor: 1 },
      { value: "mC", label: { en: "Millicoulomb (mC)", ar: "ميلي كولوم" }, factor: 0.001 },
      { value: "uC", label: { en: "Microcoulomb (µC)", ar: "ميكرو كولوم" }, factor: 1e-6 },
      { value: "Ah", label: { en: "Ampere-hour (Ah)", ar: "أمبير·ساعة" }, factor: 3600 },
      { value: "mAh", label: { en: "Milliampere-hour (mAh)", ar: "ملي أمبير·ساعة" }, factor: 3.6 },
      { value: "F", label: { en: "Faraday", ar: "فاراداي" }, factor: 96485.33212 },
      { value: "statC", label: { en: "Statcoulomb", ar: "ستات كولوم" }, factor: 3.33564095198152e-10 },
      { value: "e", label: { en: "Elementary charge (e)", ar: "شحنة أولية" }, factor: 1.602176634e-19 },
    ],
  }),

  // Currency Converter — static reference rates (USD-based, approximate)
  // Rates are indicative; for live rates connect to an FX API.
  {
    id: "conv-currency",
    category: "converters",
    names: { en: "Currency Converter", ar: "محوّل العملات" },
    descriptions: {
      en: "Approximate currency conversion (reference rates, USD-based). For live rates use a real-time FX API.",
      ar: "تحويل عملات تقريبي (أسعار مرجعية، بأساس الدولار). للحصول على أسعار حية استخدم واجهة FX.",
    },
    keywords: ["currency", "exchange", "usd", "eur", "gbp", "jpy", "عملة", "صرافة"],
    icon: "DollarSign",
    live: true,
    fields: [
      { key: "value", names: { en: "Amount", ar: "المبلغ" }, type: "number", default: 100 },
      {
        key: "from",
        names: { en: "From", ar: "من" },
        type: "select",
        default: "USD",
        options: CURRENCY_OPTIONS,
      },
      {
        key: "to",
        names: { en: "To", ar: "إلى" },
        type: "select",
        default: "EUR",
        options: CURRENCY_OPTIONS,
      },
    ],
    compute: (v) => {
      const amount = num(v.value);
      const from = String(v.from);
      const to = String(v.to);
      if (Number.isNaN(amount)) return { results: [], error: { en: "Enter a number", ar: "أدخل رقمًا" } };
      const fromRate = CURRENCY_RATES[from];
      const toRate = CURRENCY_RATES[to];
      if (!fromRate || !toRate) return { results: [], error: { en: "Unknown currency", ar: "عملة غير معروفة" } };
      // amount in USD = amount / fromRate; then convert to target = usd * toRate
      const usd = amount / fromRate;
      const result = usd * toRate;
      return {
        results: [
          {
            label: { en: `Result (${to})`, ar: `النتيجة (${to})` },
            value: fmt(result, 4),
            primary: true,
          },
          { label: { en: "In USD (mid)", ar: "بالدولار (وسط)" }, value: fmt(usd, 4) },
        ],
        formula: `${amount} ${from} → ${fmt(result, 4)} ${to}  (via USD: ${fmt(usd, 4)})`,
        steps: [
          { description: { en: `Convert ${amount} ${from} to USD: ${amount} ÷ ${fromRate} = ${fmt(usd, 4)}`, ar: `حوّل ${amount} ${from} إلى دولار: ${fmt(usd, 4)}` } },
          { description: { en: `Convert USD to ${to}: ${fmt(usd, 4)} × ${toRate} = ${fmt(result, 4)}`, ar: `حوّل من الدولار إلى ${to}: ${fmt(result, 4)}` } },
        ],
        explanation: {
          en: "Rates are static reference values (USD = 1.00). For live exchange rates, integrate a real-time FX API.",
          ar: "الأسعار قيم مرجعية ثابتة (الدولار = 1.00). للحصول على أسعار صرف حية، اربط واجهة FX لحظية.",
        },
      };
    },
  },
];

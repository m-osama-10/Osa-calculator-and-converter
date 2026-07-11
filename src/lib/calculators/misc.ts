// ============================================================================
// Computer Calculators
// ============================================================================

import type { Calculator } from "../types";
import { num, fmt } from "../calculator-utils";

export const computerCalculators: Calculator[] = [
  // IP Subnet Calculator
  {
    id: "ip-subnet",
    category: "computer",
    names: { en: "IP Subnet Calculator", ar: "حاسبة الشبكة الفرعية IP" },
    descriptions: { en: "Calculate network, broadcast, hosts from CIDR notation.", ar: "احسب الشبكة، البث، عدد المضيفين من تدوين CIDR." },
    keywords: ["ip", "subnet", "cidr", "network", "شبكة"],
    icon: "Network",
    live: true,
    fields: [
      { key: "ip", names: { en: "IP address", ar: "عنوان IP" }, type: "text", default: "192.168.1.10" },
      { key: "prefix", names: { en: "CIDR prefix /", ar: "بادئة CIDR /" }, type: "number", default: 24, min: 0, max: 32 },
    ],
    compute: (v) => {
      const ipStr = String(v.ip).trim();
      const parts = ipStr.split(".").map(Number);
      if (parts.length !== 4 || parts.some((p) => Number.isNaN(p) || p < 0 || p > 255)) {
        return { results: [], error: { en: "Invalid IP", ar: "IP غير صالح" } };
      }
      const prefix = num(v.prefix);
      if (Number.isNaN(prefix) || prefix < 0 || prefix > 32) return { results: [], error: { en: "Prefix 0-32", ar: "البادئة 0-32" } };
      const ipInt = (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
      const mask = prefix === 0 ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0;
      const network = (ipInt & mask) >>> 0;
      const broadcast = (network | (~mask >>> 0)) >>> 0;
      const totalHosts = prefix >= 31 ? 0 : Math.pow(2, 32 - prefix) - 2;
      const toIP = (n: number) => `${(n >>> 24) & 0xFF}.${(n >>> 16) & 0xFF}.${(n >>> 8) & 0xFF}.${n & 0xFF}`;
      return {
        results: [
          { label: { en: "Network address", ar: "عنوان الشبكة" }, value: toIP(network), primary: true },
          { label: { en: "Broadcast address", ar: "عنوان البث" }, value: toIP(broadcast) },
          { label: { en: "Subnet mask", ar: "قناع الشبكة" }, value: toIP(mask) },
          { label: { en: "Usable hosts", ar: "المضيفون المتاحون" }, value: fmt(totalHosts) },
          { label: { en: "IP class", ar: "فئة IP" }, value: parts[0] < 128 ? "A" : parts[0] < 192 ? "B" : parts[0] < 224 ? "C" : parts[0] < 240 ? "D (multicast)" : "E (reserved)" },
        ],
        formula: `Network = IP & Mask;  Broadcast = Network | ~Mask;  Hosts = 2^(32−prefix) − 2`,
        steps: [
          { description: { en: `Mask = ${toIP(mask)}`, ar: `القناع = ${toIP(mask)}` } },
          { description: { en: `Network = ${toIP(network)}`, ar: `الشبكة = ${toIP(network)}` } },
          { description: { en: `Broadcast = ${toIP(broadcast)}`, ar: `البث = ${toIP(broadcast)}` } },
        ],
      };
    },
  },

  // Number Base Converter
  {
    id: "number-base",
    category: "computer",
    names: { en: "Number Base Converter", ar: "محوّل قواعد الأرقام" },
    descriptions: { en: "Convert between binary, octal, decimal and hex.", ar: "تحويل بين الثنائي، الثماني، العشري والسداسي عشر." },
    keywords: ["base", "binary", "octal", "decimal", "hex", "قاعدة"],
    icon: "Binary",
    live: true,
    fields: [
      { key: "value", names: { en: "Value", ar: "القيمة" }, type: "text", default: "255" },
      {
        key: "from",
        names: { en: "From base", ar: "من القاعدة" },
        type: "select",
        default: "10",
        options: [
          { value: "2", label: { en: "Binary (2)", ar: "ثنائي" } },
          { value: "8", label: { en: "Octal (8)", ar: "ثماني" } },
          { value: "10", label: { en: "Decimal (10)", ar: "عشري" } },
          { value: "16", label: { en: "Hexadecimal (16)", ar: "سداسي عشر" } },
        ],
      },
    ],
    compute: (v) => {
      const val = String(v.value).trim();
      const base = Number(v.from);
      if (!base || ![2, 8, 10, 16].includes(base)) return { results: [], error: { en: "Invalid base", ar: "قاعدة غير صالحة" } };
      const n = parseInt(val, base);
      if (Number.isNaN(n)) return { results: [], error: { en: "Invalid number for base", ar: "رقم غير صالح للقاعدة" } };
      return {
        results: [
          { label: { en: "Decimal", ar: "عشري" }, value: n.toString(10), primary: true },
          { label: { en: "Binary", ar: "ثنائي" }, value: n.toString(2) },
          { label: { en: "Octal", ar: "ثماني" }, value: n.toString(8) },
          { label: { en: "Hexadecimal", ar: "سداسي عشر" }, value: n.toString(16).toUpperCase() },
        ],
        formula: `${val} (base ${base}) → Decimal = ${n}`,
      };
    },
  },

  // Download Time
  {
    id: "download-time",
    category: "computer",
    names: { en: "Download Time Calculator", ar: "حاسبة وقت التنزيل" },
    descriptions: { en: "Estimate download time from file size and speed.", ar: "تقدير وقت التنزيل من حجم الملف والسرعة." },
    keywords: ["download", "time", "speed", "تنزيل", "وقت"],
    icon: "Download",
    live: true,
    fields: [
      { key: "size", names: { en: "File size", ar: "حجم الملف" }, type: "number", default: 4.7, unit: { en: "GB", ar: "جيجابايت" } },
      {
        key: "sizeUnit",
        names: { en: "Size unit", ar: "وحدة الحجم" },
        type: "select",
        default: "GB",
        options: [
          { value: "MB", label: { en: "MB", ar: "ميجابايت" } },
          { value: "GB", label: { en: "GB", ar: "جيجابايت" } },
          { value: "TB", label: { en: "TB", ar: "تيرابايت" } },
        ],
      },
      { key: "speed", names: { en: "Speed", ar: "السرعة" }, type: "number", default: 50, unit: { en: "Mbps", ar: "ميجابت/ث" } },
    ],
    compute: (v) => {
      const size = num(v.size), speed = num(v.speed);
      if ([size, speed].some((x) => Number.isNaN(x) || x <= 0)) return { results: [], error: { en: "Enter positive values", ar: "أدخل قيمًا موجبة" } };
      const sizeMB = String(v.sizeUnit) === "MB" ? size : String(v.sizeUnit) === "TB" ? size * 1024 * 1024 : size * 1024;
      const sizeMbit = sizeMB * 8;
      const seconds = sizeMbit / speed;
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = Math.round(seconds % 60);
      return {
        results: [
          { label: { en: "Download time", ar: "وقت التنزيل" }, value: `${h}h ${m}m ${s}s`, primary: true },
          { label: { en: "Total seconds", ar: "إجمالي الثواني" }, value: fmt(seconds, 1) + " s" },
        ],
        formula: `time = (size × 8) / speed  [seconds, MB and Mbps]`,
        steps: [
          { description: { en: `Size = ${fmt(sizeMB, 2)} MB = ${fmt(sizeMbit, 2)} Mbit`, ar: `الحجم = ${fmt(sizeMB, 2)} ميجابايت` } },
          { description: { en: `Time = ${fmt(sizeMbit, 2)} / ${speed} = ${fmt(seconds, 1)} s`, ar: `الوقت = ${fmt(seconds, 1)} ث` } },
        ],
      };
    },
  },

  // Storage / Bandwidth converter (uses general converter, but listed)
  // RGB ↔ HEX color
  {
    id: "color-converter",
    category: "computer",
    names: { en: "Color (RGB ↔ HEX)", ar: "محوّل الألوان (RGB ↔ HEX)" },
    descriptions: { en: "Convert between RGB and HEX color codes.", ar: "تحويل بين أكواد الألوان RGB و HEX." },
    keywords: ["color", "rgb", "hex", "لون"],
    icon: "Palette",
    live: true,
    fields: [
      { key: "r", names: { en: "Red (0-255)", ar: "الأحمر" }, type: "number", default: 64, min: 0, max: 255 },
      { key: "g", names: { en: "Green (0-255)", ar: "الأخضر" }, type: "number", default: 156, min: 0, max: 255 },
      { key: "b", names: { en: "Blue (0-255)", ar: "الأزرق" }, type: "number", default: 255, min: 0, max: 255 },
    ],
    compute: (v) => {
      const r = num(v.r), g = num(v.g), b = num(v.b);
      if ([r, g, b].some((x) => Number.isNaN(x) || x < 0 || x > 255)) return { results: [], error: { en: "0-255 only", ar: "0-255 فقط" } };
      const hex = "#" + [r, g, b].map((x) => Math.round(x).toString(16).padStart(2, "0")).join("").toUpperCase();
      const hsl = rgbToHsl(r, g, b);
      return {
        results: [
          { label: { en: "HEX", ar: "HEX" }, value: hex, primary: true },
          { label: { en: "RGB", ar: "RGB" }, value: `rgb(${r}, ${g}, ${b})` },
          { label: { en: "HSL", ar: "HSL" }, value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
        ],
        formula: `HEX = #${[r, g, b].map((x) => Math.round(x).toString(16).padStart(2, "0")).join("").toUpperCase()}`,
      };
    },
  },

  // Password generator
  {
    id: "password-generator",
    category: "computer",
    names: { en: "Password Generator", ar: "مولّد كلمات المرور" },
    descriptions: { en: "Generate strong random passwords.", ar: "توليد كلمات مرور قوية عشوائية." },
    keywords: ["password", "generator", "random", "كلمة مرور", "توليد"],
    icon: "Key",
    live: false,
    fields: [
      { key: "length", names: { en: "Length", ar: "الطول" }, type: "number", default: 16, min: 4, max: 64 },
      {
        key: "chars",
        names: { en: "Character set", ar: "مجموعة الأحرف" },
        type: "select",
        default: "all",
        options: [
          { value: "all", label: { en: "Letters + digits + symbols", ar: "حروف + أرقام + رموز" } },
          { value: "alnum", label: { en: "Letters + digits", ar: "حروف + أرقام" } },
          { value: "digits", label: { en: "Digits only", ar: "أرقام فقط" } },
        ],
      },
    ],
    compute: (v) => {
      const len = Math.max(4, Math.min(64, num(v.length)));
      let chars = "";
      if (String(v.chars) === "all") chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:,.<>?";
      else if (String(v.chars) === "alnum") chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      else chars = "0123456789";
      let pw = "";
      for (let i = 0; i < len; i++) pw += chars[Math.floor(Math.random() * chars.length)];
      const entropy = len * Math.log2(chars.length);
      return {
        results: [
          { label: { en: "Password", ar: "كلمة المرور" }, value: pw, primary: true },
          { label: { en: "Entropy", ar: "الإنتروبيا" }, value: fmt(entropy, 1) + " bits", status: entropy >= 60 ? "good" : entropy >= 36 ? "warning" : "bad" },
        ],
        formula: `Random selection from ${chars.length} chars, length ${len}`,
      };
    },
  },
];

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = ((b - r) / d + 2); break;
      case b: h = ((r - g) / d + 4); break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

// ============================================================================
// Date & Time Calculators
// ============================================================================

export const datetimeCalculators: Calculator[] = [
  // Age Calculator
  {
    id: "age",
    category: "datetime",
    names: { en: "Age Calculator", ar: "حاسبة العمر" },
    descriptions: { en: "Exact age in years, months, days from birth date.", ar: "العمر بالضبط بالسنوات والأشهر والأيام." },
    keywords: ["age", "birth", "birthday", "عمر", "ميلاد"],
    icon: "Cake",
    live: true,
    fields: [
      { key: "birth", names: { en: "Birth date", ar: "تاريخ الميلاد" }, type: "date", default: "1995-06-15" },
    ],
    compute: (v) => {
      const birth = new Date(String(v.birth));
      if (isNaN(birth.getTime())) return { results: [], error: { en: "Enter valid date", ar: "أدخل تاريخًا صالحًا" } };
      const now = new Date();
      if (birth > now) return { results: [], error: { en: "Birth date in future", ar: "تاريخ الميلاد في المستقبل" } };
      let years = now.getFullYear() - birth.getFullYear();
      let months = now.getMonth() - birth.getMonth();
      let days = now.getDate() - birth.getDate();
      if (days < 0) {
        months--;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
      }
      if (months < 0) { years--; months += 12; }
      const totalDays = Math.floor((now.getTime() - birth.getTime()) / 86400000);
      return {
        results: [
          { label: { en: "Age", ar: "العمر" }, value: `${years}y ${months}m ${days}d`, primary: true },
          { label: { en: "Total months", ar: "إجمالي الأشهر" }, value: String(years * 12 + months) },
          { label: { en: "Total weeks", ar: "إجمالي الأسابيع" }, value: String(Math.floor(totalDays / 7)) },
          { label: { en: "Total days", ar: "إجمالي الأيام" }, value: String(totalDays) },
          { label: { en: "Total hours", ar: "إجمالي الساعات" }, value: String(totalDays * 24) },
        ],
        formula: `Age = today − birth date`,
      };
    },
  },

  // Date Difference
  {
    id: "date-diff",
    category: "datetime",
    names: { en: "Date Difference", ar: "فرق التاريخ" },
    descriptions: { en: "Days, weeks, months and years between two dates.", ar: "الأيام والأسابيع والأشهر والسنوات بين تاريخين." },
    keywords: ["date", "difference", "between", "فرق", "تاريخ"],
    icon: "CalendarRange",
    live: true,
    fields: [
      { key: "start", names: { en: "Start date", ar: "تاريخ البداية" }, type: "date", default: "2025-01-01" },
      { key: "end", names: { en: "End date", ar: "تاريخ النهاية" }, type: "date", default: "2026-01-01" },
    ],
    compute: (v) => {
      const start = new Date(String(v.start));
      const end = new Date(String(v.end));
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return { results: [], error: { en: "Enter valid dates", ar: "أدخل تواريخ صالحة" } };
      const days = Math.abs(Math.floor((end.getTime() - start.getTime()) / 86400000));
      return {
        results: [
          { label: { en: "Days", ar: "الأيام" }, value: String(days), primary: true },
          { label: { en: "Weeks", ar: "الأسابيع" }, value: fmt(days / 7, 2) },
          { label: { en: "Months (approx)", ar: "الأشهر (تقريبي)" }, value: fmt(days / 30.44, 2) },
          { label: { en: "Years (approx)", ar: "السنوات (تقريبي)" }, value: fmt(days / 365.25, 4) },
          { label: { en: "Hours", ar: "الساعات" }, value: String(days * 24) },
        ],
        formula: `Δ = |end − start|`,
      };
    },
  },

  // Business days
  {
    id: "business-days",
    category: "datetime",
    names: { en: "Business Days", ar: "أيام العمل" },
    descriptions: { en: "Number of business days (Mon-Fri) between two dates.", ar: "عدد أيام العمل (الإثنين-الجمعة) بين تاريخين." },
    keywords: ["business", "workdays", "أيام عمل"],
    icon: "Briefcase",
    live: true,
    fields: [
      { key: "start", names: { en: "Start date", ar: "تاريخ البداية" }, type: "date", default: "2025-01-01" },
      { key: "end", names: { en: "End date", ar: "تاريخ النهاية" }, type: "date", default: "2025-01-31" },
    ],
    compute: (v) => {
      const start = new Date(String(v.start));
      const end = new Date(String(v.end));
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return { results: [], error: { en: "Enter valid dates", ar: "أدخل تواريخ صالحة" } };
      let count = 0;
      const cur = new Date(start);
      while (cur <= end) {
        const day = cur.getDay();
        if (day !== 0 && day !== 6) count++;
        cur.setDate(cur.getDate() + 1);
      }
      return {
        results: [
          { label: { en: "Business days", ar: "أيام العمل" }, value: String(count), primary: true },
          { label: { en: "Weekend days", ar: "أيام العطلة" }, value: String(Math.abs(Math.floor((end.getTime() - start.getTime()) / 86400000)) + 1 - count) },
        ],
        formula: `Count days where 1 ≤ getDay() ≤ 5`,
      };
    },
  },

  // Countdown
  {
    id: "countdown",
    category: "datetime",
    names: { en: "Countdown to Date", ar: "عد تنازلي لتاريخ" },
    descriptions: { en: "Time remaining until a future date.", ar: "الوقت المتبقي حتى تاريخ مستقبلي." },
    keywords: ["countdown", "timer", "عد تنازلي", "وقت"],
    icon: "Timer",
    live: true,
    fields: [
      { key: "target", names: { en: "Target date", ar: "التاريخ المستهدف" }, type: "date", default: "2026-12-31" },
    ],
    compute: (v) => {
      const target = new Date(String(v.target));
      if (isNaN(target.getTime())) return { results: [], error: { en: "Enter valid date", ar: "أدخل تاريخًا صالحًا" } };
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      if (diff < 0) {
        return {
          results: [
            { label: { en: "Status", ar: "الحالة" }, value: "Past date", status: "bad" },
            { label: { en: "Days since", ar: "الأيام المنقضية" }, value: String(Math.abs(Math.floor(diff / 86400000))) },
          ],
        };
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      return {
        results: [
          { label: { en: "Time remaining", ar: "الوقت المتبقي" }, value: `${days}d ${hours}h ${mins}m`, primary: true },
          { label: { en: "Total days", ar: "إجمالي الأيام" }, value: String(days) },
          { label: { en: "Total hours", ar: "إجمالي الساعات" }, value: String(Math.floor(diff / 3600000)) },
        ],
        formula: `Δ = target − now`,
      };
    },
  },
];

// ============================================================================
// Construction Calculators
// ============================================================================

export const constructionCalculators: Calculator[] = [
  // Concrete Volume
  {
    id: "concrete-volume",
    category: "construction",
    names: { en: "Concrete Volume", ar: "حجم الخرسانة" },
    descriptions: { en: "Volume of concrete for a slab, footing or column.", ar: "حجم الخرسانة لبلاطة أو قاعدة أو عمود." },
    keywords: ["concrete", "volume", "slab", "خرسانة", "حجم"],
    icon: "Box",
    live: true,
    fields: [
      { key: "l", names: { en: "Length", ar: "الطول" }, type: "number", default: 5, unit: { en: "m", ar: "م" } },
      { key: "w", names: { en: "Width", ar: "العرض" }, type: "number", default: 4, unit: { en: "m", ar: "م" } },
      { key: "h", names: { en: "Depth/Height", ar: "العمق/الارتفاع" }, type: "number", default: 0.15, unit: { en: "m", ar: "م" } },
    ],
    compute: (v) => {
      const l = num(v.l), w = num(v.w), h = num(v.h);
      if ([l, w, h].some((x) => Number.isNaN(x) || x <= 0)) return { results: [], error: { en: "Enter positive values", ar: "أدخل قيمًا موجبة" } };
      const vol = l * w * h;
      // Cement bags (40kg, ~0.03 m³/bag roughly; varies)
      const bags = vol / 0.03;
      return {
        results: [
          { label: { en: "Volume", ar: "الحجم" }, value: fmt(vol, 4) + " m³", primary: true },
          { label: { en: "In cubic feet", ar: "بالقدم المكعب" }, value: fmt(vol * 35.3147, 2) + " ft³" },
          { label: { en: "Cement bags (40kg, approx)", ar: "أكياس أسمنت (40كجم، تقريبي)" }, value: fmt(bags, 0) },
        ],
        formula: `V = L × W × H = ${l} × ${w} × ${h} = ${fmt(vol, 4)} m³`,
      };
    },
  },

  // Bricks needed
  {
    id: "bricks",
    category: "construction",
    names: { en: "Brick Calculator", ar: "حاسبة الطوب" },
    descriptions: { en: "Number of bricks for a wall (with mortar joint).", ar: "عدد الطوبات لحائط (مع ملاط)." },
    keywords: ["brick", "wall", "masonry", "طوب", "حائط"],
    icon: "Boxes",
    live: true,
    fields: [
      { key: "wallL", names: { en: "Wall length", ar: "طول الحائط" }, type: "number", default: 5, unit: { en: "m", ar: "م" } },
      { key: "wallH", names: { en: "Wall height", ar: "ارتفاع الحائط" }, type: "number", default: 3, unit: { en: "m", ar: "م" } },
      { key: "brickL", names: { en: "Brick length", ar: "طول الطوبة" }, type: "number", default: 0.22, unit: { en: "m", ar: "م" } },
      { key: "brickH", names: { en: "Brick height", ar: "ارتفاع الطوبة" }, type: "number", default: 0.075, unit: { en: "m", ar: "م" } },
      { key: "joint", names: { en: "Mortar joint", ar: "سمك الملاط" }, type: "number", default: 0.01, unit: { en: "m", ar: "م" } },
    ],
    compute: (v) => {
      const wL = num(v.wallL), wH = num(v.wallH), bL = num(v.brickL), bH = num(v.brickH), j = num(v.joint);
      if ([wL, wH, bL, bH].some((x) => Number.isNaN(x) || x <= 0)) return { results: [], error: { en: "Enter positive values", ar: "أدخل قيمًا موجبة" } };
      const wallArea = wL * wH;
      const brickArea = (bL + j) * (bH + j);
      const count = Math.ceil(wallArea / brickArea);
      return {
        results: [
          { label: { en: "Bricks needed", ar: "عدد الطوب" }, value: String(count), primary: true },
          { label: { en: "Wall area", ar: "مساحة الحائط" }, value: fmt(wallArea, 2) + " m²" },
          { label: { en: "With 5% waste", ar: "مع 5% هدر" }, value: String(Math.ceil(count * 1.05)) },
        ],
        formula: `Bricks = ⌈(L×H) / ((bL+j)×(bH+j))⌉`,
      };
    },
  },

  // Paint Calculator
  {
    id: "paint",
    category: "construction",
    names: { en: "Paint Calculator", ar: "حاسبة الطلاء" },
    descriptions: { en: "Liters of paint needed for a wall area.", ar: "لترات الطلاء اللازمة لمساحة حائط." },
    keywords: ["paint", "wall", "طلاء", "حائط"],
    icon: "PaintRoller",
    live: true,
    fields: [
      { key: "area", names: { en: "Wall area", ar: "مساحة الحائط" }, type: "number", default: 50, unit: { en: "m²", ar: "م²" } },
      { key: "coats", names: { en: "Number of coats", ar: "عدد الطبقات" }, type: "number", default: 2 },
      { key: "coverage", names: { en: "Coverage per liter", ar: "التغطية لكل لتر" }, type: "number", default: 10, unit: { en: "m²/L", ar: "م²/لتر" } },
    ],
    compute: (v) => {
      const a = num(v.area), c = num(v.coats), cov = num(v.coverage);
      if ([a, c, cov].some((x) => Number.isNaN(x) || x <= 0)) return { results: [], error: { en: "Enter positive values", ar: "أدخل قيمًا موجبة" } };
      const liters = (a * c) / cov;
      return {
        results: [
          { label: { en: "Paint needed", ar: "الطلاء اللازم" }, value: fmt(liters, 2) + " L", primary: true },
          { label: { en: "Gallons (US)", ar: "جالون (US)" }, value: fmt(liters / 3.785, 2) },
        ],
        formula: `Paint = (area × coats) / coverage = (${a} × ${c}) / ${cov} = ${fmt(liters, 2)} L`,
      };
    },
  },

  // Tile Calculator
  {
    id: "tiles",
    category: "construction",
    names: { en: "Tile Calculator", ar: "حاسبة البلاط" },
    descriptions: { en: "Number of tiles for a floor or wall area.", ar: "عدد البلاطات لأرضية أو حائط." },
    keywords: ["tile", "floor", "بلاط", "أرضية"],
    icon: "Grid2x2",
    live: true,
    fields: [
      { key: "area", names: { en: "Area to cover", ar: "المساحة" }, type: "number", default: 20, unit: { en: "m²", ar: "م²" } },
      { key: "tileL", names: { en: "Tile length", ar: "طول البلاطة" }, type: "number", default: 0.3, unit: { en: "m", ar: "م" } },
      { key: "tileW", names: { en: "Tile width", ar: "عرض البلاطة" }, type: "number", default: 0.3, unit: { en: "m", ar: "م" } },
    ],
    compute: (v) => {
      const a = num(v.area), tL = num(v.tileL), tW = num(v.tileW);
      if ([a, tL, tW].some((x) => Number.isNaN(x) || x <= 0)) return { results: [], error: { en: "Enter positive values", ar: "أدخل قيمًا موجبة" } };
      const tiles = Math.ceil(a / (tL * tW) * 1.1); // +10% waste
      return {
        results: [
          { label: { en: "Tiles needed (+10%)", ar: "عدد البلاطات (+10%)" }, value: String(tiles), primary: true },
        ],
        formula: `Tiles = ⌈area / (tileL × tileW) × 1.1⌉`,
      };
    },
  },
];

// ============================================================================
// Everyday Calculators
// ============================================================================

export const everydayCalculators: Calculator[] = [
  // Fuel Cost
  {
    id: "fuel-cost",
    category: "everyday",
    names: { en: "Fuel Cost Calculator", ar: "حاسبة تكلفة الوقود" },
    descriptions: { en: "Total fuel cost for a trip based on distance and consumption.", ar: "إجمالي تكلفة الوقود لرحلة حسب المسافة والاستهلاك." },
    keywords: ["fuel", "cost", "trip", "gas", "وقود", "تكلفة"],
    icon: "Fuel",
    live: true,
    fields: [
      { key: "distance", names: { en: "Distance", ar: "المسافة" }, type: "number", default: 350, unit: { en: "km", ar: "كم" } },
      { key: "consumption", names: { en: "Consumption", ar: "الاستهلاك" }, type: "number", default: 7.5, unit: { en: "L/100km", ar: "لتر/100كم" } },
      { key: "price", names: { en: "Fuel price", ar: "سعر الوقود" }, type: "number", default: 1.7, unit: { en: "$/L", ar: "$/لتر" } },
    ],
    compute: (v) => {
      const d = num(v.distance), c = num(v.consumption), p = num(v.price);
      if ([d, c, p].some((x) => Number.isNaN(x) || x < 0)) return { results: [], error: { en: "Enter valid numbers", ar: "أدخل أرقامًا صالحة" } };
      const liters = (d * c) / 100;
      const cost = liters * p;
      return {
        results: [
          { label: { en: "Fuel needed", ar: "الوقود اللازم" }, value: fmt(liters, 2) + " L" },
          { label: { en: "Total cost", ar: "التكلفة الإجمالية" }, value: "$" + fmt(cost, 2), primary: true },
          { label: { en: "Cost per km", ar: "التكلفة/كم" }, value: "$" + fmt(cost / d, 3) },
        ],
        formula: `Cost = (distance × consumption / 100) × price`,
      };
    },
  },

  // Electricity Bill
  {
    id: "electricity-bill",
    category: "everyday",
    names: { en: "Electricity Bill", ar: "فاتورة الكهرباء" },
    descriptions: { en: "Estimate electricity cost from wattage, hours and rate.", ar: "تقدير تكلفة الكهرباء من القدرة، الساعات والسعر." },
    keywords: ["electricity", "bill", "power", "كهرباء", "فاتورة"],
    icon: "PlugZap",
    live: true,
    fields: [
      { key: "watts", names: { en: "Power", ar: "القدرة" }, type: "number", default: 1500, unit: { en: "W", ar: "واط" } },
      { key: "hours", names: { en: "Hours per day", ar: "ساعات/يوم" }, type: "number", default: 5 },
      { key: "days", names: { en: "Days", ar: "الأيام" }, type: "number", default: 30 },
      { key: "rate", names: { en: "Rate", ar: "السعر" }, type: "number", default: 0.15, unit: { en: "$/kWh", ar: "$/ك.و.س" } },
    ],
    compute: (v) => {
      const w = num(v.watts), h = num(v.hours), d = num(v.days), r = num(v.rate);
      if ([w, h, d, r].some((x) => Number.isNaN(x) || x < 0)) return { results: [], error: { en: "Enter valid numbers", ar: "أدخل أرقامًا صالحة" } };
      const kwh = (w / 1000) * h * d;
      const cost = kwh * r;
      return {
        results: [
          { label: { en: "Energy used", ar: "الطاقة المستخدمة" }, value: fmt(kwh, 2) + " kWh" },
          { label: { en: "Total cost", ar: "التكلفة الإجمالية" }, value: "$" + fmt(cost, 2), primary: true },
          { label: { en: "Monthly (30d)", ar: "شهريًا" }, value: "$" + fmt(kwh * r * (30 / d), 2) },
        ],
        formula: `kWh = (W/1000) × hours × days; Cost = kWh × rate`,
      };
    },
  },

  // Split Bill
  {
    id: "split-bill",
    category: "everyday",
    names: { en: "Split Bill", ar: "تقسيم الفاتورة" },
    descriptions: { en: "Divide a bill among a group with tip.", ar: "اقسم فاتورة على مجموعة مع بقشيش." },
    keywords: ["split", "bill", "tip", "تقسيم", "فاتورة"],
    icon: "ReceiptText",
    live: true,
    fields: [
      { key: "total", names: { en: "Bill total", ar: "إجمالي الفاتورة" }, type: "number", default: 240, unit: { en: "$", ar: "$" } },
      { key: "tip", names: { en: "Tip %", ar: "البقشيش %" }, type: "number", default: 18, unit: { en: "%", ar: "%" } },
      { key: "people", names: { en: "People", ar: "الأشخاص" }, type: "number", default: 4 },
    ],
    compute: (v) => {
      const t = num(v.total), tip = num(v.tip), p = num(v.people);
      if (Number.isNaN(t) || Number.isNaN(tip) || Number.isNaN(p) || p <= 0) return { results: [], error: { en: "Enter valid numbers", ar: "أدخل أرقامًا صالحة" } };
      const tipAmt = t * tip / 100;
      const grand = t + tipAmt;
      return {
        results: [
          { label: { en: "Tip amount", ar: "البقشيش" }, value: "$" + fmt(tipAmt, 2) },
          { label: { en: "Grand total", ar: "الإجمالي الكلي" }, value: "$" + fmt(grand, 2) },
          { label: { en: "Per person", ar: "للشخص الواحد" }, value: "$" + fmt(grand / p, 2), primary: true },
        ],
        formula: `Per person = (total + total×tip%) / people`,
      };
    },
  },

  // Travel Cost
  {
    id: "travel-cost",
    category: "everyday",
    names: { en: "Travel Cost", ar: "تكلفة السفر" },
    descriptions: { en: "Estimate travel cost with multiple travelers.", ar: "تقدير تكلفة السفر مع عدة مسافرين." },
    keywords: ["travel", "trip", "cost", "سفر", "رحلة"],
    icon: "Plane",
    live: true,
    fields: [
      { key: "distance", names: { en: "Round-trip distance", ar: "مسافة الذهاب والإياب" }, type: "number", default: 800, unit: { en: "km", ar: "كم" } },
      { key: "consumption", names: { en: "Car consumption", ar: "استهلاك السيارة" }, type: "number", default: 8, unit: { en: "L/100km", ar: "لتر/100كم" } },
      { key: "price", names: { en: "Fuel price", ar: "سعر الوقود" }, type: "number", default: 1.7, unit: { en: "$/L", ar: "$/لتر" } },
      { key: "people", names: { en: "Travelers", ar: "المسافرون" }, type: "number", default: 4 },
      { key: "extraCosts", names: { en: "Other costs (tolls, etc.)", ar: "تكاليف أخرى" }, type: "number", default: 30, unit: { en: "$", ar: "$" } },
    ],
    compute: (v) => {
      const d = num(v.distance), c = num(v.consumption), p = num(v.price), ppl = num(v.people), extra = num(v.extraCosts);
      if ([d, c, p, ppl, extra].some((x) => Number.isNaN(x) || x < 0)) return { results: [], error: { en: "Enter valid numbers", ar: "أدخل أرقامًا صالحة" } };
      const liters = (d * c) / 100;
      const fuelCost = liters * p;
      const total = fuelCost + extra;
      return {
        results: [
          { label: { en: "Fuel cost", ar: "تكلفة الوقود" }, value: "$" + fmt(fuelCost, 2) },
          { label: { en: "Total cost", ar: "التكلفة الإجمالية" }, value: "$" + fmt(total, 2), primary: true },
          { label: { en: "Per person", ar: "للشخص الواحد" }, value: "$" + fmt(ppl > 0 ? total / ppl : 0, 2) },
        ],
        formula: `Total = fuel + extra; Per person = total / travelers`,
      };
    },
  },
];

// ============================================================================
// Engineering Calculators
// ============================================================================

export const engineeringCalculators: Calculator[] = [
  // Ohm's Law Power
  {
    id: "power-electrical",
    category: "engineering",
    names: { en: "Electrical Power (P = V·I = I²R = V²/R)", ar: "القدرة الكهربائية" },
    descriptions: { en: "Power, voltage, current, resistance relationships.", ar: "علاقات القدرة، الجهد، التيار، المقاومة." },
    keywords: ["power", "electrical", "engineering", "قدرة", "هندسة"],
    icon: "Zap",
    live: true,
    fields: [
      { key: "v", names: { en: "Voltage V (optional)", ar: "الجهد V (اختياري)" }, type: "number", default: 120, unit: { en: "V", ar: "فولت" } },
      { key: "i", names: { en: "Current I (optional)", ar: "التيار I (اختياري)" }, type: "number", default: 10, unit: { en: "A", ar: "أمبير" } },
      { key: "r", names: { en: "Resistance R (optional)", ar: "المقاومة R (اختياري)" }, type: "number", default: 12, unit: { en: "Ω", ar: "أوم" } },
    ],
    compute: (v) => {
      const V = num(v.v), I = num(v.i), R = num(v.r);
      const hasV = !Number.isNaN(V) && V > 0;
      const hasI = !Number.isNaN(I) && I > 0;
      const hasR = !Number.isNaN(R) && R > 0;
      let P = NaN;
      if (hasV && hasI) P = V * I;
      else if (hasI && hasR) P = I * I * R;
      else if (hasV && hasR) P = (V * V) / R;
      if (Number.isNaN(P)) return { results: [], error: { en: "Provide at least 2 values", ar: "أدخل قيمتين على الأقل" } };
      return {
        results: [
          { label: { en: "Power", ar: "القدرة" }, value: fmt(P, 6) + " W", primary: true },
          { label: { en: "Power (kW)", ar: "القدرة (ك.و)" }, value: fmt(P / 1000, 6) + " kW" },
          { label: { en: "Power (HP)", ar: "القدرة (حصان)" }, value: fmt(P / 745.7, 6) + " HP" },
        ],
        formula: `P = V·I = I²R = V²/R`,
      };
    },
  },

  // Pipe Flow (volumetric)
  {
    id: "pipe-flow",
    category: "engineering",
    names: { en: "Pipe Flow Rate", ar: "معدل تدفق الأنبوب" },
    descriptions: { en: "Flow rate Q = velocity × pipe cross-section area.", ar: "معدل التدفق Q = السرعة × مساحة المقطع." },
    keywords: ["pipe", "flow", "engineering", "أنبوب", "تدفق"],
    icon: "Gauge",
    live: true,
    fields: [
      { key: "diameter", names: { en: "Inner diameter", ar: "القطر الداخلي" }, type: "number", default: 0.05, unit: { en: "m", ar: "م" } },
      { key: "velocity", names: { en: "Flow velocity", ar: "سرعة التدفق" }, type: "number", default: 2, unit: { en: "m/s", ar: "م/ث" } },
    ],
    compute: (v) => {
      const d = num(v.diameter), vel = num(v.velocity);
      if ([d, vel].some((x) => Number.isNaN(x) || x <= 0)) return { results: [], error: { en: "Enter positive values", ar: "أدخل قيمًا موجبة" } };
      const area = (Math.PI * d * d) / 4;
      const Q = area * vel;
      return {
        results: [
          { label: { en: "Cross-section area", ar: "مساحة المقطع" }, value: fmt(area, 6) + " m²" },
          { label: { en: "Flow rate (m³/s)", ar: "التدفق (م³/ث)" }, value: fmt(Q, 6) + " m³/s", primary: true },
          { label: { en: "Flow rate (L/min)", ar: "التدفق (لتر/دقيقة)" }, value: fmt(Q * 60000, 2) + " L/min" },
          { label: { en: "Flow rate (m³/h)", ar: "التدفق (م³/س)" }, value: fmt(Q * 3600, 2) + " m³/h" },
        ],
        formula: `A = π·d²/4;  Q = A × v`,
      };
    },
  },

  // Stress & Strain
  {
    id: "stress-strain",
    category: "engineering",
    names: { en: "Stress & Strain", ar: "الإجهاد والانفعال" },
    descriptions: { en: "Stress = F/A; Strain = ΔL/L.", ar: "الإجهاد = F/A؛ الانفعال = ΔL/L." },
    keywords: ["stress", "strain", "mechanical", "إجهاد", "انفعال"],
    icon: "Move",
    live: true,
    fields: [
      { key: "force", names: { en: "Force F", ar: "القوة F" }, type: "number", default: 5000, unit: { en: "N", ar: "نيوتن" } },
      { key: "area", names: { en: "Area A", ar: "المساحة A" }, type: "number", default: 0.001, unit: { en: "m²", ar: "م²" } },
      { key: "dL", names: { en: "Change in length ΔL", ar: "التغير في الطول" }, type: "number", default: 0.002, unit: { en: "m", ar: "م" } },
      { key: "L", names: { en: "Original length L", ar: "الطول الأصلي" }, type: "number", default: 1, unit: { en: "m", ar: "م" } },
    ],
    compute: (v) => {
      const F = num(v.force), A = num(v.area), dL = num(v.dL), L = num(v.L);
      if ([F, A, dL, L].some((x) => Number.isNaN(x) || x <= 0)) return { results: [], error: { en: "Enter positive values", ar: "أدخل قيمًا موجبة" } };
      const stress = F / A;
      const strain = dL / L;
      const E = stress / strain; // Young's modulus
      return {
        results: [
          { label: { en: "Stress σ", ar: "الإجهاد σ" }, value: fmt(stress, 4) + " Pa", primary: true },
          { label: { en: "Strain ε", ar: "الانفعال ε" }, value: fmt(strain, 6) },
          { label: { en: "Young's modulus E", ar: "معامل يونغ E" }, value: fmt(E, 4) + " Pa" },
        ],
        formula: `σ = F/A;  ε = ΔL/L;  E = σ/ε`,
      };
    },
  },

  // Reynolds Number
  {
    id: "reynolds",
    category: "engineering",
    names: { en: "Reynolds Number", ar: "رقم رينولدز" },
    descriptions: { en: "Re = ρvD/μ — characterizes flow regime.", ar: "Re = ρvD/μ — يحدد نظام التدفق." },
    keywords: ["reynolds", "fluid", "flow", "رينولدز", "موائع"],
    icon: "Waves",
    live: true,
    fields: [
      { key: "density", names: { en: "Density ρ", ar: "الكثافة ρ" }, type: "number", default: 1000, unit: { en: "kg/m³", ar: "كجم/م³" } },
      { key: "velocity", names: { en: "Velocity v", ar: "السرعة v" }, type: "number", default: 1.5, unit: { en: "m/s", ar: "م/ث" } },
      { key: "D", names: { en: "Diameter D", ar: "القطر D" }, type: "number", default: 0.05, unit: { en: "m", ar: "م" } },
      { key: "viscosity", names: { en: "Dynamic viscosity μ", ar: "اللزوجة μ" }, type: "number", default: 0.001, unit: { en: "Pa·s", ar: "باس·ث" } },
    ],
    compute: (v) => {
      const rho = num(v.density), vel = num(v.velocity), D = num(v.D), mu = num(v.viscosity);
      if ([rho, vel, D, mu].some((x) => Number.isNaN(x) || x <= 0)) return { results: [], error: { en: "Enter positive values", ar: "أدخل قيمًا موجبة" } };
      const Re = (rho * vel * D) / mu;
      let flow = "Laminar (Re<2300)", flowAr = "طبقي";
      if (Re > 4000) { flow = "Turbulent (Re>4000)"; flowAr = "مضطرب"; }
      else if (Re >= 2300) { flow = "Transitional (2300-4000)"; flowAr = "انتقالي"; }
      return {
        results: [
          { label: { en: "Reynolds number", ar: "رقم رينولدز" }, value: fmt(Re, 2), primary: true },
          { label: { en: "Flow regime", ar: "نظام التدفق" }, value: `${flow} / ${flowAr}` },
        ],
        formula: `Re = ρvD/μ = ${rho}×${vel}×${D}/${mu} = ${fmt(Re, 2)}`,
      };
    },
  },
];

// ============================================================================
// Laboratory Calculators
// ============================================================================

export const laboratoryCalculators: Calculator[] = [
  // Serial Dilution
  {
    id: "serial-dilution",
    category: "laboratory",
    names: { en: "Serial Dilution", ar: "التخفيف المتسلسل" },
    descriptions: { en: "Concentration at each step of a serial dilution.", ar: "التركيز عند كل خطوة من التخفيف المتسلسل." },
    keywords: ["serial", "dilution", "lab", "تخفيف", "مختبر"],
    icon: "TestTube",
    live: true,
    fields: [
      { key: "initial", names: { en: "Initial concentration", ar: "التركيز الابتدائي" }, type: "number", default: 1000, unit: { en: "mg/L", ar: "مجم/لتر" } },
      { key: "factor", names: { en: "Dilution factor", ar: "عامل التخفيف" }, type: "number", default: 10, help: { en: "e.g. 10 = 1:10 dilution", ar: "مثال: 10 = تخفيف 1:10" } },
      { key: "steps", names: { en: "Number of steps", ar: "عدد الخطوات" }, type: "number", default: 5, min: 1, max: 12 },
    ],
    compute: (v) => {
      const c0 = num(v.initial), f = num(v.factor), s = Math.min(12, Math.max(1, Math.round(num(v.steps))));
      if ([c0, f, s].some((x) => Number.isNaN(x) || x <= 0)) return { results: [], error: { en: "Enter positive values", ar: "أدخل قيمًا موجبة" } };
      const rows = [];
      for (let i = 0; i <= s; i++) {
        const c = c0 / Math.pow(f, i);
        rows.push({ label: { en: `Step ${i}`, ar: `الخطوة ${i}` }, value: fmt(c, 6) + " mg/L", primary: i === s });
      }
      return {
        results: rows,
        formula: `Cₙ = C₀ / fⁿ`,
        steps: Array.from({ length: s + 1 }, (_, i) => ({
          description: { en: `Step ${i}: C = ${fmt(c0 / Math.pow(f, i), 4)} mg/L`, ar: `الخطوة ${i}: ${fmt(c0 / Math.pow(f, i), 4)} مجم/لتر` },
        })),
      };
    },
  },

  // Solution Preparation
  {
    id: "solution-prep",
    category: "laboratory",
    names: { en: "Solution Preparation", ar: "تحضير المحلول" },
    descriptions: { en: "Mass of solute to weigh for a target molarity & volume.", ar: "كتلة المذاب لوزنها للحصول على مولارية وحجم مستهدفين." },
    keywords: ["solution", "preparation", "lab", "molar", "محلول", "تحضير"],
    icon: "Beaker",
    live: true,
    fields: [
      { key: "molarity", names: { en: "Target molarity", ar: "المولارية المستهدفة" }, type: "number", default: 0.5, unit: { en: "mol/L", ar: "مول/لتر" } },
      { key: "volume", names: { en: "Target volume", ar: "الحجم المستهدف" }, type: "number", default: 1, unit: { en: "L", ar: "لتر" } },
      { key: "molarMass", names: { en: "Molar mass", ar: "الكتلة المولية" }, type: "number", default: 58.44, unit: { en: "g/mol", ar: "جم/مول" }, help: { en: "NaCl = 58.44", ar: "NaCl = 58.44" } },
    ],
    compute: (v) => {
      const M = num(v.molarity), V = num(v.volume), mw = num(v.molarMass);
      if ([M, V, mw].some((x) => Number.isNaN(x) || x <= 0)) return { results: [], error: { en: "Enter positive values", ar: "أدخل قيمًا موجبة" } };
      const mass = M * V * mw;
      return {
        results: [
          { label: { en: "Mass to weigh", ar: "الكتلة المطلوبة" }, value: fmt(mass, 4) + " g", primary: true },
          { label: { en: "In milligrams", ar: "بالمليجرام" }, value: fmt(mass * 1000, 2) + " mg" },
        ],
        formula: `mass = M × V × MW = ${M} × ${V} × ${mw} = ${fmt(mass, 4)} g`,
        steps: [
          { description: { en: `Moles needed = M × V = ${M} × ${V} = ${fmt(M * V, 4)} mol`, ar: `المولات = ${fmt(M * V, 4)} مول` } },
          { description: { en: `Mass = moles × MW = ${fmt(M * V, 4)} × ${mw} = ${fmt(mass, 4)} g`, ar: `الكتلة = ${fmt(mass, 4)} جم` } },
        ],
        explanation: { en: "Weigh this mass of solute and dissolve in solvent, then bring to the target volume.", ar: "وزن هذه الكتلة من المذاب وذوبها في المذيب، ثم أكمل للحجم المستهدف." },
      };
    },
  },

  // Reagent Calculator
  {
    id: "reagent",
    category: "laboratory",
    names: { en: "Reagent Volume", ar: "حجم الكاشف" },
    descriptions: { en: "Volume of stock reagent needed for a final concentration.", ar: "حجم كاشف المخزون اللازم للتركيز النهائي." },
    keywords: ["reagent", "stock", "lab", "كاشف", "مخزون"],
    icon: "FlaskConical",
    live: true,
    fields: [
      { key: "c2", names: { en: "Final concentration", ar: "التركيز النهائي" }, type: "number", default: 50, unit: { en: "µg/mL", ar: "ميكروجرام/مل" } },
      { key: "v2", names: { en: "Final volume", ar: "الحجم النهائي" }, type: "number", default: 10, unit: { en: "mL", ar: "مل" } },
      { key: "c1", names: { en: "Stock concentration", ar: "تركيز المخزون" }, type: "number", default: 1000, unit: { en: "µg/mL", ar: "ميكروجرام/مل" } },
    ],
    compute: (v) => {
      const c2 = num(v.c2), v2 = num(v.v2), c1 = num(v.c1);
      if ([c2, v2, c1].some((x) => Number.isNaN(x) || x <= 0)) return { results: [], error: { en: "Enter positive values", ar: "أدخل قيمًا موجبة" } };
      const v1 = (c2 * v2) / c1;
      return {
        results: [
          { label: { en: "Stock volume to use", ar: "حجم المخزون المطلوب" }, value: fmt(v1, 4) + " mL", primary: true },
          { label: { en: "Solvent to add", ar: "المذيب المطلوب إضافته" }, value: fmt(v2 - v1, 4) + " mL" },
        ],
        formula: `V₁ = (C₂ × V₂) / C₁ = (${c2} × ${v2}) / ${c1} = ${fmt(v1, 4)} mL`,
      };
    },
  },

  // Lab Unit Conversion (mg/dL ↔ mmol/L for common analytes)
  {
    id: "lab-glucose",
    category: "laboratory",
    names: { en: "Glucose Unit Converter", ar: "محوّل وحدات الجلوكوز" },
    descriptions: { en: "Convert blood glucose between mg/dL and mmol/L.", ar: "تحويل جلوكوز الدم بين مجم/ديسيلتر و مليمول/لتر." },
    keywords: ["glucose", "blood", "lab", "جلوكوز", "سكر"],
    icon: "TestTube",
    live: true,
    fields: [
      { key: "value", names: { en: "Value", ar: "القيمة" }, type: "number", default: 90 },
      {
        key: "from",
        names: { en: "From", ar: "من" },
        type: "select",
        default: "mgdl",
        options: [
          { value: "mgdl", label: { en: "mg/dL", ar: "مجم/ديس" } },
          { value: "mmol", label: { en: "mmol/L", ar: "مليمول/لتر" } },
        ],
      },
    ],
    compute: (v) => {
      const val = num(v.value);
      if (Number.isNaN(val) || val < 0) return { results: [], error: { en: "Enter valid number", ar: "أدخل رقمًا صالحًا" } };
      // Glucose MW = 180.156 g/mol
      // 1 mmol/L = 18.0156 mg/dL
      let mgdl: number, mmol: number;
      if (String(v.from) === "mgdl") { mgdl = val; mmol = val / 18.0156; }
      else { mmol = val; mgdl = val * 18.0156; }
      return {
        results: [
          { label: { en: "mg/dL", ar: "مجم/ديس" }, value: fmt(mgdl, 2), primary: String(v.from) !== "mgdl" },
          { label: { en: "mmol/L", ar: "مليمول/لتر" }, value: fmt(mmol, 2), primary: String(v.from) === "mgdl" },
        ],
        formula: `mmol/L = mg/dL ÷ 18.0156`,
      };
    },
  },
];

// ============================================================================
// Nutrition Calculators
// ============================================================================

export const nutritionCalculators: Calculator[] = [
  // Glycemic Load
  {
    id: "glycemic-load",
    category: "nutrition",
    names: { en: "Glycemic Load", ar: "الحمل السكري" },
    descriptions: { en: "GL = (GI × carbs per serving) / 100.", ar: "GL = (GI × كربوهيدرات الحصة) / 100." },
    keywords: ["glycemic", "load", "gi", "glucose", "سكر", "حمل"],
    icon: "Apple",
    live: true,
    fields: [
      { key: "gi", names: { en: "Glycemic Index (GI)", ar: "المؤشر السكري" }, type: "number", default: 72 },
      { key: "carbs", names: { en: "Carbs per serving", ar: "كربوهيدرات الحصة" }, type: "number", default: 30, unit: { en: "g", ar: "جم" } },
    ],
    compute: (v) => {
      const gi = num(v.gi), c = num(v.carbs);
      if ([gi, c].some((x) => Number.isNaN(x) || x < 0)) return { results: [], error: { en: "Enter valid numbers", ar: "أدخل أرقامًا صالحة" } };
      const gl = (gi * c) / 100;
      let cat = "Low (GL<10)", catAr = "منخفض", status: "good" | "warning" | "bad" = "good";
      if (gl >= 20) { cat = "High (GL≥20)"; catAr = "مرتفع"; status = "bad"; }
      else if (gl >= 10) { cat = "Medium (10-19)"; catAr = "متوسط"; status = "warning"; }
      return {
        results: [
          { label: { en: "Glycemic Load", ar: "الحمل السكري" }, value: fmt(gl, 2), primary: true, status },
          { label: { en: "Category", ar: "التصنيف" }, value: `${cat} / ${catAr}` },
        ],
        formula: `GL = (GI × carbs) / 100 = (${gi} × ${c}) / 100 = ${fmt(gl, 2)}`,
      };
    },
  },

  // BMR-based daily calories (uses nutrition category for clarity)
  {
    id: "daily-calories",
    category: "nutrition",
    names: { en: "Daily Calories", ar: "السعرات اليومية" },
    descriptions: { en: "TDEE = BMR × activity factor.", ar: "إجمالي الإنفاق اليومي = BMR × عامل النشاط." },
    keywords: ["calories", "tdee", "daily", "سعرات", "يومي"],
    icon: "Flame",
    live: true,
    fields: [
      {
        key: "sex",
        names: { en: "Sex", ar: "الجنس" },
        type: "select",
        default: "male",
        options: [
          { value: "male", label: { en: "Male", ar: "ذكر" } },
          { value: "female", label: { en: "Female", ar: "أنثى" } },
        ],
      },
      { key: "weight", names: { en: "Weight", ar: "الوزن" }, type: "number", default: 70, unit: { en: "kg", ar: "كجم" } },
      { key: "height", names: { en: "Height", ar: "الطول" }, type: "number", default: 175, unit: { en: "cm", ar: "سم" } },
      { key: "age", names: { en: "Age", ar: "العمر" }, type: "number", default: 30 },
      {
        key: "activity",
        names: { en: "Activity", ar: "النشاط" },
        type: "select",
        default: "1.55",
        options: [
          { value: "1.2", label: { en: "Sedentary", ar: "خامل" } },
          { value: "1.375", label: { en: "Light", ar: "خفيف" } },
          { value: "1.55", label: { en: "Moderate", ar: "متوسط" } },
          { value: "1.725", label: { en: "Active", ar: "نشط" } },
          { value: "1.9", label: { en: "Very active", ar: "نشط جدًا" } },
        ],
      },
    ],
    compute: (v) => {
      const w = num(v.weight), h = num(v.height), age = num(v.age);
      if ([w, h, age].some((x) => Number.isNaN(x) || x <= 0)) return { results: [], error: { en: "Enter positive values", ar: "أدخل قيمًا موجبة" } };
      const s = String(v.sex) === "male" ? 5 : -161;
      const bmr = 10 * w + 6.25 * h - 5 * age + s;
      const factor = num(v.activity);
      const tdee = bmr * factor;
      return {
        results: [
          { label: { en: "BMR", ar: "معدل الأيض" }, value: fmt(bmr, 0) + " kcal" },
          { label: { en: "TDEE (maintain)", ar: "الثبات" }, value: fmt(tdee, 0) + " kcal/day", primary: true },
          { label: { en: "Lose 0.5 kg/week", ar: "خسارة 0.5 كجم/أسبوع" }, value: fmt(tdee - 500, 0) + " kcal", status: "good" },
          { label: { en: "Gain 0.5 kg/week", ar: "زيادة 0.5 كجم/أسبوع" }, value: fmt(tdee + 500, 0) + " kcal", status: "warning" },
        ],
        formula: `BMR = 10w + 6.25h − 5age + s;  TDEE = BMR × activity`,
      };
    },
  },

  // Protein intake
  {
    id: "protein-intake",
    category: "nutrition",
    names: { en: "Protein Intake", ar: "مقدار البروتين" },
    descriptions: { en: "Daily protein recommendation based on body weight.", ar: "توصية البروتين اليومية حسب وزن الجسم." },
    keywords: ["protein", "intake", "daily", "بروتين"],
    icon: "Apple",
    live: true,
    fields: [
      { key: "weight", names: { en: "Weight", ar: "الوزن" }, type: "number", default: 70, unit: { en: "kg", ar: "كجم" } },
      {
        key: "goal",
        names: { en: "Goal", ar: "الهدف" },
        type: "select",
        default: "active",
        options: [
          { value: "sedentary", label: { en: "Sedentary (0.8 g/kg)", ar: "خامل" } },
          { value: "active", label: { en: "Active (1.6 g/kg)", ar: "نشط" } },
          { value: "endurance", label: { en: "Endurance (1.4 g/kg)", ar: "تحمل" } },
          { value: "strength", label: { en: "Strength (2.0 g/kg)", ar: "قوة" } },
          { value: "cutting", label: { en: "Cutting (2.4 g/kg)", ar: "تنشيف" } },
        ],
      },
    ],
    compute: (v) => {
      const w = num(v.weight);
      if (Number.isNaN(w) || w <= 0) return { results: [], error: { en: "Enter weight", ar: "أدخل الوزن" } };
      const factors: Record<string, number> = { sedentary: 0.8, active: 1.6, endurance: 1.4, strength: 2.0, cutting: 2.4 };
      const f = factors[String(v.goal)] ?? 1.6;
      const g = w * f;
      return {
        results: [{ label: { en: "Daily protein", ar: "البروتين اليومي" }, value: fmt(g, 1) + " g", primary: true }],
        formula: `Protein = ${f} × weight = ${f} × ${w} = ${fmt(g, 1)} g`,
      };
    },
  },
];

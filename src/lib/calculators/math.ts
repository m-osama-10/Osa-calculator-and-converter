// ============================================================================
// Mathematics Calculators
// ============================================================================

import type { Calculator } from "../types";
import { num, fmt } from "../calculator-utils";

export const mathCalculators: Calculator[] = [
  // Triangle Solver (3 sides → area via Heron)
  {
    id: "triangle-area",
    category: "math",
    names: { en: "Triangle Area (Heron)", ar: "مساحة المثلث (هيرون)" },
    descriptions: { en: "Area of a triangle given three sides using Heron's formula.", ar: "مساحة المثلث بمعرفة أضلاعه باستخدام صيغة هيرون." },
    keywords: ["triangle", "heron", "area", "geometry", "مثلث", "هيرون"],
    icon: "Triangle",
    live: true,
    fields: [
      { key: "a", names: { en: "Side a", ar: "الضلع a" }, type: "number", default: 3 },
      { key: "b", names: { en: "Side b", ar: "الضلع b" }, type: "number", default: 4 },
      { key: "c", names: { en: "Side c", ar: "الضلع c" }, type: "number", default: 5 },
    ],
    compute: (v) => {
      const a = num(v.a), b = num(v.b), c = num(v.c);
      if ([a, b, c].some((x) => Number.isNaN(x) || x <= 0)) return { results: [], error: { en: "Sides must be positive", ar: "الأضلاع يجب أن تكون موجبة" } };
      if (a + b <= c || b + c <= a || a + c <= b) return { results: [], error: { en: "Triangle inequality violated", ar: "مخالفة لمتباينة المثلث" } };
      const s = (a + b + c) / 2;
      const A = Math.sqrt(s * (s - a) * (s - b) * (s - c));
      return {
        results: [
          { label: { en: "Area", ar: "المساحة" }, value: fmt(A, 6), primary: true },
          { label: { en: "Perimeter", ar: "المحيط" }, value: fmt(a + b + c) },
          { label: { en: "Semi-perimeter", ar: "نصف المحيط" }, value: fmt(s) },
        ],
        formula: `s = (a+b+c)/2;  A = √(s(s−a)(s−b)(s−c)) = ${fmt(A, 6)}`,
        steps: [
          { description: { en: `s = (${a}+${b}+${c})/2 = ${fmt(s)}`, ar: `s = ${fmt(s)}` } },
          { description: { en: `A = √(${fmt(s)} × ${fmt(s - a)} × ${fmt(s - b)} × ${fmt(s - c)}) = ${fmt(A, 6)}`, ar: `المساحة = ${fmt(A, 6)}` } },
        ],
      };
    },
  },

  // Circle
  {
    id: "circle",
    category: "math",
    names: { en: "Circle Calculator", ar: "حاسبة الدائرة" },
    descriptions: { en: "Area, circumference, diameter from radius.", ar: "المساحة، المحيط، القطر من نصف القطر." },
    keywords: ["circle", "area", "circumference", "دائرة", "مساحة"],
    icon: "Circle",
    live: true,
    fields: [
      { key: "r", names: { en: "Radius r", ar: "نصف القطر r" }, type: "number", default: 5 },
    ],
    compute: (v) => {
      const r = num(v.r);
      if (Number.isNaN(r) || r <= 0) return { results: [], error: { en: "Radius must be positive", ar: "نصف القطر يجب أن يكون موجبًا" } };
      return {
        results: [
          { label: { en: "Area", ar: "المساحة" }, value: fmt(Math.PI * r * r, 6), primary: true },
          { label: { en: "Circumference", ar: "المحيط" }, value: fmt(2 * Math.PI * r, 6) },
          { label: { en: "Diameter", ar: "القطر" }, value: fmt(2 * r) },
        ],
        formula: `A = πr²,  C = 2πr,  d = 2r`,
        steps: [
          { description: { en: `A = π × ${r}² = ${fmt(Math.PI * r * r, 6)}`, ar: `المساحة = ${fmt(Math.PI * r * r, 6)}` } },
          { description: { en: `C = 2π × ${r} = ${fmt(2 * Math.PI * r, 6)}`, ar: `المحيط = ${fmt(2 * Math.PI * r, 6)}` } },
        ],
      };
    },
  },

  // Rectangle
  {
    id: "rectangle",
    category: "math",
    names: { en: "Rectangle Calculator", ar: "حاسبة المستطيل" },
    descriptions: { en: "Area and perimeter of a rectangle.", ar: "المساحة والمحيط للمستطيل." },
    keywords: ["rectangle", "area", "مستطيل", "مساحة"],
    icon: "Square",
    live: true,
    fields: [
      { key: "l", names: { en: "Length", ar: "الطول" }, type: "number", default: 8 },
      { key: "w", names: { en: "Width", ar: "العرض" }, type: "number", default: 5 },
    ],
    compute: (v) => {
      const l = num(v.l), w = num(v.w);
      if ([l, w].some((x) => Number.isNaN(x) || x <= 0)) return { results: [], error: { en: "Sides must be positive", ar: "الأضلاع يجب أن تكون موجبة" } };
      return {
        results: [
          { label: { en: "Area", ar: "المساحة" }, value: fmt(l * w, 6), primary: true },
          { label: { en: "Perimeter", ar: "المحيط" }, value: fmt(2 * (l + w)) },
          { label: { en: "Diagonal", ar: "القطر" }, value: fmt(Math.sqrt(l * l + w * w), 6) },
        ],
        formula: `A = l × w = ${l} × ${w} = ${fmt(l * w, 6)}`,
      };
    },
  },

  // Trigonometry (sin/cos/tan of angle)
  {
    id: "trig",
    category: "math",
    names: { en: "Trigonometry Calculator", ar: "حاسبة المثلثات" },
    descriptions: { en: "Calculate sin, cos, tan and inverse functions.", ar: "احسب sin، cos، tan والدوال العكسية." },
    keywords: ["trig", "sin", "cos", "tan", "مثلثات"],
    icon: "Triangle",
    live: true,
    fields: [
      {
        key: "mode",
        names: { en: "Mode", ar: "الوضع" },
        type: "select",
        default: "deg",
        options: [
          { value: "deg", label: { en: "Degrees", ar: "درجات" } },
          { value: "rad", label: { en: "Radians", ar: "راديان" } },
        ],
      },
      { key: "x", names: { en: "Angle x", ar: "الزاوية x" }, type: "number", default: 30 },
    ],
    compute: (v) => {
      const x = num(v.x);
      if (Number.isNaN(x)) return { results: [], error: { en: "Enter a number", ar: "أدخل رقمًا" } };
      const rad = String(v.mode) === "deg" ? (x * Math.PI) / 180 : x;
      return {
        results: [
          { label: { en: "sin(x)", ar: "sin(x)" }, value: fmt(Math.sin(rad), 8), primary: true },
          { label: { en: "cos(x)", ar: "cos(x)" }, value: fmt(Math.cos(rad), 8) },
          { label: { en: "tan(x)", ar: "tan(x)" }, value: fmt(Math.tan(rad), 8) },
          { label: { en: "csc(x)", ar: "csc(x)" }, value: fmt(1 / Math.sin(rad), 8) },
          { label: { en: "sec(x)", ar: "sec(x)" }, value: fmt(1 / Math.cos(rad), 8) },
          { label: { en: "cot(x)", ar: "cot(x)" }, value: fmt(1 / Math.tan(rad), 8) },
        ],
        formula: `sin, cos, tan of ${x}${String(v.mode) === "deg" ? "°" : " rad"}`,
      };
    },
  },

  // Statistics
  {
    id: "statistics",
    category: "math",
    names: { en: "Statistics (Mean, Median, Std Dev)", ar: "الإحصاء (المتوسط، الوسيط، الانحراف)" },
    descriptions: { en: "Compute mean, median, mode, variance, std dev from a list.", ar: "احسب المتوسط، الوسيط، المنوال، التباين، الانحراف المعياري." },
    keywords: ["statistics", "mean", "median", "stddev", "إحصاء", "متوسط"],
    icon: "BarChart3",
    live: true,
    fields: [
      {
        key: "data",
        names: { en: "Data (comma or space separated)", ar: "البيانات (مفصولة بفاصلة أو مسافة)" },
        type: "text",
        placeholder: { en: "e.g. 1, 2, 3, 4, 5, 5, 6", ar: "مثال: 1, 2, 3, 4, 5, 5, 6" },
        default: "1, 2, 3, 4, 5, 5, 6",
      },
    ],
    compute: (v) => {
      const data = String(v.data)
        .split(/[\s,;]+/)
        .map((s) => Number(s.trim()))
        .filter((n) => Number.isFinite(n));
      if (data.length === 0) return { results: [], error: { en: "Enter at least one number", ar: "أدخل رقمًا واحدًا على الأقل" } };
      const n = data.length;
      const sum = data.reduce((a, b) => a + b, 0);
      const mean = sum / n;
      const sorted = [...data].sort((a, b) => a - b);
      const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];
      const variance = data.reduce((s, x) => s + (x - mean) ** 2, 0) / n;
      const stdDev = Math.sqrt(variance);
      const min = sorted[0], max = sorted[n - 1];
      // mode
      const counts: Record<number, number> = {};
      data.forEach((x) => (counts[x] = (counts[x] || 0) + 1));
      const maxCount = Math.max(...Object.values(counts));
      const modes = Object.entries(counts).filter(([, c]) => c === maxCount).map(([k]) => k);
      return {
        results: [
          { label: { en: "Count (n)", ar: "العدد" }, value: String(n) },
          { label: { en: "Mean", ar: "المتوسط" }, value: fmt(mean, 6), primary: true },
          { label: { en: "Median", ar: "الوسيط" }, value: fmt(median, 6) },
          { label: { en: "Mode", ar: "المنوال" }, value: maxCount === 1 ? "—" : modes.join(", ") },
          { label: { en: "Std deviation", ar: "الانحراف المعياري" }, value: fmt(stdDev, 6) },
          { label: { en: "Variance", ar: "التباين" }, value: fmt(variance, 6) },
          { label: { en: "Min", ar: "الأدنى" }, value: fmt(min) },
          { label: { en: "Max", ar: "الأعلى" }, value: fmt(max) },
          { label: { en: "Range", ar: "المدى" }, value: fmt(max - min) },
          { label: { en: "Sum", ar: "المجموع" }, value: fmt(sum) },
        ],
        formula: `mean = Σx / n,  variance = Σ(x − mean)² / n,  σ = √variance`,
        steps: [
          { description: { en: `n = ${n}`, ar: `n = ${n}` } },
          { description: { en: `Σx = ${fmt(sum)}`, ar: `المجموع = ${fmt(sum)}` } },
          { description: { en: `mean = ${fmt(sum)} / ${n} = ${fmt(mean, 6)}`, ar: `المتوسط = ${fmt(mean, 6)}` } },
          { description: { en: `σ = ${fmt(stdDev, 6)}`, ar: `الانحراف = ${fmt(stdDev, 6)}` } },
        ],
      };
    },
  },

  // Matrix Determinant (2x2 and 3x3)
  {
    id: "matrix-det",
    category: "math",
    names: { en: "Matrix Determinant", ar: "محدّد المصفوفة" },
    descriptions: { en: "Determinant of 2×2 or 3×3 matrix.", ar: "محدّد مصفوفة 2×2 أو 3×3." },
    keywords: ["matrix", "determinant", "linear algebra", "مصفوفة", "محدد"],
    icon: "Grid3x3",
    live: true,
    fields: [
      {
        key: "size",
        names: { en: "Size", ar: "الحجم" },
        type: "select",
        default: "2",
        options: [
          { value: "2", label: { en: "2 × 2", ar: "2 × 2" } },
          { value: "3", label: { en: "3 × 3", ar: "3 × 3" } },
        ],
      },
      { key: "a", names: { en: "a", ar: "a" }, type: "number", default: 1 },
      { key: "b", names: { en: "b", ar: "b" }, type: "number", default: 2 },
      { key: "c", names: { en: "c", ar: "c" }, type: "number", default: 3 },
      { key: "d", names: { en: "d", ar: "d" }, type: "number", default: 4 },
      { key: "e", names: { en: "e (3×3)", ar: "e (3×3)" }, type: "number", default: 5 },
      { key: "f", names: { en: "f (3×3)", ar: "f (3×3)" }, type: "number", default: 6 },
      { key: "g", names: { en: "g (3×3)", ar: "g (3×3)" }, type: "number", default: 7 },
      { key: "h", names: { en: "h (3×3)", ar: "h (3×3)" }, type: "number", default: 8 },
      { key: "i", names: { en: "i (3×3)", ar: "i (3×3)" }, type: "number", default: 9 },
    ],
    compute: (v) => {
      const a = num(v.a), b = num(v.b), c = num(v.c), d = num(v.d);
      const e = num(v.e), f = num(v.f), g = num(v.g), h = num(v.h), i = num(v.i);
      if ([a, b, c, d, e, f, g, h, i].some(Number.isNaN)) return { results: [], error: { en: "Enter valid numbers", ar: "أدخل أرقامًا صالحة" } };
      if (String(v.size) === "2") {
        const det = a * d - b * c;
        return {
          results: [{ label: { en: "Determinant", ar: "المحدّد" }, value: fmt(det, 6), primary: true }],
          formula: `det = ad − bc = ${a}×${d} − ${b}×${c} = ${fmt(det, 6)}`,
          steps: [{ description: { en: `det = ${a}*${d} - ${b}*${c} = ${fmt(det, 6)}`, ar: `المحدّد = ${fmt(det, 6)}` } }],
        };
      }
      const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
      return {
        results: [{ label: { en: "Determinant", ar: "المحدّد" }, value: fmt(det, 6), primary: true }],
        formula: `det = a(ei − fh) − b(di − fg) + c(dh − eg)`,
        steps: [
          { description: { en: `a(${e}*${i} - ${f}*${h}) = ${fmt(a * (e * i - f * h), 6)}`, ar: `المصطلح الأول = ${fmt(a * (e * i - f * h), 6)}` } },
          { description: { en: `-b(${d}*${i} - ${f}*${g}) = ${fmt(-b * (d * i - f * g), 6)}`, ar: `المصطلح الثاني = ${fmt(-b * (d * i - f * g), 6)}` } },
          { description: { en: `+c(${d}*${h} - ${e}*${g}) = ${fmt(c * (d * h - e * g), 6)}`, ar: `المصطلح الثالث = ${fmt(c * (d * h - e * g), 6)}` } },
          { description: { en: `Total: ${fmt(det, 6)}`, ar: `المجموع: ${fmt(det, 6)}` } },
        ],
      };
    },
  },

  // Complex Number operations
  {
    id: "complex",
    category: "math",
    names: { en: "Complex Numbers", ar: "الأعداد المركبة" },
    descriptions: { en: "Add, subtract, multiply, divide two complex numbers; convert to polar.", ar: "اجمع، اطرح، اضرب، اقسم عددين مركبين؛ حوّل إلى قطبي." },
    keywords: ["complex", "imaginary", "polar", "مركب", "تخيلي"],
    icon: "Sigma",
    live: true,
    fields: [
      {
        key: "op",
        names: { en: "Operation", ar: "العملية" },
        type: "select",
        default: "add",
        options: [
          { value: "add", label: { en: "Add", ar: "جمع" } },
          { value: "sub", label: { en: "Subtract", ar: "طرح" } },
          { value: "mul", label: { en: "Multiply", ar: "ضرب" } },
          { value: "div", label: { en: "Divide", ar: "قسمة" } },
        ],
      },
      { key: "a1", names: { en: "Re(z₁)", ar: "الحقيقي z₁" }, type: "number", default: 1 },
      { key: "b1", names: { en: "Im(z₁)", ar: "التخيلي z₁" }, type: "number", default: 2 },
      { key: "a2", names: { en: "Re(z₂)", ar: "الحقيقي z₂" }, type: "number", default: 3 },
      { key: "b2", names: { en: "Im(z₂)", ar: "التخيلي z₂" }, type: "number", default: 4 },
    ],
    compute: (v) => {
      const a1 = num(v.a1), b1 = num(v.b1), a2 = num(v.a2), b2 = num(v.b2);
      if ([a1, b1, a2, b2].some(Number.isNaN)) return { results: [], error: { en: "Enter valid numbers", ar: "أدخل أرقامًا صالحة" } };
      const op = String(v.op);
      let re = 0, im = 0;
      switch (op) {
        case "add": re = a1 + a2; im = b1 + b2; break;
        case "sub": re = a1 - a2; im = b1 - b2; break;
        case "mul": re = a1 * a2 - b1 * b2; im = a1 * b2 + b1 * a2; break;
        case "div": {
          const d = a2 * a2 + b2 * b2;
          if (d === 0) return { results: [], error: { en: "Cannot divide by zero", ar: "لا يمكن القسمة على صفر" } };
          re = (a1 * a2 + b1 * b2) / d;
          im = (b1 * a2 - a1 * b2) / d;
          break;
        }
      }
      const mag = Math.sqrt(re * re + im * im);
      const angle = (Math.atan2(im, re) * 180) / Math.PI;
      return {
        results: [
          { label: { en: "Result (rect)", ar: "النتيجة (مستطيل)" }, value: `${fmt(re, 4)} ${im >= 0 ? "+" : "−"} ${fmt(Math.abs(im), 4)}i`, primary: true },
          { label: { en: "Magnitude |z|", ar: "المقدار |z|" }, value: fmt(mag, 6) },
          { label: { en: "Argument θ", ar: "الزاوية θ" }, value: fmt(angle, 4) + "°" },
        ],
        formula: `${op}: (${a1}+${b1}i) ${op === "add" ? "+" : op === "sub" ? "−" : op === "mul" ? "×" : "÷"} (${a2}+${b2}i) = ${fmt(re, 4)} ${im >= 0 ? "+" : "−"} ${fmt(Math.abs(im), 4)}i`,
      };
    },
  },

  // Logarithm (any base)
  {
    id: "logarithm",
    category: "math",
    names: { en: "Logarithm (any base)", ar: "اللوغاريتم (أي أساس)" },
    descriptions: { en: "Compute logₐ(x) for any base a and argument x.", ar: "احسب logₐ(x) لأي أساس a ووسيط x." },
    keywords: ["log", "logarithm", "ln", "لوغاريتم"],
    icon: "FunctionSquare",
    live: true,
    fields: [
      { key: "x", names: { en: "Argument x", ar: "الوسيط x" }, type: "number", default: 1000 },
      { key: "base", names: { en: "Base a", ar: "الأساس a" }, type: "number", default: 10, help: { en: "Use e (2.71828) for natural log", ar: "استخدم e للوغاريتم الطبيعي" } },
    ],
    compute: (v) => {
      const x = num(v.x), a = num(v.base);
      if ([x, a].some(Number.isNaN)) return { results: [], error: { en: "Enter valid numbers", ar: "أدخل أرقامًا صالحة" } };
      if (x <= 0 || a <= 0 || a === 1) return { results: [], error: { en: "x > 0, a > 0, a ≠ 1", ar: "x > 0، a > 0، a ≠ 1" } };
      const r = Math.log(x) / Math.log(a);
      return {
        results: [{ label: { en: `log${a}(x)`, ar: `log${a}(x)` }, value: fmt(r, 8), primary: true }],
        formula: `logₐ(x) = ln(x) / ln(a) = ln(${x}) / ln(${a}) = ${fmt(r, 8)}`,
      };
    },
  },

  // GCD/LCM
  {
    id: "gcd-lcm",
    category: "math",
    names: { en: "GCD & LCM", ar: "القاسم المشترك والمضاعف" },
    descriptions: { en: "Greatest common divisor & least common multiple of two integers.", ar: "القاسم المشترك الأكبر والمضاعف المشترك الأصغر." },
    keywords: ["gcd", "lcm", "divisor", "multiple", "قاسم", "مضاعف"],
    icon: "Equal",
    live: true,
    fields: [
      { key: "a", names: { en: "a", ar: "a" }, type: "number", default: 24 },
      { key: "b", names: { en: "b", ar: "b" }, type: "number", default: 36 },
    ],
    compute: (v) => {
      let a = Math.abs(Math.round(num(v.a))), b = Math.abs(Math.round(num(v.b)));
      if (Number.isNaN(a) || Number.isNaN(b)) return { results: [], error: { en: "Enter integers", ar: "أدخل أعدادًا صحيحة" } };
      if (a === 0 && b === 0) return { results: [], error: { en: "Both cannot be zero", ar: "كلاهما لا يمكن أن يكون صفرًا" } };
      const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
      const g = gcd(a, b);
      const l = (a * b) / g || 0;
      return {
        results: [
          { label: { en: "GCD", ar: "القاسم المشترك" }, value: String(g), primary: true },
          { label: { en: "LCM", ar: "المضاعف المشترك" }, value: String(l) },
        ],
        formula: `gcd(${a}, ${b}) = ${g},  lcm = a×b / gcd = ${l}`,
      };
    },
  },

  // Combination / Permutation
  {
    id: "combinations-permutations",
    category: "math",
    names: { en: "Combinations & Permutations", ar: "التباديل والترتيبات" },
    descriptions: { en: "Calculate nCr (combinations) and nPr (permutations).", ar: "احسب nCr (التركيبات) و nPr (التباديل)." },
    keywords: ["combination", "permutation", "ncr", "npr", "تبديل", "ترتيب"],
    icon: "Shuffle",
    live: true,
    fields: [
      { key: "n", names: { en: "n", ar: "n" }, type: "number", default: 10 },
      { key: "r", names: { en: "r", ar: "r" }, type: "number", default: 3 },
    ],
    compute: (v) => {
      const n = Math.round(num(v.n)), r = Math.round(num(v.r));
      if (Number.isNaN(n) || Number.isNaN(r)) return { results: [], error: { en: "Enter integers", ar: "أدخل أعدادًا صحيحة" } };
      if (r < 0 || n < 0 || r > n) return { results: [], error: { en: "0 ≤ r ≤ n required", ar: "يجب 0 ≤ r ≤ n" } };
      const fact = (x: number) => { let f = 1; for (let i = 2; i <= x; i++) f *= i; return f; };
      const P = fact(n) / fact(n - r);
      const C = P / fact(r);
      return {
        results: [
          { label: { en: "Permutations nPr", ar: "التباديل nPr" }, value: fmt(P), primary: true },
          { label: { en: "Combinations nCr", ar: "التركيبات nCr" }, value: fmt(C), primary: true },
        ],
        formula: `nPr = n!/(n−r)!,  nCr = n!/(r!(n−r)!)`,
      };
    },
  },
];

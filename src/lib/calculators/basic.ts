// ============================================================================
// Basic Calculators: Standard, Scientific, Programmer, Percentage, Fraction, Equation Solver
// ============================================================================

import type { Calculator } from "../types";
import { num, fmt, safeEval, factorial } from "../calculator-utils";

export const basicCalculators: Calculator[] = [
  // -------------------------------------------------------------------------
  // Standard Calculator (live expression evaluator)
  // -------------------------------------------------------------------------
  {
    id: "standard",
    category: "basic",
    names: { en: "Standard Calculator", ar: "حاسبة قياسية" },
    descriptions: {
      en: "Evaluate arithmetic expressions with +, −, ×, ÷, ^, %, parentheses, π and e.",
      ar: "احسب التعابير الحسابية باستخدام +، −، ×، ÷، ^، %، الأقواس، π و e.",
    },
    keywords: ["standard", "arithmetic", "basic", "حاسبة", "حساب", "قياسي"],
    icon: "Calculator",
    live: true,
    fields: [
      {
        key: "expr",
        names: { en: "Expression", ar: "التعبير" },
        type: "text",
        placeholder: { en: "e.g. 2 + 3 * (4 - 1) ^ 2", ar: "مثال: 2 + 3 * (4 - 1) ^ 2" },
        default: "2 + 3 * (4 - 1) ^ 2",
        help: {
          en: "Operators: + − × ÷ ^ %  Functions: sin cos tan log ln sqrt abs exp  Constants: π e",
          ar: "العمليات: + − × ÷ ^ %  الدوال: sin cos tan log ln sqrt abs exp  الثوابت: π e",
        },
      },
    ],
    compute: (v) => {
      const expr = String(v.expr ?? "").trim();
      if (!expr) return { results: [], error: { en: "Enter an expression", ar: "أدخل تعبيرًا" } };
      const result = safeEval(expr);
      if (!Number.isFinite(result)) {
        return {
          results: [],
          error: { en: "Invalid expression", ar: "تعبير غير صالح" },
        };
      }
      return {
        results: [
          {
            label: { en: "Result", ar: "النتيجة" },
            value: fmt(result, 10),
            primary: true,
          },
        ],
        formula: `${expr} = ${fmt(result, 10)}`,
        explanation: {
          en: "Standard arithmetic evaluation respecting operator precedence (PEMDAS). Functions and constants are evaluated using JavaScript's Math library.",
          ar: "تقييم حسابي قياسي يراعي أسبقية العمليات (PEMDAS). يتم تقييم الدوال والثوابت باستخدام مكتبة Math في JavaScript.",
        },
      };
    },
  },

  // -------------------------------------------------------------------------
  // Scientific Calculator
  // -------------------------------------------------------------------------
  {
    id: "scientific",
    category: "basic",
    names: { en: "Scientific Calculator", ar: "حاسبة علمية" },
    descriptions: {
      en: "Trigonometry, logarithms, exponentials, factorials & powers in degrees or radians.",
      ar: "حساب المثلثات، اللوغاريتمات، الأُس، المضروب والقوى بالدرجات أو الراديان.",
    },
    keywords: ["scientific", "trig", "log", "sin", "cos", "tan", "factorial", "علمي"],
    icon: "FunctionSquare",
    live: true,
    fields: [
      {
        key: "angleMode",
        names: { en: "Angle mode", ar: "وضع الزاوية" },
        type: "select",
        default: "rad",
        options: [
          { value: "rad", label: { en: "Radians", ar: "راديان" } },
          { value: "deg", label: { en: "Degrees", ar: "درجات" } },
        ],
      },
      {
        key: "expr",
        names: { en: "Expression", ar: "التعبير" },
        type: "text",
        placeholder: { en: "e.g. sin(π/4) + log(1000) + 5!", ar: "مثال: sin(π/4) + log(1000) + 5!" },
        default: "sin(π/4) + log(1000) + 5!",
        help: {
          en: "Supports sin, cos, tan, asin, acos, atan, log (base 10), ln, exp, sqrt, abs, factorial (!), π, e",
          ar: "يدعم sin, cos, tan, asin, acos, atan, log (أساس 10), ln, exp, sqrt, abs, المضروب (!), π, e",
        },
      },
    ],
    compute: (v) => {
      const mode = String(v.angleMode ?? "rad");
      let expr = String(v.expr ?? "").trim();
      if (!expr) return { results: [], error: { en: "Enter an expression", ar: "أدخل تعبيرًا" } };

      if (mode === "deg") {
        expr = expr
          .replace(/sin\(/g, "sin((pi/180)*")
          .replace(/cos\(/g, "cos((pi/180)*")
          .replace(/tan\(/g, "tan((pi/180)*")
          .replace(/asin\(/g, "(180/pi)*asin(")
          .replace(/acos\(/g, "(180/pi)*acos(")
          .replace(/atan\(/g, "(180/pi)*atan(")
          .replace(/\bpi\b/g, String(Math.PI));
      } else {
        expr = expr.replace(/\bpi\b/g, String(Math.PI));
      }

      const cleaned = expr
        .replace(/\^/g, "**")
        .replace(/(\d+(?:\.\d+)?)!/g, (_, n) => String(factorial(Number(n))))
        .replace(/log\(/g, "Math.log10(")
        .replace(/ln\(/g, "Math.log(")
        .replace(/sin\(/g, "Math.sin(")
        .replace(/cos\(/g, "Math.cos(")
        .replace(/tan\(/g, "Math.tan(")
        .replace(/asin\(/g, "Math.asin(")
        .replace(/acos\(/g, "Math.acos(")
        .replace(/atan\(/g, "Math.atan(")
        .replace(/sqrt\(/g, "Math.sqrt(")
        .replace(/exp\(/g, "Math.exp(")
        .replace(/abs\(/g, "Math.abs(")
        .replace(/\be\b/g, String(Math.E));

      try {
        const r = new Function(`"use strict"; return (${cleaned});`)();
        if (typeof r !== "number" || !Number.isFinite(r)) throw new Error();
        return {
          results: [
            {
              label: { en: "Result", ar: "النتيجة" },
              value: fmt(r, 10),
              primary: true,
            },
            {
              label: { en: "Scientific", ar: "علمي" },
              value: r.toExponential(6),
            },
          ],
          formula: `${String(v.expr)} = ${fmt(r, 10)}`,
          steps: [
            {
              description: {
                en: `Evaluated in ${mode === "deg" ? "degrees" : "radians"} mode`,
                ar: `تم التقييم في وضع ${mode === "deg" ? "الدرجات" : "الراديان"}`,
              },
            },
          ],
          explanation: {
            en: "Scientific evaluation using Math functions. Trigonometric input is interpreted in the chosen angle mode.",
            ar: "تقييم علمي باستخدام دوال Math. يتم تفسير المدخلات المثلثية حسب وضع الزاوية المختار.",
          },
        };
      } catch {
        return { results: [], error: { en: "Invalid expression", ar: "تعبير غير صالح" } };
      }
    },
  },

  // -------------------------------------------------------------------------
  // Programmer Calculator — base conversions & bitwise
  // -------------------------------------------------------------------------
  {
    id: "programmer",
    category: "basic",
    names: { en: "Programmer Calculator", ar: "حاسبة المبرمج" },
    descriptions: {
      en: "Convert between binary, octal, decimal & hex; perform bitwise operations.",
      ar: "تحويل بين الثنائي، الثماني، العشري والسداسي عشر؛ وإجراء عمليات bitwise.",
    },
    keywords: ["programmer", "binary", "hex", "octal", "decimal", "bitwise", "مبرمج"],
    icon: "Binary",
    live: true,
    fields: [
      {
        key: "value",
        names: { en: "Value", ar: "القيمة" },
        type: "text",
        placeholder: { en: "e.g. 255 or 0xFF or 0b1010", ar: "مثال: 255 أو 0xFF أو 0b1010" },
        default: "255",
      },
      {
        key: "op",
        names: { en: "Bitwise operation", ar: "عملية bitwise" },
        type: "select",
        default: "none",
        options: [
          { value: "none", label: { en: "None (convert only)", ar: "بدون (تحويل فقط)" } },
          { value: "not", label: { en: "NOT (~)", ar: "NOT (~)" } },
          { value: "shl1", label: { en: "Shift left 1 (<< 1)", ar: "إزاحة يسار 1" } },
          { value: "shr1", label: { en: "Shift right 1 (>> 1)", ar: "إزاحة يمين 1" } },
        ],
      },
    ],
    compute: (v) => {
      const raw = String(v.value ?? "").trim();
      let n: number;
      if (/^0x[0-9a-f]+$/i.test(raw)) n = parseInt(raw.slice(2), 16);
      else if (/^0b[01]+$/i.test(raw)) n = parseInt(raw.slice(2), 2);
      else if (/^0o[0-7]+$/i.test(raw)) n = parseInt(raw.slice(2), 8);
      else if (/^-?\d+$/.test(raw)) n = parseInt(raw, 10);
      else return { results: [], error: { en: "Invalid number format", ar: "صيغة رقم غير صالحة" } };

      const op = String(v.op ?? "none");
      let result = n;
      let opDesc = "";
      if (op === "not") {
        result = ~n;
        opDesc = `~${n} = ${result}`;
      } else if (op === "shl1") {
        result = n << 1;
        opDesc = `${n} << 1 = ${result}`;
      } else if (op === "shr1") {
        result = n >> 1;
        opDesc = `${n} >> 1 = ${result}`;
      }

      const u = result >>> 0;
      return {
        results: [
          { label: { en: "Decimal", ar: "عشري" }, value: String(result), primary: true },
          { label: { en: "Unsigned", ar: "غير موقّع" }, value: String(u) },
          { label: { en: "Hexadecimal", ar: "سداسي عشر" }, value: "0x" + u.toString(16).toUpperCase() },
          { label: { en: "Octal", ar: "ثماني" }, value: "0o" + u.toString(8) },
          { label: { en: "Binary", ar: "ثنائي" }, value: "0b" + u.toString(2) },
        ],
        formula: op === "none" ? String(result) : opDesc,
        explanation: {
          en: "32-bit signed/unsigned conversion and bitwise operations. Hex uses 0x prefix, binary 0b, octal 0o.",
          ar: "تحويل وعمليات bitwise بإشارة 32-bit. يستخدم السداسي عشر 0x، والثنائي 0b، والثماني 0o.",
        },
      };
    },
  },

  // -------------------------------------------------------------------------
  // Percentage Calculator
  // -------------------------------------------------------------------------
  {
    id: "percentage",
    category: "basic",
    names: { en: "Percentage Calculator", ar: "حاسبة النسبة المئوية" },
    descriptions: {
      en: "Find X% of Y, what % X is of Y, percentage increase/decrease.",
      ar: "أوجد X% من Y، كم نسبة X من Y، الزيادة/النقصان بالنسبة المئوية.",
    },
    keywords: ["percentage", "percent", "نسبة", "مئوية"],
    icon: "Percent",
    live: true,
    fields: [
      {
        key: "mode",
        names: { en: "Mode", ar: "الوضع" },
        type: "select",
        default: "of",
        options: [
          { value: "of", label: { en: "X% of Y", ar: "X% من Y" } },
          { value: "isWhat", label: { en: "X is what % of Y", ar: "X كم نسبة من Y" } },
          { value: "increase", label: { en: "% increase from X to Y", ar: "نسبة الزيادة من X إلى Y" } },
        ],
      },
      { key: "x", names: { en: "X", ar: "X" }, type: "number", default: 25 },
      { key: "y", names: { en: "Y", ar: "Y" }, type: "number", default: 200 },
    ],
    compute: (v) => {
      const x = num(v.x);
      const y = num(v.y);
      const mode = String(v.mode ?? "of");
      if (Number.isNaN(x) || Number.isNaN(y)) {
        return { results: [], error: { en: "Enter valid numbers", ar: "أدخل أرقامًا صالحة" } };
      }
      if (mode === "of") {
        const r = (x / 100) * y;
        return {
          results: [
            { label: { en: "Result", ar: "النتيجة" }, value: fmt(r), primary: true },
          ],
          formula: `${x}% × ${y} = ${fmt(r)}`,
          steps: [
            { description: { en: `Convert ${x}% to decimal: ${x / 100}`, ar: `حوّل ${x}% إلى عشري: ${x / 100}` } },
            { description: { en: `Multiply: ${x / 100} × ${y} = ${fmt(r)}`, ar: `اضرب: ${x / 100} × ${y} = ${fmt(r)}` } },
          ],
        };
      }
      if (mode === "isWhat") {
        if (y === 0) return { results: [], error: { en: "Y cannot be zero", ar: "لا يمكن أن يكون Y صفرًا" } };
        const r = (x / y) * 100;
        return {
          results: [
            { label: { en: "Percentage", ar: "النسبة" }, value: fmt(r) + "%", primary: true },
          ],
          formula: `(${x} ÷ ${y}) × 100 = ${fmt(r)}%`,
        };
      }
      if (x === 0) return { results: [], error: { en: "X cannot be zero", ar: "لا يمكن أن يكون X صفرًا" } };
      const diff = y - x;
      const r = (diff / Math.abs(x)) * 100;
      return {
        results: [
          {
            label: { en: "Change", ar: "التغير" },
            value: (r >= 0 ? "+" : "") + fmt(r) + "%",
            primary: true,
            status: r >= 0 ? "good" : "bad",
          },
          { label: { en: "Difference", ar: "الفرق" }, value: fmt(diff) },
        ],
        formula: `(${y} − ${x}) ÷ |${x}| × 100 = ${fmt(r)}%`,
      };
    },
  },

  // -------------------------------------------------------------------------
  // Fraction Calculator
  // -------------------------------------------------------------------------
  {
    id: "fraction",
    category: "basic",
    names: { en: "Fraction Calculator", ar: "حاسبة الكسور" },
    descriptions: {
      en: "Add, subtract, multiply or divide two fractions; simplify the result.",
      ar: "اجمع، اطرح، اضرب أو اقسم كسرين وبسّط النتيجة.",
    },
    keywords: ["fraction", "simplify", "gcd", "كسر", "تبسيط"],
    icon: "Divide",
    live: true,
    fields: [
      {
        key: "op",
        names: { en: "Operation", ar: "العملية" },
        type: "select",
        default: "add",
        options: [
          { value: "add", label: { en: "Add (a/b + c/d)", ar: "جمع (a/b + c/d)" } },
          { value: "sub", label: { en: "Subtract", ar: "طرح" } },
          { value: "mul", label: { en: "Multiply", ar: "ضرب" } },
          { value: "div", label: { en: "Divide", ar: "قسمة" } },
        ],
      },
      { key: "a", names: { en: "Numerator a", ar: "البسط a" }, type: "number", default: 1 },
      { key: "b", names: { en: "Denominator b", ar: "المقام b" }, type: "number", default: 2 },
      { key: "c", names: { en: "Numerator c", ar: "البسط c" }, type: "number", default: 3 },
      { key: "d", names: { en: "Denominator d", ar: "المقام d" }, type: "number", default: 4 },
    ],
    compute: (v) => {
      const a = num(v.a), b = num(v.b), c = num(v.c), d = num(v.d);
      const op = String(v.op ?? "add");
      if ([a, b, c, d].some(Number.isNaN)) return { results: [], error: { en: "Enter integers", ar: "أدخل أعدادًا صحيحة" } };
      if (b === 0 || d === 0) return { results: [], error: { en: "Denominators cannot be zero", ar: "لا يمكن أن يكون المقام صفرًا" } };
      let n: number, dn: number;
      switch (op) {
        case "add": n = a * d + c * b; dn = b * d; break;
        case "sub": n = a * d - c * b; dn = b * d; break;
        case "mul": n = a * c; dn = b * d; break;
        case "div": n = a * d; dn = b * c; break;
        default: n = 0; dn = 1;
      }
      const g = gcd(Math.abs(n), Math.abs(dn));
      const sn = n / g, sd = dn / g;
      const sign = sn * sd < 0 ? "-" : "";
      const whole = Math.floor(Math.abs(sn) / Math.abs(sd));
      const rem = Math.abs(sn) % Math.abs(sd);
      const mixed = rem === 0
        ? `${sign}${Math.abs(sn) / Math.abs(sd)}`
        : `${sign}${whole > 0 ? whole + " " : ""}${rem}/${Math.abs(sd)}`;
      return {
        results: [
          { label: { en: "Result (fraction)", ar: "النتيجة (كسر)" }, value: `${sign}${Math.abs(sn)}/${Math.abs(sd)}`, primary: true },
          { label: { en: "Mixed", ar: "عدد كسري" }, value: mixed },
          { label: { en: "Decimal", ar: "عشري" }, value: fmt(sn / sd, 6) },
        ],
        formula: `${a}/${b} ${op === "add" ? "+" : op === "sub" ? "−" : op === "mul" ? "×" : "÷"} ${c}/${d} = ${sign}${Math.abs(sn)}/${Math.abs(sd)}`,
        steps: [
          { description: { en: `Raw: ${n}/${dn}`, ar: `خام: ${n}/${dn}` } },
          { description: { en: `GCD(${Math.abs(n)}, ${Math.abs(dn)}) = ${g}`, ar: `القسمة المشتركة = ${g}` } },
          { description: { en: `Simplified: ${sign}${Math.abs(sn)}/${Math.abs(sd)}`, ar: `مبسّط: ${sign}${Math.abs(sn)}/${Math.abs(sd)}` } },
        ],
      };
    },
  },

  // -------------------------------------------------------------------------
  // Equation Solver — linear & quadratic
  // -------------------------------------------------------------------------
  {
    id: "equation-solver",
    category: "basic",
    names: { en: "Equation Solver", ar: "حل المعادلات" },
    descriptions: {
      en: "Solve linear (ax + b = 0) and quadratic (ax² + bx + c = 0) equations.",
      ar: "حل المعادلات الخطية (ax + b = 0) والتربيعية (ax² + bx + c = 0).",
    },
    keywords: ["equation", "quadratic", "linear", "root", "solve", "معادلة", "جذر"],
    icon: "Equal",
    live: true,
    fields: [
      {
        key: "type",
        names: { en: "Equation type", ar: "نوع المعادلة" },
        type: "select",
        default: "quadratic",
        options: [
          { value: "linear", label: { en: "Linear: ax + b = 0", ar: "خطية: ax + b = 0" } },
          { value: "quadratic", label: { en: "Quadratic: ax² + bx + c = 0", ar: "تربيعية: ax² + bx + c = 0" } },
        ],
      },
      { key: "a", names: { en: "a", ar: "a" }, type: "number", default: 1 },
      { key: "b", names: { en: "b", ar: "b" }, type: "number", default: -5 },
      { key: "c", names: { en: "c", ar: "c" }, type: "number", default: 6, help: { en: "Only for quadratic", ar: "للتربيعية فقط" } },
    ],
    compute: (v) => {
      const a = num(v.a), b = num(v.b), c = num(v.c);
      const type = String(v.type ?? "quadratic");
      if ([a, b, c].some(Number.isNaN)) return { results: [], error: { en: "Enter coefficients", ar: "أدخل المعاملات" } };
      if (type === "linear") {
        if (a === 0) {
          if (b === 0) return { results: [{ label: { en: "Solution", ar: "الحل" }, value: "All real numbers", primary: true }] };
          return { results: [], error: { en: "No solution", ar: "لا يوجد حل" } };
        }
        const x = -b / a;
        return {
          results: [{ label: { en: "x", ar: "x" }, value: fmt(x), primary: true }],
          formula: `${a}x + ${b} = 0  →  x = −b/a = ${fmt(x)}`,
          steps: [
            { description: { en: `Subtract ${b}: ${a}x = ${-b}`, ar: `اطرح ${b}: ${a}x = ${-b}` } },
            { description: { en: `Divide by ${a}: x = ${fmt(x)}`, ar: `اقسم على ${a}: x = ${fmt(x)}` } },
          ],
        };
      }
      if (a === 0) return { results: [], error: { en: "a cannot be zero for quadratic", ar: "a لا يمكن أن يكون صفرًا" } };
      const disc = b * b - 4 * a * c;
      if (disc < 0) {
        const real = -b / (2 * a);
        const imag = Math.sqrt(-disc) / (2 * a);
        return {
          results: [
            { label: { en: "Discriminant", ar: "المميّز" }, value: fmt(disc), status: "bad" },
            { label: { en: "Root 1", ar: "الجذر 1" }, value: `${fmt(real)} + ${fmt(imag)}i`, primary: true },
            { label: { en: "Root 2", ar: "الجذر 2" }, value: `${fmt(real)} − ${fmt(imag)}i`, primary: true },
          ],
          formula: `x = (−b ± √(b² − 4ac)) / 2a`,
          explanation: {
            en: "Negative discriminant → complex conjugate roots.",
            ar: "مميّز سالب → جذور مركبة مرافقة.",
          },
        };
      }
      const sq = Math.sqrt(disc);
      const x1 = (-b + sq) / (2 * a);
      const x2 = (-b - sq) / (2 * a);
      return {
        results: [
          { label: { en: "Discriminant", ar: "المميّز" }, value: fmt(disc), status: disc === 0 ? "warning" : "good" },
          { label: { en: "Root x₁", ar: "الجذر x₁" }, value: fmt(x1), primary: true, status: "good" },
          ...(disc > 0 ? [{ label: { en: "Root x₂", ar: "الجذر x₂" }, value: fmt(x2), primary: true, status: "good" as const }] : []),
        ],
        formula: `x = (−b ± √(b² − 4ac)) / 2a`,
        steps: [
          { description: { en: `Discriminant = b² − 4ac = ${b}² − 4(${a})(${c}) = ${fmt(disc)}`, ar: `المميّز = b² − 4ac = ${b}² − 4(${a})(${c}) = ${fmt(disc)}` } },
          { description: { en: `√D = ${fmt(sq)}`, ar: `√D = ${fmt(sq)}` } },
          { description: { en: `x₁ = (−${b} + ${fmt(sq)}) / ${2 * a} = ${fmt(x1)}`, ar: `x₁ = (−${b} + ${fmt(sq)}) / ${2 * a} = ${fmt(x1)}` } },
          ...(disc > 0 ? [{ description: { en: `x₂ = (−${b} − ${fmt(sq)}) / ${2 * a} = ${fmt(x2)}`, ar: `x₂ = (−${b} − ${fmt(sq)}) / ${2 * a} = ${fmt(x2)}` } }] : []),
        ],
      };
    },
  },
];

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a || 1;
}

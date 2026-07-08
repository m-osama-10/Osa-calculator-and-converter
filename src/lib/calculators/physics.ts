// ============================================================================
// Physics Calculators
// ============================================================================

import type { Calculator } from "../types";
import { num, fmt, fmtSci } from "../calculator-utils";

export const physicsCalculators: Calculator[] = [
  // Velocity (v = d/t)
  {
    id: "velocity",
    category: "physics",
    names: { en: "Velocity (v = d/t)", ar: "السرعة (v = d/t)" },
    descriptions: { en: "Calculate velocity from distance and time.", ar: "احسب السرعة من المسافة والزمن." },
    keywords: ["velocity", "speed", "distance", "time", "سرعة", "مسافة"],
    icon: "Gauge",
    live: true,
    fields: [
      { key: "d", names: { en: "Distance", ar: "المسافة" }, type: "number", default: 100, unit: { en: "m", ar: "م" } },
      { key: "t", names: { en: "Time", ar: "الزمن" }, type: "number", default: 10, unit: { en: "s", ar: "ث" } },
    ],
    compute: (v) => {
      const d = num(v.d), t = num(v.t);
      if ([d, t].some(Number.isNaN)) return { results: [], error: { en: "Enter valid numbers", ar: "أدخل أرقامًا صالحة" } };
      if (t === 0) return { results: [], error: { en: "Time cannot be zero", ar: "الزمن لا يمكن أن يكون صفرًا" } };
      const vel = d / t;
      return {
        results: [{ label: { en: "Velocity", ar: "السرعة" }, value: fmt(vel, 6) + " m/s", primary: true }],
        formula: `v = d / t = ${d} / ${t} = ${fmt(vel, 6)} m/s`,
        steps: [
          { description: { en: `Distance = ${d} m`, ar: `المسافة = ${d} م` } },
          { description: { en: `Time = ${t} s`, ar: `الزمن = ${t} ث` } },
          { description: { en: `v = d ÷ t = ${fmt(vel, 6)} m/s`, ar: `v = d ÷ t = ${fmt(vel, 6)} م/ث` } },
        ],
      };
    },
  },

  // Acceleration (a = Δv / Δt)
  {
    id: "acceleration",
    category: "physics",
    names: { en: "Acceleration (a = Δv/Δt)", ar: "التسارع (a = Δv/Δt)" },
    descriptions: { en: "Calculate acceleration from change in velocity over time.", ar: "احسب التسارع من تغير السرعة خلال زمن." },
    keywords: ["acceleration", "velocity", "تسارع", "عجلة"],
    icon: "TrendingUp",
    live: true,
    fields: [
      { key: "v0", names: { en: "Initial velocity v₀", ar: "السرعة الابتدائية v₀" }, type: "number", default: 0, unit: { en: "m/s", ar: "م/ث" } },
      { key: "v1", names: { en: "Final velocity v", ar: "السرعة النهائية v" }, type: "number", default: 30, unit: { en: "m/s", ar: "م/ث" } },
      { key: "t", names: { en: "Time", ar: "الزمن" }, type: "number", default: 5, unit: { en: "s", ar: "ث" } },
    ],
    compute: (v) => {
      const v0 = num(v.v0), v1 = num(v.v1), t = num(v.t);
      if ([v0, v1, t].some(Number.isNaN)) return { results: [], error: { en: "Enter valid numbers", ar: "أدخل أرقامًا صالحة" } };
      if (t === 0) return { results: [], error: { en: "Time cannot be zero", ar: "الزمن لا يمكن أن يكون صفرًا" } };
      const a = (v1 - v0) / t;
      return {
        results: [{ label: { en: "Acceleration", ar: "التسارع" }, value: fmt(a, 6) + " m/s²", primary: true }],
        formula: `a = (v − v₀) / t = (${v1} − ${v0}) / ${t} = ${fmt(a, 6)} m/s²`,
      };
    },
  },

  // Force (F = ma)
  {
    id: "force",
    category: "physics",
    names: { en: "Force (F = ma)", ar: "القوة (F = ma)" },
    descriptions: { en: "Newton's second law: force = mass × acceleration.", ar: "قانون نيوتن الثاني: القوة = الكتلة × التسارع." },
    keywords: ["force", "newton", "f=ma", "قوة", "نيوتن"],
    icon: "ArrowUpFromLine",
    live: true,
    fields: [
      { key: "m", names: { en: "Mass", ar: "الكتلة" }, type: "number", default: 10, unit: { en: "kg", ar: "كجم" } },
      { key: "a", names: { en: "Acceleration", ar: "التسارع" }, type: "number", default: 9.81, unit: { en: "m/s²", ar: "م/ث²" } },
    ],
    compute: (v) => {
      const m = num(v.m), a = num(v.a);
      if ([m, a].some(Number.isNaN)) return { results: [], error: { en: "Enter valid numbers", ar: "أدخل أرقامًا صالحة" } };
      const F = m * a;
      return {
        results: [{ label: { en: "Force", ar: "القوة" }, value: fmt(F, 6) + " N", primary: true }],
        formula: `F = m × a = ${m} × ${a} = ${fmt(F, 6)} N`,
        steps: [
          { description: { en: `Mass = ${m} kg`, ar: `الكتلة = ${m} كجم` } },
          { description: { en: `Acceleration = ${a} m/s²`, ar: `التسارع = ${a} م/ث²` } },
          { description: { en: `F = m × a = ${fmt(F, 6)} N`, ar: `F = m × a = ${fmt(F, 6)} نيوتن` } },
        ],
      };
    },
  },

  // Kinetic Energy (KE = ½mv²)
  {
    id: "kinetic-energy",
    category: "physics",
    names: { en: "Kinetic Energy (KE = ½mv²)", ar: "الطاقة الحركية (KE = ½mv²)" },
    descriptions: { en: "Calculate kinetic energy from mass and velocity.", ar: "احسب الطاقة الحركية من الكتلة والسرعة." },
    keywords: ["kinetic", "energy", "ke", "طاقة حركية"],
    icon: "Zap",
    live: true,
    fields: [
      { key: "m", names: { en: "Mass", ar: "الكتلة" }, type: "number", default: 2, unit: { en: "kg", ar: "كجم" } },
      { key: "v", names: { en: "Velocity", ar: "السرعة" }, type: "number", default: 10, unit: { en: "m/s", ar: "م/ث" } },
    ],
    compute: (v) => {
      const m = num(v.m), vel = num(v.v);
      if ([m, vel].some(Number.isNaN)) return { results: [], error: { en: "Enter valid numbers", ar: "أدخل أرقامًا صالحة" } };
      const KE = 0.5 * m * vel * vel;
      return {
        results: [{ label: { en: "Kinetic energy", ar: "الطاقة الحركية" }, value: fmt(KE, 6) + " J", primary: true }],
        formula: `KE = ½mv² = ½ × ${m} × ${vel}² = ${fmt(KE, 6)} J`,
      };
    },
  },

  // Potential Energy (PE = mgh)
  {
    id: "potential-energy",
    category: "physics",
    names: { en: "Potential Energy (PE = mgh)", ar: "الطاقة الكامنة (PE = mgh)" },
    descriptions: { en: "Gravitational potential energy near Earth's surface.", ar: "الطاقة الكامنة الجاذبية قرب سطح الأرض." },
    keywords: ["potential", "energy", "pe", "mgh", "طاقة كامنة"],
    icon: "ArrowDownToLine",
    live: true,
    fields: [
      { key: "m", names: { en: "Mass", ar: "الكتلة" }, type: "number", default: 5, unit: { en: "kg", ar: "كجم" } },
      { key: "h", names: { en: "Height", ar: "الارتفاع" }, type: "number", default: 10, unit: { en: "m", ar: "م" } },
      { key: "g", names: { en: "Gravity g", ar: "الجاذبية g" }, type: "number", default: 9.81, unit: { en: "m/s²", ar: "م/ث²" } },
    ],
    compute: (v) => {
      const m = num(v.m), h = num(v.h), g = num(v.g);
      if ([m, h, g].some(Number.isNaN)) return { results: [], error: { en: "Enter valid numbers", ar: "أدخل أرقامًا صالحة" } };
      const PE = m * g * h;
      return {
        results: [{ label: { en: "Potential energy", ar: "الطاقة الكامنة" }, value: fmt(PE, 6) + " J", primary: true }],
        formula: `PE = mgh = ${m} × ${g} × ${h} = ${fmt(PE, 6)} J`,
      };
    },
  },

  // Momentum (p = mv)
  {
    id: "momentum",
    category: "physics",
    names: { en: "Momentum (p = mv)", ar: "الزخم (p = mv)" },
    descriptions: { en: "Linear momentum = mass × velocity.", ar: "الزخم الخطي = الكتلة × السرعة." },
    keywords: ["momentum", "p", "زخم"],
    icon: "MoveRight",
    live: true,
    fields: [
      { key: "m", names: { en: "Mass", ar: "الكتلة" }, type: "number", default: 10, unit: { en: "kg", ar: "كجم" } },
      { key: "v", names: { en: "Velocity", ar: "السرعة" }, type: "number", default: 5, unit: { en: "m/s", ar: "م/ث" } },
    ],
    compute: (v) => {
      const m = num(v.m), vel = num(v.v);
      if ([m, vel].some(Number.isNaN)) return { results: [], error: { en: "Enter valid numbers", ar: "أدخل أرقامًا صالحة" } };
      const p = m * vel;
      return {
        results: [{ label: { en: "Momentum", ar: "الزخم" }, value: fmt(p, 6) + " kg·m/s", primary: true }],
        formula: `p = mv = ${m} × ${vel} = ${fmt(p, 6)} kg·m/s`,
      };
    },
  },

  // Projectile Motion
  {
    id: "projectile",
    category: "physics",
    names: { en: "Projectile Motion", ar: "حركة المقذوفات" },
    descriptions: { en: "Range, max height and flight time of a projectile.", ar: "المدى، أقصى ارتفاع وزمن طيران المقذوف." },
    keywords: ["projectile", "trajectory", "range", "مقذوف", "مسار"],
    icon: "TrendingUp",
    live: true,
    fields: [
      { key: "v0", names: { en: "Initial velocity v₀", ar: "السرعة الابتدائية" }, type: "number", default: 20, unit: { en: "m/s", ar: "م/ث" } },
      { key: "angle", names: { en: "Launch angle", ar: "زاوية الإطلاق" }, type: "number", default: 45, unit: { en: "°", ar: "°" } },
      { key: "g", names: { en: "Gravity g", ar: "الجاذبية" }, type: "number", default: 9.81, unit: { en: "m/s²", ar: "م/ث²" } },
    ],
    compute: (v) => {
      const v0 = num(v.v0), angle = num(v.angle), g = num(v.g);
      if ([v0, angle, g].some(Number.isNaN) || g === 0) return { results: [], error: { en: "Invalid inputs", ar: "مدخلات غير صالحة" } };
      const rad = (angle * Math.PI) / 180;
      const range = (v0 * v0 * Math.sin(2 * rad)) / g;
      const maxHeight = (v0 * v0 * Math.sin(rad) ** 2) / (2 * g);
      const time = (2 * v0 * Math.sin(rad)) / g;
      return {
        results: [
          { label: { en: "Range", ar: "المدى" }, value: fmt(range, 4) + " m", primary: true },
          { label: { en: "Max height", ar: "أقصى ارتفاع" }, value: fmt(maxHeight, 4) + " m" },
          { label: { en: "Time of flight", ar: "زمن الطيران" }, value: fmt(time, 4) + " s" },
        ],
        formula: `R = v₀²sin(2θ)/g,  H = v₀²sin²(θ)/(2g),  T = 2v₀sin(θ)/g`,
        steps: [
          { description: { en: `sin(2 × ${angle}°) = ${fmt(Math.sin(2 * rad), 4)}`, ar: `sin(2 × ${angle}°) = ${fmt(Math.sin(2 * rad), 4)}` } },
          { description: { en: `R = ${v0}² × ${fmt(Math.sin(2 * rad), 4)} / ${g} = ${fmt(range, 4)}`, ar: `المدى = ${fmt(range, 4)} م` } },
          { description: { en: `H = ${fmt(maxHeight, 4)} m, T = ${fmt(time, 4)} s`, ar: `أقصى ارتفاع = ${fmt(maxHeight, 4)} م، الزمن = ${fmt(time, 4)} ث` } },
        ],
      };
    },
  },

  // Newton's Law of Gravitation (F = G m₁m₂/r²)
  {
    id: "gravitation",
    category: "physics",
    names: { en: "Gravitational Force", ar: "قوة الجاذبية" },
    descriptions: { en: "Newton's law: F = G·m₁·m₂/r².", ar: "قانون نيوتن: F = G·m₁·m₂/r²." },
    keywords: ["gravity", "newton", "gravitation", "جاذبية", "نيوتن"],
    icon: "Globe",
    live: true,
    fields: [
      { key: "m1", names: { en: "Mass m₁", ar: "الكتلة m₁" }, type: "number", default: 5.972e24, unit: { en: "kg", ar: "كجم" } },
      { key: "m2", names: { en: "Mass m₂", ar: "الكتلة m₂" }, type: "number", default: 7.348e22, unit: { en: "kg", ar: "كجم" } },
      { key: "r", names: { en: "Distance r", ar: "المسافة r" }, type: "number", default: 3.844e8, unit: { en: "m", ar: "م" } },
    ],
    compute: (v) => {
      const G = 6.6743e-11;
      const m1 = num(v.m1), m2 = num(v.m2), r = num(v.r);
      if ([m1, m2, r].some(Number.isNaN) || r === 0) return { results: [], error: { en: "Invalid inputs", ar: "مدخلات غير صالحة" } };
      const F = (G * m1 * m2) / (r * r);
      return {
        results: [{ label: { en: "Gravitational force", ar: "قوة الجاذبية" }, value: fmtSci(F, 6) + " N", primary: true }],
        formula: `F = G·m₁·m₂/r² = ${G} × ${fmtSci(m1, 4)} × ${fmtSci(m2, 4)} / (${fmtSci(r, 4)})² = ${fmtSci(F, 6)} N`,
        steps: [
          { description: { en: `G = 6.6743 × 10⁻¹¹ N·m²/kg²`, ar: `G = 6.6743 × 10⁻¹¹` } },
          { description: { en: `F = ${fmtSci(F, 6)} N`, ar: `F = ${fmtSci(F, 6)} نيوتن` } },
        ],
      };
    },
  },

  // Ohm's Law (V = IR)
  {
    id: "ohms-law",
    category: "physics",
    names: { en: "Ohm's Law (V = IR)", ar: "قانون أوم (V = IR)" },
    descriptions: { en: "Solve V = IR for any of V, I, R.", ar: "حل V = IR لأي من V، I، R." },
    keywords: ["ohm", "voltage", "current", "resistance", "أوم", "جهد"],
    icon: "Zap",
    live: true,
    fields: [
      {
        key: "solve",
        names: { en: "Solve for", ar: "حل من أجل" },
        type: "select",
        default: "v",
        options: [
          { value: "v", label: { en: "Voltage (V)", ar: "الجهد (V)" } },
          { value: "i", label: { en: "Current (I)", ar: "التيار (I)" } },
          { value: "r", label: { en: "Resistance (R)", ar: "المقاومة (R)" } },
        ],
      },
      { key: "v", names: { en: "Voltage V", ar: "الجهد V" }, type: "number", default: 12, unit: { en: "V", ar: "فولت" } },
      { key: "i", names: { en: "Current I", ar: "التيار I" }, type: "number", default: 2, unit: { en: "A", ar: "أمبير" } },
      { key: "r", names: { en: "Resistance R", ar: "المقاومة R" }, type: "number", default: 6, unit: { en: "Ω", ar: "أوم" } },
    ],
    compute: (v) => {
      const solve = String(v.solve);
      const V = num(v.v), I = num(v.i), R = num(v.r);
      let result = 0, label = "", unit = "";
      if (solve === "v") { result = I * R; label = "V"; unit = " V"; }
      else if (solve === "i") { if (R === 0) return { results: [], error: { en: "R ≠ 0", ar: "R ≠ 0" } }; result = V / R; label = "I"; unit = " A"; }
      else { if (I === 0) return { results: [], error: { en: "I ≠ 0", ar: "I ≠ 0" } }; result = V / I; label = "R"; unit = " Ω"; }
      return {
        results: [{ label: { en: label, ar: label }, value: fmt(result, 6) + unit, primary: true }],
        formula: `V = IR  →  ${label} = ${fmt(result, 6)}${unit}`,
        steps: [{ description: { en: `Solve ${label} = ${fmt(result, 6)}${unit}`, ar: `الحل ${label} = ${fmt(result, 6)}${unit}` } }],
      };
    },
  },

  // Electrical Power (P = VI)
  {
    id: "electrical-power",
    category: "physics",
    names: { en: "Electrical Power (P = VI)", ar: "القدرة الكهربائية (P = VI)" },
    descriptions: { en: "Calculate power from voltage and current.", ar: "احسب القدرة من الجهد والتيار." },
    keywords: ["power", "electrical", "watt", "قدرة", "كهرباء"],
    icon: "Zap",
    live: true,
    fields: [
      { key: "v", names: { en: "Voltage V", ar: "الجهد V" }, type: "number", default: 230, unit: { en: "V", ar: "فولت" } },
      { key: "i", names: { en: "Current I", ar: "التيار I" }, type: "number", default: 5, unit: { en: "A", ar: "أمبير" } },
    ],
    compute: (v) => {
      const V = num(v.v), I = num(v.i);
      if ([V, I].some(Number.isNaN)) return { results: [], error: { en: "Enter valid numbers", ar: "أدخل أرقامًا صالحة" } };
      const P = V * I;
      return {
        results: [{ label: { en: "Power", ar: "القدرة" }, value: fmt(P, 6) + " W", primary: true }],
        formula: `P = V × I = ${V} × ${I} = ${fmt(P, 6)} W`,
      };
    },
  },

  // Work (W = F·d·cos θ)
  {
    id: "work",
    category: "physics",
    names: { en: "Work (W = Fd cos θ)", ar: "الشغل (W = Fd cos θ)" },
    descriptions: { en: "Calculate work done by a force over a distance.", ar: "احسب الشغل المبذول بقوة خلال مسافة." },
    keywords: ["work", "force", "energy", "شغل", "طاقة"],
    icon: "Hammer",
    live: true,
    fields: [
      { key: "f", names: { en: "Force F", ar: "القوة F" }, type: "number", default: 50, unit: { en: "N", ar: "نيوتن" } },
      { key: "d", names: { en: "Distance d", ar: "المسافة d" }, type: "number", default: 10, unit: { en: "m", ar: "م" } },
      { key: "angle", names: { en: "Angle θ", ar: "الزاوية θ" }, type: "number", default: 0, unit: { en: "°", ar: "°" } },
    ],
    compute: (v) => {
      const F = num(v.f), d = num(v.d), angle = num(v.angle);
      if ([F, d, angle].some(Number.isNaN)) return { results: [], error: { en: "Enter valid numbers", ar: "أدخل أرقامًا صالحة" } };
      const W = F * d * Math.cos((angle * Math.PI) / 180);
      return {
        results: [{ label: { en: "Work", ar: "الشغل" }, value: fmt(W, 6) + " J", primary: true }],
        formula: `W = F·d·cos(θ) = ${F} × ${d} × cos(${angle}°) = ${fmt(W, 6)} J`,
      };
    },
  },

  // Density (ρ = m/V)
  {
    id: "density",
    category: "physics",
    names: { en: "Density (ρ = m/V)", ar: "الكثافة (ρ = m/V)" },
    descriptions: { en: "Calculate density from mass and volume.", ar: "احسب الكثافة من الكتلة والحجم." },
    keywords: ["density", "mass", "volume", "كثافة"],
    icon: "Layers",
    live: true,
    fields: [
      { key: "m", names: { en: "Mass", ar: "الكتلة" }, type: "number", default: 1000, unit: { en: "kg", ar: "كجم" } },
      { key: "V", names: { en: "Volume", ar: "الحجم" }, type: "number", default: 1, unit: { en: "m³", ar: "م³" } },
    ],
    compute: (v) => {
      const m = num(v.m), V = num(v.V);
      if ([m, V].some(Number.isNaN)) return { results: [], error: { en: "Enter valid numbers", ar: "أدخل أرقامًا صالحة" } };
      if (V === 0) return { results: [], error: { en: "Volume cannot be zero", ar: "الحجم لا يمكن أن يكون صفرًا" } };
      const rho = m / V;
      return {
        results: [{ label: { en: "Density", ar: "الكثافة" }, value: fmt(rho, 6) + " kg/m³", primary: true }],
        formula: `ρ = m / V = ${m} / ${V} = ${fmt(rho, 6)} kg/m³`,
      };
    },
  },

  // Wave speed (v = fλ)
  {
    id: "wave-speed",
    category: "physics",
    names: { en: "Wave Speed (v = fλ)", ar: "سرعة الموجة (v = fλ)" },
    descriptions: { en: "Calculate wave speed from frequency and wavelength.", ar: "احسب سرعة الموجة من التردد وطول الموجة." },
    keywords: ["wave", "frequency", "wavelength", "موجة", "تردد"],
    icon: "Waves",
    live: true,
    fields: [
      { key: "f", names: { en: "Frequency f", ar: "التردد f" }, type: "number", default: 440, unit: { en: "Hz", ar: "هرتز" } },
      { key: "lambda", names: { en: "Wavelength λ", ar: "طول الموجة λ" }, type: "number", default: 0.78, unit: { en: "m", ar: "م" } },
    ],
    compute: (v) => {
      const f = num(v.f), lambda = num(v.lambda);
      if ([f, lambda].some(Number.isNaN)) return { results: [], error: { en: "Enter valid numbers", ar: "أدخل أرقامًا صالحة" } };
      const w = f * lambda;
      return {
        results: [{ label: { en: "Wave speed", ar: "سرعة الموجة" }, value: fmt(w, 6) + " m/s", primary: true }],
        formula: `v = f × λ = ${f} × ${lambda} = ${fmt(w, 6)} m/s`,
      };
    },
  },
];

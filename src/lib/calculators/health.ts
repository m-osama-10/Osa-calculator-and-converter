// ============================================================================
// Health & Fitness Calculators
// ============================================================================

import type { Calculator } from "../types";
import { num, fmt } from "../calculator-utils";

export const healthCalculators: Calculator[] = [
  // BMI
  {
    id: "bmi",
    category: "health",
    names: { en: "BMI Calculator", ar: "حاسبة مؤشر كتلة الجسم" },
    descriptions: { en: "Body Mass Index from weight and height, with category.", ar: "مؤشر كتلة الجسم من الوزن والطول مع التصنيف." },
    keywords: ["bmi", "body mass index", "weight", "مؤشر كتلة", "وزن"],
    icon: "HeartPulse",
    live: true,
    fields: [
      {
        key: "unit",
        names: { en: "Units", ar: "الوحدات" },
        type: "select",
        default: "metric",
        options: [
          { value: "metric", label: { en: "Metric (kg, cm)", ar: "متري (كجم، سم)" } },
          { value: "imperial", label: { en: "Imperial (lb, in)", ar: "إمبراطوري (رطل، بوصة)" } },
        ],
      },
      { key: "weight", names: { en: "Weight", ar: "الوزن" }, type: "number", default: 70, unit: { en: "kg / lb", ar: "كجم / رطل" } },
      { key: "height", names: { en: "Height", ar: "الطول" }, type: "number", default: 175, unit: { en: "cm / in", ar: "سم / بوصة" } },
    ],
    compute: (v) => {
      let w = num(v.weight), h = num(v.height);
      if ([w, h].some(Number.isNaN) || w <= 0 || h <= 0) return { results: [], error: { en: "Enter positive values", ar: "أدخل قيمًا موجبة" } };
      let bmi: number;
      if (String(v.unit) === "metric") {
        bmi = w / Math.pow(h / 100, 2);
      } else {
        bmi = (703 * w) / Math.pow(h, 2);
      }
      let cat = "Normal", catAr = "طبيعي", status: "good" | "warning" | "bad" = "good";
      if (bmi < 18.5) { cat = "Underweight"; catAr = "نحافة"; status = "warning"; }
      else if (bmi < 25) { cat = "Normal"; catAr = "طبيعي"; status = "good"; }
      else if (bmi < 30) { cat = "Overweight"; catAr = "زيادة"; status = "warning"; }
      else { cat = "Obese"; catAr = "سمنة"; status = "bad"; }
      return {
        results: [
          { label: { en: "BMI", ar: "المؤشر" }, value: fmt(bmi, 2) + " kg/m²", primary: true, status },
          { label: { en: "Category", ar: "التصنيف" }, value: `${cat} / ${catAr}` },
        ],
        formula: `BMI = weight (kg) / height² (m²) = ${w} / ${(h / 100).toFixed(2)}² = ${fmt(bmi, 2)}`,
        steps: [
          { description: { en: `Weight = ${w} ${String(v.unit) === "metric" ? "kg" : "lb"}`, ar: `الوزن = ${w}` } },
          { description: { en: `Height = ${h} ${String(v.unit) === "metric" ? "cm" : "in"}`, ar: `الطول = ${h}` } },
          { description: { en: `BMI = ${fmt(bmi, 2)} → ${cat}`, ar: `المؤشر = ${fmt(bmi, 2)} → ${catAr}` } },
        ],
        chart: {
          type: "gauge",
          title: { en: "BMI Scale", ar: "مقياس المؤشر" },
          data: [
            { label: "Underweight", value: 18.5, color: "#3b82f6" },
            { label: "Normal", value: 25, color: "#22c55e" },
            { label: "Overweight", value: 30, color: "#f59e0b" },
            { label: "Obese", value: 40, color: "#ef4444" },
          ],
        },
      };
    },
  },

  // BMR
  {
    id: "bmr",
    category: "health",
    names: { en: "BMR Calculator", ar: "حاسبة معدل الأيض الأساسي" },
    descriptions: { en: "Basal Metabolic Rate using Mifflin–St Jeor equation.", ar: "معدل الأيض الأساسي باستخدام معادلة ميفلين-سانت جيور." },
    keywords: ["bmr", "metabolism", "calories", "أيض", "سعرات"],
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
      { key: "age", names: { en: "Age", ar: "العمر" }, type: "number", default: 30, unit: { en: "years", ar: "سنة" } },
    ],
    compute: (v) => {
      const w = num(v.weight), h = num(v.height), age = num(v.age);
      if ([w, h, age].some((x) => Number.isNaN(x) || x <= 0)) return { results: [], error: { en: "Enter positive values", ar: "أدخل قيمًا موجبة" } };
      const s = String(v.sex) === "male" ? 5 : -161;
      const bmr = 10 * w + 6.25 * h - 5 * age + s;
      return {
        results: [
          { label: { en: "BMR", ar: "معدل الأيض" }, value: fmt(bmr, 0) + " kcal/day", primary: true },
          { label: { en: "Sedentary", ar: "خامل" }, value: fmt(bmr * 1.2, 0) + " kcal" },
          { label: { en: "Lightly active", ar: "نشاط خفيف" }, value: fmt(bmr * 1.375, 0) + " kcal" },
          { label: { en: "Moderately active", ar: "نشاط متوسط" }, value: fmt(bmr * 1.55, 0) + " kcal" },
          { label: { en: "Very active", ar: "نشاط عالٍ" }, value: fmt(bmr * 1.725, 0) + " kcal" },
        ],
        formula: `BMR = 10×weight + 6.25×height − 5×age + s`,
        steps: [
          { description: { en: `10×${w} + 6.25×${h} − 5×${age} + ${s}`, ar: `الحساب` } },
          { description: { en: `BMR = ${fmt(bmr, 0)} kcal/day`, ar: `النتيجة = ${fmt(bmr, 0)} سعر/يوم` } },
        ],
      };
    },
  },

  // Body Fat %
  {
    id: "body-fat",
    category: "health",
    names: { en: "Body Fat %", ar: "نسبة الدهون" },
    descriptions: { en: "US Navy method body fat percentage.", ar: "نسبة دهون الجسم بطريقة البحرية الأمريكية." },
    keywords: ["body fat", "fat percentage", "navy", "دهون"],
    icon: "HeartPulse",
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
      { key: "height", names: { en: "Height", ar: "الطول" }, type: "number", default: 175, unit: { en: "cm", ar: "سم" } },
      { key: "neck", names: { en: "Neck circumference", ar: "محيط الرقبة" }, type: "number", default: 38, unit: { en: "cm", ar: "سم" } },
      { key: "waist", names: { en: "Waist circumference", ar: "محيط الخصر" }, type: "number", default: 85, unit: { en: "cm", ar: "سم" } },
      { key: "hip", names: { en: "Hip (females only)", ar: "الورك (للإناث)" }, type: "number", default: 0, unit: { en: "cm", ar: "سم" } },
    ],
    compute: (v) => {
      const h = num(v.height), n = num(v.neck), w = num(v.waist), hip = num(v.hip);
      if ([h, n, w].some((x) => Number.isNaN(x) || x <= 0)) return { results: [], error: { en: "Enter positive values", ar: "أدخل قيمًا موجبة" } };
      let bf: number;
      if (String(v.sex) === "male") {
        bf = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
      } else {
        if (hip <= 0) return { results: [], error: { en: "Enter hip circumference", ar: "أدخل محيط الورك" } };
        bf = 495 / (1.29579 - 0.35004 * Math.log10(w + hip - n) + 0.22100 * Math.log10(h)) - 450;
      }
      let cat = "Normal", status: "good" | "warning" | "bad" = "good";
      const isMale = String(v.sex) === "male";
      if (isMale) {
        if (bf < 6) { cat = "Essential"; status = "warning"; }
        else if (bf < 14) { cat = "Athlete"; status = "good"; }
        else if (bf < 18) { cat = "Fitness"; status = "good"; }
        else if (bf < 25) { cat = "Average"; status = "good"; }
        else { cat = "Obese"; status = "bad"; }
      } else {
        if (bf < 14) { cat = "Essential"; status = "warning"; }
        else if (bf < 21) { cat = "Athlete"; status = "good"; }
        else if (bf < 25) { cat = "Fitness"; status = "good"; }
        else if (bf < 32) { cat = "Average"; status = "good"; }
        else { cat = "Obese"; status = "bad"; }
      }
      return {
        results: [
          { label: { en: "Body fat %", ar: "نسبة الدهون" }, value: fmt(bf, 2) + "%", primary: true, status },
          { label: { en: "Category", ar: "التصنيف" }, value: cat },
        ],
        formula: isMale
          ? `BF% = 495/(1.0324 − 0.19077·log(waist−neck) + 0.15456·log(height)) − 450`
          : `BF% = 495/(1.29579 − 0.35004·log(waist+hip−neck) + 0.22100·log(height)) − 450`,
      };
    },
  },

  // Water Intake
  {
    id: "water-intake",
    category: "health",
    names: { en: "Water Intake", ar: "مقدار الماء" },
    descriptions: { en: "Daily water requirement based on weight and activity.", ar: "متطلبات الماء اليومية حسب الوزن والنشاط." },
    keywords: ["water", "hydration", "ماء", "ترطيب"],
    icon: "Droplets",
    live: true,
    fields: [
      { key: "weight", names: { en: "Weight", ar: "الوزن" }, type: "number", default: 70, unit: { en: "kg", ar: "كجم" } },
      {
        key: "activity",
        names: { en: "Activity", ar: "النشاط" },
        type: "select",
        default: "moderate",
        options: [
          { value: "low", label: { en: "Low (30 min/day)", ar: "منخفض" } },
          { value: "moderate", label: { en: "Moderate (60 min)", ar: "متوسط" } },
          { value: "high", label: { en: "High (90+ min)", ar: "عالٍ" } },
        ],
      },
    ],
    compute: (v) => {
      const w = num(v.weight);
      if (Number.isNaN(w) || w <= 0) return { results: [], error: { en: "Enter weight", ar: "أدخل الوزن" } };
      const factor = String(v.activity) === "low" ? 30 : String(v.activity) === "moderate" ? 35 : 40;
      const ml = w * factor;
      return {
        results: [
          { label: { en: "Daily intake", ar: "الكمية اليومية" }, value: fmt(ml, 0) + " ml", primary: true },
          { label: { en: "In liters", ar: "باللتر" }, value: fmt(ml / 1000, 2) + " L" },
          { label: { en: "Glasses (250ml)", ar: "أكواب" }, value: fmt(ml / 250, 1) },
        ],
        formula: `Water (ml) = weight × factor (${factor})`,
      };
    },
  },

  // Ideal Weight
  {
    id: "ideal-weight",
    category: "health",
    names: { en: "Ideal Weight", ar: "الوزن المثالي" },
    descriptions: { en: "Ideal body weight using Devine formula.", ar: "الوزن المثالي للجسم باستخدام معادلة ديفاين." },
    keywords: ["ideal weight", "devine", "وزن مثالي"],
    icon: "Scale",
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
      { key: "height", names: { en: "Height", ar: "الطول" }, type: "number", default: 175, unit: { en: "cm", ar: "سم" } },
    ],
    compute: (v) => {
      const h = num(v.height);
      if (Number.isNaN(h) || h <= 0) return { results: [], error: { en: "Enter height", ar: "أدخل الطول" } };
      const inchesOver5ft = Math.max(0, h / 2.54 - 60);
      const base = String(v.sex) === "male" ? 50 : 45.5;
      const w = base + 2.3 * inchesOver5ft;
      return {
        results: [{ label: { en: "Ideal weight", ar: "الوزن المثالي" }, value: fmt(w, 1) + " kg", primary: true }],
        formula: `Devine: ${base} + 2.3 × (height_in − 60) = ${fmt(w, 1)} kg`,
      };
    },
  },

  // Calories Burned (MET)
  {
    id: "calories-burned",
    category: "health",
    names: { en: "Calories Burned", ar: "السعرات المحروقة" },
    descriptions: { en: "Calories burned using MET × weight × time.", ar: "السعرات المحروقة باستخدام MET × الوزن × الوقت." },
    keywords: ["calories", "burned", "exercise", "met", "سعرات", "حرق"],
    icon: "Flame",
    live: true,
    fields: [
      { key: "weight", names: { en: "Weight", ar: "الوزن" }, type: "number", default: 70, unit: { en: "kg", ar: "كجم" } },
      {
        key: "activity",
        names: { en: "Activity", ar: "النشاط" },
        type: "select",
        default: "8",
        options: [
          { value: "3", label: { en: "Walking (3 MET)", ar: "مشي" } },
          { value: "5", label: { en: "Light cycling (5 MET)", ar: "دراجة خفيفة" } },
          { value: "8", label: { en: "Jogging (8 MET)", ar: "هرولة" } },
          { value: "10", label: { en: "Running (10 MET)", ar: "جري" } },
          { value: "12", label: { en: "Swimming fast (12 MET)", ar: "سباحة سريعة" } },
          { value: "6", label: { en: "Weight training (6 MET)", ar: "حديد" } },
        ],
      },
      { key: "time", names: { en: "Duration", ar: "المدة" }, type: "number", default: 30, unit: { en: "min", ar: "دقيقة" } },
    ],
    compute: (v) => {
      const w = num(v.weight), met = num(v.activity), t = num(v.time);
      if ([w, met, t].some((x) => Number.isNaN(x) || x <= 0)) return { results: [], error: { en: "Enter positive values", ar: "أدخل قيمًا موجبة" } };
      const kcal = (met * w * t) / 60;
      return {
        results: [{ label: { en: "Calories burned", ar: "السعرات المحروقة" }, value: fmt(kcal, 0) + " kcal", primary: true }],
        formula: `kcal = MET × weight × time(min) / 60 = ${met} × ${w} × ${t} / 60 = ${fmt(kcal, 0)}`,
      };
    },
  },

  // Macro Calculator
  {
    id: "macro",
    category: "health",
    names: { en: "Macro Calculator", ar: "حاسبة العناصر الغذائية" },
    descriptions: { en: "Protein, carbs, fat split from daily calories.", ar: "تقسيم البروتين، الكربوهيدرات، الدهون من السعرات اليومية." },
    keywords: ["macro", "protein", "carbs", "fat", "عناصر", "بروتين"],
    icon: "Apple",
    live: true,
    fields: [
      { key: "calories", names: { en: "Daily calories", ar: "السعرات اليومية" }, type: "number", default: 2000, unit: { en: "kcal", ar: "سعر" } },
      {
        key: "split",
        names: { en: "Diet split", ar: "نوع الحمية" },
        type: "select",
        default: "balanced",
        options: [
          { value: "balanced", label: { en: "Balanced (30/40/30)", ar: "متوازن" } },
          { value: "lowcarb", label: { en: "Low-carb (35/20/45)", ar: "قليل الكربوهيدرات" } },
          { value: "keto", label: { en: "Keto (25/5/70)", ar: "كيتو" } },
          { value: "highprotein", label: { en: "High protein (40/40/20)", ar: "عالي البروتين" } },
        ],
      },
    ],
    compute: (v) => {
      const c = num(v.calories);
      if (Number.isNaN(c) || c <= 0) return { results: [], error: { en: "Enter positive calories", ar: "أدخل سعرات موجبة" } };
      const splits: Record<string, [number, number, number]> = {
        balanced: [0.3, 0.4, 0.3],
        lowcarb: [0.35, 0.2, 0.45],
        keto: [0.25, 0.05, 0.7],
        highprotein: [0.4, 0.4, 0.2],
      };
      const [pP, pC, pF] = splits[String(v.split)] ?? splits.balanced;
      const pGrams = (c * pP) / 4;
      const cGrams = (c * pC) / 4;
      const fGrams = (c * pF) / 9;
      return {
        results: [
          { label: { en: "Protein", ar: "البروتين" }, value: fmt(pGrams, 0) + " g (" + Math.round(pP * 100) + "%)", primary: true },
          { label: { en: "Carbs", ar: "الكربوهيدرات" }, value: fmt(cGrams, 0) + " g (" + Math.round(pC * 100) + "%)", primary: true },
          { label: { en: "Fat", ar: "الدهون" }, value: fmt(fGrams, 0) + " g (" + Math.round(pF * 100) + "%)", primary: true },
        ],
        formula: `Protein: ${Math.round(pP * 100)}% × ${c} / 4 kcal/g; Carbs: ${Math.round(pC * 100)}% × ${c} / 4; Fat: ${Math.round(pF * 100)}% × ${c} / 9`,
        chart: {
          type: "donut",
          title: { en: "Calorie Distribution", ar: "توزيع السعرات" },
          data: [
            { label: "Protein", value: Math.round(c * pP), color: "#22c55e" },
            { label: "Carbs", value: Math.round(c * pC), color: "#f59e0b" },
            { label: "Fat", value: Math.round(c * pF), color: "#ef4444" },
          ],
        },
      };
    },
  },

  // Heart Rate Zones
  {
    id: "heart-rate-zones",
    category: "health",
    names: { en: "Heart Rate Zones", ar: "مناطق معدل ضربات القلب" },
    descriptions: { en: "Calculate training zones from age and resting HR.", ar: "احسب مناطق التدريب من العمر ومعدل الضربات أثناء الراحة." },
    keywords: ["heart rate", "zones", "training", "معدل ضربات", "تدريب"],
    icon: "HeartPulse",
    live: true,
    fields: [
      { key: "age", names: { en: "Age", ar: "العمر" }, type: "number", default: 30 },
      { key: "resting", names: { en: "Resting HR", ar: "معدل الراحة" }, type: "number", default: 65, unit: { en: "bpm", ar: "نبضة/دقيقة" } },
    ],
    compute: (v) => {
      const age = num(v.age), r = num(v.resting);
      if ([age, r].some((x) => Number.isNaN(x) || x <= 0)) return { results: [], error: { en: "Enter positive values", ar: "أدخل قيمًا موجبة" } };
      const max = 220 - age;
      const reserve = max - r;
      const zone = (lo: number, hi: number) => `${fmt(r + reserve * lo)} – ${fmt(r + reserve * hi)} bpm`;
      return {
        results: [
          { label: { en: "Max HR", ar: "أقصى معدل" }, value: fmt(max) + " bpm", primary: true },
          { label: { en: "Zone 1 (50-60%) Very light", ar: "منطقة 1 (خفيف جدًا)" }, value: zone(0.5, 0.6) },
          { label: { en: "Zone 2 (60-70%) Light", ar: "منطقة 2 (خفيف)" }, value: zone(0.6, 0.7) },
          { label: { en: "Zone 3 (70-80%) Moderate", ar: "منطقة 3 (متوسط)" }, value: zone(0.7, 0.8) },
          { label: { en: "Zone 4 (80-90%) Hard", ar: "منطقة 4 (صعب)" }, value: zone(0.8, 0.9) },
          { label: { en: "Zone 5 (90-100%) Max", ar: "منطقة 5 (أقصى)" }, value: zone(0.9, 1.0) },
        ],
        formula: `Max HR = 220 − age;  HR_reserve = Max − Resting;  Zone = Resting + reserve × %`,
      };
    },
  },

  // Pregnancy due date
  {
    id: "pregnancy",
    category: "health",
    names: { en: "Pregnancy Due Date", ar: "تاريخ الولادة المتوقع" },
    descriptions: { en: "Estimate due date from last menstrual period (LMP) using Naegele's rule.", ar: "تقدير موعد الولادة من آخر دورة شهرية (LMP) باستخدام قاعدة نيغيلي." },
    keywords: ["pregnancy", "due date", "lmp", "حمل", "ولادة"],
    icon: "Baby",
    live: true,
    fields: [
      { key: "lmp", names: { en: "Last menstrual period (LMP)", ar: "آخر دورة شهرية" }, type: "date", default: "2026-01-01" },
    ],
    compute: (v) => {
      const lmpStr = String(v.lmp);
      const lmp = new Date(lmpStr);
      if (isNaN(lmp.getTime())) return { results: [], error: { en: "Enter valid date", ar: "أدخل تاريخًا صالحًا" } };
      const due = new Date(lmp);
      due.setDate(due.getDate() + 280);
      const today = new Date();
      const daysPregnant = Math.floor((today.getTime() - lmp.getTime()) / 86400000);
      const weeksPregnant = Math.floor(daysPregnant / 7);
      return {
        results: [
          { label: { en: "Estimated due date", ar: "تاريخ الولادة المتوقع" }, value: due.toISOString().slice(0, 10), primary: true },
          { label: { en: "Days pregnant", ar: "أيام الحمل" }, value: String(Math.max(0, daysPregnant)) },
          { label: { en: "Weeks pregnant", ar: "أسابيع الحمل" }, value: String(Math.max(0, weeksPregnant)) },
        ],
        formula: `Due date = LMP + 280 days (Naegele's rule)`,
      };
    },
  },
];

// ============================================================================
// Finance Calculators
// ============================================================================

import type { Calculator } from "../types";
import { num, fmt } from "../calculator-utils";

export const financeCalculators: Calculator[] = [
  // Loan / EMI
  {
    id: "loan-emi",
    category: "finance",
    names: { en: "Loan / EMI Calculator", ar: "حاسبة القرض / القسط" },
    descriptions: { en: "Monthly installment (EMI) for a loan with fixed interest.", ar: "القسط الشهري لقرض بفائدة ثابتة." },
    keywords: ["loan", "emi", "installment", "mortgage", "قرض", "قسط", "رهن"],
    icon: "Landmark",
    live: true,
    fields: [
      { key: "principal", names: { en: "Principal (loan amount)", ar: "المبلغ الأساسي" }, type: "number", default: 100000, unit: { en: "$", ar: "$" } },
      { key: "rate", names: { en: "Annual interest rate", ar: "معدل الفائدة السنوي" }, type: "number", default: 5, unit: { en: "%", ar: "%" } },
      { key: "years", names: { en: "Loan term", ar: "مدة القرض" }, type: "number", default: 10, unit: { en: "years", ar: "سنة" } },
    ],
    compute: (v) => {
      const P = num(v.principal), rAnnual = num(v.rate), n = num(v.years);
      if ([P, rAnnual, n].some((x) => Number.isNaN(x) || x <= 0)) return { results: [], error: { en: "Enter positive values", ar: "أدخل قيمًا موجبة" } };
      const r = rAnnual / 100 / 12;
      const months = n * 12;
      const emi = r === 0 ? P / months : (P * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
      const total = emi * months;
      const interest = total - P;
      return {
        results: [
          { label: { en: "Monthly EMI", ar: "القسط الشهري" }, value: "$" + fmt(emi, 2), primary: true },
          { label: { en: "Total payment", ar: "إجمالي السداد" }, value: "$" + fmt(total, 2) },
          { label: { en: "Total interest", ar: "إجمالي الفائدة" }, value: "$" + fmt(interest, 2), status: "warning" },
          { label: { en: "Number of payments", ar: "عدد الدفعات" }, value: String(months) },
        ],
        formula: `EMI = P·r·(1+r)ⁿ / ((1+r)ⁿ − 1)`,
        steps: [
          { description: { en: `P = ${P}, r = ${rAnnual}% / 12 = ${fmt(r, 6)}, n = ${months}`, ar: `المعطيات` } },
          { description: { en: `EMI = ${fmt(emi, 2)}`, ar: `القسط = ${fmt(emi, 2)}` } },
          { description: { en: `Total = EMI × n = ${fmt(total, 2)}`, ar: `الإجمالي = ${fmt(total, 2)}` } },
        ],
        chart: {
          type: "pie",
          title: { en: "Principal vs Interest", ar: "الأصل مقابل الفائدة" },
          data: [
            { label: "Principal", value: Math.round(P), color: "#22c55e" },
            { label: "Interest", value: Math.round(interest), color: "#ef4444" },
          ],
        },
      };
    },
  },

  // Compound Interest
  {
    id: "compound-interest",
    category: "finance",
    names: { en: "Compound Interest", ar: "الفائدة المركبة" },
    descriptions: { en: "A = P(1 + r/n)^(nt) — compound interest.", ar: "الفائدة المركبة: A = P(1 + r/n)^(nt)." },
    keywords: ["compound", "interest", "investment", "فائدة مركبة", "استثمار"],
    icon: "TrendingUp",
    live: true,
    fields: [
      { key: "principal", names: { en: "Principal P", ar: "المبلغ P" }, type: "number", default: 10000, unit: { en: "$", ar: "$" } },
      { key: "rate", names: { en: "Annual rate r", ar: "المعدل السنوي r" }, type: "number", default: 7, unit: { en: "%", ar: "%" } },
      { key: "years", names: { en: "Years t", ar: "السنين t" }, type: "number", default: 10 },
      {
        key: "n",
        names: { en: "Compounds per year n", ar: "مرات التركيب سنويًا" },
        type: "select",
        default: "12",
        options: [
          { value: "1", label: { en: "Annually", ar: "سنويًا" } },
          { value: "2", label: { en: "Semi-annually", ar: "نصف سنوي" } },
          { value: "4", label: { en: "Quarterly", ar: "ربع سنوي" } },
          { value: "12", label: { en: "Monthly", ar: "شهري" } },
          { value: "365", label: { en: "Daily", ar: "يومي" } },
        ],
      },
    ],
    compute: (v) => {
      const P = num(v.principal), r = num(v.rate) / 100, t = num(v.years), n = num(v.n);
      if ([P, r, t, n].some((x) => Number.isNaN(x) || x <= 0)) return { results: [], error: { en: "Enter positive values", ar: "أدخل قيمًا موجبة" } };
      const A = P * Math.pow(1 + r / n, n * t);
      const interest = A - P;
      return {
        results: [
          { label: { en: "Final amount A", ar: "المبلغ النهائي A" }, value: "$" + fmt(A, 2), primary: true, status: "good" },
          { label: { en: "Interest earned", ar: "الفائدة المكتسبة" }, value: "$" + fmt(interest, 2) },
          { label: { en: "Growth", ar: "النمو" }, value: fmt((A / P - 1) * 100, 2) + "%" },
        ],
        formula: `A = P(1 + r/n)^(nt) = ${P}(1 + ${r}/${n})^(${n}×${t}) = ${fmt(A, 2)}`,
        steps: [
          { description: { en: `r/n = ${r}/${n} = ${fmt(r / n, 6)}`, ar: `r/n = ${fmt(r / n, 6)}` } },
          { description: { en: `(1 + ${fmt(r / n, 6)})^${n * t} = ${fmt(Math.pow(1 + r / n, n * t), 6)}`, ar: `العامل = ${fmt(Math.pow(1 + r / n, n * t), 6)}` } },
          { description: { en: `A = ${P} × ${fmt(Math.pow(1 + r / n, n * t), 6)} = ${fmt(A, 2)}`, ar: `A = ${fmt(A, 2)}` } },
        ],
      };
    },
  },

  // Simple Interest
  {
    id: "simple-interest",
    category: "finance",
    names: { en: "Simple Interest", ar: "الفائدة البسيطة" },
    descriptions: { en: "I = P·r·t — simple interest.", ar: "الفائدة البسيطة: I = P·r·t." },
    keywords: ["simple", "interest", "فائدة بسيطة"],
    icon: "Percent",
    live: true,
    fields: [
      { key: "principal", names: { en: "Principal P", ar: "المبلغ P" }, type: "number", default: 5000, unit: { en: "$", ar: "$" } },
      { key: "rate", names: { en: "Annual rate r", ar: "المعدل r" }, type: "number", default: 6, unit: { en: "%", ar: "%" } },
      { key: "years", names: { en: "Years t", ar: "السنين t" }, type: "number", default: 3 },
    ],
    compute: (v) => {
      const P = num(v.principal), r = num(v.rate) / 100, t = num(v.years);
      if ([P, r, t].some((x) => Number.isNaN(x) || x <= 0)) return { results: [], error: { en: "Enter positive values", ar: "أدخل قيمًا موجبة" } };
      const I = P * r * t;
      return {
        results: [
          { label: { en: "Interest I", ar: "الفائدة I" }, value: "$" + fmt(I, 2), primary: true },
          { label: { en: "Total amount", ar: "إجمالي المبلغ" }, value: "$" + fmt(P + I, 2) },
        ],
        formula: `I = P·r·t = ${P} × ${r} × ${t} = ${fmt(I, 2)}`,
      };
    },
  },

  // ROI
  {
    id: "roi",
    category: "finance",
    names: { en: "ROI Calculator", ar: "حاسبة العائد على الاستثمار" },
    descriptions: { en: "Return on investment = (gain − cost) / cost × 100%.", ar: "العائد على الاستثمار = (المكسب − التكلفة) / التكلفة × 100%." },
    keywords: ["roi", "return", "investment", "عائد", "استثمار"],
    icon: "TrendingUp",
    live: true,
    fields: [
      { key: "cost", names: { en: "Initial cost", ar: "التكلفة الأولية" }, type: "number", default: 1000, unit: { en: "$", ar: "$" } },
      { key: "return", names: { en: "Final value", ar: "القيمة النهائية" }, type: "number", default: 1500, unit: { en: "$", ar: "$" } },
    ],
    compute: (v) => {
      const c = num(v.cost), r = num(v.return);
      if (Number.isNaN(c) || Number.isNaN(r) || c === 0) return { results: [], error: { en: "Enter valid numbers (cost ≠ 0)", ar: "أدخل أرقامًا (التكلفة ≠ 0)" } };
      const roi = ((r - c) / c) * 100;
      return {
        results: [
          { label: { en: "ROI", ar: "العائد" }, value: fmt(roi, 2) + "%", primary: true, status: roi >= 0 ? "good" : "bad" },
          { label: { en: "Net gain", ar: "صافي المكسب" }, value: "$" + fmt(r - c, 2) },
        ],
        formula: `ROI = (Final − Cost) / Cost × 100 = (${r} − ${c}) / ${c} × 100 = ${fmt(roi, 2)}%`,
      };
    },
  },

  // VAT
  {
    id: "vat",
    category: "finance",
    names: { en: "VAT Calculator", ar: "حاسبة ضريبة القيمة المضافة" },
    descriptions: { en: "Add or remove VAT from an amount.", ar: "أضف أو أزل ضريبة القيمة المضافة من مبلغ." },
    keywords: ["vat", "tax", "ضريبة", "قيمة مضافة"],
    icon: "ReceiptText",
    live: true,
    fields: [
      {
        key: "mode",
        names: { en: "Mode", ar: "الوضع" },
        type: "select",
        default: "add",
        options: [
          { value: "add", label: { en: "Add VAT to net", ar: "أضف للصافي" } },
          { value: "remove", label: { en: "Remove VAT from gross", ar: "أزل من الإجمالي" } },
        ],
      },
      { key: "amount", names: { en: "Amount", ar: "المبلغ" }, type: "number", default: 100, unit: { en: "$", ar: "$" } },
      { key: "rate", names: { en: "VAT rate", ar: "نسبة الضريبة" }, type: "number", default: 14, unit: { en: "%", ar: "%" } },
    ],
    compute: (v) => {
      const amt = num(v.amount), rate = num(v.rate);
      if ([amt, rate].some((x) => Number.isNaN(x))) return { results: [], error: { en: "Enter valid numbers", ar: "أدخل أرقامًا صالحة" } };
      let net: number, vat: number, gross: number;
      if (String(v.mode) === "add") {
        net = amt;
        vat = amt * rate / 100;
        gross = net + vat;
      } else {
        gross = amt;
        vat = amt - (amt / (1 + rate / 100));
        net = gross - vat;
      }
      return {
        results: [
          { label: { en: "Net", ar: "الصافي" }, value: "$" + fmt(net, 2) },
          { label: { en: "VAT", ar: "الضريبة" }, value: "$" + fmt(vat, 2), status: "warning" },
          { label: { en: "Gross", ar: "الإجمالي" }, value: "$" + fmt(gross, 2), primary: true },
        ],
        formula: String(v.mode) === "add"
          ? `VAT = ${amt} × ${rate}% = ${fmt(vat, 2)}; Gross = ${fmt(gross, 2)}`
          : `Net = ${amt} / (1 + ${rate}%) = ${fmt(net, 2)}; VAT = ${fmt(vat, 2)}`,
      };
    },
  },

  // Discount
  {
    id: "discount",
    category: "finance",
    names: { en: "Discount Calculator", ar: "حاسبة الخصم" },
    descriptions: { en: "Final price after a percentage discount.", ar: "السعر النهائي بعد خصم بنسبة مئوية." },
    keywords: ["discount", "sale", "price", "خصم", "تخفيض"],
    icon: "Tag",
    live: true,
    fields: [
      { key: "price", names: { en: "Original price", ar: "السعر الأصلي" }, type: "number", default: 200, unit: { en: "$", ar: "$" } },
      { key: "discount", names: { en: "Discount %", ar: "نسبة الخصم" }, type: "number", default: 25, unit: { en: "%", ar: "%" } },
    ],
    compute: (v) => {
      const p = num(v.price), d = num(v.discount);
      if (Number.isNaN(p) || Number.isNaN(d) || p < 0) return { results: [], error: { en: "Enter valid numbers", ar: "أدخل أرقامًا صالحة" } };
      const save = p * d / 100;
      const final = p - save;
      return {
        results: [
          { label: { en: "You save", ar: "توفّر" }, value: "$" + fmt(save, 2), status: "good" },
          { label: { en: "Final price", ar: "السعر النهائي" }, value: "$" + fmt(final, 2), primary: true },
        ],
        formula: `Save = ${p} × ${d}% = ${fmt(save, 2)}; Final = ${fmt(final, 2)}`,
      };
    },
  },

  // Profit Margin
  {
    id: "profit-margin",
    category: "finance",
    names: { en: "Profit Margin", ar: "هامش الربح" },
    descriptions: { en: "Gross profit margin from revenue and cost.", ar: "هامش الربح الإجمالي من الإيرادات والتكلفة." },
    keywords: ["profit", "margin", "revenue", "ربح", "هامش"],
    icon: "TrendingUp",
    live: true,
    fields: [
      { key: "revenue", names: { en: "Revenue", ar: "الإيرادات" }, type: "number", default: 5000, unit: { en: "$", ar: "$" } },
      { key: "cost", names: { en: "Cost", ar: "التكلفة" }, type: "number", default: 3500, unit: { en: "$", ar: "$" } },
    ],
    compute: (v) => {
      const r = num(v.revenue), c = num(v.cost);
      if (Number.isNaN(r) || Number.isNaN(c) || r === 0) return { results: [], error: { en: "Revenue cannot be zero", ar: "الإيرادات لا يمكن أن تكون صفرًا" } };
      const profit = r - c;
      const margin = (profit / r) * 100;
      return {
        results: [
          { label: { en: "Profit", ar: "الربح" }, value: "$" + fmt(profit, 2), primary: true, status: profit >= 0 ? "good" : "bad" },
          { label: { en: "Profit margin", ar: "هامش الربح" }, value: fmt(margin, 2) + "%" },
          { label: { en: "Markup", ar: "هامش التكلفة" }, value: fmt(c === 0 ? 0 : (profit / c) * 100, 2) + "%" },
        ],
        formula: `Profit = Revenue − Cost; Margin = Profit / Revenue × 100`,
      };
    },
  },

  // Savings Goal
  {
    id: "savings-goal",
    category: "finance",
    names: { en: "Savings Goal", ar: "هدف الادخار" },
    descriptions: { en: "Monthly contribution needed to reach a savings goal.", ar: "المساهمة الشهرية اللازمة للوصول لهدف ادخار." },
    keywords: ["savings", "goal", "ادخار", "هدف"],
    icon: "PiggyBank",
    live: true,
    fields: [
      { key: "goal", names: { en: "Savings goal", ar: "هدف الادخار" }, type: "number", default: 50000, unit: { en: "$", ar: "$" } },
      { key: "years", names: { en: "Years to goal", ar: "السنوات" }, type: "number", default: 5 },
      { key: "rate", names: { en: "Annual return rate", ar: "معدل العائد السنوي" }, type: "number", default: 4, unit: { en: "%", ar: "%" } },
    ],
    compute: (v) => {
      const goal = num(v.goal), years = num(v.years), r = num(v.rate) / 100;
      if ([goal, years].some((x) => Number.isNaN(x) || x <= 0)) return { results: [], error: { en: "Enter positive values", ar: "أدخل قيمًا موجبة" } };
      const n = years * 12;
      const i = r / 12;
      const pmt = i === 0 ? goal / n : (goal * i) / (Math.pow(1 + i, n) - 1);
      return {
        results: [
          { label: { en: "Monthly contribution", ar: "المساهمة الشهرية" }, value: "$" + fmt(pmt, 2), primary: true },
          { label: { en: "Total contributions", ar: "إجمالي المساهمات" }, value: "$" + fmt(pmt * n, 2) },
          { label: { en: "Interest earned", ar: "الفائدة المكتسبة" }, value: "$" + fmt(goal - pmt * n, 2) },
        ],
        formula: `PMT = goal · i / ((1+i)ⁿ − 1)`,
      };
    },
  },

  // Tip Calculator
  {
    id: "tip",
    category: "finance",
    names: { en: "Tip Calculator", ar: "حاسبة البقشيش" },
    descriptions: { en: "Calculate tip and split the bill among people.", ar: "احسب البقشيش واقسم الفاتورة على الأشخاص." },
    keywords: ["tip", "restaurant", "split", "بقشيش", "مطعم"],
    icon: "Utensils",
    live: true,
    fields: [
      { key: "bill", names: { en: "Bill amount", ar: "قيمة الفاتورة" }, type: "number", default: 80, unit: { en: "$", ar: "$" } },
      { key: "tipPct", names: { en: "Tip %", ar: "نسبة البقشيش" }, type: "number", default: 15, unit: { en: "%", ar: "%" } },
      { key: "people", names: { en: "Number of people", ar: "عدد الأشخاص" }, type: "number", default: 2 },
    ],
    compute: (v) => {
      const b = num(v.bill), t = num(v.tipPct), p = num(v.people);
      if (Number.isNaN(b) || Number.isNaN(t) || Number.isNaN(p) || p <= 0) return { results: [], error: { en: "Enter valid numbers", ar: "أدخل أرقامًا صالحة" } };
      const tip = b * t / 100;
      const total = b + tip;
      return {
        results: [
          { label: { en: "Tip", ar: "البقشيش" }, value: "$" + fmt(tip, 2) },
          { label: { en: "Total", ar: "الإجمالي" }, value: "$" + fmt(total, 2), primary: true },
          { label: { en: "Per person", ar: "للشخص الواحد" }, value: "$" + fmt(total / p, 2), primary: true },
        ],
        formula: `Tip = ${b} × ${t}% = ${fmt(tip, 2)}; Total = ${fmt(total, 2)}; Per person = ${fmt(total / p, 2)}`,
      };
    },
  },

  // Mortgage (simple version, same as EMI but clearer naming)
  {
    id: "mortgage",
    category: "finance",
    names: { en: "Mortgage Calculator", ar: "حاسبة الرهن العقاري" },
    descriptions: { en: "Monthly mortgage payment with down payment option.", ar: "القسط الشهري للرهن العقاري مع خيار الدفعة المقدمة." },
    keywords: ["mortgage", "home", "house", "رهن", "منزل"],
    icon: "Home",
    live: true,
    fields: [
      { key: "homePrice", names: { en: "Home price", ar: "سعر المنزل" }, type: "number", default: 350000, unit: { en: "$", ar: "$" } },
      { key: "downPct", names: { en: "Down payment %", ar: "نسبة الدفعة المقدمة" }, type: "number", default: 20, unit: { en: "%", ar: "%" } },
      { key: "rate", names: { en: "Annual rate", ar: "المعدل السنوي" }, type: "number", default: 6.5, unit: { en: "%", ar: "%" } },
      { key: "years", names: { en: "Loan term", ar: "مدة القرض" }, type: "number", default: 30, unit: { en: "years", ar: "سنة" } },
    ],
    compute: (v) => {
      const hp = num(v.homePrice), dp = num(v.downPct), r = num(v.rate) / 100 / 12, n = num(v.years) * 12;
      if ([hp, dp, r, n].some((x) => Number.isNaN(x) || x < 0)) return { results: [], error: { en: "Enter valid numbers", ar: "أدخل أرقامًا صالحة" } };
      const down = hp * dp / 100;
      const P = hp - down;
      const pmt = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const total = pmt * n;
      return {
        results: [
          { label: { en: "Loan amount", ar: "مبلغ القرض" }, value: "$" + fmt(P, 2) },
          { label: { en: "Down payment", ar: "الدفعة المقدمة" }, value: "$" + fmt(down, 2) },
          { label: { en: "Monthly payment", ar: "القسط الشهري" }, value: "$" + fmt(pmt, 2), primary: true },
          { label: { en: "Total paid", ar: "إجمالي المدفوع" }, value: "$" + fmt(total + down, 2) },
          { label: { en: "Total interest", ar: "إجمالي الفائدة" }, value: "$" + fmt(total - P, 2), status: "warning" },
        ],
        formula: `M = P·r·(1+r)ⁿ / ((1+r)ⁿ − 1)`,
      };
    },
  },
];

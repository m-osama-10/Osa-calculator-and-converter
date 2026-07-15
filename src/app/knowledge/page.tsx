"use client";
import { CategoryLayout } from "@/components/layout/category-layout";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, BookOpen, ArrowRight, ArrowLeft, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/store";
import { cn } from "@/lib/utils";

const APK_URL = "https://apkpure.com/p/com.osa.calculator";

interface Article {
  slug: string;
  category: string;
  categoryAr: string;
  titleEn: string;
  titleAr: string;
  excerptEn: string;
  excerptAr: string;
  keywords: string[];
}

const ARTICLES: Article[] = [
  {
    slug: "how-to-use-bmi-calculator",
    category: "Health",
    categoryAr: "الصحة",
    titleEn: "How to Use the BMI Calculator: A Complete Guide",
    titleAr: "كيفية استخدام حاسبة مؤشر كتلة الجسم (BMI): دليل كامل",
    excerptEn: "Learn what BMI is, how it's calculated, what the categories mean, and how to interpret your results for better health.",
    excerptAr: "تعرّف على مؤشر كتلة الجسم، كيف يُحسب، ماذا تعني الفئات، وكيف تفسر نتائجك لصحة أفضل.",
    keywords: ["bmi", "health", "weight", "fitness", "صحة", "وزن"],
  },
  {
    slug: "molarity-vs-molality",
    category: "Chemistry",
    categoryAr: "الكيمياء",
    titleEn: "Molarity vs Molality: What's the Difference?",
    titleAr: "المولارية مقابل المولالية: ما الفرق؟",
    excerptEn: "Understand the key differences between molarity and molality, when to use each, and how temperature affects them.",
    excerptAr: "افهم الفروق الرئيسية بين المولارية والمولالية، متى تستخدم كل منهما، وكيف تؤثر الحرارة عليهما.",
    keywords: ["molarity", "molality", "chemistry", "concentration", "كيمياء", "تركيز"],
  },
  {
    slug: "understanding-ph-scale",
    category: "Chemistry",
    categoryAr: "الكيمياء",
    titleEn: "Understanding the pH Scale: Acids, Bases, and Indicators",
    titleAr: "فهم مقياس pH: الأحماض والقواعد والمؤشرات",
    excerptEn: "A comprehensive guide to the pH scale, how it works, household pH values, and how to use red cabbage as a natural indicator.",
    excerptAr: "دليل شامل لمقياس pH، كيف يعمل، قيم pH للمواد المنزلية، وكيفية استخدام الملفوف الأحمر كمؤشر طبيعي.",
    keywords: ["ph", "acid", "base", "chemistry", "كيمياء", "حمض"],
  },
  {
    slug: "unit-conversion-guide",
    category: "Converters",
    categoryAr: "المحولات",
    titleEn: "Complete Guide to Unit Conversions: Length, Weight, Volume & More",
    titleAr: "دليل كامل لتحويلات الوحدات: الطول، الوزن، الحجم والمزيد",
    excerptEn: "Master unit conversions with practical examples for length, weight, area, volume, temperature, and speed.",
    excerptAr: "أتقن تحويلات الوحدات بأمثلة عملية للطول، الوزن، المساحة، الحجم، الحرارة، والسرعة.",
    keywords: ["conversion", "units", "length", "weight", "تحويل", "وحدات"],
  },
  {
    slug: "pcr-and-dna-amplification",
    category: "Biology",
    categoryAr: "البيولوجيا",
    titleEn: "PCR and DNA Amplification Explained",
    titleAr: "شرح PCR وتضخيم DNA",
    excerptEn: "Learn how PCR works, the role of primers and Taq polymerase, and how to calculate amplification efficiency.",
    excerptAr: "تعرّف على كيفية عمل PCR، دور البرايمرات وبوليميريز Taq، وكيفية حساب كفاءة التضخيم.",
    keywords: ["pcr", "dna", "biology", "amplification", "بيولوجيا", "dna"],
  },
  {
    slug: "hardy-weinberg-equilibrium",
    category: "Genetics",
    categoryAr: "الوراثة",
    titleEn: "Hardy-Weinberg Equilibrium: Principles and Applications",
    titleAr: "توازن هاردي-واينبرغ: المبادئ والتطبيقات",
    excerptEn: "Understand the Hardy-Weinberg principle, its assumptions, and how to calculate allele frequencies in populations.",
    excerptAr: "افهم مبدأ هاردي-واينبرغ، افتراضاته، وكيفية حساب ترددات الأليل في المجتمعات.",
    keywords: ["genetics", "hardy", "weinberg", "allele", "وراثة"],
  },
  {
    slug: "fertilizer-calculation-guide",
    category: "Agriculture",
    categoryAr: "الزراعة",
    titleEn: "Fertilizer Calculation Guide: NPK, Urea, and More",
    titleAr: "دليل حساب الأسمدة: NPK، اليوريا، والمزيد",
    excerptEn: "Learn how to calculate the right amount of fertilizer per feddan based on NPK recommendations and fertilizer analysis.",
    excerptAr: "تعرّف على كيفية حساب الكمية المناسبة من السماد للفدان بناءً على توصيات NPK وتحليل السماد.",
    keywords: ["fertilizer", "npk", "agriculture", "urea", "سماد", "زراعة"],
  },
  {
    slug: "irrigation-water-calculation",
    category: "Agriculture",
    categoryAr: "الزراعة",
    titleEn: "How to Calculate Irrigation Water Needs",
    titleAr: "كيفية حساب احتياجات ماء الري",
    excerptEn: "Master irrigation calculations: ETc, system efficiency, drip vs flood, and how to determine irrigation duration.",
    excerptAr: "أتقن حسابات الري: ETc، كفاءة النظام، التنقيط مقابل الغمر، وكيفية تحديد مدة الري.",
    keywords: ["irrigation", "water", "agriculture", "drip", "ري", "ماء"],
  },
  {
    slug: "compound-interest-explained",
    category: "Finance",
    categoryAr: "المالية",
    titleEn: "Compound Interest Explained: How Your Money Grows",
    titleAr: "شرح الفائدة المركبة: كيف ينمو أموالك",
    excerptEn: "Understand compound interest, the formula A = P(1+r/n)^(nt), and see real examples of how investments grow over time.",
    excerptAr: "افهم الفائدة المركبة، الصيغة A = P(1+r/n)^(nt)، وشاهد أمثلة حقيقية لنمو الاستثمارات بمرور الوقت.",
    keywords: ["compound", "interest", "finance", "investment", "فائدة", "استثمار"],
  },
  {
    slug: "percentage-calculation-tricks",
    category: "Math",
    categoryAr: "الرياضيات",
    titleEn: "Percentage Calculation Tricks and Tips",
    titleAr: "حيل ونصائح لحساب النسب المئوية",
    excerptEn: "Learn quick mental math tricks for calculating percentages, discounts, increases, and decreases.",
    excerptAr: "تعرّف على حيل رياضية سريعة لحساب النسب المئوية والخصومات والزيادات والنقصان.",
    keywords: ["percentage", "math", "discount", "نسبة", "رياضيات"],
  },
  {
    slug: "loan-emi-calculation",
    category: "Finance",
    categoryAr: "المالية",
    titleEn: "How Loan EMI is Calculated: Formula and Examples",
    titleAr: "كيف يُحسب قسط القرض (EMI): الصيغة والأمثلة",
    excerptEn: "Understand the EMI formula, how principal and interest change over time, and tips for choosing the right loan tenure.",
    excerptAr: "افهم صيغة القسط، كيف يتغير الأصل والفائدة بمرور الوقت، ونصائح لاختيار مدة القرض المناسبة.",
    keywords: ["loan", "emi", "finance", "mortgage", "قرض", "قسط"],
  },
  {
    slug: "periodic-table-guide",
    category: "Chemistry",
    categoryAr: "الكيمياء",
    titleEn: "Navigating the Periodic Table: A Beginner's Guide",
    titleAr: "تصفح الجدول الدوري: دليل للمبتدئين",
    excerptEn: "Learn how the periodic table is organized, what groups and periods mean, and how to read element properties.",
    excerptAr: "تعرّف على كيفية تنظيم الجدول الدوري، ماذا تعني المجموعات والدورات، وكيفية قراءة خصائص العناصر.",
    keywords: ["periodic", "table", "elements", "chemistry", "جدول دوري", "عناصر"],
  },
];

const CATEGORIES_LIST = ["All", "Chemistry", "Health", "Biology", "Genetics", "Agriculture", "Finance", "Math", "Converters"];
const CATEGORIES_LIST_AR = ["الكل", "الكيمياء", "الصحة", "البيولوجيا", "الوراثة", "الزراعة", "المالية", "الرياضيات", "المحولات"];

export default function KnowledgePage() {
  const lang = usePreferences((s) => s.language);
  const isAr = lang === "ar";
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("All");

  const filtered = useMemo(() => {
    let result = ARTICLES;
    if (activeCat !== "All") {
      result = result.filter((a) => a.category === activeCat);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (a) =>
          a.titleEn.toLowerCase().includes(q) ||
          a.titleAr.includes(query.trim()) ||
          a.keywords.some((k) => k.includes(q))
      );
    }
    return result;
  }, [query, activeCat]);

  return (
    <CategoryLayout>
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex rounded-2xl bg-gradient-to-br from-violet-500 to-orange-500 p-3 mb-4">
            <BookOpen className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {isAr ? "مركز المعرفة" : "Knowledge Center"}
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            {isAr
              ? "مقالات تعليمية وأدلة شاملة لاستخدام الحاسبات وفهم المعادلات والقوانين"
              : "Educational articles and comprehensive guides for using calculators and understanding formulas"}
          </p>
        </div>

        {/* Download App Banner */}
        <div className="bg-gradient-to-br from-violet-500/10 to-orange-500/10 border rounded-2xl p-4 mb-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-sm">
              {isAr ? "حمّل تطبيق Zoma Calculator" : "Get the Zoma Calculator App"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isAr ? "متاح الآن على APKPure" : "Available now on APKPure"}
            </p>
          </div>
          <a href={APK_URL} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="gap-2 shrink-0">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M14.5 3.5a2 2 0 0 1 2 2v.5l1-.5a1.5 1.5 0 0 1 1.5 2.6L18 9l1 .6a1.5 1.5 0 0 1-1.5 2.6l-1-.5v.3a2 2 0 0 1-2 2H10a4 4 0 0 1-4-4V7.5a4 4 0 0 1 4-4h4.5zM5 8v6a5 5 0 0 0 5 5h6a1 1 0 0 1 0 2H10a7 7 0 0 1-7-7V8a1 1 0 0 1 2 0z"/></svg>
              {isAr ? "تحميل" : "Download"}
            </Button>
          </a>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isAr ? "ابحث في المقالات..." : "Search articles..."}
            className="pl-9 h-11"
          />
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(isAr ? CATEGORIES_LIST_AR : CATEGORIES_LIST).map((cat, i) => {
            const engCat = CATEGORIES_LIST[i];
            return (
              <button
                key={cat}
                onClick={() => setActiveCat(engCat)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition",
                  activeCat === engCat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Articles grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((a, i) => (
            <motion.a
              key={a.slug}
              href={`/knowledge/${a.slug}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="group bg-card border rounded-2xl p-5 hover:shadow-md transition"
            >
              <Badge variant="secondary" className="mb-2 text-[10px]">
                {isAr ? a.categoryAr : a.category}
              </Badge>
              <h3 className="font-semibold text-sm mb-2 group-hover:text-primary transition line-clamp-2">
                {isAr ? a.titleAr : a.titleEn}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {isAr ? a.excerptAr : a.excerptEn}
              </p>
              <div className="flex items-center gap-1 mt-3 text-xs text-primary font-medium">
                {isAr ? "اقرأ المزيد" : "Read more"}
                {isAr ? <ArrowLeft className="h-3 w-3" /> : <ArrowRight className="h-3 w-3" />}
              </div>
            </motion.a>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-sm">{isAr ? "لا توجد مقالات" : "No articles found"}</p>
          </div>
        )}
      </div>
    </div>
    </CategoryLayout>
  );
}

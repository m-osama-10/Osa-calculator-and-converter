"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePreferences } from "@/store";

// Article content database — in production this would come from a CMS or MDX files
const ARTICLE_CONTENT: Record<string, {
  category: string;
  categoryAr: string;
  titleEn: string;
  titleAr: string;
  contentEn: string[];
  contentAr: string[];
}> = {
  "how-to-use-bmi-calculator": {
    category: "Health",
    categoryAr: "الصحة",
    titleEn: "How to Use the BMI Calculator: A Complete Guide",
    titleAr: "كيفية استخدام حاسبة مؤشر كتلة الجسم (BMI): دليل كامل",
    contentEn: [
      "Body Mass Index (BMI) is a simple measure that uses your height and weight to work out if your weight is healthy. The BMI calculation divides an adult's weight in kilograms by their height in metres squared.",
      "The formula is: BMI = weight (kg) / height² (m²). For example, if you weigh 70 kg and are 1.75 m tall, your BMI = 70 / (1.75)² = 22.86.",
      "BMI Categories: Underweight (BMI < 18.5), Normal weight (18.5–24.9), Overweight (25–29.9), Obese (BMI ≥ 30).",
      "BMI is a useful screening tool but it doesn't directly measure body fat. Very muscular people may have a high BMI but low body fat. For a more complete picture, use our Body Fat Calculator alongside BMI.",
      "To use the BMI Calculator in Zoma Calculator: 1) Open the Health & Fitness category, 2) Click on BMI Calculator, 3) Enter your weight and height, 4) The result appears instantly with your category.",
      "For best results, weigh yourself in the morning before eating, and measure your height without shoes. Track your BMI over time to monitor changes.",
    ],
    contentAr: [
      "مؤشر كتلة الجسم (BMI) هو مقياس بسيط يستخدم طولك ووزنك لمعرفة ما إذا كان وزنك صحيًا. يقسم حساب BMI وزن الشخص بالكيلوجرام على مربع طوله بالأمتار.",
      "الصيغة هي: BMI = الوزن (كجم) / الطول² (م²). مثال: إذا كان وزنك 70 كجم وطولك 1.75 م، فإن BMI = 70 / (1.75)² = 22.86.",
      "فئات BMI: نحافة (BMI < 18.5)، وزن طبيعي (18.5–24.9)، زيادة في الوزن (25–29.9)، سمنة (BMI ≥ 30).",
      "BMI أداة فحص مفيدة لكنها لا تقيس الدهون في الجسم مباشرة. الأشخاص العضليون قد يكون لديهم BMI مرتفع لكن دهون قليلة. للحصول على صورة أشمل، استخدم حاسبة نسبة الدهون بجانب BMI.",
      "لاستخدام حاسبة BMI في Zoma Calculator: 1) افتح فئة الصحة واللياقة، 2) اضغط على حاسبة BMI، 3) أدخل وزنك وطولك، 4) تظهر النتيجة فورًا مع التصنيف.",
      "للحصول على أفضل النتائج، قف على الميزان في الصباح قبل الأكل، وقس طولك بدون حذاء. تابع مؤشر BMI بمرور الوقت لمراقبة التغيرات.",
    ],
  },
  "molarity-vs-molality": {
    category: "Chemistry",
    categoryAr: "الكيمياء",
    titleEn: "Molarity vs Molality: What's the Difference?",
    titleAr: "المولارية مقابل المولالية: ما الفرق؟",
    contentEn: [
      "Molarity (M) and molality (m) are two ways to express concentration. While they sound similar, they differ in a crucial way: molarity depends on volume, while molality depends on mass.",
      "Molarity = moles of solute / liters of solution (mol/L). Molality = moles of solute / kg of solvent (mol/kg).",
      "The key difference: molarity changes with temperature (because volume expands/contracts), while molality stays constant (mass doesn't change with temperature).",
      "When to use molarity: Most lab work, titrations, solution preparation (because we measure by volume). When to use molality: Boiling point elevation, freezing point depression, colligative properties (temperature-independent).",
      "Example: 1 mol NaCl in 1 L water = 1 M (molarity). 1 mol NaCl in 1 kg water = 1 m (molality). For dilute aqueous solutions, M ≈ m because 1 L water ≈ 1 kg.",
      "Use our Molarity and Molality calculators in the Chemistry category to practice with real values.",
    ],
    contentAr: [
      "المولارية (M) والمولالية (m) طريقتان للتعبير عن التركيز. رغم تشابه الاسمين، إلا أنهما يختلفان بشكل جوهري: المولارية تعتمد على الحجم، بينما المولالية تعتمد على الكتلة.",
      "المولارية = مولات المذاب / لترات المحلول (مول/لتر). المولالية = مولات المذاب / كجم من المذيب (مول/كجم).",
      "الفرق الرئيسي: المولارية تتغير مع الحرارة (لأن الحجم يتمدد/ينكمش)، بينما المولالية تبقى ثابتة (الكتلة لا تتغير مع الحرارة).",
      "متى تستخدم المولارية: معظم أعمال المختبر، المعايرة، تحضير المحاليل (لأننا نقيس بالحجم). متى تستخدم المولالية: رفع درجة الغليان، خفض درجة التجمد، الخواص التراذمية.",
      "مثال: 1 مول NaCl في 1 لتر ماء = 1 M (مولارية). 1 مول NaCl في 1 كجم ماء = 1 m (مولالية). للمحاليل المائية المخففة، M ≈ m لأن 1 لتر ماء ≈ 1 كجم.",
      "استخدم حاسبات المولارية والمولالية في فئة الكيمياء للتدريب بقيم حقيقية.",
    ],
  },
};

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const lang = usePreferences((s) => s.language);
  const isAr = lang === "ar";

  const slug = params.slug as string;
  const article = ARTICLE_CONTENT[slug];

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-sm text-muted-foreground mb-4">
            {isAr ? "المقال غير موجود" : "Article not found"}
          </p>
          <Button onClick={() => router.push("/knowledge")} variant="outline" size="sm">
            {isAr ? "العودة لمركز المعرفة" : "Back to Knowledge Center"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Back button */}
        <Button
          onClick={() => router.push("/knowledge")}
          variant="ghost"
          size="sm"
          className="mb-4 gap-1"
        >
          {isAr ? <ArrowRight className="h-3 w-3" /> : <ArrowLeft className="h-3 w-3" />}
          {isAr ? "العودة للمقالات" : "Back to Articles"}
        </Button>

        {/* Article header */}
        <Badge variant="secondary" className="mb-3">
          {isAr ? article.categoryAr : article.category}
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">
          {isAr ? article.titleAr : article.titleEn}
        </h1>

        {/* Article content */}
        <div className="space-y-4">
          {(isAr ? article.contentAr : article.contentEn).map((para, i) => (
            <p key={i} className="text-sm text-muted-foreground leading-relaxed">
              {para}
            </p>
          ))}
        </div>

        {/* Related calculators CTA */}
        <div className="mt-8 bg-gradient-to-br from-violet-500/10 to-orange-500/10 border rounded-2xl p-6 text-center">
          <h3 className="font-semibold text-sm mb-2">
            {isAr ? "جرب الحاسبات ذات الصلة" : "Try Related Calculators"}
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            {isAr ? "استخدم الحاسبات العملية في المنصة" : "Use the practical calculators in the platform"}
          </p>
          <Button onClick={() => router.push("/")} size="sm">
            {isAr ? "تصفح الحاسبات" : "Browse Calculators"}
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";
import { CategoryLayout } from "@/components/layout/category-layout";

import { usePreferences } from "@/store";

export default function DisclaimerPage() {
  const lang = usePreferences((s) => s.language);
  const isAr = lang === "ar";

  const sections = isAr ? [
    { title: "إخلاء المسؤولية العامة", body: "منصة Zoma Calculator and OSA Converter منصة تعليمية ومرجعية. جميع الحسابات والنتائج المقدمة هي لأغراض تعليمية ومعلوماتية فقط. لا ينبغي الاعتماد عليها كأساس وحيد لاتخاذ قرارات مهمة." },
    { title: "دقة النتائج", body: "نبذل قصارى جهدنا لضمان دقة جميع الحسابات والمعادلات المستخدمة. ومع ذلك، لا نضمن خلو النتائج من الأخطاء. يُنصح دائماً بالتحقق من النتائج الحساسة من مصادر متعددة أو استشارة مختص." },
    { title: "ليست بديلاً عن الاستشارة المهنية", body: "المعلومات المقدمة على المنصة لا تشكل نصيحة طبية أو مالية أو قانونية أو هندسية. للحصول على قرارات مهمة تؤثر على صحتك أو أموالك أو سلامتك، يرجى استشارة متخصص مؤهل." },
    { title: "المحتوى التعليمي", body: "المقالات والأدلة في مركز المعرفة مكتوبة لأغراض تعليمية. قد تحتوي على تبسيطات أو تعميمات لتسهيل الفهم. للمعلومات التفصيلية، راجع المصادر العلمية المتخصصة." },
    { title: "روابط خارجية", body: "قد تحتوي المنصة على روابط لمواقع خارجية. لا نتحكم في محتوى هذه المواقع ولا نتحمل مسؤولية سياساتها أو محتواها." },
    { title: "تجارب منزلية", body: "التجارب المنزلية المذكورة في المنصة مصممة لتكون آمنة عند اتباع التعليمات بدقة. اتبع جميع تحذيرات السلامة. لا نتحمل مسؤولية أي إصابات أو أضرار ناتجة عن تنفيذ التجارب بشكل غير صحيح." },
    { title: "الإعلانات", body: "الإعلانات المعروضة على المنصة تُدار بواسطة أطراف ثالثة (Google AdSense). لا نتحكم في محتوى الإعلانات ولا نشتري أو نبيع أي منتجات معلن عنها." },
    { title: "حدود المسؤولية", body: "بأقصى حد يسمح به القانون، لا تتحمل المنصة أو مطوروها أي مسؤولية عن أي أضرار مباشرة أو غير مباشرة أو عرضية أو تبعية ناتجة عن استخدام المنصة أو عدم القدرة على استخدامها." },
  ] : [
    { title: "General Disclaimer", body: "Zoma Calculator and OSA Converter is an educational and reference platform. All calculations and results are for educational and informational purposes only and should not be relied upon as the sole basis for important decisions." },
    { title: "Accuracy of Results", body: "We strive to ensure accuracy of all calculations and formulas. However, we do not guarantee results are error-free. Always verify critical results from multiple sources or consult a professional." },
    { title: "Not Professional Advice", body: "Information provided does not constitute medical, financial, legal, or engineering advice. For decisions affecting your health, finances, or safety, please consult a qualified professional." },
    { title: "Educational Content", body: "Articles and guides in the Knowledge Center are written for educational purposes. They may contain simplifications for clarity. For detailed information, consult specialized scientific sources." },
    { title: "External Links", body: "The Platform may contain links to external websites. We do not control their content and are not responsible for their policies or content." },
    { title: "Home Experiments", body: "Home experiments described on the Platform are designed to be safe when instructions are followed carefully. Follow all safety warnings. We are not responsible for injuries or damages from improper execution." },
    { title: "Advertisements", body: "Ads displayed are managed by third parties (Google AdSense). We do not control ad content and do not buy or sell any advertised products." },
    { title: "Limitation of Liability", body: "To the maximum extent permitted by law, the Platform and its developers are not liable for any direct, indirect, incidental, or consequential damages arising from use of or inability to use the Platform." },
  ];

  return (
    <CategoryLayout>
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold mb-2">
          {isAr ? "إخلاء المسؤولية" : "Disclaimer"}
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          {isAr ? "آخر تحديث: يوليو 2026" : "Last updated: July 2026"}
        </p>
        <div className="space-y-6">
          {sections.map((s, i) => (
            <section key={i} className="bg-card border rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-2">{i + 1}. {s.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
    </CategoryLayout>
  );
}

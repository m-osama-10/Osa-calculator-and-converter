"use client";

import { usePreferences } from "@/store";

export default function TermsPage() {
  const lang = usePreferences((s) => s.language);
  const isAr = lang === "ar";

  const sections = isAr ? [
    { title: "قبول الشروط", body: "باستخدامك لمنصة Zoma Calculator and OSA Converter (\"المنصة\")، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء منها، يرجى عدم استخدام المنصة." },
    { title: "وصف الخدمة", body: "المنصة عبارة عن أداة ويب مجانية توفر حاسبات ومحولات وحدات في مجالات متعددة تشمل الرياضيات، الكيمياء، الفيزياء، البيولوجيا، الزراعة، المالية، الصحة، والمزيد. تعمل جميع الحسابات على جهاز المستخدم ولا تتطلب اتصالاً بالإنترنت بعد تحميل الصفحة." },
    { title: "الاستخدام المقبول", body: "تتعهد باستخدام المنصة لأغراض قانونية فقط. لا يجوز استخدام المنصة لأي غرض غير قانوني أو ضار. لا يجوز محاولة الوصول غير المصرح به إلى أنظمة المنصة أو تعطيل خدمتها." },
    { title: "الملكية الفكرية", body: "المحتوى المنشور على المنصة بما في ذلك النصوص والصور والشعارات والتصميمات والكود البرمجي محمي بموجب قوانين الملكية الفكرية. لا يجوز نسخ أو إعادة توزيع المحتوى دون إذن كتابي." },
    { title: "إخلاء المسؤولية", body: "تُقدم المنصة كما هي دون أي ضمانات. النتائج المقدمة بواسطة الحاسبات هي لأغراض تعليمية ومرجعية فقط ولا تغني عن استشارة متخصص. لا نتحمل أي مسؤولية عن أي أضرار ناتجة عن استخدام المنصة أو الاعتماد على نتائجها." },
    { title: "الإعلانات", body: "قد تعرض المنصة إعلانات من Google AdSense أو شبكات إعلانية أخرى. هذه الإعلانات تُدار بواسطة أطراف ثالثة ولنا ولا لهم سيطرة كاملة على محتواها. النقر على الإعلانات اختياري." },
    { title: "البيانات والخصوصية", body: "لا نجمع بيانات شخصية تُحدد هويتك. جميع الحسابات تتم على جهازك. لمزيد من التفاصيل، يرجى مراجعة صفحة سياسة الخصوصية." },
    { title: "تعديل الشروط", body: "نحتفظ بالحق في تعديل هذه الشروط في أي وقت. ستكون التغييرات سارية المفعول فور نشرها على هذه الصفحة. استمرارك في استخدام المنصة بعد التعديلات يعني موافقتك على الشروط المعدلة." },
    { title: "قانون الحاكم", body: "تخضع هذه الشروط لقوانين جمهورية مصر العربية." },
  ] : [
    { title: "Acceptance of Terms", body: "By using Zoma Calculator and OSA Converter (\"the Platform\"), you agree to comply with these terms and conditions. If you do not agree with any part, please do not use the Platform." },
    { title: "Service Description", body: "The Platform is a free web tool providing calculators and unit converters across multiple fields including mathematics, chemistry, physics, biology, agriculture, finance, health, and more. All calculations run on the user's device and do not require an internet connection after page load." },
    { title: "Acceptable Use", body: "You agree to use the Platform for lawful purposes only. You may not use it for any illegal or harmful purpose, attempt unauthorized access, or disrupt the service." },
    { title: "Intellectual Property", body: "Content published on the Platform including text, images, logos, designs, and code is protected by intellectual property laws. Content may not be copied or redistributed without written permission." },
    { title: "Disclaimer", body: "The Platform is provided \"as is\" without warranties. Results from calculators are for educational and reference purposes only and do not replace professional consultation. We are not liable for damages resulting from use of or reliance on the Platform's results." },
    { title: "Advertisements", body: "The Platform may display ads from Google AdSense or other ad networks. These ads are managed by third parties. Clicking ads is optional." },
    { title: "Data & Privacy", body: "We do not collect personally identifiable data. All calculations run on your device. For details, see our Privacy Policy page." },
    { title: "Modification of Terms", body: "We reserve the right to modify these terms at any time. Changes take effect immediately upon posting. Continued use constitutes acceptance of modified terms." },
    { title: "Governing Law", body: "These terms are governed by the laws of the Arab Republic of Egypt." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold mb-2">
          {isAr ? "الشروط والأحكام" : "Terms & Conditions"}
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
  );
}

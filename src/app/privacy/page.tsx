"use client";
import { CategoryLayout } from "@/components/layout/category-layout";

import { usePreferences } from "@/store";

export default function PrivacyPage() {
  const lang = usePreferences((s) => s.language);
  const isAr = lang === "ar";

  const sections = isAr ? [
    {
      title: "مقدمة",
      body: "تحترم منصة Zoma Calculator & OSA Converter (\"المنصة\") خصوصية مستخدميها. توضح هذه السياسة كيفية تعاملنا مع البيانات عند استخدامك للموقع أو التطبيق."
    },
    {
      title: "البيانات التي يتم جمعها",
      body: "لا نجمع أي بيانات شخصية تُحدد هويتك. جميع الحسابات والعمليات تتم بالكامل على جهازك (Client-side). البيانات المحفوظة محليًا (مثل المفضلة والسجل) تُخزن في متصفحك فقط ولا تُرسل لأي خادم."
    },
    {
      title: "ملفات تعريف الارتباط (Cookies)",
      body: "لا نستخدم ملفات تعريف ارتباط لتتبع هويتك. ومع ذلك، قد تستخدم خدمات الطرف الثالث (مثل Google AdSense) ملفات تعريف ارتباط لعرض الإعلانات المناسبة."
    },
    {
      title: "خدمات الطرف الثالث",
      body: "نستخدم خدمات إعلانية من أطراف ثالثة، وتحديدًا Google AdSense، لعرض الإعلانات. قد تستخدم هذه الخدمات ملفات تعريف ارتباط أو تقنيات مشابهة لعرض إعلانات ذات صلة باهتماماتك. يمكنك تعطيل الإعلانات المخصصة من إعدادات حساب Google الخاص بك."
    },
    {
      title: "البيانات المحلية",
      body: "تُخزن البيانات التالية محليًا على جهازك فقط ولا تُرسل لأي خادم: المفضلة (الحاسبات المفضلة)، السجل (آخر العمليات الحسابية)، إعدادات اللغة والثيم."
    },
    {
      title: "حقوق المستخدم",
      body: "لديك الحق الكامل في: مسح جميع البيانات المحلية في أي وقت من خلال مسح بيانات الموقع في متصفحك. لا تحتاج لإنشاء حساب أو تقديم أي معلومات شخصية لاستخدام المنصة."
    },
    {
      title: "التواصل",
      body: "لأي استفسارات حول الخصوصية، يمكنك التواصل عبر: GitHub: github.com/m-osama-10"
    },
  ] : [
    {
      title: "Introduction",
      body: "Zoma Calculator & OSA Converter (\"the Platform\") respects the privacy of its users. This policy explains how we handle data when you use our website or app."
    },
    {
      title: "Data We Collect",
      body: "We do not collect any personally identifiable information. All calculations and operations are performed entirely on your device (client-side). Locally stored data (such as favorites and history) is stored in your browser only and is never sent to any server."
    },
    {
      title: "Cookies",
      body: "We do not use tracking cookies to identify you. However, third-party services (such as Google AdSense) may use cookies to display relevant advertisements."
    },
    {
      title: "Third-Party Services",
      body: "We use third-party advertising services, specifically Google AdSense, to display ads. These services may use cookies or similar technologies to show ads relevant to your interests. You can opt out of personalized ads from your Google account settings."
    },
    {
      title: "Local Data",
      body: "The following data is stored locally on your device only and is never sent to any server: Favorites (starred calculators), History (recent calculations), Language and theme preferences."
    },
    {
      title: "User Rights",
      body: "You have the full right to: Clear all local data at any time by clearing site data in your browser. You do not need to create an account or provide any personal information to use the Platform."
    },
    {
      title: "Contact",
      body: "For any privacy-related inquiries, you can reach us via: GitHub: github.com/m-osama-10"
    },
  ];

  return (
    <CategoryLayout>
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold mb-2">
          {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          {isAr ? "آخر تحديث: يوليو 2026" : "Last updated: July 2026"}
        </p>

        <div className="space-y-6">
          {sections.map((s, i) => (
            <section key={i} className="bg-card border rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-2">
                {i + 1}. {s.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {s.body}
              </p>
            </section>
          ))}
        </div>
      </div>
    </div>
    </CategoryLayout>
  );
}

"use client";

import { Github, Linkedin, Facebook, Download, Sparkles, Calculator, Globe, Smartphone, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/store";
import { REGISTRY, CATEGORIES } from "@/lib/registry";

const APK_URL = "https://apkpure.com/p/com.osa.calculator";

const developer = {
  nameEn: "Mohamed Osama Sayed",
  nameAr: "محمد أسامة سيد",
  degreeEn: "B.Sc. Biotechnology — Assiut University",
  degreeAr: "بكالوريوس التكنولوجيا الحيوية – جامعة أسيوط",
  bioEn: "App and web developer passionate about building digital tools and scientific/educational solutions. Experienced in web app development, UI/UX design, performance optimization, and user experience.",
  bioAr: "مطور تطبيقات ومواقع ويب، ومهتم ببناء الأدوات الرقمية والحلول العلمية والتعليمية. يمتلك خبرة في تطوير تطبيقات الويب، وتصميم واجهات المستخدم، وتحسين الأداء وتجربة المستخدم.",
  socials: [
    { icon: Github, url: "https://github.com/m-osama-10", label: "GitHub" },
    { icon: Linkedin, url: "https://www.linkedin.com/in/MoOsama", label: "LinkedIn" },
    { icon: Facebook, url: "https://www.facebook.com/M.o0sama", label: "Facebook" },
  ],
};

export default function AboutPage() {
  const lang = usePreferences((s) => s.language);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-orange-500 p-6 sm:p-10 text-white shadow-xl">
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <img src="/logo.png" alt="Logo" className="h-20 w-20 rounded-2xl mx-auto mb-4 bg-white/20 p-2 backdrop-blur-sm" />
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">
              {lang === "ar" ? "من نحن" : "About Us"}
            </h1>
            <p className="text-sm sm:text-base text-white/90 max-w-2xl mx-auto">
              {lang === "ar"
                ? "منصة Zoma Calculator & OSA Converter هي منصة شاملة لحاسبات ومحولات متعددة الأغراض، مصممة لخدمة الطلاب والباحثين والمهندسين والمزارعين."
                : "Zoma Calculator & OSA Converter is a comprehensive multi-purpose calculator and converter platform, designed to serve students, researchers, engineers, and farmers."}
            </p>
          </div>
        </section>

        {/* Mission & Goals */}
        <section className="bg-card border rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-500" />
            {lang === "ar" ? "رسالتنا وأهدافنا" : "Our Mission & Goals"}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {lang === "ar"
              ? "رسالتنا هي توفير أداة رقمية موثوقة وسهلة الاستخدام تجمع مئات الحاسبات والمحولات في مكان واحد، باللغتين العربية والإنجليزية، مع دعم كامل للعمل دون اتصال بالإنترنت. نهدف إلى جعل الحسابات العلمية واليومية في متناول الجميع، مجانًا."
              : "Our mission is to provide a reliable, easy-to-use digital tool that combines hundreds of calculators and converters in one place, in both Arabic and English, with full offline support. We aim to make scientific and everyday calculations accessible to everyone, free of charge."}
          </p>
        </section>

        {/* Features */}
        <section className="bg-card border rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-fuchsia-500" />
            {lang === "ar" ? "أهم المميزات" : "Key Features"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { icon: Calculator, en: "150+ calculators across 19 categories", ar: "150+ حاسبة في 19 فئة" },
              { icon: Globe, en: "Bilingual (Arabic/English) with RTL support", ar: "ثنائي اللغة (عربي/إنجليزي) مع دعم RTL" },
              { icon: Smartphone, en: "Works offline as a PWA", ar: "يعمل بدون إنترنت كـ PWA" },
              { icon: Zap, en: "Instant search & live calculations", ar: "بحث فوري وحساب مباشر" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <f.icon className="h-4 w-4 text-primary shrink-0" />
                <span>{lang === "ar" ? f.ar : f.en}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Download App */}
        <section className="bg-gradient-to-br from-violet-500/10 to-orange-500/10 border rounded-2xl p-6 text-center">
          <h2 className="text-xl font-bold mb-3">
            {lang === "ar" ? "حمّل تطبيق Zoma Calculator" : "Download Zoma Calculator App"}
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            {lang === "ar" ? "حمّل التطبيق الآن على هاتفك من APKPure" : "Get the app on your phone from APKPure"}
          </p>
          <a href={APK_URL} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="gap-2">
              <Download className="h-5 w-5" />
              {lang === "ar" ? "تحميل التطبيق من APKPure" : "Download from APKPure"}
            </Button>
          </a>
        </section>

        {/* Developer */}
        <section className="bg-card border rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">
            {lang === "ar" ? "عن المطور" : "About the Developer"}
          </h2>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="rounded-full bg-gradient-to-br from-violet-500 to-orange-500 p-1 shrink-0">
              <div className="h-16 w-16 rounded-full bg-background flex items-center justify-center text-2xl font-bold">
                {lang === "ar" ? "م ع" : "MO"}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">{lang === "ar" ? developer.nameAr : developer.nameEn}</h3>
              <p className="text-sm text-primary font-medium mb-2">
                {lang === "ar" ? developer.degreeAr : developer.degreeEn}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {lang === "ar" ? developer.bioAr : developer.bioEn}
              </p>
              <div className="flex items-center gap-2">
                {developer.socials.map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg border hover:bg-accent transition"
                    aria-label={s.label}
                  >
                    <s.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { value: `${REGISTRY.length}+`, label: lang === "ar" ? "حاسبة" : "Calculators" },
            { value: `${CATEGORIES.length}`, label: lang === "ar" ? "فئة" : "Categories" },
            { value: "118", label: lang === "ar" ? "عنصر" : "Elements" },
            { value: "2", label: lang === "ar" ? "لغة" : "Languages" },
          ].map((s, i) => (
            <div key={i} className="bg-card border rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-primary">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

"use client";
import { CategoryLayout } from "@/components/layout/category-layout";

import { useState } from "react";
import { Mail, MessageSquare, Send, Github, Linkedin, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { usePreferences } from "@/store";

export default function ContactPage() {
  const lang = usePreferences((s) => s.language);
  const isAr = lang === "ar";
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success(isAr ? "تم إرسال رسالتك بنجاح" : "Your message has been sent");
  };

  return (
    <CategoryLayout>
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold mb-2">
          {isAr ? "اتصل بنا" : "Contact Us"}
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          {isAr
            ? "نحن هنا لمساعدتك. إذا كان لديك أي سؤال أو اقتراح أو ملاحظة، لا تتردد في التواصل معنا."
            : "We're here to help. If you have any questions, suggestions, or feedback, don't hesitate to reach out."}
        </p>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Contact form */}
          <div className="bg-card border rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-violet-500" />
              {isAr ? "أرسل رسالة" : "Send a Message"}
            </h2>
            {submitted ? (
              <div className="text-center py-8">
                <div className="rounded-full bg-emerald-500/10 p-4 w-fit mx-auto mb-3">
                  <Send className="h-8 w-8 text-emerald-500" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {isAr ? "شكراً لتواصلك! سنرد عليك في أقرب وقت." : "Thank you for reaching out! We'll get back to you soon."}
                </p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => setSubmitted(false)}>
                  {isAr ? "إرسال رسالة أخرى" : "Send another"}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <Label className="text-xs">{isAr ? "الاسم" : "Name"}</Label>
                  <Input required placeholder={isAr ? "اسمك الكامل" : "Your full name"} className="h-10 mt-1" />
                </div>
                <div>
                  <Label className="text-xs">{isAr ? "البريد الإلكتروني" : "Email"}</Label>
                  <Input required type="email" placeholder="you@example.com" className="h-10 mt-1" />
                </div>
                <div>
                  <Label className="text-xs">{isAr ? "الرسالة" : "Message"}</Label>
                  <Textarea required placeholder={isAr ? "اكتب رسالتك هنا..." : "Write your message here..."} className="min-h-[100px] mt-1" />
                </div>
                <Button type="submit" className="w-full gap-2">
                  <Send className="h-4 w-4" />
                  {isAr ? "إرسال" : "Send"}
                </Button>
              </form>
            )}
          </div>

          {/* Contact info */}
          <div className="space-y-4">
            <div className="bg-card border rounded-2xl p-6">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-fuchsia-500" />
                {isAr ? "معلومات التواصل" : "Contact Information"}
              </h2>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  {isAr
                    ? "منصة Zoma Calculator and OSA Converter منصة مجانية تهدف إلى توفير أدوات حسابية دقيقة وسهلة الاستخدام للجميع."
                    : "Zoma Calculator and OSA Converter is a free platform providing accurate and easy-to-use calculation tools for everyone."}
                </p>
                <p className="font-medium text-foreground">
                  {isAr ? "المطور: محمد أسامة سيد" : "Developer: Mohamed Osama Sayed"}
                </p>
                <p>
                  {isAr ? "بكالوريوس التكنولوجيا الحيوية – جامعة أسيوط" : "B.Sc. Biotechnology — Assiut University"}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-4">
                {[
                  { icon: Github, url: "https://github.com/m-osama-10", label: "GitHub" },
                  { icon: Linkedin, url: "https://www.linkedin.com/in/MoOsama", label: "LinkedIn" },
                  { icon: Facebook, url: "https://www.facebook.com/M.o0sama", label: "Facebook" },
                ].map((s, i) => (
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

            <div className="bg-gradient-to-br from-violet-500/10 to-orange-500/10 border rounded-2xl p-6">
              <h3 className="font-semibold text-sm mb-2">
                {isAr ? "حمّل التطبيق" : "Download the App"}
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                {isAr ? "متاح على APKPure" : "Available on APKPure"}
              </p>
              <a href="https://apkpure.com/p/com.osa.calculator" target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="gap-2">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M14.5 3.5a2 2 0 0 1 2 2v.5l1-.5a1.5 1.5 0 0 1 1.5 2.6L18 9l1 .6a1.5 1.5 0 0 1-1.5 2.6l-1-.5v.3a2 2 0 0 1-2 2H10a4 4 0 0 1-4-4V7.5a4 4 0 0 1 4-4h4.5zM5 8v6a5 5 0 0 0 5 5h6a1 1 0 0 1 0 2H10a7 7 0 0 1-7-7V8a1 1 0 0 1 2 0z"/></svg>
                  {isAr ? "تحميل من APKPure" : "Download from APKPure"}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </CategoryLayout>
  );
}

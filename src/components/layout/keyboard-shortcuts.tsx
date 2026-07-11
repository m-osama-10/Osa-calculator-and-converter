"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/store";

const SHORTCUTS = [
  { keys: ["/"], desc: { en: "Focus search bar", ar: "تركيز البحث" } },
  { keys: ["Ctrl", "K"], desc: { en: "Focus search bar", ar: "تركيز البحث" } },
  { keys: ["Esc"], desc: { en: "Close modal / search", ar: "إغلاق النافذة / البحث" } },
  { keys: ["T"], desc: { en: "Toggle theme (when not typing)", ar: "تبديل المظهر (خارج الكتابة)" } },
  { keys: ["L"], desc: { en: "Toggle language (when not typing)", ar: "تبديل اللغة (خارج الكتابة)" } },
  { keys: ["Enter"], desc: { en: "Calculate (non-live calculators)", ar: "احسب (للحاسبات غير المباشرة)" } },
];

export function KeyboardShortcutsHelp() {
  const [open, setOpen] = useState(false);
  const lang = usePreferences((s) => s.language);

  // Show shortcuts when user presses "?" (outside inputs)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if (e.key === "?" && !isInput) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
      // Theme toggle on "T" (outside input)
      if ((e.key === "t" || e.key === "T") && !isInput && !e.ctrlKey && !e.metaKey) {
        const root = document.documentElement;
        const isDark = root.classList.contains("dark");
        root.classList.toggle("dark", !isDark);
        try { localStorage.setItem("theme", isDark ? "light" : "dark"); } catch { /* ignore */ }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: "spring", damping: 24, stiffness: 320 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-background border rounded-2xl shadow-2xl z-50 overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard shortcuts"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold flex items-center gap-2">
                <Keyboard className="h-4 w-4" />
                {lang === "ar" ? "اختصارات لوحة المفاتيح" : "Keyboard shortcuts"}
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="h-7 w-7">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 space-y-2">
              {SHORTCUTS.map((s, i) => (
                <div key={i} className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-muted-foreground">{s.desc[lang]}</span>
                  <div className="flex items-center gap-1">
                    {s.keys.map((k, j) => (
                      <kbd key={j} className="px-2 py-1 text-[11px] font-mono font-semibold border rounded-md bg-muted">
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
              <p className="text-[11px] text-muted-foreground/70 pt-2 border-t mt-3">
                {lang === "ar"
                  ? "اضغط ? في أي وقت لإظهار هذه القائمة."
                  : "Press ? at any time to show this menu."}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

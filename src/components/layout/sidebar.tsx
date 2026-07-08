"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Home, Star, History as HistoryIcon, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUI, usePreferences } from "@/store";
import { CATEGORIES, REGISTRY } from "@/lib/registry";
import { Icon } from "@/lib/icons";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const lang = usePreferences((s) => s.language);
  const sidebarOpen = useUI((s) => s.sidebarOpen);
  const setSidebarOpen = useUI((s) => s.setSidebarOpen);
  const view = useUI((s) => s.view);
  const setView = useUI((s) => s.setView);
  const activeCategoryId = useUI((s) => s.activeCategoryId);
  const setActiveCategory = useUI((s) => s.setActiveCategory);
  const setSearchQuery = useUI((s) => s.setSearchQuery);

  const navItems = [
    { id: "home", label: t(lang, "home"), icon: Home },
    { id: "favorites", label: t(lang, "favorites"), icon: Star },
    { id: "history", label: t(lang, "history"), icon: HistoryIcon },
  ] as const;

  const handleNav = (v: typeof navItems[number]["id"]) => {
    setView(v);
    setSearchQuery("");
    setSidebarOpen(false);
  };

  const handleCategory = (id: string) => {
    setActiveCategory(id);
    setSearchQuery("");
    setSidebarOpen(false);
  };

  const content = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 lg:hidden">
        <span className="font-bold flex items-center gap-2">
          <div className="rounded-lg bg-gradient-to-br from-violet-500 to-orange-500 p-1">
            <Calculator className="h-4 w-4 text-white" />
          </div>
          Menu
        </span>
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3 py-2">
        <div className="space-y-1 mb-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition",
                view === item.id
                  ? "bg-secondary text-secondary-foreground"
                  : "hover:bg-accent text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </div>

        <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Sparkles className="h-3 w-3" />
          {t(lang, "categories")}
        </div>

        <div className="space-y-1 mt-1">
          {CATEGORIES.map((cat) => {
            const count = REGISTRY.filter((r) => r.calculator.category === cat.id).length;
            const isActive = view === "category" && activeCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategory(cat.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition group",
                  isActive
                    ? "bg-secondary text-secondary-foreground"
                    : "hover:bg-accent text-muted-foreground hover:text-foreground"
                )}
              >
                <div className={cn("rounded-lg bg-gradient-to-br p-1.5 text-white shrink-0 shadow-sm", cat.color)}>
                  <Icon name={cat.icon} className="h-3.5 w-3.5" />
                </div>
                <span className="flex-1 text-start font-medium">{cat.names[lang]}</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-muted rounded-full text-muted-foreground/80">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-4 border-t text-[11px] text-muted-foreground space-y-1">
        <div className="flex items-center justify-between">
          <span>{t(lang, "totalCalculators")}</span>
          <span className="font-bold text-foreground">{REGISTRY.length}+</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{t(lang, "offlineReady")}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0 border-r bg-sidebar/50 backdrop-blur-sm sticky top-16 h-[calc(100vh-4rem)] no-print">
        {content}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="lg:hidden fixed inset-y-0 start-0 w-80 max-w-[85vw] bg-background border-e z-50 no-print"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

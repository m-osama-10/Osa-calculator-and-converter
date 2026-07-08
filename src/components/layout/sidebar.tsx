"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Home, Star, History as HistoryIcon, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUI, usePreferences } from "@/store";
import { CATEGORIES, REGISTRY } from "@/lib/registry";
import { Icon } from "@/lib/icons";
import { AdBanner } from "@/components/ads/adsense-ad";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { id: "home", labelKey: "home", icon: Home },
  { id: "favorites", labelKey: "favorites", icon: Star },
  { id: "history", labelKey: "history", icon: HistoryIcon },
] as const;

export function Sidebar() {
  const lang = usePreferences((s) => s.language);
  const sidebarOpen = useUI((s) => s.sidebarOpen);
  const setSidebarOpen = useUI((s) => s.setSidebarOpen);
  const view = useUI((s) => s.view);
  const setView = useUI((s) => s.setView);
  const activeCategoryId = useUI((s) => s.activeCategoryId);
  const setActiveCategory = useUI((s) => s.setActiveCategory);
  const setSearchQuery = useUI((s) => s.setSearchQuery);

  const handleNav = (v: "home" | "favorites" | "history") => {
    setView(v);
    setSearchQuery("");
    setSidebarOpen(false);
  };

  const handleCategory = (id: string) => {
    setActiveCategory(id);
    setSearchQuery("");
    setSidebarOpen(false);
  };

  const renderContent = () => (
    <div className="flex flex-col h-full min-h-0">
      {/* Mobile header */}
      <div className="flex items-center justify-between p-4 lg:hidden shrink-0">
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

      {/* Scrollable nav + categories */}
      <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-2">
        <div className="space-y-1 mb-4">
          {NAV_ITEMS.map((item) => (
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
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{t(lang, item.labelKey)}</span>
            </button>
          ))}
        </div>

        <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 shrink-0" />
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
                <span className="flex-1 text-start font-medium truncate">{cat.names[lang]}</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-muted rounded-full text-muted-foreground/80 shrink-0">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Sidebar ad */}
      <div className="px-3 pb-2 shrink-0">
        <AdBanner className="my-0" label="Sponsored" />
      </div>

      {/* Footer */}
      <div className="p-4 border-t text-[11px] text-muted-foreground space-y-1 shrink-0">
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
      {/* Desktop sidebar — sticky, full height, internal scroll */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0 border-r bg-sidebar/50 backdrop-blur-sm sticky top-16 h-[calc(100vh-4rem)] no-print overflow-hidden">
        {renderContent()}
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
              className="lg:hidden fixed inset-y-0 start-0 w-80 max-w-[85vw] bg-background border-e z-50 no-print overflow-hidden"
            >
              {renderContent()}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

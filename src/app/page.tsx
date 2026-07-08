"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Search, Star, History as HistoryIcon, TrendingUp,
  Trash2, Clock, Calculator, ArrowRight, ArrowLeft, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { CalculatorCard } from "@/components/calculators/calculator-card";
import { CalculatorModal } from "@/components/calculators/calculator-modal";
import { KeyboardShortcutsHelp } from "@/components/layout/keyboard-shortcuts";
import { useUI, usePreferences, useFavorites, useHistory } from "@/store";
import { CATEGORIES, REGISTRY, getPopularCalculators, searchCalculators, getByCategory } from "@/lib/registry";
import { Icon } from "@/lib/icons";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export default function Home() {
  const lang = usePreferences((s) => s.language);
  const view = useUI((s) => s.view);
  const activeCategoryId = useUI((s) => s.activeCategoryId);
  const setActiveCategory = useUI((s) => s.setActiveCategory);
  const searchQuery = useUI((s) => s.searchQuery);
  const setSearchQuery = useUI((s) => s.setSearchQuery);
  const setView = useUI((s) => s.setView);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {view === "home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <HomeView />
              </motion.div>
            )}
            {view === "category" && (
              <motion.div
                key={`cat-${activeCategoryId}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <CategoryView categoryId={activeCategoryId!} />
              </motion.div>
            )}
            {view === "favorites" && (
              <motion.div
                key="favorites"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <FavoritesView />
              </motion.div>
            )}
            {view === "history" && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <HistoryView />
              </motion.div>
            )}
            {view === "search" && (
              <motion.div
                key={`search-${searchQuery}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <SearchView query={searchQuery} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
      <Footer />
      <CalculatorModal />
      <KeyboardShortcutsHelp />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Home view — hero + categories + popular
// ---------------------------------------------------------------------------
function HomeView() {
  const lang = usePreferences((s) => s.language);
  const setActiveCategory = useUI((s) => s.setActiveCategory);
  const openCalculator = useUI((s) => s.openCalculator);
  const [query, setQuery] = useState("");
  const setSearchQuery = useUI((s) => s.setSearchQuery);
  const popular = useMemo(() => getPopularCalculators(), []);

  const stats = [
    { label: lang === "ar" ? "حاسبة" : "Calculators", value: `${REGISTRY.length}+` },
    { label: lang === "ar" ? "فئة" : "Categories", value: `${CATEGORIES.length}` },
    { label: lang === "ar" ? "وحدة" : "Conversions", value: "200+" },
    { label: lang === "ar" ? "لغة" : "Languages", value: "2" },
  ];

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) setSearchQuery(query);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-orange-500 p-6 sm:p-10 lg:p-14 mb-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium mb-4">
            <Sparkles className="h-3 w-3" />
            {t(lang, "tagline")}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-3">
            {t(lang, "appName")}
          </h1>
          <p className="text-sm sm:text-base text-white/90 mb-6 max-w-2xl">
            {lang === "ar"
              ? "مئات الحاسبات والمحولات في مكان واحد — للرياضيات والكيمياء والفيزياء والمالية والصحة والمزيد."
              : "Hundreds of calculators and converters in one place — for math, chemistry, physics, finance, health and more."}
          </p>

          {/* Search bar */}
          <form onSubmit={submitSearch} className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t(lang, "searchPlaceholder")}
              className="h-12 sm:h-14 pl-12 pr-24 text-sm sm:text-base bg-white text-foreground border-0 shadow-lg"
            />
            <Button type="submit" className="absolute end-1.5 top-1/2 -translate-y-1/2 h-9 sm:h-11 px-4 sm:px-6">
              {t(lang, "search")}
            </Button>
          </form>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            {stats.map((s) => (
              <div key={s.label} className="bg-white/15 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <div className="text-xl sm:text-2xl font-bold">{s.value}</div>
                <div className="text-[11px] sm:text-xs text-white/80">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories grid */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-500" />
            {t(lang, "categories")}
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {CATEGORIES.map((cat, idx) => {
            const count = REGISTRY.filter((r) => r.calculator.category === cat.id).length;
            return (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.25 }}
                whileHover={{ y: -2 }}
                onClick={() => setActiveCategory(cat.id)}
                className="group relative overflow-hidden rounded-2xl border bg-card p-4 sm:p-5 text-start shadow-sm hover:shadow-md transition"
              >
                <div className={cn("inline-flex rounded-xl bg-gradient-to-br p-3 text-white shadow-md mb-3", cat.color)}>
                  <Icon name={cat.icon} className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base leading-tight mb-1">{cat.names[lang]}</h3>
                <p className="text-[11px] text-muted-foreground line-clamp-2 mb-2">{cat.description[lang]}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground/70 font-medium">{count} {t(lang, "calculators")}</span>
                  {lang === "ar" ? <ArrowLeft className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-foreground transition" /> : <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-foreground transition" />}
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Popular */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-rose-500" />
            {t(lang, "popular")}
          </h2>
          <Button variant="ghost" size="sm" onClick={() => setActiveCategory("basic")} className="text-xs">
            {t(lang, "viewAll")}
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {popular.map((calc, i) => {
            const cat = REGISTRY.find((r) => r.calculator.id === calc.id)?.category;
            if (!cat) return null;
            return <CalculatorCard key={calc.id} calculator={calc} category={cat} index={i} />;
          })}
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Category view
// ---------------------------------------------------------------------------
function CategoryView({ categoryId }: { categoryId: string }) {
  const lang = usePreferences((s) => s.language);
  const setActiveCategory = useUI((s) => s.setActiveCategory);
  const calcs = useMemo(() => getByCategory(categoryId as never), [categoryId]);
  const cat = CATEGORIES.find((c) => c.id === categoryId);

  if (!cat) return null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <Button variant="ghost" size="sm" onClick={() => setActiveCategory(null)} className="mb-4 text-xs">
        {lang === "ar" ? <ArrowRight className="h-3 w-3 me-1 rtl-flip" /> : <ArrowLeft className="h-3 w-3 me-1" />}
        {t(lang, "allCategories")}
      </Button>

      <div className={cn("rounded-2xl bg-gradient-to-br p-6 sm:p-8 mb-6 text-white shadow-lg", cat.color)}>
        <div className="inline-flex rounded-xl bg-white/20 backdrop-blur-sm p-3 mb-3">
          <Icon name={cat.icon} className="h-7 w-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{cat.names[lang]}</h1>
        <p className="text-sm text-white/90">{cat.description[lang]}</p>
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs">
          <Calculator className="h-3 w-3" />
          {calcs.length} {t(lang, "calculators")}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {calcs.map((c, i) => {
          const c2 = REGISTRY.find((r) => r.calculator.id === c.id)?.category;
          if (!c2) return null;
          return <CalculatorCard key={c.id} calculator={c} category={c2} index={i} />;
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Favorites view
// ---------------------------------------------------------------------------
function FavoritesView() {
  const lang = usePreferences((s) => s.language);
  const favorites = useFavorites((s) => s.favorites);
  const setView = useUI((s) => s.setView);

  const favs = favorites
    .map((id) => REGISTRY.find((r) => r.calculator.id === id))
    .filter(Boolean) as typeof REGISTRY;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-6 sm:p-8 mb-6 text-white shadow-lg">
        <div className="inline-flex rounded-xl bg-white/20 backdrop-blur-sm p-3 mb-3">
          <Star className="h-7 w-7 fill-current" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t(lang, "favorites")}</h1>
        <p className="text-sm text-white/90">{favs.length} {t(lang, "calculators")}</p>
      </div>

      {favs.length === 0 ? (
        <EmptyState
          icon="Star"
          title={t(lang, "noFavorites")}
          action={<Button onClick={() => setView("home")} variant="outline">{t(lang, "home")}</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {favs.map(({ calculator, category }, i) => (
            <CalculatorCard key={calculator.id} calculator={calculator} category={category} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// History view
// ---------------------------------------------------------------------------
function HistoryView() {
  const lang = usePreferences((s) => s.language);
  const history = useHistory((s) => s.history);
  const clearHistory = useHistory((s) => s.clear);
  const removeHistory = useHistory((s) => s.remove);
  const openCalculator = useUI((s) => s.openCalculator);
  const setView = useUI((s) => s.setView);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 sm:p-8 mb-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex rounded-xl bg-white/20 backdrop-blur-sm p-3 mb-3">
              <HistoryIcon className="h-7 w-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t(lang, "history")}</h1>
            <p className="text-sm text-white/90">{history.length} {lang === "ar" ? "حساب" : "calculations"}</p>
          </div>
          {history.length > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                if (confirm(lang === "ar" ? "مسح كل السجل؟" : "Clear all history?")) clearHistory();
              }}
              className="bg-white/20 text-white hover:bg-white/30 border-0"
            >
              <Trash2 className="h-3.5 w-3.5 me-1" />
              {t(lang, "clearHistory")}
            </Button>
          )}
        </div>
      </div>

      {history.length === 0 ? (
        <EmptyState
          icon="Clock"
          title={t(lang, "noHistory")}
          action={<Button onClick={() => setView("home")} variant="outline">{t(lang, "home")}</Button>}
        />
      ) : (
        <div className="space-y-2">
          {history.map((h) => {
            const calc = REGISTRY.find((r) => r.calculator.id === h.calcId);
            const cat = calc?.category;
            if (!calc || !cat) return null;
            const date = new Date(h.timestamp);
            return (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-3 sm:p-4 rounded-xl border bg-card hover:bg-accent/50 transition group"
              >
                <div className={cn("rounded-lg bg-gradient-to-br p-2 text-white shrink-0", cat.color)}>
                  <Icon name={calc.calculator.icon} className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{calc.calculator.names[lang]}</div>
                  <div className="text-xs text-muted-foreground font-mono truncate">{h.primaryResult}</div>
                </div>
                <div className="text-[11px] text-muted-foreground/70 hidden sm:block">
                  {date.toLocaleString(lang === "ar" ? "ar-EG" : "en-US", { hour: "2-digit", minute: "2-digit", month: "short", day: "numeric" })}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100"
                  onClick={() => openCalculator(h.calcId)}
                >
                  {lang === "ar" ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive h-7 w-7"
                  onClick={() => removeHistory(h.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Search view
// ---------------------------------------------------------------------------
function SearchView({ query }: { query: string }) {
  const lang = usePreferences((s) => s.language);
  const results = useMemo(() => searchCalculators(query, 100), [query]);
  const setView = useUI((s) => s.setView);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="text-xs text-muted-foreground mb-1">{t(lang, "search")}</div>
        <h1 className="text-xl sm:text-2xl font-bold">
          &ldquo;{query}&rdquo;
          <span className="text-muted-foreground font-normal ms-2 text-sm">· {results.length} {t(lang, "calculators")}</span>
        </h1>
      </div>

      {results.length === 0 ? (
        <EmptyState
          icon="Search"
          title={t(lang, "noResults")}
          action={<Button onClick={() => setView("home")} variant="outline">{t(lang, "home")}</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {results.map(({ calculator, category }, i) => (
            <CalculatorCard key={calculator.id} calculator={calculator} category={category} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------
function EmptyState({ icon, title, action }: { icon: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-2xl bg-muted p-6 mb-4">
        <Icon name={icon} className="h-10 w-10 text-muted-foreground/60" />
      </div>
      <p className="text-sm text-muted-foreground max-w-md mb-4">{title}</p>
      {action}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------
function Footer() {
  const lang = usePreferences((s) => s.language);
  return (
    <footer className="mt-auto border-t bg-card/50 py-6 px-4 sm:px-6 no-print">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-gradient-to-br from-violet-500 to-orange-500 p-1">
            <Calculator className="h-3 w-3 text-white" />
          </div>
          <span className="font-medium text-foreground">{t(lang, "appName")}</span>
          <span className="opacity-50">·</span>
          <span>{t(lang, "footerText")}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Zap className="h-3 w-3 text-emerald-500" />
            {t(lang, "offlineReady")}
          </span>
          <span className="opacity-50">·</span>
          <span>{t(lang, "madeWith")}</span>
        </div>
      </div>
    </footer>
  );
}

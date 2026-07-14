"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Moon, Sun, Menu, X, Calculator,
  Star, History as HistoryIcon, Home, BookOpen, Info, Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePreferences, useUI, useDirection } from "@/store";
import { t } from "@/lib/i18n";
import { searchCalculators, REGISTRY } from "@/lib/registry";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const lang = usePreferences((s) => s.language);
  const toggleLanguage = usePreferences((s) => s.toggleLanguage);
  const dir = useDirection();
  const view = useUI((s) => s.view);
  const setView = useUI((s) => s.setView);
  const searchQuery = useUI((s) => s.searchQuery);
  const setSearchQuery = useUI((s) => s.setSearchQuery);
  const setSidebarOpen = useUI((s) => s.setSidebarOpen);

  const [localQuery, setLocalQuery] = useState("");

  // Memoize search results instead of using setState-in-effect
  const results = useMemo(() => {
    if (!localQuery.trim()) return REGISTRY.slice(0, 8);
    return searchCalculators(localQuery, 12);
  }, [localQuery]);

  // Mark as mounted for theme toggle (one-time)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Keyboard shortcut: "/" or Ctrl+K to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.ctrlKey || e.metaKey)) || (e.key === "/" && document.activeElement?.tagName !== "INPUT")) {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localQuery);
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md no-print">
      <div className="flex h-16 items-center gap-2 px-3 sm:px-6">
        {/* Mobile sidebar toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo */}
        <button
          onClick={() => { setView("home"); setSearchQuery(""); setLocalQuery(""); }}
          className="flex items-center gap-2 px-1 sm:px-2 hover:opacity-80 transition"
          aria-label={t(lang, "appName")}
        >
          <img
            src="/logo.png"
            alt={t(lang, "appName")}
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg object-contain shadow-sm"
          />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-bold text-sm">{t(lang, "appName")}</span>
            <span className="text-[10px] text-muted-foreground">{t(lang, "tagline")}</span>
          </div>
        </button>

        {/* Search trigger (desktop) */}
        <form onSubmit={handleSubmit} className="flex-1 max-w-2xl mx-auto hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              ref={searchInputRef}
              type="search"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
              placeholder={t(lang, "searchPlaceholder")}
              className="pl-9 pr-12 h-10"
              aria-label={t(lang, "search")}
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground border rounded px-1.5 py-0.5 hidden lg:block">
              /
            </kbd>
            <AnimatePresence>
              {searchOpen && results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full mt-2 w-full bg-popover border rounded-xl shadow-xl overflow-hidden z-50 max-h-[70vh] overflow-y-auto"
                >
                  {localQuery.trim() === "" && (
                    <div className="px-3 py-2 text-[11px] text-muted-foreground uppercase tracking-wider border-b bg-muted/30">
                      {t(lang, "popular")} · {t(lang, "smartSuggestions")}
                    </div>
                  )}
                  {results.map(({ calculator: c, category: cat }) => {
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          useUI.getState().openCalculator(c.id);
                          setSearchOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-accent transition text-start"
                      >
                        <div className={cn("rounded-lg bg-gradient-to-br p-2 text-white shrink-0", cat.color)}>
                          <Icon name={c.icon} className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{c.names[lang]}</div>
                          <div className="text-[11px] text-muted-foreground truncate">{c.descriptions[lang]}</div>
                        </div>
                        <span className="text-[10px] text-muted-foreground/70 px-1.5 py-0.5 bg-muted rounded-full shrink-0">
                          {cat.names[lang]}
                        </span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>

        <div className="flex-1 md:hidden" />

        {/* Quick actions */}
        <div className="flex items-center gap-1">
          {/* Mobile search button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSearchOpen(true)}
            aria-label={t(lang, "search")}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Nav shortcuts */}
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={view === "home" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => { setView("home"); setSearchQuery(""); setLocalQuery(""); }}
                  aria-label={t(lang, "home")}
                >
                  <Home className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t(lang, "home")}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={view === "favorites" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setView("favorites")}
                  aria-label={t(lang, "favorites")}
                >
                  <Star className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t(lang, "favorites")}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={view === "history" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setView("history")}
                  aria-label={t(lang, "history")}
                >
                  <HistoryIcon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t(lang, "history")}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Page links */}
          <div className="hidden lg:flex items-center gap-1">
            <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => window.location.href = "/knowledge"}>
              <BookOpen className="h-4 w-4" />
              {lang === "ar" ? "المعرفة" : "Knowledge"}
            </Button>
            <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => window.location.href = "/about"}>
              <Info className="h-4 w-4" />
              {lang === "ar" ? "من نحن" : "About"}
            </Button>
          </div>

          {/* Download App Button */}
          <a href="https://apkpure.com/p/com.osa.calculator" target="_blank" rel="noopener noreferrer" className="hidden sm:block">
            <Button size="sm" className="gap-1.5 h-8">
              <Download className="h-3.5 w-3.5" />
              {lang === "ar" ? "تحميل التطبيق" : "Get App"}
            </Button>
          </a>

          {/* Language toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            aria-label={t(lang, "language")}
            className="font-bold text-xs"
          >
            {lang === "en" ? "ع" : "EN"}
          </Button>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={t(lang, "theme")}
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 top-16 bg-background z-40 p-3"
          >
            <form onSubmit={handleSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                type="search"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder={t(lang, "searchPlaceholder")}
                className="pl-9 pr-10 h-11"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </form>
            <div className="mt-3 max-h-[70vh] overflow-y-auto">
              {results.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">{t(lang, "noResults")}</p>
              ) : (
                results.map(({ calculator: c, category: cat }) => {
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        useUI.getState().openCalculator(c.id);
                        setSearchOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-accent rounded-lg transition text-start"
                    >
                      <div className={cn("rounded-lg bg-gradient-to-br p-2 text-white shrink-0", cat.color)}>
                        <Icon name={c.icon} className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{c.names[lang]}</div>
                        <div className="text-[11px] text-muted-foreground truncate">{c.descriptions[lang]}</div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

"use client";

import { motion } from "framer-motion";
import { Star, ArrowRight, ArrowLeft } from "lucide-react";
import type { Calculator, Category } from "@/lib/types";
import { Icon } from "@/lib/icons";
import { usePreferences, useFavorites, useUI } from "@/store";
import type { Language } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface Props {
  calculator: Calculator;
  category: Category;
  index?: number;
}

export function CalculatorCard({ calculator, category, index = 0 }: Props) {
  const lang = usePreferences((s) => s.language);
  const isFav = useFavorites((s) => s.favorites.includes(calculator.id));
  const toggleFav = useFavorites((s) => s.toggleFavorite);
  const openCalculator = useUI((s) => s.openCalculator);
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.2) }}
      whileHover={{ y: -3 }}
      onClick={() => openCalculator(calculator.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openCalculator(calculator.id); } }}
      className={cn(
        "group relative text-start rounded-xl border bg-card p-4 sm:p-5 cursor-pointer",
        "shadow-sm hover:shadow-md transition-all duration-200",
        "focus-visible:outline-2 focus-visible:outline-ring"
      )}
    >
      {/* Favorite button */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); toggleFav(calculator.id); }}
        className={cn(
          "absolute top-3 end-3 p-1 rounded-md transition",
          isFav ? "text-amber-400 hover:text-amber-500" : "text-muted-foreground/40 hover:text-amber-400 opacity-0 group-hover:opacity-100"
        )}
        aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
      >
        <Star className={cn("h-4 w-4", isFav && "fill-current")} />
      </button>

      <div className={cn("inline-flex rounded-lg bg-gradient-to-br p-2.5 text-white shadow-sm mb-3", category.color)}>
        <Icon name={calculator.icon} className="h-5 w-5" />
      </div>

      <h3 className="font-semibold text-sm sm:text-base leading-snug pe-6 mb-1 line-clamp-2">
        {calculator.names[lang]}
      </h3>
      <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-2 leading-relaxed">
        {calculator.descriptions[lang]}
      </p>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground/80 px-2 py-0.5 bg-muted/60 rounded-full">
          {category.names[lang as Language]}
        </span>
        <Arrow className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition" />
      </div>
    </motion.div>
  );
}

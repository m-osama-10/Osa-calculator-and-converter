"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryLayout } from "@/components/layout/category-layout";
import { CalculatorCard } from "@/components/calculators/calculator-card";
import { HPFBanner468 } from "@/components/ads/hpf-banner-468";
import { usePreferences, useUI } from "@/store";
import { CATEGORIES, REGISTRY, getByCategory } from "@/lib/registry";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Fragment } from "react";

export default function CategoryPage() {
  const params = useParams();
  const lang = usePreferences((s) => s.language);
  const isAr = lang === "ar";
  const setView = useUI((s) => s.setView);
  const setSearchQuery = useUI((s) => s.setSearchQuery);

  const categoryId = params.categoryId as string;
  const cat = CATEGORIES.find((c) => c.id === categoryId);

  // When navigating back to home, ensure the view is set to "home"
  const goHome = () => {
    setView("home");
    setSearchQuery("");
  };

  if (!cat) {
    return (
      <CategoryLayout>
        <div className="p-8 text-center">
          <p className="text-muted-foreground mb-4">{isAr ? "الفئة غير موجودة" : "Category not found"}</p>
          <Link href="/">
            <Button variant="outline" onClick={goHome}>
              {isAr ? "العودة للرئيسية" : "Back to Home"}
            </Button>
          </Link>
        </div>
      </CategoryLayout>
    );
  }

  const calcs = getByCategory(categoryId as never);

  return (
    <CategoryLayout>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <Link href="/" onClick={goHome}>
            <Button
              variant="ghost"
              size="sm"
              className="mb-4 text-xs gap-1"
            >
              {isAr ? <ArrowRight className="h-3 w-3" /> : <ArrowLeft className="h-3 w-3" />}
              {isAr ? "كل الفئات" : "All Categories"}
            </Button>
          </Link>

          {/* Category header */}
          <div className={cn("rounded-2xl bg-gradient-to-br p-6 sm:p-8 mb-6 text-white shadow-lg", cat.color)}>
            <div className="inline-flex rounded-xl bg-white/20 backdrop-blur-sm p-3 mb-3">
              <Icon name={cat.icon} className="h-7 w-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{cat.names[lang]}</h1>
            <p className="text-sm text-white/90">{cat.description[lang]}</p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs">
              <Calculator className="h-3 w-3" />
              {calcs.length} {isAr ? "حاسبة" : "Calculators"}
            </div>
          </div>

          {/* Ad after header */}
          <HPFBanner468 className="mb-6" label="Advertisement" />

          {/* Calculators grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {calcs.map((c, i) => {
              const c2 = REGISTRY.find((r) => r.calculator.id === c.id)?.category;
              if (!c2) return null;
              return (
                <Fragment key={c.id}>
                  <CalculatorCard calculator={c} category={c2} index={i} />
                </Fragment>
              );
            })}
          </div>

          {/* Bottom ad */}
          <HPFBanner468 className="mt-6" label="Advertisement" />
        </div>
      </motion.div>
    </CategoryLayout>
  );
}

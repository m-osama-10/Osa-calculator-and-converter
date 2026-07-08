"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Star, Copy, Share2, Printer, FileText, FileSpreadsheet, Save,
  Check, AlertCircle, RotateCcw, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { useUI, usePreferences, useFavorites, useHistory } from "@/store";
import { getCalculatorById, REGISTRY } from "@/lib/registry";
import { Icon } from "@/lib/icons";
import { t } from "@/lib/i18n";
import type { Calculator, Field, ComputeResult } from "@/lib/types";
import { StandardCalculator, ScientificCalculator } from "@/components/calculators/button-calculators";
import { AdBanner } from "@/components/ads/adsense-ad";
import { cn } from "@/lib/utils";

/** Wrapper that mounts a fresh inner component when the calculator changes. */
export function CalculatorModal() {
  const activeId = useUI((s) => s.activeCalculatorId);
  const closeCalculator = useUI((s) => s.closeCalculator);

  return (
    <AnimatePresence>
      {activeId && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCalculator}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 no-print"
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed inset-0 sm:inset-x-4 sm:top-4 sm:bottom-4 sm:max-w-4xl lg:max-w-5xl sm:mx-auto z-50 flex flex-col bg-background sm:rounded-2xl shadow-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            <ModalInner key={activeId} calcId={activeId} onClose={closeCalculator} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ModalInner({ calcId, onClose }: { calcId: string; onClose: () => void }) {
  const lang = usePreferences((s) => s.language);
  const isFav = useFavorites((s) => s.favorites.includes(calcId));
  const toggleFav = useFavorites((s) => s.toggleFavorite);
  const addHistory = useHistory((s) => s.add);

  const calc = getCalculatorById(calcId);
  const cat = calc ? REGISTRY.find((r) => r.calculator.id === calc.id)?.category : undefined;

  // Initialize defaults ONCE per mount (modal remounts on calc change due to key)
  const [values, setValues] = useState<Record<string, string | number | boolean>>(() => {
    if (!calc) return {};
    const d: Record<string, string | number | boolean> = {};
    for (const f of calc.fields) {
      d[f.key] = f.default ?? (f.type === "boolean" ? false : f.type === "number" ? 0 : "");
    }
    return d;
  });
  const [manualResult, setManualResult] = useState<ComputeResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSteps, setShowSteps] = useState(true);

  // Live computation via useMemo (no setState-in-effect)
  const liveResult = useMemo<ComputeResult | null>(() => {
    if (!calc || !calc.live) return null;
    try {
      return calc.compute(values);
    } catch {
      return { results: [], error: { en: "Compute error", ar: "خطأ في الحساب" } };
    }
  }, [calc, values]);

  const result = calc?.live ? liveResult : manualResult;

  const handleCompute = useCallback(() => {
    if (!calc) return;
    try {
      const r = calc.compute(values);
      setManualResult(r);
      if (r.results.length > 0 && !r.error) {
        const primary = r.results.find((x) => x.primary) ?? r.results[0];
        addHistory({
          calcId: calc.id,
          calcNameEn: calc.names.en,
          calcNameAr: calc.names.ar,
          inputs: { ...values },
          primaryResult: primary.value,
        });
      }
    } catch {
      setManualResult({ results: [], error: { en: "Compute error", ar: "خطأ في الحساب" } });
    }
  }, [calc, values, addHistory]);

  const handleReset = () => {
    if (!calc) return;
    const d: Record<string, string | number | boolean> = {};
    for (const f of calc.fields) {
      d[f.key] = f.default ?? (f.type === "boolean" ? false : f.type === "number" ? 0 : "");
    }
    setValues(d);
    setManualResult(null);
  };

  // Save to history for live calculators too (debounced via effect-equivalent)
  // We'll add to history only when user explicitly wants to — for now skip auto-save for live.

  const handleCopy = async () => {
    if (!result || !calc) return;
    const lines = [
      calc.names[lang],
      ...result.results.map((r) => `${r.label[lang]}: ${r.value}`),
      result.formula ? `Formula: ${result.formula}` : "",
    ].filter(Boolean);
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      toast.success(lang === "ar" ? "تم النسخ" : "Copied to clipboard");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error(lang === "ar" ? "فشل النسخ" : "Copy failed");
    }
  };

  const handleSave = () => {
    if (!result || !calc || result.error) return;
    const primary = result.results.find((x) => x.primary) ?? result.results[0];
    if (!primary) return;
    addHistory({
      calcId: calc.id,
      calcNameEn: calc.names.en,
      calcNameAr: calc.names.ar,
      inputs: { ...values },
      primaryResult: primary.value,
    });
    toast.success(lang === "ar" ? "تم الحفظ في السجل" : "Saved to history");
  };

  const handleShare = async () => {
    if (!result || !calc) return;
    const text = `${calc.names[lang]}: ${result.results.find((r) => r.primary)?.value ?? result.results[0]?.value}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: calc.names[lang], text });
      } catch { /* user cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        toast.success(lang === "ar" ? "تم نسخ النتيجة" : "Result copied — share ready");
      } catch { /* ignore */ }
    }
  };

  const handlePrint = () => { window.print(); };
  const handleExportPdf = () => { window.print(); };

  const handleExportExcel = () => {
    if (!result || !calc) return;
    const rows: string[][] = [];
    rows.push([calc.names[lang]]);
    rows.push(["Field", "Value"]);
    for (const f of calc.fields) {
      rows.push([f.names[lang], String(values[f.key] ?? "")]);
    }
    rows.push([]);
    rows.push(["Result", ""]);
    for (const r of result.results) {
      rows.push([r.label[lang], r.value]);
    }
    if (result.formula) {
      rows.push([]);
      rows.push(["Formula", result.formula]);
    }
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${calc.id}-export.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(lang === "ar" ? "تم تصدير CSV" : "CSV exported");
  };

  if (!calc || !cat) return null;

  // Special-case: button-based calculators (Standard & Scientific) get a custom full-width UI
  if (calc.id === "standard" || calc.id === "scientific") {
    return (
      <>
        {/* Header */}
        <div className="flex items-start gap-3 p-4 sm:p-5 border-b no-print">
          <div className={cn("rounded-xl bg-gradient-to-br p-2.5 text-white shadow-md shrink-0", cat.color)}>
            <Icon name={calc.icon} className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-base sm:text-lg leading-tight">{calc.names[lang]}</h2>
            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{calc.descriptions[lang]}</p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleFav(calc.id)}
              aria-label="Toggle favorite"
              className={isFav ? "text-amber-400" : ""}
            >
              <Star className={cn("h-4 w-4", isFav && "fill-current")} />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Body — full-width button calculator */}
        <ScrollArea className="flex-1">
          <div className="p-4 sm:p-6 max-w-2xl mx-auto">
            {calc.id === "standard" ? (
              <StandardCalculator calcId={calc.id} />
            ) : (
              <ScientificCalculator calcId={calc.id} />
            )}
          </div>
          {/* Ad at bottom of button calculator */}
          <AdBanner className="mx-4 sm:mx-6 mb-4" label="Sponsored" />
        </ScrollArea>
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-start gap-3 p-4 sm:p-5 border-b no-print">
        <div className={cn("rounded-xl bg-gradient-to-br p-2.5 text-white shadow-md shrink-0", cat.color)}>
          <Icon name={calc.icon} className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-base sm:text-lg leading-tight">{calc.names[lang]}</h2>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{calc.descriptions[lang]}</p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleFav(calc.id)}
            aria-label="Toggle favorite"
            className={isFav ? "text-amber-400" : ""}
          >
            <Star className={cn("h-4 w-4", isFav && "fill-current")} />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Body */}
      <ScrollArea className="flex-1">
        <div className="grid lg:grid-cols-2 gap-0 lg:gap-6 p-4 sm:p-6">
          {/* Inputs */}
          <div className="print-area space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-violet-500" />
                {t(lang, "inputs")}
              </h3>
              <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs h-7">
                <RotateCcw className="h-3 w-3 me-1" />
                {t(lang, "reset")}
              </Button>
            </div>
            <div className="space-y-3">
              {calc.fields.map((field) => (
                <FieldRenderer
                  key={field.key}
                  field={field}
                  lang={lang}
                  value={values[field.key]}
                  onChange={(v) => setValues((s) => ({ ...s, [field.key]: v }))}
                />
              ))}
            </div>
            {!calc.live && (
              <Button onClick={handleCompute} className="w-full h-11" size="lg">
                {t(lang, "calculate")}
              </Button>
            )}
            {calc.live && (
              <p className="text-[11px] text-muted-foreground text-center flex items-center justify-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {lang === "ar" ? "حساب مباشر" : "Live calculation"}
              </p>
            )}
          </div>

          {/* Result */}
          <div className="mt-6 lg:mt-0 lg:border-s lg:ps-6 print-area">
            {result?.error ? (
              <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{result.error[lang]}</span>
              </div>
            ) : result && result.results.length > 0 ? (
              <ResultPanel
                result={result}
                lang={lang}
                showSteps={showSteps}
                onToggleSteps={() => setShowSteps((s) => !s)}
                onCopy={handleCopy}
                onSave={handleSave}
                onShare={handleShare}
                onPrint={handlePrint}
                onExportPdf={handleExportPdf}
                onExportExcel={handleExportExcel}
                copied={copied}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center text-muted-foreground">
                <div className="rounded-full bg-muted p-4 mb-3">
                  <Icon name={calc.icon} className="h-6 w-6 opacity-50" />
                </div>
                <p className="text-sm">
                  {calc.live
                    ? (lang === "ar" ? "النتيجة تظهر هنا تلقائيًا" : "Result appears here automatically")
                    : (lang === "ar" ? "اضغط احسب لعرض النتيجة" : "Click Calculate to see the result")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Ad inside modal body */}
        <AdBanner className="mx-4 sm:mx-6 mb-4" label="Sponsored" />
      </ScrollArea>
    </>
  );
}

// ---------------------------------------------------------------------------
// Field renderer
// ---------------------------------------------------------------------------
function FieldRenderer({
  field, lang, value, onChange,
}: {
  field: Field;
  lang: "en" | "ar";
  value: string | number | boolean | undefined;
  onChange: (v: string | number | boolean) => void;
}) {
  const label = (
    <Label htmlFor={`f-${field.key}`} className="text-xs font-medium flex items-center justify-between w-full">
      <span>{field.names[lang]}</span>
      {field.unit && (
        <span className="text-[10px] text-muted-foreground font-normal">{field.unit[lang]}</span>
      )}
    </Label>
  );

  if (field.type === "select") {
    return (
      <div className="space-y-1.5">
        {label}
        <Select value={String(value ?? "")} onValueChange={onChange}>
          <SelectTrigger id={`f-${field.key}`} className="h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label[lang]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (field.type === "boolean") {
    return (
      <div className="flex items-center justify-between py-2 rounded-lg border px-3">
        <Label htmlFor={`f-${field.key}`} className="text-sm">{field.names[lang]}</Label>
        <Switch
          id={`f-${field.key}`}
          checked={Boolean(value)}
          onCheckedChange={onChange}
        />
      </div>
    );
  }

  if (field.type === "date") {
    return (
      <div className="space-y-1.5">
        {label}
        <Input
          id={`f-${field.key}`}
          type="date"
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className="h-10"
        />
        {field.help && <p className="text-[10px] text-muted-foreground">{field.help[lang]}</p>}
      </div>
    );
  }

  if (field.type === "text") {
    return (
      <div className="space-y-1.5">
        {label}
        <Textarea
          id={`f-${field.key}`}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder?.[lang]}
          className="min-h-[80px] font-mono text-sm"
        />
        {field.help && <p className="text-[10px] text-muted-foreground leading-relaxed">{field.help[lang]}</p>}
      </div>
    );
  }

  // number
  return (
    <div className="space-y-1.5">
      {label}
      <Input
        id={`f-${field.key}`}
        type="number"
        value={value === undefined || value === "" ? "" : Number(value)}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
        placeholder={field.placeholder?.[lang]}
        min={field.min}
        max={field.max}
        step={field.step ?? "any"}
        className="h-10"
      />
      {field.help && <p className="text-[10px] text-muted-foreground">{field.help[lang]}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Result panel
// ---------------------------------------------------------------------------
function ResultPanel({
  result, lang, showSteps, onToggleSteps,
  onCopy, onSave, onShare, onPrint, onExportPdf, onExportExcel, copied,
}: {
  result: ComputeResult;
  lang: "en" | "ar";
  showSteps: boolean;
  onToggleSteps: () => void;
  onCopy: () => void;
  onSave: () => void;
  onShare: () => void;
  onPrint: () => void;
  onExportPdf: () => void;
  onExportExcel: () => void;
  copied: boolean;
}) {
  const statusColor: Record<string, string> = {
    good: "text-emerald-600 dark:text-emerald-400",
    warning: "text-amber-600 dark:text-amber-400",
    bad: "text-red-600 dark:text-red-400",
    neutral: "",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {t(lang, "result")}
        </h3>
      </div>

      {/* Results grid */}
      <div className="space-y-2">
        {result.results.map((r, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center justify-between gap-3 px-3 py-2 rounded-lg border",
              r.primary ? "bg-primary/5 border-primary/30" : "bg-muted/40"
            )}
          >
            <span className="text-xs text-muted-foreground">{r.label[lang]}</span>
            <span className={cn(
              "font-mono font-semibold",
              r.primary ? "text-base" : "text-sm",
              statusColor[r.status ?? "neutral"]
            )}>
              {r.value}
              {r.unit && <span className="text-muted-foreground ms-1 font-normal text-xs">{r.unit[lang]}</span>}
            </span>
          </div>
        ))}
      </div>

      {/* Formula */}
      {result.formula && (
        <div className="rounded-lg border bg-muted/30 p-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            {t(lang, "formula")}
          </div>
          <code className="text-xs font-mono break-words whitespace-pre-wrap">{result.formula}</code>
        </div>
      )}

      {/* Steps (collapsible) */}
      {result.steps && result.steps.length > 0 && (
        <Collapsible open={showSteps} onOpenChange={onToggleSteps}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="text-xs h-7 w-full justify-between">
              <span>{t(lang, "steps")} ({result.steps.length})</span>
              <ChevronDown className={cn("h-3 w-3 transition", showSteps && "rotate-180")} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ol className="mt-2 space-y-1.5 list-decimal list-inside text-xs">
              {result.steps.map((s, i) => (
                <li key={i} className="text-muted-foreground">
                  <span className="text-foreground">{s.description[lang]}</span>
                  {s.expression && (
                    <code className="block ms-4 mt-0.5 font-mono text-[11px] bg-muted px-2 py-0.5 rounded">{s.expression}</code>
                  )}
                </li>
              ))}
            </ol>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Explanation */}
      {result.explanation && (
        <div className="rounded-lg border-s-2 border-s-violet-400 bg-violet-50/40 dark:bg-violet-950/20 p-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400 mb-1">
            {t(lang, "explanation")}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{result.explanation[lang]}</p>
        </div>
      )}

      {/* Chart */}
      {result.chart && (
        <div className="rounded-lg border p-3">
          <div className="text-xs font-medium mb-2">{result.chart.title[lang]}</div>
          {result.chart.type === "pie" || result.chart.type === "donut" ? (
            <DonutChart data={result.chart.data} type={result.chart.type} />
          ) : (
            <BarChartMini data={result.chart.data} />
          )}
        </div>
      )}

      <Separator />

      {/* Actions */}
      <div className="space-y-1.5 no-print">
        <Button
          onClick={onSave}
          variant="default"
          size="sm"
          className="w-full h-10 gap-2"
        >
          <Save className="h-4 w-4" />
          {lang === "ar" ? "حفظ في السجل" : "Save to history"}
        </Button>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
          <ActionButton onClick={onCopy} icon={copied ? Check : Copy} label={t(lang, "copy")} />
          <ActionButton onClick={onShare} icon={Share2} label={t(lang, "share")} />
          <ActionButton onClick={onPrint} icon={Printer} label={t(lang, "print")} />
          <ActionButton onClick={onExportPdf} icon={FileText} label={t(lang, "exportPdf")} />
          <ActionButton onClick={onExportExcel} icon={FileSpreadsheet} label={t(lang, "exportExcel")} />
        </div>
      </div>
    </div>
  );
}

function ActionButton({ onClick, icon: IconCmp, label }: { onClick: () => void; icon: typeof Copy; label: string }) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="flex flex-col items-center gap-0.5 h-14 px-1 text-[10px] font-medium"
    >
      <IconCmp className="h-4 w-4" />
      <span className="truncate w-full text-center">{label}</span>
    </Button>
  );
}

// ---------------------------------------------------------------------------
// Simple charts (pure SVG, no external deps)
// ---------------------------------------------------------------------------
function DonutChart({ data, type }: { data: Array<{ label: string; value: number; color?: string }>; type: "pie" | "donut" }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total <= 0) return null;
  // Pre-compute slice arcs functionally (no mutation during render)
  const radius = 60;
  const innerR = type === "donut" ? 35 : 0;
  const slices = data.reduce<Array<{ label: string; value: number; color?: string; startPct: number; endPct: number }>>(
    (acc, d, _i, _arr) => {
      const prevEnd = acc.length > 0 ? acc[acc.length - 1].endPct : 0;
      const startPct = prevEnd;
      const endPct = startPct + d.value / total;
      return [...acc, { ...d, startPct, endPct }];
    },
    []
  );
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <svg width="140" height="140" viewBox="0 0 140 140" className="shrink-0">
        {slices.map((d, i) => {
          const startAngle = d.startPct * 2 * Math.PI - Math.PI / 2;
          const endAngle = d.endPct * 2 * Math.PI - Math.PI / 2;
          const x1 = 70 + radius * Math.cos(startAngle);
          const y1 = 70 + radius * Math.sin(startAngle);
          const x2 = 70 + radius * Math.cos(endAngle);
          const y2 = 70 + radius * Math.sin(endAngle);
          const xi1 = 70 + innerR * Math.cos(endAngle);
          const yi1 = 70 + innerR * Math.sin(endAngle);
          const xi2 = 70 + innerR * Math.cos(startAngle);
          const yi2 = 70 + innerR * Math.sin(startAngle);
          const large = (d.endPct - d.startPct) > 0.5 ? 1 : 0;
          const path = innerR
            ? `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2} L ${xi1} ${yi1} A ${innerR} ${innerR} 0 ${large} 0 ${xi2} ${yi2} Z`
            : `M 70 70 L ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2} Z`;
          return <path key={i} d={path} fill={d.color ?? `hsl(${i * 60}, 60%, 50%)`} />;
        })}
        {type === "donut" && (
          <text x="70" y="74" textAnchor="middle" className="fill-foreground font-bold text-sm">
            {total.toLocaleString()}
          </text>
        )}
      </svg>
      <div className="space-y-1 text-xs">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm" style={{ background: d.color ?? `hsl(${i * 60}, 60%, 50%)` }} />
            <span className="text-muted-foreground">{d.label}</span>
            <span className="font-mono font-semibold">{d.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarChartMini({ data }: { data: Array<{ label: string; value: number; color?: string }> }) {
  const max = Math.max(...data.map((d) => Math.abs(d.value)), 1);
  return (
    <div className="space-y-2">
      {data.map((d, i) => (
        <div key={i} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">{d.label}</span>
            <span className="font-mono font-semibold">{d.value.toLocaleString()}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(Math.abs(d.value) / max) * 100}%` }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="h-full rounded-full"
              style={{ background: d.color ?? `hsl(${i * 60}, 60%, 50%)` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// Re-export Calculator type for convenience (suppress unused warning)
void (null as unknown as Calculator);

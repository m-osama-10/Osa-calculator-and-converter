"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { usePreferences, useFavorites, useHistory } from "@/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Math helpers
// ---------------------------------------------------------------------------
function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

/** Evaluate a calculator expression string. Supports +, -, *, /, ^, %, (), functions, constants. */
function evalExpr(expr: string, degMode: boolean): number {
  if (!expr.trim()) return NaN;
  let s = expr
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/√/g, "Math.sqrt")
    .replace(/π/g, String(Math.PI))
    .replace(/\be\b/g, String(Math.E))
    .replace(/\^/g, "**");

  // Percentage: number followed by % → number / 100
  s = s.replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");

  // Factorial: number! → factorial(number)
  s = s.replace(/(\d+(?:\.\d+)?)!/g, (_, n) => String(factorial(Number(n))));

  // Trig functions — convert degrees to radians if in degree mode
  const toRad = degMode ? "(Math.PI/180)*" : "";
  const fromRad = degMode ? "(180/Math.PI)*" : "";
  s = s
    .replace(/\bsin\(/g, `Math.sin(${toRad}`)
    .replace(/\bcos\(/g, `Math.cos(${toRad}`)
    .replace(/\btan\(/g, `Math.tan(${toRad}`)
    .replace(/\basin\(/g, `${fromRad}Math.asin(`)
    .replace(/\bacos\(/g, `${fromRad}Math.acos(`)
    .replace(/\batan\(/g, `${fromRad}Math.atan(`)
    .replace(/\blog\(/g, "Math.log10(")
    .replace(/\bln\(/g, "Math.log(")
    .replace(/\bexp\(/g, "Math.exp(")
    .replace(/\babs\(/g, "Math.abs(");

  // Safety check: allow digits, operators, parens, decimal, comma, letters (for Math.xxx), dot, spaces
  if (!/^[\d+\-*/().\s,a-zA-Z]+$/.test(s)) return NaN;

  try {
    const fn = new Function(`"use strict"; return (${s});`);
    const v = fn();
    return typeof v === "number" ? v : NaN;
  } catch {
    return NaN;
  }
}

function formatNum(n: number): string {
  if (!Number.isFinite(n)) return "Error";
  if (Number.isInteger(n) && Math.abs(n) < 1e15) return n.toString();
  // Use up to 10 significant digits, trim trailing zeros
  const str = n.toPrecision(12).replace(/\.?0+$/, "");
  // Handle very large/small numbers with scientific notation
  const abs = Math.abs(n);
  if (abs !== 0 && (abs >= 1e15 || abs < 1e-6)) {
    return n.toExponential(6);
  }
  return str;
}

// ---------------------------------------------------------------------------
// Standard Calculator (button-based)
// ---------------------------------------------------------------------------
export function StandardCalculator({ calcId }: { calcId: string }) {
  const lang = usePreferences((s) => s.language);
  const isFav = useFavorites((s) => s.favorites.includes(calcId));
  const toggleFav = useFavorites((s) => s.toggleFavorite);
  const addHistory = useHistory((s) => s.add);

  const [expr, setExpr] = useState("");          // current expression being typed
  const [history, setHistory] = useState<string[]>([]);
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [error, setError] = useState(false);
  const displayRef = useRef<HTMLDivElement>(null);

  // Derived display + preview result (no setState-in-effect)
  const { display, result } = useMemo(() => {
    if (error) return { display: "Error", result: "" };
    if (!expr) return { display: "0", result: "" };
    const v = evalExpr(expr, false);
    const r = Number.isFinite(v) && String(v) !== expr ? formatNum(v) : "";
    return { display: expr, result: r };
  }, [expr, error]);

  // Auto-scroll display to the end
  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.scrollLeft = displayRef.current.scrollWidth;
    }
  }, [display]);

  const input = useCallback((token: string) => {
    setJustEvaluated(false);
    setError(false);
    setExpr((prev) => {
      // If we just evaluated and user types a digit, start fresh
      if (justEvaluated && /[0-9.]/.test(token)) return token;
      // If we just evaluated and user types an operator, continue from result
      if (justEvaluated && /[+\-*/^%]/.test(token) && result) {
        return result + token;
      }
      return prev + token;
    });
  }, [justEvaluated, result]);

  const clearAll = useCallback(() => {
    setExpr("");
    setError(false);
    setJustEvaluated(false);
  }, []);

  const backspace = useCallback(() => {
    setJustEvaluated(false);
    setError(false);
    setExpr((prev) => prev.slice(0, -1));
  }, []);

  const equals = useCallback(() => {
    if (!expr) return;
    const v = evalExpr(expr, false);
    if (!Number.isFinite(v)) {
      setError(true);
      return;
    }
    const formatted = formatNum(v);
    const entry = `${expr} = ${formatted}`;
    setHistory((h) => [entry, ...h].slice(0, 30));
    setExpr(formatted);
    setJustEvaluated(true);
    // Save to app history
    addHistory({
      calcId,
      calcNameEn: "Standard Calculator",
      calcNameAr: "حاسبة قياسية",
      inputs: { expr },
      primaryResult: formatted,
    });
  }, [expr, calcId, addHistory]);

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const k = e.key;
      if (/[0-9.]/.test(k)) { input(k); e.preventDefault(); }
      else if (k === "+" || k === "-") { input(k); e.preventDefault(); }
      else if (k === "*") { input("×"); e.preventDefault(); }
      else if (k === "/") { input("÷"); e.preventDefault(); }
      else if (k === "^") { input("^"); e.preventDefault(); }
      else if (k === "%") { input("%"); e.preventDefault(); }
      else if (k === "(" || k === ")") { input(k); e.preventDefault(); }
      else if (k === "Enter" || k === "=") { equals(); e.preventDefault(); }
      else if (k === "Backspace") { backspace(); e.preventDefault(); }
      else if (k === "Escape") { clearAll(); e.preventDefault(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [input, equals, backspace, clearAll]);

  const buttons: Array<{ label: string; onClick: () => void; variant?: "default" | "op" | "fn" | "eq" | "danger" }> = [
    { label: lang === "ar" ? "مسح" : "AC", onClick: clearAll, variant: "danger" },
    { label: "(", onClick: () => input("("), variant: "fn" },
    { label: ")", onClick: () => input(")"), variant: "fn" },
    { label: "÷", onClick: () => input("÷"), variant: "op" },

    { label: "7", onClick: () => input("7") },
    { label: "8", onClick: () => input("8") },
    { label: "9", onClick: () => input("9") },
    { label: "×", onClick: () => input("×"), variant: "op" },

    { label: "4", onClick: () => input("4") },
    { label: "5", onClick: () => input("5") },
    { label: "6", onClick: () => input("6") },
    { label: "−", onClick: () => input("-"), variant: "op" },

    { label: "1", onClick: () => input("1") },
    { label: "2", onClick: () => input("2") },
    { label: "3", onClick: () => input("3") },
    { label: "+", onClick: () => input("+"), variant: "op" },

    { label: "0", onClick: () => input("0") },
    { label: ".", onClick: () => input(".") },
    { label: "%", onClick: () => input("%"), variant: "fn" },
    { label: "=", onClick: equals, variant: "eq" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Display */}
      <div className="bg-muted/50 rounded-xl p-4 mb-3 border">
        <div
          ref={displayRef}
          className="text-end text-2xl sm:text-3xl font-mono font-bold overflow-x-auto whitespace-nowrap"
          dir="ltr"
        >
          {display}
        </div>
        {result && (
          <div className="text-end text-sm text-muted-foreground font-mono mt-1" dir="ltr">
            = {result}
          </div>
        )}
      </div>

      {/* History strip */}
      {history.length > 0 && (
        <div className="mb-3 max-h-24 overflow-y-auto rounded-lg border bg-muted/30 p-2 text-xs font-mono space-y-1" dir="ltr">
          {history.map((h, i) => (
            <div key={i} className="text-muted-foreground text-end">{h}</div>
          ))}
        </div>
      )}

      {/* Buttons grid */}
      <div className="grid grid-cols-4 gap-2 flex-1">
        {buttons.map((b, i) => (
          <CalculatorButton key={i} label={b.label} onClick={b.onClick} variant={b.variant} />
        ))}
      </div>

      {/* Favorite toggle (small) */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleFav(calcId)}
          className="text-xs gap-1.5"
        >
          <Star className={cn("h-3.5 w-3.5", isFav && "fill-amber-400 text-amber-400")} />
          {isFav ? (lang === "ar" ? "في المفضلة" : "Favorited") : (lang === "ar" ? "أضف للمفضلة" : "Add to favorites")}
        </Button>
        <span className="text-[10px] text-muted-foreground">
          {lang === "ar" ? "يدعم لوحة المفاتيح" : "Keyboard supported"}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Scientific Calculator (button-based with scientific functions + memory)
// ---------------------------------------------------------------------------
export function ScientificCalculator({ calcId }: { calcId: string }) {
  const lang = usePreferences((s) => s.language);
  const isFav = useFavorites((s) => s.favorites.includes(calcId));
  const toggleFav = useFavorites((s) => s.toggleFavorite);
  const addHistory = useHistory((s) => s.add);

  const [expr, setExpr] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [degMode, setDegMode] = useState(true);
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [memory, setMemory] = useState(0);
  const [error, setError] = useState(false);
  const displayRef = useRef<HTMLDivElement>(null);

  // Derived display + preview result (no setState-in-effect)
  const { display, result } = useMemo(() => {
    if (error) return { display: "Error", result: "" };
    if (!expr) return { display: "0", result: "" };
    const v = evalExpr(expr, degMode);
    const r = Number.isFinite(v) && String(v) !== expr ? formatNum(v) : "";
    return { display: expr, result: r };
  }, [expr, degMode, error]);

  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.scrollLeft = displayRef.current.scrollWidth;
    }
  }, [display]);

  const input = useCallback((token: string) => {
    setJustEvaluated(false);
    setError(false);
    setExpr((prev) => {
      if (justEvaluated && /[0-9.]/.test(token)) return token;
      if (justEvaluated && /[+\-*/^%]/.test(token) && result) return result + token;
      return prev + token;
    });
  }, [justEvaluated, result]);

  const inputFn = useCallback((fn: string) => {
    setJustEvaluated(false);
    setError(false);
    setExpr((prev) => prev + fn + "(");
  }, []);

  const clearAll = useCallback(() => {
    setExpr("");
    setError(false);
    setJustEvaluated(false);
  }, []);

  const backspace = useCallback(() => {
    setJustEvaluated(false);
    setError(false);
    setExpr((prev) => {
      // Remove function names entirely (e.g., "sin" → "")
      const match = prev.match(/(sin|cos|tan|asin|acos|atan|log|ln|exp|abs|sqrt)$/i);
      if (match) return prev.slice(0, -match[0].length);
      return prev.slice(0, -1);
    });
  }, []);

  const equals = useCallback(() => {
    if (!expr) return;
    const v = evalExpr(expr, degMode);
    if (!Number.isFinite(v)) {
      setError(true);
      return;
    }
    const formatted = formatNum(v);
    const entry = `${expr} = ${formatted}`;
    setHistory((h) => [entry, ...h].slice(0, 30));
    setExpr(formatted);
    setJustEvaluated(true);
    addHistory({
      calcId,
      calcNameEn: "Scientific Calculator",
      calcNameAr: "حاسبة علمية",
      inputs: { expr, degMode },
      primaryResult: formatted,
    });
  }, [expr, degMode, calcId, addHistory]);

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const k = e.key;
      if (/[0-9.]/.test(k)) { input(k); e.preventDefault(); }
      else if (k === "+" || k === "-") { input(k); e.preventDefault(); }
      else if (k === "*") { input("×"); e.preventDefault(); }
      else if (k === "/") { input("÷"); e.preventDefault(); }
      else if (k === "^") { input("^"); e.preventDefault(); }
      else if (k === "%") { input("%"); e.preventDefault(); }
      else if (k === "(" || k === ")") { input(k); e.preventDefault(); }
      else if (k === "Enter" || k === "=") { equals(); e.preventDefault(); }
      else if (k === "Backspace") { backspace(); e.preventDefault(); }
      else if (k === "Escape") { clearAll(); e.preventDefault(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [input, equals, backspace, clearAll]);

  // Memory operations
  const memClear = () => { setMemory(0); toast.info(lang === "ar" ? "تم مسح الذاكرة" : "Memory cleared"); };
  const memRecall = () => { input(formatNum(memory)); };
  const memAdd = () => {
    const v = evalExpr(expr, degMode);
    if (Number.isFinite(v)) { setMemory((m) => m + v); toast.success(lang === "ar" ? "أُضيف للذاكرة" : "Added to memory"); }
  };
  const memSub = () => {
    const v = evalExpr(expr, degMode);
    if (Number.isFinite(v)) { setMemory((m) => m - v); toast.success(lang === "ar" ? "حُذف من الذاكرة" : "Subtracted from memory"); }
  };
  const memStore = () => {
    const v = evalExpr(expr, degMode);
    if (Number.isFinite(v)) { setMemory(v); toast.success(lang === "ar" ? "حُفظ في الذاكرة" : "Stored in memory"); }
  };

  // Button layout — scientific functions on top, then memory, then standard keypad
  const sciButtons: Array<{ label: string; onClick: () => void; variant?: "default" | "op" | "fn" | "eq" | "danger" | "mem" }> = [
    { label: "sin", onClick: () => inputFn("sin"), variant: "fn" },
    { label: "cos", onClick: () => inputFn("cos"), variant: "fn" },
    { label: "tan", onClick: () => inputFn("tan"), variant: "fn" },
    { label: "π", onClick: () => input("π"), variant: "fn" },
    { label: "e", onClick: () => input("e"), variant: "fn" },
    { label: "x²", onClick: () => input("^2"), variant: "fn" },
    { label: "xʸ", onClick: () => input("^"), variant: "fn" },
    { label: "√", onClick: () => inputFn("sqrt"), variant: "fn" },
    { label: "log", onClick: () => inputFn("log"), variant: "fn" },
    { label: "ln", onClick: () => inputFn("ln"), variant: "fn" },
    { label: "exp", onClick: () => inputFn("exp"), variant: "fn" },
    { label: "n!", onClick: () => input("!"), variant: "fn" },
  ];

  const memButtons: Array<{ label: string; onClick: () => void }> = [
    { label: "MC", onClick: memClear },
    { label: "MR", onClick: memRecall },
    { label: "M+", onClick: memAdd },
    { label: "M−", onClick: memSub },
    { label: "MS", onClick: memStore },
  ];

  const mainButtons: Array<{ label: string; onClick: () => void; variant?: "default" | "op" | "fn" | "eq" | "danger" }> = [
    { label: "AC", onClick: clearAll, variant: "danger" },
    { label: "⌫", onClick: backspace, variant: "fn" },
    { label: "(", onClick: () => input("("), variant: "fn" },
    { label: ")", onClick: () => input(")"), variant: "fn" },
    { label: "÷", onClick: () => input("÷"), variant: "op" },

    { label: "7", onClick: () => input("7") },
    { label: "8", onClick: () => input("8") },
    { label: "9", onClick: () => input("9") },
    { label: "×", onClick: () => input("×"), variant: "op" },

    { label: "4", onClick: () => input("4") },
    { label: "5", onClick: () => input("5") },
    { label: "6", onClick: () => input("6") },
    { label: "−", onClick: () => input("-"), variant: "op" },

    { label: "1", onClick: () => input("1") },
    { label: "2", onClick: () => input("2") },
    { label: "3", onClick: () => input("3") },
    { label: "+", onClick: () => input("+"), variant: "op" },

    { label: "0", onClick: () => input("0") },
    { label: ".", onClick: () => input(".") },
    { label: "%", onClick: () => input("%"), variant: "fn" },
    { label: "=", onClick: equals, variant: "eq" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Mode toggle: DEG/RAD */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="deg-mode" className="text-xs font-mono">DEG</Label>
          <Switch id="deg-mode" checked={degMode} onCheckedChange={setDegMode} />
          <Label htmlFor="deg-mode" className="text-xs font-mono">RAD</Label>
        </div>
        {memory !== 0 && (
          <span className="text-[10px] text-amber-500 font-mono">M = {formatNum(memory)}</span>
        )}
      </div>

      {/* Display */}
      <div className="bg-muted/50 rounded-xl p-4 mb-3 border">
        <div
          ref={displayRef}
          className="text-end text-xl sm:text-2xl font-mono font-bold overflow-x-auto whitespace-nowrap"
          dir="ltr"
        >
          {display}
        </div>
        {result && (
          <div className="text-end text-sm text-muted-foreground font-mono mt-1" dir="ltr">
            = {result}
          </div>
        )}
      </div>

      {/* History strip */}
      {history.length > 0 && (
        <div className="mb-3 max-h-20 overflow-y-auto rounded-lg border bg-muted/30 p-2 text-xs font-mono space-y-1" dir="ltr">
          {history.map((h, i) => (
            <div key={i} className="text-muted-foreground text-end">{h}</div>
          ))}
        </div>
      )}

      {/* Scientific functions */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 mb-2">
        {sciButtons.map((b, i) => (
          <CalculatorButton key={i} label={b.label} onClick={b.onClick} variant={b.variant} size="sm" />
        ))}
      </div>

      {/* Memory buttons */}
      <div className="grid grid-cols-5 gap-1.5 mb-2">
        {memButtons.map((b, i) => (
          <CalculatorButton key={i} label={b.label} onClick={b.onClick} variant="mem" size="sm" />
        ))}
      </div>

      {/* Main keypad */}
      <div className="grid grid-cols-4 gap-2 flex-1">
        {mainButtons.map((b, i) => (
          <CalculatorButton key={i} label={b.label} onClick={b.onClick} variant={b.variant} />
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleFav(calcId)}
          className="text-xs gap-1.5"
        >
          <Star className={cn("h-3.5 w-3.5", isFav && "fill-amber-400 text-amber-400")} />
          {isFav ? (lang === "ar" ? "في المفضلة" : "Favorited") : (lang === "ar" ? "أضف للمفضلة" : "Add to favorites")}
        </Button>
        <span className="text-[10px] text-muted-foreground">
          {lang === "ar" ? "يدعم لوحة المفاتيح" : "Keyboard supported"}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Calculator button component
// ---------------------------------------------------------------------------
function CalculatorButton({
  label, onClick, variant = "default", size = "default",
}: {
  label: string;
  onClick: () => void;
  variant?: "default" | "op" | "fn" | "eq" | "danger" | "mem";
  size?: "default" | "sm";
}) {
  const variants: Record<string, string> = {
    default: "bg-card hover:bg-accent border text-foreground",
    op: "bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/30 text-violet-600 dark:text-violet-400 font-semibold",
    fn: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30 text-blue-600 dark:text-blue-400 font-medium",
    eq: "bg-emerald-500 hover:bg-emerald-600 border-emerald-600 text-white font-bold",
    danger: "bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-600 dark:text-red-400 font-semibold",
    mem: "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-600 dark:text-amber-400 font-medium text-xs",
  };
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "rounded-lg border font-mono transition-colors select-none",
        "flex items-center justify-center",
        size === "sm" ? "h-10 text-xs sm:text-sm" : "h-14 text-base sm:text-lg",
        variants[variant]
      )}
    >
      {label}
    </motion.button>
  );
}

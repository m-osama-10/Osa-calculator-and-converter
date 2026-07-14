"use client";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { CalculatorModal } from "@/components/calculators/calculator-modal";
import { KeyboardShortcutsHelp } from "@/components/layout/keyboard-shortcuts";
import { HPFBanner } from "@/components/ads/hpf-banner";
import { useUI } from "@/store";

/**
 * Shared layout for category pages — includes header, sidebar, footer,
 * calculator modal, and keyboard shortcuts — same as the home page.
 */
export function CategoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      {/* Top banner ad */}
      <div className="border-b bg-muted/10 px-3 sm:px-6 py-1 no-print">
        <HPFBanner className="my-0" label="Advertisement" />
      </div>
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
      <CategoryFooter />
      <CalculatorModal />
      <KeyboardShortcutsHelp />
    </div>
  );
}

function CategoryFooter() {
  return (
    <footer className="mt-auto border-t bg-card/50 py-6 px-4 sm:px-6 no-print">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-4 mb-4 text-xs">
          <a href="/" className="text-muted-foreground hover:text-foreground transition">Home</a>
          <a href="/about" className="text-muted-foreground hover:text-foreground transition">About</a>
          <a href="/knowledge" className="text-muted-foreground hover:text-foreground transition">Knowledge Center</a>
          <a href="/privacy" className="text-muted-foreground hover:text-foreground transition">Privacy Policy</a>
          <a href="https://apkpure.com/p/com.osa.calculator" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition flex items-center gap-1">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M14.5 3.5a2 2 0 0 1 2 2v.5l1-.5a1.5 1.5 0 0 1 1.5 2.6L18 9l1 .6a1.5 1.5 0 0 1-1.5 2.6l-1-.5v.3a2 2 0 0 1-2 2H10a4 4 0 0 1-4-4V7.5a4 4 0 0 1 4-4h4.5zM5 8v6a5 5 0 0 0 5 5h6a1 1 0 0 1 0 2H10a7 7 0 0 1-7-7V8a1 1 0 0 1 2 0z"/></svg>
            Download App
          </a>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="h-6 w-6 rounded object-contain" />
            <span className="font-medium text-foreground">Zoma Calculator and OSA Converter</span>
          </div>
          <span>Developed by M.Osama</span>
        </div>
      </div>
    </footer>
  );
}

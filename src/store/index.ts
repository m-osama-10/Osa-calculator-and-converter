"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Language } from "@/lib/i18n";
import { LANGUAGE_DIRECTION } from "@/lib/i18n";

// ============================================================================
// Preferences Store — language, theme
// ============================================================================
interface PreferencesState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const usePreferences = create<PreferencesState>()(
  persist(
    (set, get) => ({
      language: "en",
      setLanguage: (lang) => set({ language: lang }),
      toggleLanguage: () => set({ language: get().language === "en" ? "ar" : "en" }),
    }),
    {
      name: "uch-prefs",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ============================================================================
// Favorites Store
// ============================================================================
interface FavoritesState {
  favorites: string[]; // calculator ids
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clear: () => void;
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (id) =>
        set((s) => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter((f) => f !== id)
            : [...s.favorites, id],
        })),
      isFavorite: (id) => get().favorites.includes(id),
      clear: () => set({ favorites: [] }),
    }),
    {
      name: "uch-favorites",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ============================================================================
// History Store — last 50 calculations
// ============================================================================
export interface HistoryEntry {
  id: string;            // unique history id (uuid)
  calcId: string;        // calculator id
  calcNameEn: string;
  calcNameAr: string;
  inputs: Record<string, string | number | boolean>;
  primaryResult: string;
  timestamp: number;
}

interface HistoryState {
  history: HistoryEntry[];
  add: (entry: Omit<HistoryEntry, "id" | "timestamp">) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useHistory = create<HistoryState>()(
  persist(
    (set) => ({
      history: [],
      add: (entry) =>
        set((s) => {
          const newEntry: HistoryEntry = {
            ...entry,
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            timestamp: Date.now(),
          };
          return { history: [newEntry, ...s.history].slice(0, 50) };
        }),
      remove: (id) => set((s) => ({ history: s.history.filter((h) => h.id !== id) })),
      clear: () => set({ history: [] }),
    }),
    {
      name: "uch-history",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ============================================================================
// UI Store — current view, active category, search query, active calculator
// ============================================================================
export type View = "home" | "category" | "favorites" | "history" | "search";

interface UIState {
  view: View;
  activeCategoryId: string | null;
  searchQuery: string;
  activeCalculatorId: string | null; // opens calculator modal
  sidebarOpen: boolean;
  setView: (v: View) => void;
  setActiveCategory: (id: string | null) => void;
  setSearchQuery: (q: string) => void;
  openCalculator: (id: string) => void;
  closeCalculator: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUI = create<UIState>((set) => ({
  view: "home",
  activeCategoryId: null,
  searchQuery: "",
  activeCalculatorId: null,
  sidebarOpen: false,
  setView: (v) => set({ view: v, activeCategoryId: v === "category" ? null : null }),
  setActiveCategory: (id) => set({ activeCategoryId: id, view: "category" }),
  setSearchQuery: (q) => set({ searchQuery: q, view: q ? "search" : "home" }),
  openCalculator: (id) => set({ activeCalculatorId: id }),
  closeCalculator: () => set({ activeCalculatorId: null }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));

// Convenience hook to get current direction based on language
export function useDirection(): "ltr" | "rtl" {
  const lang = usePreferences((s) => s.language);
  return LANGUAGE_DIRECTION[lang];
}

# 🧮 Zoma Calculator and OSA Converter

> **منصة شاملة لحاسبات ومحولات متعددة الأغراض — 150+ حاسبة في 19 فئة**

A comprehensive, bilingual (Arabic/English) all-in-one calculator and conversion platform built as a modern PWA. Features 150+ calculators across 19 categories including math, chemistry, physics, biology, finance, health, agriculture, engineering, and more — with full RTL support and offline capability.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Categories](#categories)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Adding New Calculators](#adding-new-calculators)
- [Deployment](#deployment)
- [License](#license)

---

## 🌟 Overview

**Zoma Calculator and OSA Converter** is a production-ready Next.js 16 web application that provides hundreds of calculators and unit converters in a single, beautiful, responsive interface. It's designed to be the only calculator tool you'll ever need — whether you're a student, engineer, scientist, farmer, or just someone who needs to do quick calculations.

The app is fully bilingual (Arabic/English) with automatic RTL/LTR direction switching, works offline as a PWA, and includes a modular architecture where adding a new calculator requires zero UI code — just register a new entry in the registry.

---

## ✨ Features

### Core Features
- 🌐 **Bilingual** — Full Arabic & English support with automatic RTL/LTR switching
- 🌓 **Dark/Light Mode** — System-aware theme with manual toggle
- 🔍 **Instant Search** — Smart fuzzy search across all 150+ calculators with keyboard shortcut (`/` or `Ctrl+K`)
- ⭐ **Favorites** — Star any calculator for quick access
- 📜 **History** — Last 50 calculations saved locally
- 📤 **Export** — Copy, Share, Print, Export PDF, Export Excel (CSV)
- 💾 **Save Results** — Save any calculation to history
- 📱 **PWA** — Installable, works offline with service worker
- ⌨️ **Keyboard Shortcuts** — Full keyboard support (`?` for help)
- ♿ **Accessible** — ARIA labels, semantic HTML, focus management
- 🔒 **Local Storage** — All data stays on your device

### Calculator Features
- ✅ Input validation with error handling
- ✅ Formula display for every calculation
- ✅ Step-by-step calculation breakdown
- ✅ Explanation of the method
- ✅ Live calculation (auto-update as you type)
- ✅ Responsive charts (pie, donut, bar) — pure SVG, no dependencies
- ✅ Status indicators (good/warning/bad) for health/finance results
- ✅ Copyable formulas and results

### Button-Based Calculators
- 🖩 **Standard Calculator** — Full numeric keypad with +, −, ×, ÷, %, parentheses, live preview, history, keyboard support
- 🔬 **Scientific Calculator** — sin/cos/tan, log/ln, √, x², xʸ, π, e, n!, DEG/RAD, memory (MC/MR/M+/M−/MS), calculation history

---

## 📂 Categories (19 categories, 150+ calculators)

| # | Category | Count | Description |
|---|----------|-------|-------------|
| 1 | **Basic Calculators** | 6 | Standard, Scientific (button-based), Programmer, Percentage, Fraction, Equation Solver |
| 2 | **Unit Converters** | 30 | Length, Weight, Area, Volume, Temperature, Time, Speed, Data Storage, Pressure, Energy, Power, Angle, Frequency, Force, Torque, Acceleration, Density, Fuel, Flow Rate, Internet Speed, Concentration, Light, Sound, Radiation, Viscosity, Magnetic, Electric Charge, Currency (50+ currencies) |
| 3 | **Chemistry** | 16 | Molar Mass (with compound info card), Molarity, Molality, Moles, pH, Dilution, Ideal Gas, Buffer (Henderson-Hasselbalch), Normality, Boyle's Law, Combined Gas Law, Osmolarity, Percent Yield, Atomic Mass Lookup, Stoichiometry, Periodic Table (all 118 elements) |
| 4 | **Physics** | 13 | Velocity, Acceleration, Force, Kinetic/Potential Energy, Momentum, Projectile Motion, Gravitation, Ohm's Law, Electrical Power, Work, Density, Wave Speed |
| 5 | **Mathematics** | 10 | Triangle (Heron), Circle, Rectangle, Trigonometry, Statistics (mean/median/mode/std dev), Matrix Determinant, Complex Numbers, Logarithm, GCD/LCM, Combinations/Permutations |
| 6 | **Health & Fitness** | 9 | BMI, BMR, Body Fat (Navy), Water Intake, Ideal Weight, Calories Burned, Macro, Heart Rate Zones, Pregnancy Due Date |
| 7 | **Nutrition** | 3 | Glycemic Load, Daily Calories (TDEE), Protein Intake |
| 8 | **Finance** | 10 | Loan/EMI, Compound Interest, Simple Interest, ROI, VAT, Discount, Profit Margin, Savings Goal, Tip, Mortgage |
| 9 | **Engineering** | 4 | Electrical Power, Pipe Flow, Stress/Strain, Reynolds Number |
| 10 | **Laboratory Tools** | 4 | Serial Dilution, Solution Preparation, Reagent Volume, Glucose Unit Converter |
| 11 | **Computer** | 5 | IP Subnet, Number Base, Download Time, Color (RGB↔HEX), Password Generator |
| 12 | **Date & Time** | 4 | Age, Date Difference, Business Days, Countdown |
| 13 | **Construction** | 4 | Concrete Volume, Bricks, Paint, Tiles |
| 14 | **Everyday** | 4 | Fuel Cost, Electricity Bill, Split Bill, Travel Cost |
| 15 | **Safe Home Experiments** | 5 | Salt Solution Maker, Volcano (Vinegar+Baking Soda), Crystal Growing, Density Column, pH of Household Items |
| 16 | **Molecular Biology** | 7 | DNA Concentration (OD260), DNA Copy Number, Melting Temperature (Tm), PCR Amplification, Protein Concentration (OD280), Cell Seeding Density, Molarity↔Mass |
| 17 | **Molecular Genetics** | 4 | Hardy-Weinberg Equilibrium, Punnett Square, Allele Frequency (with Chi-square), Mutation Rate |
| 18 | **DNA & RNA Tools** | 6 | DNA/RNA Molecular Weight, DNA Dilution for PCR, Ligation Insert:Vector Ratio, OD600→Cell Density, GC Content Analyzer, Protein MW from Amino Acids |
| 19 | **Agriculture & Farming** | 8 | Land Area Converter, Seeds per Area, Seedlings per Area, Fertilizer per Area, Pesticide Spray Calculator, Irrigation Water Calculator, Crop Yield Calculator, Plant Population Density |

### Compound Database
The Molar Mass calculator includes a **compound info card** that shows physical properties when you enter a known formula (e.g., H2O, NaCl, NaHCO3, C6H12O6):
- Common name (Arabic & English)
- Density
- Melting & boiling points
- Physical state at room temperature
- Household uses
- Hazard level with safety warnings

### Periodic Table
Complete interactive periodic table with all **118 elements**:
- Atomic number, symbol, name (Arabic & English)
- Atomic mass
- Electron configuration
- Category (alkali metal, halogen, noble gas, etc.)
- Group & period
- Color-coded by element category

---

## 🛠 Technology Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 + shadcn/ui (New York) |
| **Icons** | Lucide React |
| **Animations** | Framer Motion |
| **State Management** | Zustand (client) |
| **Theme** | next-themes (dark/light) |
| **PWA** | manifest.webmanifest + Service Worker |
| **Fonts** | Geist Sans & Geist Mono |
| **Package Manager** | Bun |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/m-osama-10/Osa-calculator-and-converter.git

# Navigate to project directory
cd Osa-calculator-and-converter

# Install dependencies
bun install
# or
npm install

# Start development server
bun run dev
# or
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
# Build the project
bun run build

# Start production server
bun run start
```

### Lint

```bash
bun run lint
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (theme, i18n, PWA, ads)
│   ├── page.tsx                # Main page (Home, Category, Favorites, History, Search, About views)
│   └── globals.css             # Tailwind + custom styles (RTL, print, scrollbars)
│
├── lib/
│   ├── types.ts                # Calculator, Field, ComputeResult types
│   ├── i18n.ts                 # Arabic/English translations
│   ├── categories.ts           # 19 category definitions
│   ├── registry.ts             # Calculator registry + search
│   ├── compounds.ts            # Compound database (16 compounds with properties)
│   ├── periodic-table.ts       # All 118 elements with full data
│   ├── icons.tsx               # Dynamic Lucide icon wrapper
│   ├── calculator-utils.ts     # num, fmt, safeEval, factorial, etc.
│   └── calculators/
│       ├── basic.ts            # 6 basic calculators (Standard, Scientific buttons)
│       ├── converters.ts       # 30 unit converters + currency
│       ├── chemistry.ts        # 16 chemistry calculators
│       ├── physics.ts          # 13 physics calculators
│       ├── math.ts             # 10 math calculators
│       ├── health.ts           # 9 health/fitness calculators
│       ├── finance.ts          # 10 finance calculators
│       ├── misc.ts             # Computer, Date, Construction, Everyday, Engineering, Lab, Nutrition
│       ├── home-experiments.ts # 5 safe home experiment calculators
│       ├── molecular-biology.ts# 7 molecular biology calculators
│       ├── genetics.ts         # 4 genetics calculators
│       ├── dna-tools.ts        # 6 DNA/RNA tool calculators
│       ├── agriculture.ts      # 8 agriculture calculators
│       └── periodic-table-viewer.ts
│
├── components/
│   ├── providers/
│   │   ├── app-providers.tsx           # ThemeProvider + RTL sync
│   │   └── service-worker-register.tsx # PWA SW registration
│   ├── layout/
│   │   ├── header.tsx                  # Sticky header with search, theme/lang toggles
│   │   ├── sidebar.tsx                 # Category navigation
│   │   └── keyboard-shortcuts.tsx      # ? key help dialog
│   ├── calculators/
│   │   ├── calculator-card.tsx         # Grid card with favorite star
│   │   ├── calculator-modal.tsx        # Full-screen modal with dynamic form
│   │   └── button-calculators.tsx      # Standard & Scientific button calculators
│   └── ads/
│       ├── hpf-banner.tsx              # HighPerformanceFormat 728×90 banner
│       ├── hpf-banner-468.tsx          # HighPerformanceFormat 468×60 banner
│       └── native-banner.tsx           # EffectiveCPMNetwork native banner
│
├── store/
│   └── index.ts                        # Zustand stores (prefs, favorites, history, UI)
│
└── public/
    ├── manifest.webmanifest            # PWA manifest
    ├── sw.js                           # Service Worker (offline caching)
    ├── logo.png                        # App logo
    ├── promo.png                       # About page promo image
    └── icon.svg                        # Fallback icon
```

---

## ➕ Adding New Calculators

The architecture is modular — adding a new calculator requires **zero UI code**. Just add an entry to the relevant file in `src/lib/calculators/`:

```typescript
// src/lib/calculators/your-file.ts
import type { Calculator } from "../types";
import { num, fmt } from "../calculator-utils";

export const yourCalculators: Calculator[] = [
  {
    id: "your-calculator",
    category: "basic", // must match a CategoryId
    names: { en: "Your Calculator", ar: "حاسبتك" },
    descriptions: {
      en: "What it does...",
      ar: "ماذا تفعل...",
    },
    keywords: ["keyword1", "keyword2"],
    icon: "Calculator", // Lucide icon name
    live: true, // auto-calculate on input change
    fields: [
      {
        key: "input1",
        names: { en: "Input 1", ar: "المدخل 1" },
        type: "number",
        default: 10,
        unit: { en: "kg", ar: "كجم" },
        help: { en: "Help text", ar: "نص مساعدة" },
      },
    ],
    compute: (v) => {
      const input = num(v.input1);
      const result = input * 2;
      return {
        results: [
          { label: { en: "Result", ar: "النتيجة" }, value: fmt(result, 4), primary: true },
        ],
        formula: `Result = ${input} × 2 = ${fmt(result, 4)}`,
        steps: [
          { description: { en: `Multiply ${input} by 2`, ar: `اضرب ${input} في 2` } },
        ],
        explanation: {
          en: "Explanation of the method...",
          ar: "شرح الطريقة...",
        },
      };
    },
  },
];
```

Then register it in `src/lib/registry.ts`:

```typescript
import { yourCalculators } from "./calculators/your-file";

const allCalcs: Calculator[] = [
  // ... existing
  ...yourCalculators,
];
```

That's it! The calculator will automatically appear in the UI, search, and category views.

---

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Vercel auto-detects Next.js — just click "Deploy"
4. Your app will be live at `https://your-project.vercel.app`

### Deploy to other platforms

```bash
# Build
bun run build

# The standalone output is in .next/standalone/
# Deploy that directory with the server.js
NODE_ENV=production node .next/standalone/server.js
```

---

## 🌐 Internationalization

The app supports **Arabic (ar)** and **English (en)** with automatic RTL/LTR direction switching:

- Language toggle in the header (ع / EN button)
- `<html dir="rtl" lang="ar">` updates dynamically
- All UI text, calculator names, descriptions, labels, help text, steps, and explanations are bilingual
- Layout mirrors correctly in RTL mode

To add a new language:
1. Add the language to `Language` type in `src/lib/i18n.ts`
2. Add translations for all keys
3. Add to `LANGUAGE_DIRECTION` map

---

## 📱 PWA Features

- **Installable** — Add to home screen on mobile/desktop
- **Offline** — Service Worker caches navigation and static assets
- **Standalone** — Runs without browser chrome when installed
- **App shortcuts** — Quick links to BMI, EMI, Compound Interest
- **Theme color** — Matches the app's design

---

## 📊 Statistics

- **150+** calculators and converters
- **19** categories
- **118** elements in the periodic table
- **16** compounds with full physical properties
- **50+** currencies in the currency converter
- **2** languages (Arabic, English)
- **0** external API dependencies (fully client-side)

---

## 📝 License

This project is open source and available under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Add new calculators
- Improve translations
- Fix bugs
- Enhance the UI/UX
- Add new categories

---

## 💡 Acknowledgments

Built with:
- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Framer Motion](https://www.framer.com/motion)
- [Lucide Icons](https://lucide.dev)
- [Zustand](https://zustand-demo.pmnd.rs)

---

<p align="center">
  <strong>Zoma Calculator and OSA Converter</strong><br>
  150+ calculators in one beautiful PWA<br>
  Made with ❤️ for students, engineers, scientists, and farmers
</p>

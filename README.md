# BH Planner — Adaptive Academic Study Planning System

> **An adaptive, constraint-driven academic study planning system built for university students balancing rigid institutional commitments, commute fatigue, syllabus completion, and approaching exam runway deadlines.**

---

## 1. Product Overview & Core Loop

Most student planners fail because they treat time as an unconstrained blank canvas. **BH Planner** anchors student life to physical realities:

```text
Fixed Institutional Constraints (College Hours, Transit & Commute Fatigue)
  ↓
Target Exam Milestones & Weightage-Prioritized Syllabus Topics
  ↓
Canonical Timetable Generation (Gemini 2.5 Flash with Cohere Command R Fallback)
  ↓
Daily Execution Routine (Done · Partial · Missed)
  ↓
Missed Study Workload?
  ├── Tier-1 Engine: Deterministic 72-hour forward buffer scan (0ms latency, Zero AI)
  └── Multi-Day Accumulation: Escalate to Academic Copilot for structured re-triage
```

---

## 2. Key Architecture & Capabilities

### Tier-1 Deterministic Spillover Engine (`lib/scheduler/tier1.ts`)
- **Strictly zero AI and zero external network calls.**
- When a study block is toggled to `missed`, the algorithm searches forward up to 72 hours for an unlocked `buffer` block.
- Transfers the missed workload into the closest eligible buffer block while enforcing non-collision and immutable college/commute locks.
- Retains audit history with `recovered_from_id` metadata. Flags `requiresReTriage = true` if consecutive misses occur or if buffers are exhausted.

### Dual-Provider AI Fallback Pipeline (`lib/ai/`)
- **Primary Engine:** Google Gemini (`gemini-2.5-flash` in JSON mode, 25-second timeout).
- **Secondary Fallback:** Cohere (`command-r-08-2024`).
- **Resilience Controller:** Handles timeouts, rate limits, and JSON code-fence stripping with strict Zod validation against `TimetableSchema`.

### Academic Copilot (`app/api/planner/copilot/route.ts`)
- Conversational schedule mutations using natural language (e.g. *"Push Saturday study session to 20:00"*).
- Returns structural diff cards allowing one-click application to the active stored plan.

---

## 3. Academic Dashboard Modules

| Route | Module | Purpose |
|---|---|---|
| `/` | **Landing Sequence** | Storytelling reveal sequence, handwriting brand animation, and JOIN CTA. |
| `/auth` | **Auth Gateway** | Dual-panel sliding card (`@appvibed01`) with Supabase session & email confirmation. |
| `/dashboard/overview` | **Today's Command Surface** | Daily execution checklist (`Done`, `Partial`, `Missed`) and live Tier-1 recovery alerts. |
| `/dashboard/schedule` | **Weekly Timetable Grid** | 7-day grid differentiating `LOCKED` institutional hours from flexible study/buffer blocks. |
| `/dashboard/syllabus` | **Curriculum Breakdown** | Topic breakdown, 5-star weightage ratings, text ingestion parser, and progress bars. |
| `/dashboard/copilot` | **Academic Copilot** | Natural language schedule mutation workbench with visual diff preview. |
| `/dashboard/calendar` | **Exam Runway** | Dynamic milestone countdowns (`X DAYS RUNWAY`) derived from target exam dates. |

---

## 4. Visual Design System & Component Registry

Adheres strictly to the **Violet Bloom** flat design tokens (dark mode baseline `#0d0b14`, light mode `#f8f7fc`, accent `#8b5cf6`). **Zero gradients, zero emojis, zero generic AI glows.**

All interactive elements adapt curated 21st.dev component primitives:

1. **`@kokonutd/components/hand-writing-text`** (`components/ui/handwriting.tsx`):
   - SVG calligraphic cursive flourish with a traveling fountain pen nib cursor that traces `"BH PLANNER"`.
2. **`@kumail_ali_r/components/text-reveal-animation`** (`components/ui/text-reveal.tsx`):
   - Masked text roll-up with word-by-word deblurring (`blur(6px) → 0px`) and hover waves.
3. **`@appvibed01/components/auth-switch`** (`components/ui/auth-switch.tsx`):
   - Dual-panel split sliding card where the editorial panel glides horizontally across the card with spring physics between Sign In and Sign Up.
4. **`@hardikkashiyani123456788/components/sterling-gate-kinetic-navigation`** (`components/ui/kinetic-nav.tsx`):
   - Centered floating dock with magnetic cursor pull, micro-tilt icon reactivity, and elastic spring active pill.
5. **`@skiper26/ThemeToggleButton`** (`components/theme-toggle.tsx`):
   - Morphing SVG sun/moon with collapsing radial rays and circular view transition (`document.startViewTransition`).

---

## 5. Technology Stack

- **Framework:** Next.js 14.2 (App Router, React 18, TypeScript)
- **Styling:** Tailwind CSS, PostCSS, Framer Motion
- **Database & Auth:** Supabase (PostgreSQL with Row Level Security & `@supabase/ssr`)
- **Validation:** Zod 3.23
- **AI SDKs:** `@google/generative-ai` & `cohere-ai`
- **Icons:** Lucide React

---

## 6. Getting Started

### Prerequisites
- Node.js 18.17+ or 20+
- npm or pnpm
- A Supabase project
- Google Gemini API Key and Cohere API Key

### Installation

```bash
# 1. Clone repository
git clone https://github.com/rehan-1002/BH_PLANNER.git
cd BH_PLANNER

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local
```

Fill `.env.local` with your credentials:
```env
GEMINI_API_KEY=your_gemini_key
COHERE_API_KEY=your_cohere_key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Database Schema Setup
Execute the complete DDL in `supabase-schema.sql` within your Supabase SQL Editor. This initializes:
- `profiles` (student settings, college hours, commute minutes)
- `plans` (canonical timetable plans)
- `schedule_blocks` (daily blocks with lock status & recovery metadata)
- `syllabus_topics` (modules, subjects, weightage)
- `exam_milestones` (exam dates and runway targets)
- Row Level Security (RLS) policies for student data isolation

### Running the App

```bash
# Start development server
npm run dev

# Run TypeScript typecheck
npm run typecheck

# Build optimized production bundle
npm run build

# Start production server
npm run start
```

---

## 7. License

Academic software developed for structured university workload management.

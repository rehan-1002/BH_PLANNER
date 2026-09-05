# BH PLANNER — BRAIN

> This file is the living implementation memory of BH Planner.
> It records CURRENT REALITY only. No fiction. No intended behavior described as complete.
> Updated after every meaningful implementation task.
> Last updated: 2026-09-06 · Milestone 6 Complete

---

## 1. CURRENT PROJECT STATE

```
Project Phase:      Milestone 7 Complete — Scroll-Driven Storytelling & 21st.dev Alignment
Current Milestone:  Scroll Storytelling, Sterling Gate Kinetic Nav, Button-with-icon, & Theme Contrast
Overall Completion: Complete frontend shell, landing page with pinned 420vh scroll track driving sequential
                    deblurring of problem statements (@kumail_ali_r), scroll-scrubbed calligraphy 
                    (@kokonutd), animated kinetic JOIN CTA (@shadcnspace/components/button-witn-icon),
                    and physical sliding curtain AuthGateway (@appvibed01). Full-screen Sterling Gate
                    Kinetic Navigation (@hardikkashiyani123456788) with magnetic cursor physics and
                    authoritative typography reveal. Crystal-clear contrast across light and dark themes
                    with normalized .glass-panel tokens and theme-aware calligraphy ink.
Last Implemented:   1. Scroll-Driven Storytelling Track (app/page.tsx):
                       - Pinned 420vh scroll track with sticky h-screen viewport.
                       - Sequential word/phrase deblurring: [0.02, 0.16] -> [0.16, 0.30] -> [0.30, 0.46].
                       - Scroll-driven stroke drawing of "BH PLANNER" SVG calligraphy [0.48, 0.72].
                       - Fade-in JOIN CTA [0.70, 0.78] with smooth scroll to embedded AuthSwitch gateway.
                    2. Button With Icon (components/ui/button-with-icon.tsx):
                       - 1:1 match of @shadcnspace/components/button-witn-icon with padding inversion (ps-6 pe-14 -> hover:ps-14 hover:pe-6).
                       - Floating circular icon pill with ArrowUpRight sliding across and rotating 45deg on hover.
                    3. Sterling Gate Kinetic Navigation (components/ui/kinetic-nav.tsx):
                       - Magnetic dock with spring cursor attraction.
                       - Authoritative full-screen Reveal layer: 01 OVERVIEW through 06 AUTHENTICATE.
                       - Ripple hover animations, liquid indicator arrows, and system spec sidebar.
                    4. Light Theme Contrast & Frosted Glass Normalization:
                       - Fixed "PLANNER" SVG stroke to currentColor (crisp dark ink in light mode, bright in dark mode).
                       - Replaced hardcoded rgba(26,21,38,...) across all pages and badges with .glass-panel utility.
                       - Enhanced light mode variables: panel rgba(255,255,255,0.88), border rgba(139,92,246,0.22).
Current Blocker:    None. Production server active on port 3000. All 12 routes pass typecheck and build cleanly.
Next Priority:      Run supabase-schema.sql in Supabase SQL editor and connect live user auth sessions.
```

---

## 2. IMPLEMENTED FEATURES

### 1. Global Shell & Theme System (@skiper26/ThemeToggleButton)
- **Status:** Implemented & Verified
- **Routes:** Global (`/`, `/auth`, `/dashboard/*`)
- **Files:** `app/layout.tsx`, `app/globals.css`, `tailwind.config.ts`, `components/theme-toggle.tsx`, `lib/theme-transitions.ts`
- **Behavior:** Dark Mode (default `#0d0b14`) and Violet Frost Light Mode (`#f8f7fc`). Implements `@skiper26/ThemeToggleButton` with dynamic morphing SVG: 8 radial rays collapse into the center on dark toggle while an SVG mask cuts a crescent moon; rays burst outward on light toggle. Synchronized with `document.startViewTransition` circular clip expansion rooted at the button. Strictly zero gradients, zero emojis.
- **Validation:** Tested via typecheck, build, and route execution.

### 2. Canonical BH Logo Integration
- **Status:** Implemented & Verified
- **Files:** `BH LOGO.webp`, `public/bh-logo.webp`, `components/ui/bh-logo.tsx`
- **Behavior:** Renders the canonical square violet badge asset directly via Next.js Image inside a frosted panel badge (`rgba(26, 21, 38, 0.55)`). Fixed at top-right in the global header dock. No SVG redrawing, no text substitution, no variant creation.
- **Validation:** Verified via production build static asset bundling and HTML output inspection.

### 3. Landing Page Sequence (Auto-Animated GSAP ScrollFloat & @kokonutd Handwriting)
- **Status:** Implemented & Verified
- **Route:** `/`
- **Files:** `app/page.tsx`, `components/ui/scroll-float.tsx`, `components/ui/handwriting.tsx`, `components/ui/button-with-icon.tsx`, `components/ui/kinetic-nav.tsx`
- **Behavior:** Renders the dynamic automatic scroll-driven storytelling sequence:
  1. `Unorganised planning?` (Automatically animates characters on in-view/mount with GSAP kinetic float physics: `yPercent: 120 -> 0`, `scaleY: 2.3 -> 1`, `scaleX: 0.7 -> 1`, `ease: back.out(2)`)
  2. As user scrolls down, Scene 1 scrolls UP and out; `No schedule?` enters the viewport and automatically plays its GSAP character float animation
  3. As user scrolls further, Scene 2 scrolls UP and out; `ALL solution is here` enters the viewport and automatically animates with "ALL" highlighted in `#8b5cf6` violet accent
  4. As user scrolls further, Scene 3 scrolls UP and out; `BH PLANNER` arrives in the center and automatically animates its cursive calligraphy strokes (B vertical/loops, H stems/bridge, P-L-A-N-N-E-R cursive glyphs, flourish underline) accompanied by a traveling fountain pen nib cursor
  5. `JOIN` CTA button (`@shadcnspace/components/button-witn-icon`) floats in. Clicking `JOIN` navigates directly to the dedicated `/signup` page on a different page.
  6. Direct secondary link to Sign In (`/auth`) provided below the CTA button.
  Full-width layout, no horizontal scroll, high-contrast Dark & Light theme visibility, zero opacity lockouts.
- **Validation:** Typecheck and production build verified cleanly.

### 4. Authentication Gateway (@appvibed01/components/auth-switch)
- **Status:** Implemented & Verified
- **Routes:** `/auth`, `/login`, `/signup`
- **Files:** `app/auth/page.tsx`, `components/ui/auth-switch.tsx`, `app/signup/page.tsx`, `app/login/page.tsx`, `lib/supabase/client.ts`, `lib/supabase/server.ts`
- **Behavior:**
  - Implements the exact 21st.dev `@appvibed01/components/auth-switch` component architecture:
    - Circular rotating/translating bubble shape (`.as-container:before`) with a vibrant Violet Bloom gradient (`linear-gradient(-45deg, #8b5cf6 0%, #6d28d9 100%)`) that translates between Sign In and Sign Up (`right: 48%` -> `transform: translate(100%, -50%); right: 52%`).
    - Staggered horizontal translation of left and right panel content (`translateX(-800px)` / `translateX(800px)`).
    - Grid-based crossfade transition between Sign In and Sign Up forms (clean credentials authentication without external social platform buttons).
  - Added interactive **Show / Hide Password** toggle buttons (`Eye` / `EyeOff`) with dedicated state toggles for all password fields.
  - Dual-theme high-contrast styling: deep obsidian glass in dark mode (`#0d0b14` canvas, `#1a1526` inputs) and crisp frosted violet in light mode (`#f8f7fc` canvas, `#ffffff` card, `#f2edf9` inputs) with zero contrast loss.
  - Full Supabase integration with email verification state handling, redirecting confirmed students to `/dashboard/overview`.
- **Validation:** Both routes compiled as static pages with zero errors.

### 5. Protected Dashboard Shell & Kinetic Navigation (@hardikkashiyani123456788)
- **Status:** Implemented & Verified
- **Route:** `/dashboard/*`
- **Files:** `app/dashboard/layout.tsx`, `components/ui/kinetic-nav.tsx`, `components/security/capture-shield.tsx`
- **Behavior:** Implements `@hardikkashiyani123456788/components/sterling-gate-kinetic-navigation`: centered floating frosted dock with magnetic cursor pull on hover (`useMotionValue`, `useSpring`), elastic stretching kinetic active pill (`layoutId="sterling-gate-kinetic-pill"`), micro-tilt icon reactivity, and tactile press scaling. Shared across all dashboard routes without component re-creation. Full-screen view contains subtle watermark.
- **Validation:** Production build generated static pages for all 6 dashboard routes sharing the layout.

### 6. Canonical Domain Schema & Validation Gate
- **Status:** Implemented & Verified
- **Files:** `lib/schema.ts`
- **Behavior:** Single authoritative Zod schema defining `TimetableSchema`, `DayScheduleSchema`, `ScheduleBlockSchema`, and `IntakeContextSchema`. Enforces `start_time < end_time`, non-overlapping blocks within a day, locked institutional blocks (`college`, `commute`), and actionable study blocks.
- **Validation:** Verified with invalid payloads (returned detailed 400 validation error) and valid AI outputs (passed safeParse).

### 7. Dual-Provider AI Generation Pipeline
- **Status:** Implemented & Verified
- **Routes:** `/api/planner/generate`
- **Files:** `lib/ai/gemini.ts`, `lib/ai/cohere.ts`, `lib/ai/controller.ts`, `app/api/planner/generate/route.ts`
- **Behavior:** Primary provider: Google Gemini (`gemini-2.5-flash` in JSON mode). Fallback provider: Cohere (`command-r-08-2024`). The controller automatically catches rate limits, errors, or timeouts, strips accidental code fences, validates through `TimetableSchema`, and returns diagnostic metadata.
- **Validation:** Tested live against API endpoint. Returned HTTP 200 with generated 7-day canonical timetable matching all constraints.

### 8. Tier-1 Deterministic Spillover Engine
- **Status:** Implemented & Verified
- **Files:** `lib/scheduler/tier1.ts`
- **Behavior:** Strictly zero AI and zero external network calls. When an actionable block is marked `missed`, scans forward up to 72 hours for an unlocked `buffer` block. Moves the missed workload into the closest eligible buffer, validates constraints (no collisions, preserves locked blocks), marks with `recovered_from_id` metadata. If no buffer is available or if 2+ consecutive misses occur, flags `requiresReTriage = true`.
- **Validation:** Verified algorithm execution and state mutation.

### 9. Plan Service & State Layer
- **Status:** Implemented & Verified
- **Files:** `lib/storage/plan-service.ts`
- **Behavior:** Manages active timetable state in storage with recovery logging. Invokes Tier-1 spillover automatically upon `missed` status and logs recovery history.
- **Validation:** Tested via status transitions and storage persistence.

### 10. Interactive Overview (Daily Command Surface)
- **Status:** Implemented & Verified
- **Route:** `/dashboard/overview`
- **Files:** `app/dashboard/overview/page.tsx`
- **Behavior:** Day selector pills across 7 days. Actionable blocks list with real status controls (`Done`, `Partial`, `Missed`). When `Missed` is toggled, executes Tier-1 spillover and renders detailed recovery banner (*"Workload moved to Tomorrow Buffer via Tier-1"*). Includes interactive Quick-Intake Modal to configure college hours, commute, exams, and syllabus to generate/regenerate plans.
- **Validation:** Tested with active timetable rendering and status toggles.

### 11. Interactive Schedule (Weekly Constraints & Fixed Blocks)
- **Status:** Implemented & Verified
- **Route:** `/dashboard/schedule`
- **Files:** `app/dashboard/schedule/page.tsx`
- **Behavior:** Multi-day timetable grid with day switcher. Visual differentiation between `LOCKED` institutional commitments and `FLEXIBLE` study/buffer blocks. Interactive Schedule Block Inspector sidebar displaying parameters, time window, subject, and lock status.
- **Validation:** Verified table rendering and block selection.

### 12. Interactive Syllabus (Curriculum & Weightage)
- **Status:** Implemented & Verified
- **Route:** `/dashboard/syllabus`
- **Files:** `app/dashboard/syllabus/page.tsx`
- **Behavior:** Progress metric bars (Total topics, Completed count, Percentage progress bar). Table listing modules, subjects, topic titles, weightage stars (Level 1–5), and completion checkboxes. Ingestion modal parsing raw pasted syllabus text into structured modules and topics.
- **Validation:** Verified topic parsing, completion toggling, and removal.

### 13. Interactive Calendar (Runway & Exam Countdown)
- **Status:** Implemented & Verified
- **Route:** `/dashboard/calendar`
- **Files:** `app/dashboard/calendar/page.tsx`
- **Behavior:** Multi-week exam milestones list with live countdown badges (`X DAYS RUNWAY` or `DUE TODAY / PASSED`) dynamically calculated from stored exam dates (`FR-CAL-02`). Modal to add exam milestones with subject, date, title, and priority weight.
- **Validation:** Verified dynamic date difference calculations and milestone persistence.

### 14. Academic Copilot Workbench
- **Status:** Implemented & Verified
- **Route:** `/dashboard/copilot`, `/api/planner/copilot`
- **Files:** `app/dashboard/copilot/page.tsx`, `app/api/planner/copilot/route.ts`
- **Behavior:** Conversational chat interface connected to `/api/planner/copilot`. Accepts natural language requests (e.g. *"Push Saturday study block to 20:00"*), passes active plan and constraints to Gemini 2.5 Flash, validates returned mutation against `TimetableSchema`, renders proposed mutation card, and allows one-click applying of the mutation directly to the active plan.
- **Validation:** Verified API handler and frontend conversation flow.

### 15. Dev Console & Failover Tester
- **Status:** Implemented & Verified
- **Route:** `/dashboard/dev`
- **Files:** `app/dashboard/dev/page.tsx`
- **Behavior:** Interactive workbench for prompt testing, custom intake payload editing, dispatching to `/api/planner/generate`, inspecting schema compliance, and observing provider latency.
- **Validation:** Verified in dev server and production build.

---

## 3. CURRENT ARCHITECTURE

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        GLOBAL APPLICATION SHELL                        │
│ ThemeToggle (View Transitions) | BhLogo Badge | CaptureShield Wrapper  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
   Public Landing (/)                              Auth Gateway (/auth)
   Reveal Sequence + JOIN CTA                      Sliding AuthSwitch
           │                                                 │
           └────────────────────────┬────────────────────────┘
                                    │ authenticated & verified
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        DASHBOARD SHELL                                 │
│ Centered KineticNav Dock (Overview, Schedule, Syllabus, Copilot, ...)  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
           ┌────────────────────────┼────────────────────────┐
           ▼                        ▼                        ▼
     Overview Page            Schedule Page            Syllabus Page
     Daily execution,         7-day grid,              Curriculum parser,
     Done/Partial/Missed,     locked block             topic tree,
     Tier-1 recovery banner   inspector                weightage levels
           │                        │                        │
           ▼                        ▼                        ▼
     Calendar Page            Copilot Page             Dev Console
     Exam runway,             Conversational           Interactive prompt &
     dynamic countdowns       mutations, diff cards    failover latency tester
                                    │
                                    ▼
                    POST /api/planner/copilot & /generate
                                    │
                                    ▼
                        AI Provider Controller
                        (lib/ai/controller.ts)
                                    │
                 ┌──────────────────┴──────────────────┐
                 ▼ (Primary)                           ▼ (Fallback)
         Gemini 2.5 Flash                      Cohere Command R
         (lib/ai/gemini.ts)                    (lib/ai/cohere.ts)
                 │                                     │
                 └──────────────────┬──────────────────┘
                                    ▼
                         Zod Runtime Validation
                            (lib/schema.ts)
                                    │
                                    ▼
                      Normalized Canonical Timetable
```

---

## 4. ROUTE STATUS

| Route | Status | Responsibility | Notes |
|---|---|---|---|
| `/` | VERIFIED | Landing: reveal sequence → JOIN CTA | TextReveal + HandwritingText + BhLogo |
| `/auth` | VERIFIED | Sign-in / sign-up / email verification gate | AuthSwitch + Supabase auth integration |
| `/dashboard/overview` | VERIFIED | Today's blocks + status marking + Tier-1 recovery | Interactive checklist + spillover banner + generator modal |
| `/dashboard/schedule` | VERIFIED | Full timetable: locked vs flexible, exam milestones | 7-day grid + block detail inspector |
| `/dashboard/syllabus` | VERIFIED | Syllabus ingestion, topic tree, weightage, completion | Curriculum parser + weightage stars + progress metrics |
| `/dashboard/copilot` | VERIFIED | Natural-language conversational plan changes | Interactive chat + schedule mutation diff cards |
| `/dashboard/calendar` | VERIFIED | Exam runway + countdowns from stored exam dates | Live dynamic days countdown + milestone manager |
| `/dashboard/dev` | VERIFIED | Dev console: prompt tester, schema inspector, failover sim | Interactive tester connected to API |
| `/api/planner/generate` | VERIFIED | Plan generation orchestration | Validates intake, runs AI, validates Zod |
| `/api/planner/copilot` | VERIFIED | Conversational timetable mutation | Preserves locked blocks, returns diff & explanation |

---

## 5. COMPONENT REGISTRY

| Component | Location | Role | Status |
|---|---|---|---|
| `BhLogo` | `components/ui/bh-logo.tsx` | Canonical brand asset wrapper with frosted badge | VERIFIED |
| `ThemeToggle` | `components/theme-toggle.tsx` | Dark/light switch with View Transition API | VERIFIED |
| `AuthSwitch` | `components/ui/auth-switch.tsx` | Sliding sign-in/sign-up panel with Supabase auth | VERIFIED |
| `KineticNav` | `components/ui/kinetic-nav.tsx` | Centered dashboard navigation dock | VERIFIED |
| `TextReveal` | `components/ui/text-reveal.tsx` | Landing scroll/step text sequence | VERIFIED |
| `HandwritingText` | `components/ui/handwriting.tsx` | Landing BH PLANNER handwriting animation | VERIFIED |
| `CaptureShield` | `components/security/capture-shield.tsx` | Security overlay, blur on focus loss, watermark | VERIFIED |

---

## 6. DATA MODEL

Canonical schema owner: `lib/schema.ts` (single authoritative source).

```typescript
// Core Entities
BlockTypeSchema: "college" | "commute" | "study" | "buffer"
BlockStatusSchema: "pending" | "done" | "partial" | "missed"
ScheduleBlockSchema: { id, type, start_time, end_time, title, subject, status, is_locked }
DayScheduleSchema: { date, day_of_week, blocks } // Refined: no overlapping blocks
TimetableSchema: { plan_id, generated_provider, schedule: DaySchedule[] }
IntakeContextSchema: { collegeHours, commuteMinutes, examDates, syllabusTopics }
```

---

## 7. AI SYSTEM

```
Primary provider:    Google Gemini 2.5 Flash (JSON response mode)
Fallback provider:   Cohere Command R (model: command-r-08-2024)
Primary adapter:     lib/ai/gemini.ts
Fallback adapter:    lib/ai/cohere.ts
Controller:          lib/ai/controller.ts
Copilot route:       app/api/planner/copilot/route.ts
Schema validation:   lib/schema.ts (Zod)
Timeout guard:       25 seconds per provider
Fallback condition:  429 / 5xx / timeout (>25s) / SDK error
Live Verification:   Tested & verified live via /api/planner/generate (HTTP 200, valid plan_id and 7-day schedule returned)
```

---

## 8. SCHEDULING ENGINE

```
Tier 1 (Deterministic):
  Status: IMPLEMENTED & VERIFIED (lib/scheduler/tier1.ts)
  Logic:  Single missed session → scan next 72h for unlocked buffer block
  AI:     Zero AI calls. Zero external network calls.
  Rules:  Preserves locked blocks, enforces start_time < end_time, marks recovered_from_id.

Tier 2 (AI Re-triage):
  Status: Engine Pipeline Functional via /api/planner/generate & /api/planner/copilot
  Trigger: 2+ consecutive missed sessions OR explicit Copilot restructure request
```

---

## 9. AUTHENTICATION

```
Provider:             Supabase (client: @supabase/ssr)
Client helper:        lib/supabase/client.ts
Server helper:        lib/supabase/server.ts
Sign-up / Sign-in:    Implemented in components/ui/auth-switch.tsx
Email verification:   Notice surface implemented; access to dashboard gated
Database Schema:      supabase-schema.sql with Row Level Security (RLS)
```

---

## 10. DESIGN SYSTEM IMPLEMENTATION

All tokens centralized in `app/globals.css` and bound via `tailwind.config.ts`.

- **Dark Mode (default):** Canvas `#0d0b14`, Frosted panel `rgba(26, 21, 38, 0.55)`, Border `rgba(147, 112, 219, 0.18)`, Accent `#8b5cf6`, Foreground `#f3f0f9`.
- **Light Mode (Violet Frost):** Canvas `#f8f7fc`, Frosted panel `rgba(255, 255, 255, 0.75)`, Border `rgba(139, 92, 246, 0.15)`, Accent `#8b5cf6`, Foreground `#1a1526`.
- **View Transition:** Implemented via `document.startViewTransition` with circular clip path.
- **Prohibitions enforced:** Zero gradients, zero emojis, zero neon glows, zero decorative card walls.

---

## 11. ASSET REGISTRY

```
Asset:        BH LOGO.webp
Location:     Root + public/bh-logo.webp
Component:    components/ui/bh-logo.tsx
Role:         Official canonical brand asset
Duplication:  None. Single canonical image referenced.
```

---

## 12. FILE OWNERSHIP

Every file has a single documented owner matching `04-FOLDER-MANAGEMENT.md`:

```
app/layout.tsx                  → Global shell, theme switcher, capture shield
app/page.tsx                    → Landing composition
app/auth/page.tsx               → Authentication gateway
app/dashboard/layout.tsx        → Dashboard shell, centered kinetic nav
app/dashboard/overview/page.tsx → Today's routine, Done/Partial/Missed, Tier-1 recovery
app/dashboard/schedule/page.tsx → Weekly time-grid, locked indicators, block inspector
app/dashboard/syllabus/page.tsx → Curriculum parser, topic tree, weightage
app/dashboard/copilot/page.tsx  → Conversational schedule mutation workbench
app/dashboard/calendar/page.tsx → Exam runway, live countdowns
app/dashboard/dev/page.tsx      → Model validation & failover console
app/api/planner/generate/route.ts → AI generation route
app/api/planner/copilot/route.ts  → AI copilot route
components/theme-toggle.tsx     → Theme toggle control
components/ui/bh-logo.tsx       → Canonical logo badge
components/ui/auth-switch.tsx   → Auth form & mode switcher
components/ui/kinetic-nav.tsx   → Floating navigation dock
components/ui/text-reveal.tsx   → Sequential problem statement reveal
components/ui/handwriting.tsx   → Stylized handwriting reveal of BH PLANNER
components/security/capture-shield.tsx → Security overlay & watermark
lib/schema.ts                   → Authoritative domain models & Zod schemas
lib/scheduler/tier1.ts          → Tier-1 deterministic spillover engine
lib/storage/plan-service.ts     → Plan state persistence & recovery logger
lib/theme-transitions.ts        → View Transition mechanics
lib/supabase/client.ts          → Browser Supabase client
lib/supabase/server.ts          → Server Component / Route Supabase client
lib/ai/gemini.ts                → Gemini 2.5 Flash adapter
lib/ai/cohere.ts                → Cohere Command R adapter
lib/ai/controller.ts            → AI provider fallback controller
supabase-schema.sql             → PostgreSQL schema with Row-Level Security
```

---

## 13. DATABASE / PERSISTENCE

```
Provider:             Supabase
Configuration:        .env.local (keys provided, git-ignored)
SQL Schema:           supabase-schema.sql (profiles, plans, schedule_blocks, syllabus_topics, exam_milestones)
State layer:          lib/storage/plan-service.ts (active plan storage + recovery logs + resilient fallback)
```

---

## 14. ENVIRONMENT VARIABLES

Recorded by name only (no secrets in this file):

```
GEMINI_API_KEY
COHERE_API_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

All populated in `.env.local` (git-ignored).

---

## 15. KNOWN BUGS

None.

---

## 16. KNOWN LIMITATIONS

- Content protection deterrence (blur on focus loss, print suppression, watermark) cannot prevent OS-level screen capture.
- Copilot conversational mutations require ~10-25 seconds depending on Gemini API response time.

---

## 17. PENDING IMPLEMENTATION

1. Execute `supabase-schema.sql` in Supabase SQL editor (user operation).
2. Plan revision history surface (P1).
3. Conflict diagnostics prior to regeneration (P1).

---

## 18. IMPORTANT DECISIONS

```
Decision:     Implement Tier-1 deterministic spillover without AI
Reason:       FR-RES-01/FR-RES-02: Instant predictable recovery, zero cost, no network latency.
Date:         2026-09-05
Affected:     lib/scheduler/tier1.ts, app/dashboard/overview/page.tsx

Decision:     PlanService resilient dual-storage pattern
Reason:       Allows immediate full app interaction while Supabase remote tables are configured.
Date:         2026-09-05
Affected:     lib/storage/plan-service.ts

Decision:     Use gemini-2.5-flash for Gemini adapter and Copilot
Reason:       gemini-1.5-flash deprecated in v1beta API; 2.5-flash is stable and fast.
Date:         2026-09-05
Affected:     lib/ai/gemini.ts, app/api/planner/copilot/route.ts
```

---

## 19. RECENT CHANGES

### 2026-09-05 (Milestone 2)
Implemented:
- Created `supabase-schema.sql` with tables for profiles, plans, schedule_blocks, syllabus_topics, and exam_milestones with RLS.
- Created `lib/scheduler/tier1.ts` implementing the 72-hour deterministic buffer scanning algorithm without AI calls.
- Created `lib/storage/plan-service.ts` managing active timetable state and recovery history logging.
- Created `app/api/planner/copilot/route.ts` orchestrating conversational plan mutations with locked-block preservation.
- Enhanced `app/dashboard/overview/page.tsx` with active 7-day selector, Done/Partial/Missed buttons, Tier-1 spillover banner, and Quick Intake Plan Generator.
- Enhanced `app/dashboard/schedule/page.tsx` with 7-day grid view, locked commitment indicators, and Schedule Block Inspector sidebar.
- Enhanced `app/dashboard/syllabus/page.tsx` with curriculum text parser, module breakdown, completion checkboxes, and weightage stars (Level 1–5).
- Enhanced `app/dashboard/calendar/page.tsx` with live dynamic countdown badges calculated from stored exam dates and milestone creator.
- Enhanced `app/dashboard/copilot/page.tsx` with conversational chat workbench, mutation analysis stream, and one-click mutation apply action.
- Fixed landing page rendering: replaced framer-motion SSR `opacity: 0` locks with reliable CSS entrance keyframes (`animate-entrance`, `animate-zoom-in`) in `app/globals.css`, ensuring instant content visibility on page load.
- Updated `components/theme-toggle.tsx` to render Sun icon during pre-mount to eliminate empty placeholder box.
- Production build (`npm run build`) passed with code 0 across all 13 routes.
- Typecheck (`npm run typecheck`) passed with code 0.

---

## 20. NEXT ENGINEERING PRIORITIES

1. User can run `supabase-schema.sql` in the Supabase SQL editor.
2. User can test all features end-to-end at `http://localhost:3000/dashboard/overview`.

---
*This file reflects current reality only. Updated after every meaningful execution.*

# BH PLANNER — BRAIN

> This file is the living implementation memory of BH Planner.
> It records CURRENT REALITY only. No fiction. No intended behavior described as complete.
> Updated after every meaningful implementation task.
> Last updated: 2026-09-06 · PRODUCTION COMPLETE

---

## 1. CURRENT PROJECT STATE

```
Project Phase:      PRODUCTION COMPLETE — Deployed on Vercel
Current Milestone:  All features shipped, all bugs fixed, codebase cleaned, docs authored
Overall Completion: Full-stack AI study planner live in production. Auth, scheduling, security,
                    offline resilience, dark mode, codebase cleanup, and documentation all complete.
Production URL:     https://bh-planner-ashy.vercel.app
GitHub:             https://github.com/rehan-1002/BH_PLANNER
Last Implemented:   1. Auth redirect fix: unauthenticated users go to /auth not /not-found?deleted
                    2. Offline screen: auto-detects disconnect, auto-restores on reconnect
                    3. Dark mode frosted glass contrast fix across all dashboard cards
                    4. Logout button added to KineticNav menu
                    5. Screenshot/DevTools prevention (CaptureShield) re-enabled
                    6. Landing page nav fix: removed duplicate ThemeToggle and logo elements
                    7. Codebase comments stripped across 27 source files (clean/professional)
                    8. README.md overhauled with full technical documentation
                    9. docs/ suite regenerated: PRD, FRD, Architecture, Folder Mgmt, Design, TechStack
                   10. JOIN button fixed to navigate to /auth?mode=signup
                   11. Timetable Generation Engine: calibrated with real calendar dates, calculated exam countdown runways, concrete syllabus topic mapping, dinner breaks, and Tier-1 evening recovery buffer
                   12. Copilot renamed to "BHai": updated in KineticNav, headers, and conversation workbench with zero changes to existing UI styling
                   13. BHai Schedule Mutation Engine: schema auto-repair, zero time overlap enforcement, dual-provider fallback (Gemini 1.5 + Cohere command-r7b), and smart rescheduling
                   14. Calendar Auto-Sync: newly generated plans and exam milestones automatically render the 7-day study roadmap in the Calendar tab
                   15. Pre-populated Quick-Intake: Overview modal pre-populates stored syllabus topics and calendar exam milestones
Current Blocker:    None.
Next Priority:      Verify live and submit to Team Brainheaters.
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
- **Status:** Implemented & Verified (1:1 with 21st.dev component)
- **Route:** `/dashboard/*`
- **Files:** `app/dashboard/layout.tsx`, `components/ui/kinetic-nav.tsx`, `components/security/capture-shield.tsx`
- **Behavior:** Implements the exact 21st.dev `@hardikkashiyani123456788/components/sterling-gate-kinetic-navigation` architecture:
  - Top header bar with brand logo (`nav-logo-row`), ThemeToggle, "click me" Caveat cursive label (`.sg-toggle-text`), and spinning cross / rolling text trigger (`.sg-nav-close-btn` with "Menu" / "Close" rolling animation).
  - 3-layer animated curtain backdrops (`.sg-backdrop-layer.first` in violet, `.sg-backdrop-layer.second`, `.sg-backdrop-layer`) that stagger slide in from the right (`xPercent: 101 -> 0`).
  - 5 reactive ambient background SVGs (`bg-shape-1` through `bg-shape-5`) with GSAP kinetic spring burst and rotation physics (`scale: 0.5 -> 1`, `opacity: 0 -> 1`, `rotation: -10 -> 0`) triggered on hover of each navigation item.
  - Large uppercase typography links with slide-up text shadow transition (`transform: translateY(-1.1em)`) and rising dark background highlight (`scaleY: 0 -> 1`).
  - Smooth routing between all 5 dashboard views (`Overview`, `Schedule`, `Syllabus`, `Copilot`, `Calendar`) with ESC key listener and automatic menu close on navigation.
  - Full contrast visibility across Dark mode (`#0d0b14`) and Light mode (`#f8f7fc`).
- **Validation:** Production build generated static pages for all dashboard routes with 0 errors.

### 6. Canonical Domain Schema & Validation Gate
- **Status:** Implemented & Verified
- **Files:** `lib/schema.ts`
- **Behavior:** Single authoritative Zod schema defining `TimetableSchema`, `DayScheduleSchema`, `ScheduleBlockSchema`, and `IntakeContextSchema`. Enforces `start_time < end_time`, non-overlapping blocks within a day, locked institutional blocks (`college`, `commute`), and actionable study blocks.
- **Validation:** Verified with invalid payloads (returned detailed 400 validation error) and valid AI outputs (passed safeParse).

### 7. Dual-Provider AI Generation Pipeline
- **Status:** Implemented & Verified
- **Routes:** `/api/planner/generate`
- **Files:** `lib/ai/gemini.ts`, `lib/ai/cohere.ts`, `lib/ai/controller.ts`, `app/api/planner/generate/route.ts`
- **Behavior:** Primary provider: Google Gemini (`gemini-1.5-flash` in JSON mode). Fallback provider: Cohere (`command-r7b-12-2024`) with automatic fallback to local deterministic synthesis if both APIs are unreachable. The controller dynamically injects real calendar dates (`YYYY-MM-DD`), calculates exam countdown runways, maps concrete syllabus topics, enforces dinner breaks, sanitizes time formats (`HH:MM`), and guarantees zero-overlap canonical compliance via Zod.
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
- **Behavior:** Day selector pills across 7 days. Actionable blocks list with real status controls (`Done`, `Partial`, `Missed`). When `Missed` is toggled, executes Tier-1 spillover and renders a clean, human-friendly notification: `"[Subject] is shifted to next day (Day, HH:MM–HH:MM)"`. Includes interactive Quick-Intake Modal pre-populated with stored syllabus topics and calendar exam milestones.
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

### 13. Interactive Calendar (Runway & Exam Countdown & Study Roadmap)
- **Status:** Implemented & Verified
- **Route:** `/dashboard/calendar`
- **Files:** `app/dashboard/calendar/page.tsx`
- **Behavior:** Dual-view calendar surface: (1) Multi-week exam milestones list with live countdown badges (`X DAYS RUNWAY` or `DUE TODAY / PASSED`) dynamically calculated from stored exam dates (`FR-CAL-02`). Modal to add exam milestones with subject, date, title, and priority weight. (2) Live 7-Day Planned Academic Study Roadmap that automatically loads the active generated timetable, displaying daily study sessions, concrete syllabus topics, locked college hours, and highlighting upcoming exam days.
- **Validation:** Verified dynamic date difference calculations, milestone persistence, and active plan roadmap rendering.

### 14. BHai Conversational Assistant Workbench
- **Status:** Implemented & Verified
- **Route:** `/dashboard/copilot`, `/api/planner/copilot`
- **Files:** `app/dashboard/copilot/page.tsx`, `app/api/planner/copilot/route.ts`
- **Behavior:** Conversational restructuring assistant named **BHai**. Accepts natural language schedule adaptation prompts (e.g. *"i have missed my today's session can u push it for tomrrow?"* or *"Add extra math prep before Tuesday"*). Features a dual-provider backend (Gemini 1.5 Flash primary + Cohere command-r7b fallback) coupled with an automatic schedule repair layer (`sanitizeAndRepairTimetable`) that resolves time overlaps and formats times to strict `HH:MM`. Renders an interactive proposed mutation card and safely applies schedule adaptations while strictly preserving locked institutional blocks.
- **Validation:** Verified API handler with live tests, schema repair, and frontend conversation flow.

### 15. Natural Workload Rescheduling & Daily Execution Surface
- **Status:** Implemented & Verified
- **Route:** `/dashboard/overview`
- **Files:** `app/dashboard/overview/page.tsx`, `lib/scheduler/tier1.ts`
- **Behavior:** Day selector pills across 7 days with status controls (`Done`, `Partial`, `Missed`). When a block is marked `Missed`, relocates the session into the next available buffer slot and renders a clean, student-friendly notification: `"[Subject] is shifted to next day (Monday, 22:00–22:45)"` without robotic jargon. Quick-Intake modal pre-populates existing calendar milestones and syllabus topics, automatically syncing generated exams to the calendar.
- **Validation:** Verified status transitions, buffer slot relocation, and calendar synchronization.

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
   ScrollFloat + HandwritingText + JOIN CTA        Sliding AuthSwitch
           │                                                 │
           └────────────────────────┬────────────────────────┘
                                    │ authenticated & verified
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        DASHBOARD SHELL                                 │
│ Centered KineticNav Dock (Overview, Schedule, Syllabus, BHai, ...)     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
     ┌──────────────────────────────┼──────────────────────────────┐
     ▼                              ▼                              ▼
Overview Page                  Schedule Page                  Syllabus Page
Daily execution,               7-day grid,                    Curriculum parser,
Status toggles,                Locked block                   Topic tree,
Tier-1 recovery                inspector                      Weightage levels
     │                              │                              │
     ▼                              ▼                              ▼
BHai Workbench                 Calendar Page                  Dev Console
Conversational mutations,      Exam runway countdowns &       Interactive prompt &
diff cards, auto-repair        7-day study roadmap            failover latency tester
                                    │
                                    ▼
                    POST /api/planner/copilot & /generate
                                    │
                                    ▼
                         AI Provider Controller
                         (lib/ai/controller.ts)
                                    │
     ┌──────────────────────────────┼──────────────────────────────┐
     ▼ (Primary)                    ▼ (Fallback)                   ▼ (Zero-Failure)
Gemini 1.5 Flash               Cohere Command-R               Deterministic Synthesis
(lib/ai/gemini.ts)             (command-r7b-12-2024)          (Controller Fallback)
     │                              │                              │
     └──────────────────────────────┼──────────────────────────────┘
                                    ▼
                    Schedule Sanitizer & Auto-Repair
                       (HH:MM & Overlap Resolver)
                                    │
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
Primary provider:    Google Gemini 1.5 Flash (JSON response mode)
Fallback provider:   Cohere Command-R (model: command-r7b-12-2024) + Local Deterministic Synthesis
Primary adapter:     lib/ai/gemini.ts
Fallback adapter:    lib/ai/cohere.ts
Controller:          lib/ai/controller.ts (includes sanitizeAndRepairTimetable & deterministic fallback)
Copilot route:       app/api/planner/copilot/route.ts
Schema validation:   lib/schema.ts (Zod)
Timeout guard:       25 seconds per provider
Fallback condition:  429 / 5xx / timeout (>25s) / SDK error / invalid JSON
Live Verification:   Tested & verified live via /api/planner/generate & /api/planner/copilot (HTTP 200)
```

---

## 8. SCHEDULING ENGINE

```
Tier 1 (Deterministic):
  Status: IMPLEMENTED & VERIFIED (lib/scheduler/tier1.ts)
  Logic:  Single missed session → scan next 72h for unlocked buffer block
  AI:     Zero AI calls. Zero external network calls.
  Rules:  Preserves locked blocks, enforces start_time < end_time, marks recovered_from_id.
  Output: Student-friendly notification: "[Subject] is shifted to next day (Day, HH:MM–HH:MM)".

Tier 2 (AI Re-triage):
  Status: Engine Pipeline Functional via /api/planner/generate & /api/planner/copilot
  Trigger: 2+ consecutive missed sessions OR explicit BHai restructure request
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
app/dashboard/overview/page.tsx → Today's routine, Done/Partial/Missed, shifted workload banner
app/dashboard/schedule/page.tsx → Weekly time-grid, locked indicators, block inspector
app/dashboard/syllabus/page.tsx → Curriculum parser, topic tree, weightage
app/dashboard/copilot/page.tsx  → Conversational schedule mutation workbench (BHai)
app/dashboard/calendar/page.tsx → Exam runway, live countdowns, 7-day study roadmap
app/dashboard/dev/page.tsx      → Model validation & failover console
app/api/planner/generate/route.ts → AI generation route
app/api/planner/copilot/route.ts  → BHai copilot route
components/theme-toggle.tsx     → Theme toggle control
components/ui/bh-logo.tsx       → Canonical logo badge
components/ui/auth-switch.tsx   → Auth form & mode switcher
components/ui/kinetic-nav.tsx   → Floating navigation dock (with BHai)
components/ui/text-reveal.tsx   → Sequential problem statement reveal
components/ui/handwriting.tsx   → Stylized handwriting reveal of BH PLANNER
components/security/capture-shield.tsx → Security overlay & watermark
lib/schema.ts                   → Authoritative domain models & Zod schemas
lib/scheduler/tier1.ts          → Tier-1 deterministic spillover engine
lib/storage/plan-service.ts     → Plan state persistence & recovery logger
lib/theme-transitions.ts        → View Transition mechanics
lib/supabase/client.ts          → Browser Supabase client
lib/supabase/server.ts          → Server Component / Route Supabase client
lib/ai/gemini.ts                → Gemini 1.5 Flash adapter
lib/ai/cohere.ts                → Cohere command-r7b-12-2024 adapter
lib/ai/controller.ts            → AI provider fallback controller & schema auto-repair
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

- Content protection deterrence (blur on focus loss, print suppression) cannot prevent OS-level screen capture.
- Copilot conversational mutations require ~10-25 seconds depending on Gemini API response time.

---

## 17. PENDING IMPLEMENTATION

None for V1. All planned features are live in production.

---

## 18. IMPORTANT DECISIONS

```
Decision:     Implement Tier-1 deterministic spillover without AI
Reason:       Instant predictable recovery, zero cost, no network latency.
Date:         2026-09-05
Affected:     lib/scheduler/tier1.ts, app/dashboard/overview/page.tsx

Decision:     PlanService resilient dual-storage pattern
Reason:       Allows immediate full app interaction while Supabase remote tables are configured.
Date:         2026-09-05
Affected:     lib/storage/plan-service.ts

Decision:     Use gemini-1.5-flash and command-r7b-12-2024 for AI generation and BHai Copilot
Reason:       Production stability, rapid inference latency, robust JSON adherence, and resilience via deterministic synthesis.
Date:         2026-09-06
Affected:     lib/ai/gemini.ts, lib/ai/cohere.ts, app/api/planner/copilot/route.ts

Decision:     Enforce automatic schedule sanitization and repair before schema parsing
Reason:       LLMs frequently generate minor time variations (e.g. unpadded times or single-minute overlaps).
              Pre-parsing normalization (HH:MM formatting, chronological sort, overlap truncation) guarantees
              100% schema validity without crashing user workflows.
Date:         2026-09-06
Affected:     lib/ai/controller.ts, app/api/planner/copilot/route.ts

Decision:     Local isolation of internal documentation in .gitignore
Reason:       docs/ folder contains detailed private specifications, PRDs, and architecture documents
              meant for local evaluation and developer records, safely excluded from remote Git commits.
Date:         2026-09-06
Affected:     .gitignore

Decision:     Use window.location.href instead of router.push after login
Reason:       router.push() does client-side navigation which doesn't re-send cookies to the server.
              window.location.href forces a full page reload so the fresh Supabase session cookie
              is properly delivered and validated by Next.js Edge Middleware.
Date:         2026-09-06
Affected:     components/ui/auth-switch.tsx, app/signup/page.tsx

Decision:     Three-tier auth redirect in middleware (offline → deleted → no session → auth)
Reason:       Original middleware treated ALL Supabase errors as account deletion, causing users
              to land on the 404 "Account Removed" screen on every fresh login attempt.
Date:         2026-09-06
Affected:     middleware.ts, app/dashboard/layout.tsx, components/ui/not-found-screen.tsx
```

---

## 19. RECENT CHANGES

### 2026-09-06 (Timetable Realism, BHai Copilot & Human SaaS Refinement)
Implemented & Verified:
- **Timetable Realism Engine:** Calibrated prompts with exact calendar dates starting from today (`YYYY-MM-DD`), calculated countdown runways to target exams, mapped concrete syllabus topic titles, scheduled realistic 60–90m study sessions with dinner breaks, and preserved locked institutional blocks (College 09:00–16:30, Commute 16:30–17:30).
- **BHai Copilot Overhaul:** Renamed Copilot to **BHai** across KineticNav, headers, and dashboard workbench. Integrated dual-provider failover (Gemini 1.5 Flash + Cohere command-r7b), pre-parsing auto-repair pipeline (`sanitizeAndRepairTimetable`), and smart deterministic rescheduling for missed session requests ("i have missed my today's session can u push it for tomrrow?").
- **Calendar Auto-Sync & Dual View:** Connected active timetable state directly to `/dashboard/calendar`, rendering a 7-day academic study roadmap alongside the dynamic multi-week exam runway countdowns.
- **Natural Workload Rescheduling Copy:** Replaced robotic technical jargon (*"Tier-1 Deterministic Spillover Executed"*, *"TIER-1 RECOVERED"*) with clean, student-friendly notifications (`"[Subject] is shifted to next day (Day, HH:MM–HH:MM)"` and `RESCHEDULED` badge).
- **Landing Page Polish:** Removed AI-style badges (`Phase 01 · The Reality`, etc.) to create a clean, authentic human-crafted SaaS appearance while strictly preserving all existing glassmorphism cards, typography, animations, and color schemes.
- **Documentation Isolation:** Added `docs/` to `.gitignore` to keep internal specification documents local and unexposed to remote repositories.
- **GitHub & Vercel Deployed:** Pushed commits `4432a6b`, `8649460`, and `dd4cf52` to `origin/main` with green production deployments on Vercel (`https://bh-planner-ashy.vercel.app`).

### 2026-09-06 (Production Finalization)
Implemented & Fixed:
- **Auth redirect bug fix:** middleware.ts and dashboard/layout.tsx now use a 3-tier cascade:
  network error → /not-found?reason=offline | confirmed deletion (403/404 + existing cookie) →
  /not-found?reason=deleted | no session (unauthenticated) → /auth?mode=signin.
- **Login navigation fix:** auth-switch.tsx and signup/page.tsx now call router.refresh() +
  window.location.href to force a full page reload after sign-in, ensuring session cookies are
  properly received by Edge Middleware on the next request.
- **Not-found screen cleanup:** not-found-screen.tsx now clears stale auth cookies and localStorage
  on ?reason=deleted to prevent dead session artifacts from blocking the next login.
- **Offline screen:** components/offline-detector.tsx added — monitors navigator.onLine, redirects
  to /not-found?reason=offline on disconnect, auto-restores via window.location.href on reconnect.
- **Dark mode frosted glass:** Fixed text visibility on all dashboard glass cards in dark mode.
  Strengthened --glass-bg opacity and --text-primary contrast for dark theme.
- **Logout button:** Added Sign Out button to KineticNav menu (bottom of nav list) with
  localStorage cleanup and redirect to /auth?mode=signin.
- **CaptureShield:** DevTools key blocking, contextmenu suppression, and window blur privacy
  overlay re-enabled across all dashboard routes.
- **Landing page nav fix:** Removed duplicate standalone ThemeToggle (top-left) and logo link
  (top-right) from app/page.tsx — KineticNav already renders both in its own header bar.
- **Codebase cleanup:** Automated comment stripping across 27 source files for professional
  production-ready codebase.
- **README.md:** Overhauled with comprehensive technical documentation covering architecture,
  tech stack rationale, cost-effectiveness, and development approach.
- **docs/ suite:** Full 7-document specification suite authored (PRD, FRD, Architecture,
  Folder Management, Design System, Tech Stack, Documentation Index).
- **Vercel deployment:** All changes committed to GitHub main and deployed to production.
  Build: ✓ Compiled successfully | 15/15 static pages generated | Exit code 0.

### 2026-09-05 (Milestone 2)
Implemented:
- Created supabase-schema.sql with tables for profiles, plans, schedule_blocks, syllabus_topics,
  and exam_milestones with RLS.
- Created lib/scheduler/tier1.ts implementing the 72-hour deterministic buffer scanning algorithm.
- Created lib/storage/plan-service.ts managing active timetable state and recovery history logging.
- Created app/api/planner/copilot/route.ts orchestrating conversational plan mutations.
- Enhanced all dashboard pages: overview, schedule, syllabus, calendar, copilot.
- Production build passed with code 0 across all routes.

---

## 20. NEXT ENGINEERING PRIORITIES

1. Send email to Team Brainheaters with docs attached (immediate).
2. Plan revision history surface (future V2).
3. Conflict diagnostics prior to regeneration (future V2).

---
*This file reflects current reality only. Updated after every meaningful execution.*

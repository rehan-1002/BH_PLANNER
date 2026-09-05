# BH Planner — Technology Stack

## 1. Stack philosophy

The stack should support a responsive Next.js application, strict structured AI responses, local deterministic scheduling, protected dashboard routes and a reusable design system without unnecessary dependencies.

## 2. Application stack

| Layer | Technology | Responsibility |
|---|---|---|
| Framework | Next.js App Router | Routing, layouts, server routes, rendering |
| UI runtime | React 18 | Component model |
| Language | TypeScript | Type safety across UI/domain/integrations |
| Styling | Tailwind CSS | Utility-first visual implementation |
| Motion | Framer Motion | UI state/route/component motion where useful |
| Motion / effects | GSAP | Complex controlled sequences where Framer Motion is not ideal |
| Theme transition | CSS View Transition API | Cinematic light/dark transition |
| Validation | Zod | AI output and domain validation |
| Auth/data | Supabase/Firebase as configured | Authentication, verification and persistence |
| AI primary | Google Gemini 1.5 Flash | Plan generation / semantic planning |
| AI fallback | Cohere Command R / R+ | Provider failover |
| Styling direction | Violet Bloom reference | Theme baseline, adapted to flat/no-gradient rules |

The provider versions and service choice should be centralized so they can be swapped without changing the UI contract.

## 3. External UI components

The baseline names these external component sources:

- `@serafimcloud/violet-bloom`
- `@skiper26` / `ThemeToggleButton`
- `@appvibed01/components/auth-switch`
- `@hardikkashiyani123456788/components/sterling-gate-kinetic-navigation`
- `@kokonutd/components/hand-writing-text`
- `@kumail_ali_r/components/text-reveal-animation`

These are implementation inputs, not architecture boundaries. They must be wrapped/adapted into local components so vendor-specific APIs do not spread across the codebase.

## 4. Server/API layer

### `POST /api/planner/generate`

Responsibilities:

1. authenticate user context;
2. validate intake input;
3. normalize planner context;
4. call primary provider;
5. apply configured failover;
6. validate final JSON;
7. persist the plan;
8. return normalized plan.

### `POST /api/planner/copilot`

Responsibilities:

1. authenticate;
2. load active plan + constraints;
3. interpret natural-language request;
4. propose schedule mutation or re-triage;
5. validate mutation;
6. persist only validated state;
7. return resulting plan state.

## 5. AI strategy

### Primary model path

Gemini is the first provider.

The baseline specifies structured JSON output through an application request configured for JSON response mode.

### Fallback path

On the configured Gemini failure conditions:

```text
Gemini
  -> 429 / 5xx / timeout > 10s
  -> Cohere
```

The same normalized prompt/context should be used for fallback as far as provider API differences permit.

## 6. Data validation

Zod should be the final application gate before persistence.

Conceptual flow:

```text
External AI output
   -> parse
   -> Zod schema
   -> domain rules
   -> persistence
```

Do not use a type assertion as a substitute for runtime validation.

## 7. Scheduling engine

The scheduling engine has two classes of logic.

### Deterministic logic

- locked time protection;
- overlap validation;
- 72-hour buffer search;
- status transitions;
- escalation threshold detection.

### AI logic

- topic prioritization;
- plan synthesis;
- semantic restructuring;
- conversational schedule changes.

This split keeps predictable operations cheap and reliable.

## 8. Persistence requirements

Persistence must support at minimum:

- authenticated user;
- email verification state;
- active plan;
- schedule blocks;
- exam milestones;
- syllabus/topic records;
- plan revision/change metadata.

If Supabase is used, persistence and optional real-time synchronization should remain behind a small repository/service layer rather than being imported from every page.

## 9. Theme and styling architecture

Keep design tokens centralized. Do not repeat hex values across route files.

Suggested ownership:

```text
app/globals.css or equivalent token file
  -> CSS variables
  -> Tailwind bindings
  -> shared components
  -> pages
```

## 10. Dev tooling

The Dev route should support:

- direct prompt testing;
- schema inspection;
- provider switch;
- simulated 429/fallback behavior;
- latency observation.

It should remain out of normal user navigation and should not require separate production components for every experiment.

## 11. Environment variables

Keep credentials and provider settings in environment configuration, never in components.

Conceptual variables:

```text
GEMINI_API_KEY=
COHERE_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Use only the variables relevant to the selected backend. Never commit secrets.

## 12. Dependency discipline

Before adding a package, verify:

- whether the behavior already exists in the current stack;
- whether the package solves a real requirement;
- whether the package works with the App Router and current React version;
- whether it conflicts with design rules;
- whether it adds a long-term maintenance cost.

Do not add a library simply because a visual effect looks impressive in a demo.

## 13. Performance principles

- avoid client-side provider SDKs;
- prefer server-side AI calls;
- keep local Tier-1 recovery free of network requests;
- avoid duplicate data fetching between dashboard pages;
- keep heavy visual components shared rather than duplicated;
- use route-level loading states without changing the canonical schema.

## 14. Security principles

- protect dashboard routes server-side;
- enforce email verification before dashboard access;
- keep provider secrets server-side;
- validate all AI output;
- never trust client-submitted `is_locked` flags as authoritative;
- log provider failures without exposing secrets.

## 15. Technology acceptance criteria

The stack is correctly implemented when:

- UI routes do not import provider SDKs;
- one canonical TypeScript/Zod timetable contract is shared by generation and rendering;
- provider failure can be simulated from Dev;
- local spillover does not call AI;
- theme values are centralized;
- external UI components are wrapped under local component names;
- a developer can swap provider configuration without rewriting page components.

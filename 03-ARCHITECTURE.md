# BH Planner — System Architecture

## 1. Architectural objective

Use a layered system in which deterministic application logic owns time constraints and AI owns semantic planning tasks. The UI must remain a consumer of validated state.

## 2. Logical architecture

```text
┌────────────────────────────────────────────────────────────────────────────┐
│                           BH PLANNER GLOBAL SHELL                           │
│ Theme Toggle | BH Logo | Security/Protection UI | Shared Providers         │
└────────────────────────────────────────────────────────────────────────────┘
                                      │
                ┌─────────────────────┴──────────────────────┐
                ▼                                            ▼
      ┌───────────────────┐                         ┌──────────────────────┐
      │ Public /          │                         │ Auth Gateway         │
      │ Landing Route     │                         │ /auth                │
      └─────────┬─────────┘                         └──────────┬───────────┘
                │                                            │ verified
                └──────────────────────┬─────────────────────┘
                                       ▼
                         ┌──────────────────────────┐
                         │ Protected Dashboard      │
                         │ /dashboard/*            │
                         └────────────┬─────────────┘
                                      │
       ┌───────────────┬──────────────┼──────────────┬───────────────┐
       ▼               ▼              ▼              ▼               ▼
   Overview         Schedule       Syllabus        Copilot        Calendar
       │               │              │              │
       └───────────────┴──────────────┴───────┬──────┘
                                             ▼
                                  ┌──────────────────────┐
                                  │ Application Planner  │
                                  │ + Rescheduler        │
                                  └──────────┬───────────┘
                                             ▼
                                  ┌──────────────────────┐
                                  │ /api/planner/*       │
                                  └──────────┬───────────┘
                                             ▼
                             ┌─────────────────────────────┐
                             │ AI Provider Controller      │
                             │ Gemini -> Cohere fallback   │
                             └──────────────┬──────────────┘
                                            ▼
                                  ┌──────────────────────┐
                                  │ Zod / Domain Schema  │
                                  └──────────┬───────────┘
                                             ▼
                                       Persistence
```

## 3. Runtime boundaries

### Presentation layer
Owns page composition, interactions, loading states and rendering of validated data.

### Domain/application layer
Owns planning policies, deterministic spillover, escalation decisions and mutation rules.

### Integration layer
Owns provider clients and external API details.

### Persistence layer
Owns authenticated user state, plans, schedule changes and syllabus-derived data.

## 4. Data flow — plan generation

```text
Student context
  -> client action
  -> POST /api/planner/generate
  -> normalize input
  -> Gemini attempt
  -> if 429/5xx/timeout, Cohere fallback
  -> validate against schema
  -> persist
  -> return normalized plan
  -> dashboard renders plan
```

The baseline explicitly specifies Gemini first, Cohere fallback, structured JSON and Zod validation.

## 5. Data flow — missed work

```text
User marks study block MISSED
              │
              ▼
     deterministic policy
              │
      ┌───────┴────────┐
      │ eligible buffer│
      │ within 72h?    │
      └───────┬────────┘
          yes │ no
              │  │
              ▼  ▼
         move locally  mark for re-triage
                         │
                         ▼
                  AI re-triage trigger
                         │
                         ▼
                 validate + persist
```

## 6. Locked vs flexible time

Locked blocks represent commitments that the planner must not move through ordinary rescheduling. Examples from the baseline include college and commute/reset periods.

Flexible blocks include study and buffer blocks. The rescheduler may move flexible work only when all schedule constraints remain valid.

## 7. Canonical domain objects

### User session

- user identity
- verification status
- authentication state

### Plan

- `plan_id`
- `generated_provider`
- schedule dates
- revision metadata

### Schedule block

- `id`
- `type`
- `start_time`
- `end_time`
- `title`
- `subject`
- `status` where applicable
- `is_locked`

### Exam milestone

- date
- title/subject
- runway position

### Syllabus topic

- stable topic id
- subject
- title
- priority/weight metadata
- completion state

## 8. Provider controller

The provider controller must expose one application-level function to the rest of the app, conceptually:

```text
generatePlan(input) -> validated Plan
```

The UI must not import Gemini/Cohere SDKs directly.

Provider-specific responsibilities:

```text
lib/ai/gemini.ts  -> Gemini request/response adapter
lib/ai/cohere.ts  -> Cohere request/response adapter
provider controller -> fallback policy + normalized output
schema layer -> final validation
```

## 9. Copilot architecture

Copilot should be treated as a controlled command path, not direct database access:

```text
Natural language
  -> /api/planner/copilot
  -> parse intent
  -> read current plan + constraints
  -> generate proposed mutation/re-triage
  -> schema/domain validation
  -> persist approved change
  -> return changed state + explanation
```

## 10. Security / content-protection layer

The baseline includes client-side deterrence mechanisms:

- print CSS suppression;
- blur-on-visibility/focus loss;
- context-menu blocking;
- key interception for common capture/inspection shortcuts;
- watermarking on full-screen timetable views.

These are deterrence features. They must never be described as a guarantee against operating-system-level screen capture.

## 11. Rendering and performance principles

- Dashboard layout should remain stable across navigation.
- Shared shell components should not be recreated per route.
- AI requests should occur only through server routes.
- Local spillover must avoid network calls.
- Loading/skeleton states should not duplicate the underlying domain model.

## 12. Failure model

| Failure | System behavior |
|---|---|
| Gemini 429 | Fallback to Cohere |
| Gemini 5xx | Fallback to Cohere |
| Gemini timeout > 10s | Fallback to Cohere |
| Cohere failure | Surface generation failure; do not save invalid data |
| Invalid provider JSON | Reject output and surface schema failure |
| No spillover buffer | Flag re-triage needed |
| Unauthorized dashboard access | Block route |
| Unverified auth | Block dashboard |

## 13. Architectural guardrails

- Never let client code write an arbitrary timetable object to persistence.
- Never let an AI provider bypass domain validation.
- Never let a visual component own scheduling logic.
- Never create provider calls from page components.
- Never fork the timetable schema for a single page.

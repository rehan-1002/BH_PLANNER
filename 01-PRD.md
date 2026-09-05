# BH Planner — Product Requirements Document (PRD)

## 1. Product definition

BH Planner is an adaptive study-planning application for students who need a realistic study schedule around fixed college hours, commute, exams, syllabus coverage and changing daily completion.

The product is not positioned as a generic calendar. Its core value is **continuous plan adaptation**: generate an initial plan, observe actual completion, recover missed work locally, and invoke AI only when meaningful restructuring is required.

## 2. Problem

Students commonly have multiple constraints at the same time:

- fixed college hours;
- commute and recovery time;
- multiple subjects and syllabus modules;
- unequal topic difficulty/importance;
- approaching exam deadlines;
- missed sessions that make a static timetable obsolete.

A useful planner therefore needs to treat the timetable as a living system rather than a one-time AI output.

## 3. Product goals

### G1 — Produce a usable study plan
Generate a structured timetable from the student's intake context and preserve fixed time blocks.

### G2 — Make the plan resilient
A missed session should not destroy the entire week. Small changes should happen locally without unnecessary AI calls.

### G3 — Escalate intelligently
Repeated misses or explicit restructuring requests should trigger AI-based re-triage across the remaining exam runway.

### G4 — Make the reasoning inspectable
The user should be able to see schedule status, syllabus coverage, exam runway and AI-driven adjustments without interacting with an opaque black box.

### G5 — Keep the interface distinctive
The product must use a deliberate, restrained visual system rather than a typical gradient-heavy AI SaaS dashboard.

## 4. Users

### Primary user
A student planning study work around college and exam constraints.

### Secondary user
A developer/maintainer using the Dev route to validate model outputs, schema compliance and provider failover behavior.

## 5. Product principles

1. **Constraints before aesthetics.** Time reality beats visual polish.
2. **Local recovery before AI.** Use deterministic rescheduling when possible.
3. **AI for synthesis, not basic arithmetic.** The application owns deterministic scheduling constraints; AI owns high-level prioritization and conversational restructuring.
4. **One schedule model.** Every page reads the same canonical timetable structure.
5. **Calm, technical interface.** No visual noise, no decorative gradients, no generic cards everywhere.

## 6. Core journey

```text
Landing
  -> Join
Authentication
  -> Email verification
Dashboard
  -> Intake context
  -> Generate plan
  -> Review / execute schedule
  -> Mark Done / Partial / Missed
  -> Tier-1 local recovery OR Tier-2 AI re-triage
  -> Continue toward exam runway
```

The supplied baseline specifically defines the landing sequence, auth gate and dashboard route structure. See architecture and FRD for implementation details.

## 7. Scope

### P0 — Must exist

- Landing page with the specified reveal sequence and JOIN CTA.
- Sign-in/sign-up gateway with mandatory email verification.
- Protected dashboard.
- Overview with daily routine checklist and status.
- Schedule with recurring college calendar and exam dates.
- Syllabus ingestion and topic/weightage representation.
- AI plan generation endpoint.
- Strict timetable JSON validation.
- Done / Partial / Missed status handling.
- Tier-1 spillover for missed study work.
- Tier-2 AI re-triage after repeated misses or explicit restructuring.
- Copilot conversational schedule adjustment.
- Calendar/exam runway.
- Dev route for provider/schema testing when enabled.
- Dual-provider failover path.

### P1 — Product hardening

- Clear explanations of why a block moved.
- Better conflict diagnostics before regeneration.
- Plan version history.
- More granular topic progress.

### Out of scope for the baseline

- Social study feeds.
- Public student profiles.
- Gamification-first systems.
- Marketplace/course content.
- Unrelated productivity suites.

## 8. Functional modules

| Module | Product responsibility |
|---|---|
| Landing | Explain product and transition into auth |
| Auth | Create/authenticate user and enforce verification |
| Overview | Show today's actionable routine and status |
| Schedule | Show fixed + flexible timetable blocks |
| Syllabus | Ingest and track topics/weights |
| Copilot | Convert natural-language requests into safe schedule changes |
| Calendar | Show exam milestones / runway |
| Dev | Validate models, schemas and failover behavior |

## 9. Success criteria

A release is successful when a student can go from authentication to a generated weekly plan, mark work as missed, see a deterministic recovery where applicable, and invoke AI restructuring when the deterministic policy escalates.

## 10. Non-goals

- Preventing screenshots at the operating-system level.
- Treating AI output as trusted without validation.
- Making the product look like a generic AI template.
- Creating a separate page for every small interaction.

## 11. Risks

| Risk | Mitigation |
|---|---|
| Invalid model JSON | Zod validation + provider fallback |
| API rate limit / outage | Gemini -> Cohere failover |
| Over-rescheduling | Tier-1 deterministic scope + escalation thresholds |
| Schedule conflicts | Locked block semantics + server validation |
| File sprawl | Folder ownership rules in `04-FOLDER-MANAGEMENT.md` |
| Visual inconsistency | Centralized design tokens + component registry |

## 12. Release gates

A release candidate must satisfy:

- all P0 flows work end-to-end;
- generated schedules validate against the canonical contract;
- locked blocks are never altered by ordinary rescheduling;
- Tier-1 logic is deterministic and local;
- Tier-2 can call an AI provider and validate the result;
- dashboard routes use the shared shell;
- no prohibited design patterns are introduced;
- no unowned files or duplicate components are added.

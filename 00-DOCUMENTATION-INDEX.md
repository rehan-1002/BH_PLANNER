# BH Planner Documentation Index

**Project:** BH Planner  
**Documentation set:** Product + Functional + Architecture + Folder Management + Design + Tech Stack  
**Baseline:** Existing BH Planner system specification supplied for this project.

## Purpose

This folder is the single documentation source for designing and building BH Planner. The documents are intentionally separated by responsibility so requirements, behavior, architecture, file ownership, visual language, and technology choices do not become mixed together.

## Document map

| File | Purpose | Owner of truth |
|---|---|---|
| `01-PRD.md` | Why BH Planner exists, who it serves, outcomes, scope, priorities | Product intent |
| `02-FRD.md` | Exact functional behavior, flows, states, validation, acceptance criteria | Product behavior |
| `03-ARCHITECTURE.md` | System boundaries, runtime flow, data contracts, resilience, security | Technical architecture |
| `04-FOLDER-MANAGEMENT.md` | File ownership, naming, import boundaries, anti-file-waste rules | Repository structure |
| `05-DESIGN-DOC.md` | Visual system, external UI components, interaction rules, anti-AI-slop constraints | UI/UX |
| `06-TECHSTACK.md` | Frameworks, libraries, APIs, infrastructure, integration responsibilities | Technology |

## Cross-document invariants

1. **The timetable JSON contract is canonical.** UI components render it; they do not invent alternate schedule shapes.
2. **Route ownership is explicit.** A feature belongs to the route already assigned to it before any new route is created.
3. **Component reuse is mandatory.** A visual pattern becomes a shared component before it is copied into another page.
4. **No duplicate provider clients.** Gemini and Cohere integration files remain under `lib/ai/`.
5. **No new UI library by convenience.** External components must be approved against the design document and recorded in the component registry.
6. **No gradients. No generic AI dashboard templates. No emoji UI.** These are hard design constraints.
7. **No unnecessary files.** New files require an ownership reason and must have a single clear importing parent.

## Source alignment

The baseline specification defines a public landing route, a strict authentication gateway, a full-screen dashboard with Overview, Schedule, Syllabus, Copilot, Calendar and Dev routes, a dual-provider generation engine, a strict JSON timetable contract, Tier-1 spillover and Tier-2 AI re-triage, and the stated visual/security direction. These documents expand that specification without changing its core architecture.

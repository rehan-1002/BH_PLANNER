# BH Planner — Folder Management & File Governance

## 1. Objective

This document exists to prevent file sprawl: duplicate components, route-specific versions of shared logic, abandoned experiments, unused UI wrappers, provider clients scattered across the project, and one-off files that have no clear owner.

## 2. Canonical repository layout

```text
bh-planner/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── auth/
│   │   └── page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── overview/page.tsx
│   │   ├── schedule/page.tsx
│   │   ├── syllabus/page.tsx
│   │   ├── copilot/page.tsx
│   │   ├── calendar/page.tsx
│   │   └── dev/page.tsx
│   └── api/
│       └── planner/
│           ├── generate/route.ts
│           └── copilot/route.ts
├── components/
│   ├── theme-toggle.tsx
│   ├── ui/
│   │   ├── auth-switch.tsx
│   │   ├── handwriting.tsx
│   │   ├── kinetic-nav.tsx
│   │   └── text-reveal.tsx
│   └── security/
│       └── capture-shield.tsx
├── lib/
│   ├── ai/
│   │   ├── gemini.ts
│   │   └── cohere.ts
│   └── theme-transitions.ts
└── [supporting config files only]
```

The above mirrors the supplied baseline implementation layout. Additional folders should be added only when a responsibility genuinely does not fit the existing owners.

## 3. File ownership matrix

| Path | Owns | Must NOT own |
|---|---|---|
| `app/layout.tsx` | global providers, global shell wiring, view transitions, protection wrapper | page-specific business logic |
| `app/page.tsx` | landing composition | auth logic, planner logic |
| `app/auth/page.tsx` | auth-screen composition | provider SDK implementation |
| `app/dashboard/layout.tsx` | dashboard shell/nav | individual page logic |
| `app/dashboard/*/page.tsx` | page-specific composition | reusable visual primitives used elsewhere |
| `app/api/planner/generate/route.ts` | generation request orchestration | UI rendering |
| `app/api/planner/copilot/route.ts` | Copilot request orchestration | direct browser-only UI behavior |
| `components/ui/*` | reusable UI patterns | database access |
| `components/security/*` | security/containment UI | planner algorithms |
| `lib/ai/*` | external AI provider adapters | JSX/layout |
| `lib/theme-transitions.ts` | theme transition mechanics | component-specific styles |

## 4. Naming rules

Use:

- lowercase kebab-case for component filenames;
- `page.tsx` and `layout.tsx` only where Next.js routing requires them;
- `route.ts` only for route handlers;
- noun-oriented domain files rather than vague names;
- one canonical name per concept.

Avoid:

```text
component-new.tsx
component-final.tsx
component-final-2.tsx
helpers.ts
utils2.ts
TestDashboard.tsx
OldSchedule.tsx
NewSchedule.tsx
```

## 5. The single-owner rule

Every production file must have one clear reason to exist and one primary importing owner.

Before creating a file, answer:

```text
1. Does this responsibility already exist?
2. Can the behavior fit into the existing owner without becoming incoherent?
3. Will more than one route reuse it?
4. Is the file introducing a new domain responsibility?
```

If the answer to #1 is yes and #4 is no, extend the existing file/component instead of creating a duplicate.

## 6. Component promotion rule

A UI pattern starts local only when it is genuinely page-specific.

Promote it into `components/ui/` when:

- it appears in two or more routes;
- it needs shared behavior;
- consistency matters across routes.

Do not create a generic `Card`, `Panel`, `Box`, `Container`, `Thing`, or `Widget` component without a documented design-system purpose.

## 7. Route rule

Do not create a new dashboard route for a feature that belongs inside an existing page.

Examples:

- a daily progress modal belongs to Overview;
- an exam detail drawer belongs to Calendar or Schedule;
- a topic detail panel belongs to Syllabus;
- a schedule-change confirmation belongs to Copilot or the relevant schedule screen.

Create a route only when the feature needs an independently navigable information architecture.

## 8. External component intake rule

Every external component mentioned in the design document must follow this path:

```text
External component selected
        -> registry entry
        -> adapter/wrapper if needed
        -> shared location
        -> usage in route
```

Do not paste a vendor component directly into five pages.

## 9. No-waste development workflow

### Before coding
Search the repository for an existing component or function.

### During coding
Extend existing ownership whenever the concept remains coherent.

### After coding
Remove temporary debug files, screenshots, prompt dumps and unused test components before commit.

## 10. Required exceptions

### `dev/`
The Dev route is explicitly allowed to contain developer-only controls because this is a separate product responsibility.

### Temporary experiments
A temporary experiment must live outside the production import graph and must be deleted before release.

Do not keep `backup`, `old`, `draft`, `copy`, `tmp`, `temp`, or `final2` production files.

## 11. Import direction

Preferred dependency direction:

```text
app route/page
    -> components
    -> domain/application helpers
    -> lib integrations
```

Avoid:

```text
lib/ai -> page
component -> another page
route handler -> UI component
UI component -> provider SDK
```

## 12. Change checklist

A pull request adding a file should document:

- why the existing owner is insufficient;
- the new file's single responsibility;
- its importing parent;
- whether it should become shared later;
- whether an existing file can be deleted as a result.

## 13. Anti-sprawl hard rules

1. No duplicate provider client.
2. No duplicate navigation component.
3. No duplicate timetable types/schema.
4. No route-specific copy of a shared visual component.
5. No unused imports or dead files at release.
6. No hard-coded schedule examples in production UI.
7. No provider SDK calls from client components.
8. No design-token copies scattered across pages; tokens stay centralized.

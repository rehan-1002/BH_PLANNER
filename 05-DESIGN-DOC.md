# BH Planner — Design System & UI Direction

## 1. Design intent

BH Planner should feel like a focused academic planning instrument: editorial, technical, controlled and slightly atmospheric.

It must **not** resemble the default AI SaaS aesthetic.

## 2. Non-negotiable visual rules

### Hard prohibitions

- **No gradients.** None in backgrounds, text fills, buttons, cards, borders or decorative effects.
- **No emojis** in the product UI.
- No generic “AI assistant” hero with floating glowing blobs.
- No oversized rounded-everything card grid.
- No random glassmorphism on every element.
- No rainbow color systems.
- No excessive glow effects.
- No stock-template dashboard composition.
- No decorative illustrations that do not communicate information.
- No fake 3D decoration merely to make the UI look “AI”.

### Required qualities

- restrained violet accent;
- strong hierarchy;
- generous but purposeful spacing;
- readable typography;
- clear status semantics;
- motion used to communicate state, not to decorate;
- consistent panel geometry;
- deliberate use of translucency only where the baseline calls for frosted surfaces.

## 3. Theme source

The baseline is based on `@serafimcloud/violet-bloom`, but BH Planner's implementation is constrained to a **flat, non-gradient** interpretation of that theme.

### Dark mode — default

```text
Canvas:          #0d0b14
Frosted panel:   rgba(26, 21, 38, 0.55)
Border:          rgba(147, 112, 219, 0.18)
Primary accent:  #8b5cf6
Foreground:      #f3f0f9
Muted foreground:#a79fb7
```

### Light mode — Violet Frost

```text
Canvas:          #f8f7fc
Frosted panel:   rgba(255, 255, 255, 0.65)
Border:          rgba(139, 92, 246, 0.15)
Foreground:      #1a1526
Primary accent:  #8b5cf6
```

These values are from the supplied baseline.

## 4. Layout anchors

### Global header dock

- Top-left: theme toggle at approximately `top-5 left-6`, high z-index.
- Top-right: rounded frosted BH badge around the logo.
- Dashboard: centered kinetic navigation dock.

The shell remains spatially consistent across dashboard pages.

## 5. Typography

Typography should prioritize hierarchy over novelty.

### Landing

- Handwriting component for the `BH PLANNER` reveal.
- `BH` uses primary accent; `PLANNER` uses foreground.

### Dashboard

- Prefer a clean neutral sans for general UI.
- Use restrained monospace only where a technical/data treatment genuinely improves scanability, such as identifiers, times or developer output.
- Avoid using a decorative font for every heading.

## 6. Spatial language

Use a small set of repeatable shapes:

- medium-radius frosted panels;
- sharp or modestly rounded data surfaces;
- thin borders;
- compact control groups;
- full-screen page sections.

Do not introduce a new radius, shadow or border treatment for each component.

## 7. Surface rules

Frosted surfaces are for meaningful layering:

- auth card;
- dashboard shell overlays;
- navigation dock;
- protected content overlays;
- selected control surfaces.

Do not turn every text container into a translucent card.

## 8. Interaction and motion

Motion should answer a question:

- **Where am I?** navigation transition.
- **What changed?** status or schedule mutation.
- **What is entering/leaving?** route or modal transition.
- **What requires attention?** restrained state emphasis.

Do not animate persistent informational content continuously.

## 9. View transition

The baseline specifies `document.startViewTransition` for cinematic theme switching, using radial clipping between dark and light states.

The transition should remain brief, controlled and subordinate to content.

## 10. External components registry

The following external component references are part of the baseline and should be treated as a controlled registry, not copy-paste snippets.

| External reference | Intended role | Local owner |
|---|---|---|
| `@serafimcloud/violet-bloom` | Theme direction | theme tokens + global CSS |
| `@skiper26` / `ThemeToggleButton` | Theme toggle interaction | `components/theme-toggle.tsx` |
| `@appvibed01/components/auth-switch` | Auth sign-in/sign-up transition | `components/ui/auth-switch.tsx` |
| `@hardikkashiyani123456788/components/sterling-gate-kinetic-navigation` | Dashboard navigation dock | `components/ui/kinetic-nav.tsx` |
| `@kokonutd/components/hand-writing-text` | Landing handwriting reveal | `components/ui/handwriting.tsx` |
| `@kumail_ali_r/components/text-reveal-animation` | Landing scroll text sequence | `components/ui/text-reveal.tsx` |

### Integration rule

Each external component must be adapted to BH Planner tokens and behavior. Vendor defaults must not override the product's visual prohibitions.

For example, if a component ships with a gradient, glow or decorative shadow, those defaults must be disabled or replaced.

## 11. Landing page design

### Sequence

```text
1. Problem statement
2. Problem statement
3. Product assertion
4. BH PLANNER handwriting reveal
5. JOIN
```

The copy should feel direct and confident. Do not add exaggerated AI marketing phrases such as “revolutionary”, “next-generation intelligence”, “supercharge your life”, etc.

## 12. Dashboard design language

### Overview

A command surface for today, not a wall of analytics.

Primary hierarchy:

```text
Today
  -> next actionable block
  -> status/checklist
  -> recovery indicator
  -> supporting schedule context
```

### Schedule

Optimize for time scanning:

```text
TIME    TYPE       SUBJECT / TITLE                    STATUS
09:00   COLLEGE    College Core Hours                 LOCKED
16:30   COMMUTE    Transit / Reset Buffer             LOCKED
18:30   STUDY      Linear Algebra & Matrices          PENDING
```

### Syllabus

Prioritize topic recognition and progress rather than decorative cards.

### Copilot

Treat the conversation as a workbench. The user should understand the current plan and the proposed mutation.

### Calendar

Favor a runway narrative: today -> next milestone -> exam deadline.

## 13. Status language

Use semantic visual differences, not only color:

- `Done`: completed state + text label.
- `Partial`: incomplete state + remaining work indication.
- `Missed`: explicit missed label and recovery action.
- `Pending`: neutral actionable state.
- `Locked`: visually fixed and non-editable.

## 14. Security overlay design

The baseline protection overlay says:

> Content hidden for security.

Use this exact functional intent but keep the presentation minimal: high blur, strong darkened layer and no decorative noise.

## 15. Watermarking

The baseline specifies a diagonal, semi-transparent SVG watermark containing authenticated student email and session timestamp on full-screen timetable views.

Implementation rule: keep opacity low enough to preserve readability while remaining visible in captured material.

## 16. Responsive behavior

### Desktop
Primary target. Preserve the dashboard dock and full-screen spatial composition.

### Tablet
Collapse secondary density, retain navigation and schedule readability.

### Mobile
Convert wide timetable presentations into stacked blocks or horizontal time scrolling only where necessary. Never allow clipped critical text.

## 17. Accessibility rules

- Visible focus states.
- Keyboard navigation for primary controls.
- Status cannot be communicated through color alone.
- Sufficient contrast for muted text.
- Motion should respect reduced-motion preferences.
- Interactive controls require accessible names.

## 18. AI-slop prevention checklist

Before accepting a screen, ask:

```text
Does this look like a generic AI startup landing page?
Does every section need a card?
Did we add a gradient because the empty space felt boring?
Are glows doing a real communication job?
Could this exact screen belong to any random productivity app?
Are there unnecessary icons/emojis everywhere?
```

If the answer suggests genericity, remove decoration before adding more.

## 19. Visual acceptance test

A design is accepted only when:

- no gradients exist;
- the violet accent is controlled rather than dominant;
- hierarchy is obvious without heavy shadow/glow;
- the timetable is easier to scan than to admire;
- animations communicate change;
- shared components look identical across routes;
- the page does not resemble a stock AI dashboard.

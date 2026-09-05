# BH Planner — Functional Requirements Document (FRD)

## 1. Functional model

The application has six main runtime states:

```text
PUBLIC
  -> AUTH_REQUIRED
  -> EMAIL_UNVERIFIED
  -> AUTHENTICATED
  -> PLAN_ACTIVE
  -> RESCHEDULE_REQUIRED
```

The user interface may render different pages, but these state transitions define the underlying product behavior.

## 2. Landing page requirements

### FR-LAND-01
The root route `/` shall provide the full-width landing experience.

### FR-LAND-02
The page shall implement the defined reveal sequence:

1. `Unorganised planning?`
2. `No schedule?`
3. `ALL solution is here`
4. Handwriting reveal of `BH PLANNER`

### FR-LAND-03
The JOIN CTA shall navigate to `/auth`.

### FR-LAND-04
Landing interactions must not introduce horizontal scroll.

## 3. Authentication requirements

### FR-AUTH-01
`/auth` shall expose sign-in and sign-up through the specified sliding auth-switch interaction.

### FR-AUTH-02
Sign-up shall initiate email verification.

### FR-AUTH-03
An unverified session shall not access `/dashboard/*`.

### FR-AUTH-04
The verification state shall explain that access is blocked until email confirmation.

### FR-AUTH-05
After successful verification callback, the user may enter `/dashboard/overview`.

## 4. Dashboard shell requirements

### FR-DASH-01
Protected dashboard routes shall share one layout.

### FR-DASH-02
The shell shall provide the kinetic navigation dock, BH logo and theme toggle placement defined by the design document.

### FR-DASH-03
Navigation state shall not recreate a new navigation component per page.

## 5. Overview requirements

### FR-OVR-01
Display today's scheduled blocks.

### FR-OVR-02
Study work shall support statuses:

- `pending`
- `done`
- `partial`
- `missed`

### FR-OVR-03
Status changes shall persist.

### FR-OVR-04
A status change to `missed` shall invoke the rescheduling policy.

### FR-OVR-05
The UI shall show whether recovery was deterministic or AI-driven when such information exists.

## 6. Schedule requirements

### FR-SCH-01
Display recurring college hours.

### FR-SCH-02
Locked intervals shall be visually and logically distinct from flexible study blocks.

### FR-SCH-03
The baseline schedule example uses `09:00–16:30` college time and `16:30–17:30` commute/reset time; actual user inputs must drive the stored schedule.

### FR-SCH-04
Exam dates shall be represented as milestones used for runway calculations.

### FR-SCH-05
Normal edits must never mutate blocks where `is_locked = true`.

## 7. Syllabus requirements

### FR-SYL-01
Accept syllabus text/document ingestion through the configured parser flow.

### FR-SYL-02
Represent topics/modules in a trackable structure.

### FR-SYL-03
Expose AI-generated weightage/priority indicators as derived metadata, not as the canonical source of the syllabus.

### FR-SYL-04
Topic identifiers used by the schedule should remain stable across regeneration whenever possible.

## 8. Plan generation requirements

### FR-GEN-01
The client shall submit intake context to `/api/planner/generate`.

### FR-GEN-02
The server shall attempt Gemini first using structured JSON response mode.

### FR-GEN-03
If Gemini fails through the defined 429/5xx/timeout conditions, dispatch the same normalized request to Cohere.

### FR-GEN-04
The returned output shall be validated against the canonical timetable schema before persistence.

### FR-GEN-05
The persisted plan shall record its generating provider.

## 9. Rescheduling requirements

### FR-RES-01 — Tier 1
When a study block becomes `missed`, search the next 72 hours for the closest suitable unlocked `buffer` block.

### FR-RES-02
Tier 1 must be local and deterministic; it should not call an AI model.

### FR-RES-03
If no suitable buffer exists, leave the work unresolved and surface that the plan requires re-triage.

### FR-RES-04 — Tier 2
Trigger AI re-triage after two or more consecutive missed sessions or when Copilot requests restructuring.

### FR-RES-05
AI re-triage must preserve locked time, respect exam dates and return the same canonical schema.

## 10. Copilot requirements

### FR-COP-01
`/dashboard/copilot` shall provide a full-page conversational workspace.

### FR-COP-02
Copilot requests shall be sent through `/api/planner/copilot`.

### FR-COP-03
The server shall translate natural-language requests into a validated schedule change rather than allowing arbitrary client-side timetable mutation.

### FR-COP-04
Every accepted Copilot change shall be explainable as a schedule mutation or re-triage result.

## 11. Calendar requirements

### FR-CAL-01
Display exam milestones over multiple weeks.

### FR-CAL-02
Countdowns shall be derived from stored exam dates, not hard-coded presentation text.

## 12. Dev route requirements

### FR-DEV-01
The Dev route shall be hidden or restricted to development/admin access.

### FR-DEV-02
Provide a direct model prompt tester.

### FR-DEV-03
Provide schema inspection.

### FR-DEV-04
Provide provider switch/circuit-breaker simulation for 429, fallback and latency testing.

### FR-DEV-05
Dev tests must not silently mutate the student's active production timetable unless an explicit test-save action exists.

## 13. Canonical timetable contract

```json
{
  "plan_id": "bh_plan_98214",
  "generated_provider": "gemini-1.5-flash",
  "schedule": [
    {
      "date": "2026-09-06",
      "day_of_week": "Monday",
      "blocks": [
        {
          "id": "blk_01",
          "type": "college",
          "start_time": "09:00",
          "end_time": "16:30",
          "title": "College Core Hours",
          "subject": null,
          "is_locked": true
        },
        {
          "id": "blk_02",
          "type": "commute",
          "start_time": "16:30",
          "end_time": "17:30",
          "title": "Transit / Reset Buffer",
          "subject": null,
          "is_locked": true
        },
        {
          "id": "blk_03",
          "type": "study",
          "start_time": "18:30",
          "end_time": "20:00",
          "title": "Module 3: Linear Algebra & Matrices",
          "subject": "Engineering Mathematics",
          "status": "pending",
          "is_locked": false
        }
      ]
    }
  ]
}
```

## 14. Validation rules

- `start_time < end_time`.
- A block cannot overlap another block within the same day.
- Locked blocks cannot be moved by ordinary rescheduling.
- Study blocks must have a subject when a topic is assigned.
- Status applies to actionable work, not fixed institutional blocks.
- Unknown block types must fail validation rather than be silently accepted.
- AI output is never persisted before schema validation.

## 15. Acceptance scenarios

### Scenario A — Successful generation
**Given** valid college hours, exam dates and syllabus  
**When** the user requests a plan  
**Then** a validated plan is saved and shown in Overview/Schedule.

### Scenario B — Missed session with buffer
**Given** a missed study session and a suitable buffer within 72 hours  
**When** the miss is recorded  
**Then** the topic is moved into the closest eligible buffer without an AI request.

### Scenario C — Repeated misses
**Given** two or more consecutive misses  
**When** the next recovery is evaluated  
**Then** the system escalates to AI re-triage and validates the returned plan.

### Scenario D — Provider failure
**Given** Gemini returns a configured retry/failure condition  
**When** generation is attempted  
**Then** the same normalized request is routed to Cohere and validated.

## 16. Error behavior

Errors must be visible as operational states, not swallowed:

- authentication error;
- verification pending;
- provider timeout;
- provider rate limit;
- invalid AI schema;
- schedule conflict;
- no eligible spillover slot;
- unauthorized Dev route access.

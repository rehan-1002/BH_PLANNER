import { callGemini } from "./gemini";
import { callCohere } from "./cohere";
import { IntakeContext, Timetable, TimetableSchema, ScheduleBlock } from "../schema";

export interface PlanGenerationResult {
  timetable: Timetable;
  providerUsed: string;
  fallbackOccurred: boolean;
  rawResponseLength: number;
}

function cleanJsonString(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  return cleaned.trim();
}

/**
 * Normalizes single-digit times to 24-hour HH:MM format
 */
export function normalizeTimeFormat(t: string): string {
  if (!t) return "09:00";
  const parts = t.trim().split(":");
  if (parts.length < 2) return "09:00";
  const h = Math.min(23, Math.max(0, parseInt(parts[0], 10) || 0)).toString().padStart(2, "0");
  const m = Math.min(59, Math.max(0, parseInt(parts[1], 10) || 0)).toString().padStart(2, "0");
  return `${h}:${m}`;
}

export function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(totalMins: number): string {
  const clamped = Math.min(23 * 60 + 59, Math.max(0, totalMins));
  const h = Math.floor(clamped / 60).toString().padStart(2, "0");
  const m = (clamped % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

/**
 * Sanitizes and repairs any formatting quirks or time overlaps from AI outputs
 * to guarantee 100% strict Zod canonical schema compliance.
 */
export function sanitizeAndRepairTimetable(
  raw: any,
  intake?: IntakeContext,
  fallbackPlanId?: string
): Timetable {
  const planId = raw?.plan_id || fallbackPlanId || `bh_plan_${Date.now().toString(36)}`;
  const provider = raw?.generated_provider || "bh_planner_engine";

  const rawSchedule = Array.isArray(raw?.schedule) ? raw.schedule : [];
  const now = new Date();

  // If schedule is empty or malformed, build default 7 days
  const baseDays = rawSchedule.length >= 7
    ? rawSchedule.slice(0, 7)
    : Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(now);
        d.setDate(d.getDate() + i);
        return {
          date: d.toISOString().slice(0, 10),
          day_of_week: d.toLocaleDateString("en-US", { weekday: "long" }),
          blocks: rawSchedule[i]?.blocks || [],
        };
      });

  const repairedSchedule = baseDays.map((dayObj: any, dayIdx: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + dayIdx);
    const dateStr = typeof dayObj?.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dayObj.date)
      ? dayObj.date
      : d.toISOString().slice(0, 10);
    const dayOfWeek = typeof dayObj?.day_of_week === "string" && dayObj.day_of_week.length > 0
      ? dayObj.day_of_week
      : d.toLocaleDateString("en-US", { weekday: "long" });

    const rawBlocks = Array.isArray(dayObj?.blocks) ? dayObj.blocks : [];

    // Map each block into canonical form
    const cleanedBlocks: ScheduleBlock[] = rawBlocks.map((b: any, bIdx: number) => {
      let bType: "college" | "commute" | "study" | "buffer" = "study";
      const rawType = (b?.type || "").toLowerCase();
      if (rawType.includes("college") || rawType.includes("class") || rawType.includes("lecture")) {
        bType = "college";
      } else if (rawType.includes("commute") || rawType.includes("travel") || rawType.includes("transit")) {
        bType = "commute";
      } else if (rawType.includes("buffer") || rawType.includes("break") || rawType.includes("rest") || rawType.includes("flex")) {
        bType = "buffer";
      }

      let startTime = normalizeTimeFormat(b?.start_time || "18:00");
      let endTime = normalizeTimeFormat(b?.end_time || "19:30");

      if (timeToMinutes(endTime) <= timeToMinutes(startTime)) {
        endTime = minutesToTime(timeToMinutes(startTime) + 60);
      }

      const isLocked = bType === "college" || bType === "commute";
      const validStatus: "pending" | "done" | "partial" | "missed" =
        ["pending", "done", "partial", "missed"].includes(b?.status) ? b.status : "pending";

      return {
        id: b?.id && typeof b.id === "string" && b.id.trim().length > 0
          ? b.id
          : `blk_${planId.slice(-6)}_${dayIdx}_${bIdx}`,
        type: bType,
        start_time: startTime,
        end_time: endTime,
        title: b?.title && typeof b.title === "string" && b.title.trim().length > 0
          ? b.title
          : bType === "college"
          ? "College Core Hours"
          : bType === "commute"
          ? "Commute & Mental Reset Buffer"
          : bType === "buffer"
          ? "Tier-1 Evening Spillover & Review Buffer"
          : "Focused Subject Study Session",
        subject: isLocked ? null : (b?.subject || null),
        status: validStatus,
        is_locked: isLocked,
      };
    });

    // Chronologically sort blocks
    cleanedBlocks.sort((a, b) => timeToMinutes(a.start_time) - timeToMinutes(b.start_time));

    // Resolve any overlaps
    for (let i = 0; i < cleanedBlocks.length - 1; i++) {
      const curr = cleanedBlocks[i];
      const next = cleanedBlocks[i + 1];
      const currEnd = timeToMinutes(curr.end_time);
      const nextStart = timeToMinutes(next.start_time);

      if (currEnd > nextStart) {
        // If overlap exists, adjust next block to start after current block
        const duration = Math.max(30, timeToMinutes(next.end_time) - nextStart);
        next.start_time = minutesToTime(currEnd);
        next.end_time = minutesToTime(currEnd + duration);
      }
    }

    return {
      date: dateStr,
      day_of_week: dayOfWeek,
      blocks: cleanedBlocks,
    };
  });

  return {
    plan_id: planId,
    generated_provider: provider,
    schedule: repairedSchedule,
  };
}

/**
 * Deterministic Academic Timetable Synthesizer.
 * Generates an optimized, constraint-respecting 7-day timetable directly from
 * student intake context if all external AI network calls fail.
 */
export function generateDeterministicCanonicalPlan(intake: IntakeContext): Timetable {
  const planId = `bh_plan_${Date.now().toString(36)}`;
  const now = new Date();

  const collegeStart = intake.collegeHours.start_time || "09:00";
  const collegeEnd = intake.collegeHours.end_time || "16:30";
  const commuteEnd = minutesToTime(timeToMinutes(collegeEnd) + (intake.commuteMinutes || 60));

  // Determine top priority subjects from exam runway
  const sortedExams = [...intake.examDates].sort((a, b) => a.date.localeCompare(b.date));
  const primarySubject = sortedExams[0]?.subject || "Core Academic Focus";
  const secondarySubject = sortedExams[1]?.subject || primarySubject;

  const topics = intake.syllabusTopics.length > 0
    ? intake.syllabusTopics
    : [
        { id: "top_1", subject: primarySubject, title: `${primarySubject}: Core Concept Mastery & High-Weightage Chapters`, weightage: 5 },
        { id: "top_2", subject: primarySubject, title: `${primarySubject}: Problem Sets, Formula Derivations & PYQs`, weightage: 4 },
        { id: "top_3", subject: secondarySubject, title: `${secondarySubject}: High-Yield Theoretical Review`, weightage: 3 },
      ];

  const schedule = Array.from({ length: 7 }).map((_, dayIdx) => {
    const d = new Date(now);
    d.setDate(d.getDate() + dayIdx);
    const dateStr = d.toISOString().slice(0, 10);
    const dayOfWeek = d.toLocaleDateString("en-US", { weekday: "long" });
    const isWeekend = dayOfWeek === "Saturday" || dayOfWeek === "Sunday";

    const blocks: ScheduleBlock[] = [];
    let blkIdx = 0;

    if (!isWeekend) {
      // 1. Locked College Hours
      blocks.push({
        id: `blk_${planId.slice(-6)}_${dayIdx}_${blkIdx++}`,
        type: "college",
        start_time: collegeStart,
        end_time: collegeEnd,
        title: "College Institutional Hours",
        subject: null,
        status: "pending",
        is_locked: true,
      });

      // 2. Locked Commute / Decompress Buffer
      blocks.push({
        id: `blk_${planId.slice(-6)}_${dayIdx}_${blkIdx++}`,
        type: "commute",
        start_time: collegeEnd,
        end_time: commuteEnd,
        title: "Commute & Mental Reset Buffer",
        subject: null,
        status: "pending",
        is_locked: true,
      });

      // 3. Evening Deep Work Session 1 (e.g. 18:00 - 19:30)
      const topic1 = topics[dayIdx % topics.length];
      blocks.push({
        id: `blk_${planId.slice(-6)}_${dayIdx}_${blkIdx++}`,
        type: "study",
        start_time: "18:00",
        end_time: "19:30",
        title: `${topic1.subject}: ${topic1.title}`,
        subject: topic1.subject,
        status: "pending",
        is_locked: false,
      });

      // 4. Night Study Session 2 (e.g. 20:30 - 22:00)
      const topic2 = topics[(dayIdx + 1) % topics.length];
      blocks.push({
        id: `blk_${planId.slice(-6)}_${dayIdx}_${blkIdx++}`,
        type: "study",
        start_time: "20:30",
        end_time: "22:00",
        title: `${topic2.subject}: High-Yield Problem Sets & Revision`,
        subject: topic2.subject,
        status: "pending",
        is_locked: false,
      });

      // 5. Tier-1 Recovery & Buffer Slot (e.g. 22:00 - 22:45)
      blocks.push({
        id: `blk_${planId.slice(-6)}_${dayIdx}_${blkIdx++}`,
        type: "buffer",
        start_time: "22:00",
        end_time: "22:45",
        title: "Tier-1 Evening Spillover & Review Buffer",
        subject: null,
        status: "pending",
        is_locked: false,
      });
    } else {
      // Weekend: High-yield deep study rhythm
      const topic1 = topics[(dayIdx * 2) % topics.length];
      const topic2 = topics[(dayIdx * 2 + 1) % topics.length];

      blocks.push({
        id: `blk_${planId.slice(-6)}_${dayIdx}_${blkIdx++}`,
        type: "study",
        start_time: "09:30",
        end_time: "11:30",
        title: `${topic1.subject}: Deep Focus Module — ${topic1.title}`,
        subject: topic1.subject,
        status: "pending",
        is_locked: false,
      });

      blocks.push({
        id: `blk_${planId.slice(-6)}_${dayIdx}_${blkIdx++}`,
        type: "study",
        start_time: "11:45",
        end_time: "13:00",
        title: `${topic1.subject}: Problem Solving & Formula Retention`,
        subject: topic1.subject,
        status: "pending",
        is_locked: false,
      });

      blocks.push({
        id: `blk_${planId.slice(-6)}_${dayIdx}_${blkIdx++}`,
        type: "study",
        start_time: "16:00",
        end_time: "18:00",
        title: `${topic2.subject}: High-Weightage Chapters & Mock Test`,
        subject: topic2.subject,
        status: "pending",
        is_locked: false,
      });

      blocks.push({
        id: `blk_${planId.slice(-6)}_${dayIdx}_${blkIdx++}`,
        type: "buffer",
        start_time: "21:30",
        end_time: "22:30",
        title: "Tier-1 Weekend Review & Buffer Slot",
        subject: null,
        status: "pending",
        is_locked: false,
      });
    }

    return {
      date: dateStr,
      day_of_week: dayOfWeek,
      blocks,
    };
  });

  return {
    plan_id: planId,
    generated_provider: "deterministic-academic-engine",
    schedule,
  };
}

export async function generatePlan(intake: IntakeContext): Promise<PlanGenerationResult> {
  let rawJson: string | null = null;
  let providerUsed = "gemini-1.5-flash";
  let fallbackOccurred = false;

  try {
    rawJson = await callGemini(intake);
  } catch (geminiError: any) {
    console.warn("[AI Controller] Gemini attempt failed, falling back to Cohere:", geminiError?.message);
    fallbackOccurred = true;
    providerUsed = "cohere-command-r7b";
    try {
      rawJson = await callCohere(intake);
    } catch (cohereError: any) {
      console.warn("[AI Controller] Cohere fallback also failed. Synthesizing deterministic canonical plan:", cohereError?.message);
      fallbackOccurred = true;
      providerUsed = "deterministic-academic-engine";
      const deterministicPlan = generateDeterministicCanonicalPlan(intake);
      return {
        timetable: deterministicPlan,
        providerUsed,
        fallbackOccurred,
        rawResponseLength: JSON.stringify(deterministicPlan).length,
      };
    }
  }

  if (!rawJson) {
    const deterministicPlan = generateDeterministicCanonicalPlan(intake);
    return {
      timetable: deterministicPlan,
      providerUsed: "deterministic-academic-engine",
      fallbackOccurred: true,
      rawResponseLength: JSON.stringify(deterministicPlan).length,
    };
  }

  const cleaned = cleanJsonString(rawJson);
  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    console.warn("[AI Controller] Failed to parse JSON, falling back to deterministic plan");
    const deterministicPlan = generateDeterministicCanonicalPlan(intake);
    return {
      timetable: deterministicPlan,
      providerUsed: "deterministic-academic-engine",
      fallbackOccurred: true,
      rawResponseLength: 0,
    };
  }

  // Auto-repair formatting and time overlaps for 100% strict compliance
  const sanitized = sanitizeAndRepairTimetable(parsed, intake);
  const validationResult = TimetableSchema.safeParse(sanitized);

  if (!validationResult.success) {
    console.warn("[AI Controller] Schema validation needed fallback:", validationResult.error.format());
    const deterministicPlan = generateDeterministicCanonicalPlan(intake);
    return {
      timetable: deterministicPlan,
      providerUsed: "deterministic-academic-engine",
      fallbackOccurred: true,
      rawResponseLength: rawJson.length,
    };
  }

  return {
    timetable: validationResult.data,
    providerUsed,
    fallbackOccurred,
    rawResponseLength: rawJson.length,
  };
}


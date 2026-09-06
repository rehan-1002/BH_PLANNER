import { CohereClient } from "cohere-ai";
import { IntakeContext } from "../schema";

export async function callCohere(intake: IntakeContext): Promise<string> {
  const apiKey = process.env.COHERE_API_KEY;
  if (!apiKey) {
    throw new Error("COHERE_API_KEY environment variable is not configured");
  }

  const cohere = new CohereClient({
    token: apiKey,
  });

  const now = new Date();
  const daysInfo = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    const dayOfWeek = d.toLocaleDateString("en-US", { weekday: "long" });
    return { date: dateStr, day_of_week: dayOfWeek };
  });

  const examRunwayInfo = intake.examDates.map((ex) => {
    const exDate = new Date(ex.date + "T00:00:00");
    const diffDays = Math.ceil((exDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return `- ${ex.subject}: ${ex.date} (${diffDays <= 0 ? "Today/Passed" : `${diffDays} days left`})`;
  }).join("\n");

  const prompt = `You are BH Planner's academic scheduling engine (Fallback Provider). Build a realistic, humanized, high-yield 7-day academic study timetable.

CRITICAL STUDENT CONSTRAINTS:
1. College Core Hours: ${intake.collegeHours.start_time} to ${intake.collegeHours.end_time} (must be locked institutional blocks: type="college", is_locked=true, subject=null).
2. Commute Buffer: immediately following college for ${intake.commuteMinutes} minutes (must be locked: type="commute", is_locked=true, subject=null).
3. Exam Dates & Runway:
${examRunwayInfo}
4. Syllabus Topics to distribute:
${JSON.stringify(intake.syllabusTopics)}

EXACT 7-DAY CALENDAR DATES (STARTING FROM TODAY):
${JSON.stringify(daysInfo)}

SCHEDULING RULES FOR REALISTIC HUMAN TIMETABLE:
1. STRICT CHRONOLOGY & ZERO OVERLAPS: In each day, blocks must be in ascending time order. start_time < end_time for every block. Absolutely NO overlapping times. Format must be "HH:MM" (e.g. "09:00", "14:30").
2. EXAM RUNWAY INTENSITY:
   - Prioritize study time heavily for subjects whose exam date is closest in the runway.
   - On the 1-2 days before an exam date, schedule intensive mock practice, formula sheets, and high-weightage topic revisions.
   - Map specific syllabus topic titles into the block title, never use generic "Study".
3. HUMANIZED CADENCE:
   - Study blocks must be realistic deep-work sessions (60 to 90 minutes each).
   - Dinner break around 19:30-20:30.
   - Weekends (Sat/Sun): morning study sessions (09:30-11:30, 11:45-13:00) followed by afternoon/evening work.
4. EVENING BUFFER:
   - Every night MUST conclude with an unlocked buffer block (e.g. 21:45 - 22:30 or 22:00 - 22:45) with type="buffer", is_locked=false, subject=null, title="Tier-1 Evening Spillover & Review Buffer".
5. OUTPUT: Return ONLY a raw valid JSON object without markdown fences, explanation, or commentary.

Canonical JSON Structure:
{
  "plan_id": "bh_plan_${Date.now().toString(36)}",
  "generated_provider": "cohere-command-r7b",
  "schedule": [
    {
      "date": "YYYY-MM-DD",
      "day_of_week": "Monday",
      "blocks": [
        {
          "id": "blk_unique_id",
          "type": "college",
          "start_time": "09:00",
          "end_time": "16:30",
          "title": "College Core Hours",
          "subject": null,
          "status": "pending",
          "is_locked": true
        }
      ]
    }
  ]
}`;

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Cohere timeout (>25s)")), 25000)
  );

  const generatePromise = cohere.chat({
    model: "command-r7b-12-2024",
    message: prompt,
    temperature: 0.2,
  }).then((response) => {
    return response.text;
  });

  return Promise.race([generatePromise, timeoutPromise]);
}


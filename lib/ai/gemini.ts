import { GoogleGenerativeAI } from "@google/generative-ai";
import { IntakeContext } from "../schema";

export async function callGemini(intake: IntakeContext): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  // gemini-1.5-flash is Google's fast, production-ready model with JSON mode
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
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

  const prompt = `You are BH Planner's academic scheduling engine. Build a realistic, humanized, high-yield 7-day academic study timetable.

CRITICAL STUDENT CONSTRAINTS:
1. College Institutional Hours: ${intake.collegeHours.start_time} to ${intake.collegeHours.end_time} (must be locked institutional blocks: type="college", is_locked=true, subject=null).
2. Commute Buffer: immediately following college for ${intake.commuteMinutes} minutes (must be locked: type="commute", is_locked=true, subject=null).
3. Exam Dates & Runway:
${examRunwayInfo}
4. Syllabus Topics to distribute:
${JSON.stringify(intake.syllabusTopics)}

EXACT 7-DAY CALENDAR DATES (STARTING FROM TODAY):
${JSON.stringify(daysInfo)}

SCHEDULING RULES FOR REALISTIC HUMAN TIMETABLE:
1. STRICT CHRONOLOGY & ZERO OVERLAPS: For every single day, blocks must be in ascending time order. start_time < end_time for every block. Absolutely no overlapping time ranges. All times must be in 24-hour "HH:MM" format (with leading zeros, e.g. "09:00", "14:30").
2. EXAM RUNWAY INTENSITY:
   - Heavily prioritize study time (60-70% of available study hours) for subjects whose exam date is closest in the runway.
   - On the 1-2 days before an exam date, schedule intensive mock practice, formula sheets, and high-weightage topic revisions.
   - Map specific syllabus topic titles into the block title (e.g. "Engineering Math: Eigenvalues & Cayley-Hamilton Theorem"), DO NOT use generic "Study" or "Revision" titles.
3. HUMANIZED STUDY BLOCKS:
   - Study blocks must be realistic deep-work sessions (60 to 90 minutes each).
   - Provide realistic gaps or meal breaks (e.g., Dinner break around 19:30-20:30).
   - On weekends (Saturday/Sunday), if no college is scheduled, use morning deep-work blocks (e.g. 09:30-11:30 and 11:45-13:00) followed by afternoon and evening sessions.
4. EVENING RECOVERY BUFFER:
   - Every night MUST conclude with an unlocked buffer block (e.g. 21:45 - 22:30 or 22:00 - 22:45) with type="buffer", is_locked=false, subject=null, title="Tier-1 Evening Spillover & Review Buffer". This ensures missed sessions can be recovered.
5. LOCKED BLOCKS:
   - College blocks: type="college", is_locked=true, subject=null.
   - Commute blocks: type="commute", is_locked=true, subject=null.
   - Study blocks: type="study", is_locked=false, status="pending", subject=from syllabus.
   - Buffer blocks: type="buffer", is_locked=false, status="pending", subject=null.

Return ONLY a valid JSON object strictly matching this canonical structure:
{
  "plan_id": "bh_plan_${Date.now().toString(36)}",
  "generated_provider": "gemini-1.5-flash",
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

  // Timeout guard (25 seconds)
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Gemini timeout (>25s)")), 25000)
  );

  const generatePromise = model.generateContent(prompt).then((result) => {
    return result.response.text();
  });

  return Promise.race([generatePromise, timeoutPromise]);
}


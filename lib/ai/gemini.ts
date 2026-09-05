import { GoogleGenerativeAI } from "@google/generative-ai";
import { IntakeContext } from "../schema";

export async function callGemini(intake: IntakeContext): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

  const prompt = `You are BH Planner's academic scheduling engine.
Given the following student constraints and syllabus:
- College core hours: ${intake.collegeHours.start_time} to ${intake.collegeHours.end_time} (must be locked institutional blocks)
- Commute / Reset buffer: ${intake.commuteMinutes} minutes following college (must be locked)
- Exam dates: ${JSON.stringify(intake.examDates)}
- Syllabus topics to distribute: ${JSON.stringify(intake.syllabusTopics)}

Generate a realistic 7-day timetable starting from today.
Output ONLY a JSON object that strictly conforms to this canonical timetable structure:
{
  "plan_id": "bh_plan_<random_string>",
  "generated_provider": "gemini-1.5-flash",
  "schedule": [
    {
      "date": "YYYY-MM-DD",
      "day_of_week": "Monday",
      "blocks": [
        {
          "id": "blk_<id>",
          "type": "college" | "commute" | "study" | "buffer",
          "start_time": "HH:MM",
          "end_time": "HH:MM",
          "title": "string",
          "subject": "string or null",
          "status": "pending",
          "is_locked": boolean
        }
      ]
    }
  ]
}

Rules:
1. start_time < end_time for all blocks.
2. No overlapping blocks within the same day.
3. College and commute blocks must have is_locked = true, subject = null.
4. Study blocks must have is_locked = false, a valid subject from the syllabus, status = "pending".
5. Schedule at least one unlocked "buffer" block per day or every two days to allow deterministic Tier-1 spillover.
6. Do NOT include any markdown code blocks or commentary. Return raw valid JSON only.`;

  // Timeout guard (25 seconds for structured timetable generation)
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Gemini timeout (>25s)")), 25000)
  );

  const generatePromise = model.generateContent(prompt).then((result) => {
    return result.response.text();
  });

  return Promise.race([generatePromise, timeoutPromise]);
}

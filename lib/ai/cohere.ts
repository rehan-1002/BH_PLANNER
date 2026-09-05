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

  const prompt = `You are BH Planner's academic scheduling engine (Fallback Provider).
Given the following student constraints:
- College core hours: ${intake.collegeHours.start_time} to ${intake.collegeHours.end_time} (locked)
- Commute / Reset buffer: ${intake.commuteMinutes} minutes following college (locked)
- Exam dates: ${JSON.stringify(intake.examDates)}
- Syllabus topics to distribute: ${JSON.stringify(intake.syllabusTopics)}

Generate a realistic 7-day timetable starting from today.
Output ONLY a raw JSON object conforming strictly to the canonical timetable structure:
{
  "plan_id": "bh_plan_<random_string>",
  "generated_provider": "cohere-command-r7b",
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
1. start_time < end_time.
2. No overlapping blocks within any day.
3. College and commute blocks must have is_locked = true, subject = null.
4. Study blocks must have is_locked = false, a valid subject, status = "pending".
5. Output valid JSON only, no preamble, no explanations, no markdown formatting.`;

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Cohere timeout (>30s)")), 30000)
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

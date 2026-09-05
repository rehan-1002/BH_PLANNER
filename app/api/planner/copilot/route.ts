import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { TimetableSchema } from "@/lib/schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { currentTimetable, userMessage } = body;

    if (!currentTimetable || !userMessage) {
      return NextResponse.json(
        { error: "currentTimetable and userMessage are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const prompt = `You are BH Planner Copilot, an academic timetable restructuring assistant.
The student has an active timetable and sent this modification request:
"${userMessage}"

Current Timetable:
${JSON.stringify(currentTimetable)}

Rules for Mutation:
1. You MUST preserve all blocks where is_locked is true (college and commute blocks). Do NOT move or delete them.
2. Only flexible study or buffer blocks may be shifted, extended, or reprioritized.
3. start_time < end_time for every block.
4. No overlapping blocks within the same day.
5. Return ONLY a valid JSON object matching the exact canonical TimetableSchema structure:
{
  "plan_id": "${currentTimetable.plan_id || "bh_plan_copilot"}",
  "generated_provider": "copilot-gemini-2.5-flash",
  "explanation": "Clear 1-2 sentence explanation of the exact schedule changes made.",
  "schedule": [
    ... // array of DaySchedule objects with updated blocks
  ]
}`;

    const res = await model.generateContent(prompt);
    let rawText = res.response.text().trim();
    if (rawText.startsWith("```json")) {
      rawText = rawText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (rawText.startsWith("```")) {
      rawText = rawText.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    const parsed = JSON.parse(rawText);
    const explanation = parsed.explanation || "Schedule successfully updated per your request.";

    // Validate the modified schedule
    const validated = TimetableSchema.safeParse({
      plan_id: parsed.plan_id || currentTimetable.plan_id,
      generated_provider: "copilot-gemini-2.5-flash",
      schedule: parsed.schedule,
    });

    if (!validated.success) {
      return NextResponse.json(
        {
          error: "Copilot output failed canonical schema validation",
          details: validated.error.format(),
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      explanation,
      updatedTimetable: validated.data,
    });
  } catch (err: any) {
    console.error("[Copilot API Error]:", err?.message);
    return NextResponse.json(
      { error: err?.message || "Failed to process Copilot request" },
      { status: 500 }
    );
  }
}

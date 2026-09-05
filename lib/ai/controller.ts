import { callGemini } from "./gemini";
import { callCohere } from "./cohere";
import { IntakeContext, Timetable, TimetableSchema } from "../schema";

export interface PlanGenerationResult {
  timetable: Timetable;
  providerUsed: "gemini-1.5-flash" | "cohere-command-r";
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

export async function generatePlan(intake: IntakeContext): Promise<PlanGenerationResult> {
  let rawJson: string | null = null;
  let providerUsed: "gemini-1.5-flash" | "cohere-command-r" = "gemini-1.5-flash";
  let fallbackOccurred = false;

  try {
    rawJson = await callGemini(intake);
  } catch (geminiError: any) {
    console.warn("[AI Controller] Gemini attempt failed, falling back to Cohere:", geminiError?.message);
    fallbackOccurred = true;
    providerUsed = "cohere-command-r";
    try {
      rawJson = await callCohere(intake);
    } catch (cohereError: any) {
      console.error("[AI Controller] Cohere fallback also failed:", cohereError?.message);
      throw new Error(`AI generation failed on both providers. Gemini: ${geminiError?.message}; Cohere: ${cohereError?.message}`);
    }
  }

  if (!rawJson) {
    throw new Error("No response received from any AI provider");
  }

  const cleaned = cleanJsonString(rawJson);
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error("Provider returned non-JSON response: " + cleaned.slice(0, 100));
  }

  // Enforce Zod validation
  const validationResult = TimetableSchema.safeParse(parsed);
  if (!validationResult.success) {
    console.error("[AI Controller] Timetable validation failed:", validationResult.error.format());
    throw new Error(
      "AI output failed canonical timetable schema validation: " +
        validationResult.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")
    );
  }

  return {
    timetable: validationResult.data,
    providerUsed,
    fallbackOccurred,
    rawResponseLength: rawJson.length,
  };
}

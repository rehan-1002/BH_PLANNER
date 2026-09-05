import { NextRequest, NextResponse } from "next/server";
import { generatePlan } from "@/lib/ai/controller";
import { IntakeContextSchema } from "@/lib/schema";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = IntakeContextSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Invalid intake context format",
          details: parseResult.error.format(),
        },
        { status: 400 }
      );
    }

    const result = await generatePlan(parseResult.data);

    return NextResponse.json({
      success: true,
      data: result.timetable,
      diagnostics: {
        providerUsed: result.providerUsed,
        fallbackOccurred: result.fallbackOccurred,
        rawResponseLength: result.rawResponseLength,
      },
    });
  } catch (error: any) {
    console.error("[API /api/planner/generate] Error:", error?.message);
    return NextResponse.json(
      {
        error: error?.message || "Internal server error during plan generation",
      },
      { status: 500 }
    );
  }
}

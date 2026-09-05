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

    // Guarantee globally unique block IDs across all days
    result.timetable.schedule.forEach((day, dayIdx) => {
      day.blocks.forEach((block, blkIdx) => {
        block.id = `blk_${result.timetable.plan_id.slice(-6)}_${dayIdx}_${blkIdx}`;
      });
    });

    // Server-side direct persistence to Supabase
    try {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await supabase
          .from("plans")
          .update({ is_active: false })
          .eq("user_id", user.id);

        await supabase.from("plans").insert({
          id: result.timetable.plan_id,
          user_id: user.id,
          generated_provider: result.providerUsed,
          is_active: true,
        });

        const blockRows = [];
        for (const day of result.timetable.schedule) {
          for (const block of day.blocks) {
            blockRows.push({
              id: block.id,
              plan_id: result.timetable.plan_id,
              user_id: user.id,
              date: day.date,
              day_of_week: day.day_of_week,
              start_time: block.start_time,
              end_time: block.end_time,
              type: block.type,
              title: block.title,
              subject: block.subject || null,
              status: block.status || "pending",
              is_locked: block.is_locked,
            });
          }
        }

        if (blockRows.length > 0) {
          await supabase.from("schedule_blocks").insert(blockRows);
        }
      }
    } catch (dbErr) {
      console.warn("[API generate] Non-fatal Supabase server sync warning:", dbErr);
    }

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

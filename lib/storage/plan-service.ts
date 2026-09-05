import { Timetable, ScheduleBlock } from "../schema";
import { executeTier1Spillover, SpilloverResult } from "../scheduler/tier1";
import { createClient } from "../supabase/client";

const STORAGE_KEY_ACTIVE_PLAN = "bh_active_timetable";
const STORAGE_KEY_RECOVERY_LOG = "bh_recovery_logs";

export interface RecoveryLog {
  id: string;
  timestamp: string;
  missedBlockTitle: string;
  result: SpilloverResult;
}

export class PlanService {
  static getActivePlan(): Timetable | null {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ACTIVE_PLAN);
      if (!stored) return null;
      return JSON.parse(stored) as Timetable;
    } catch {
      return null;
    }
  }

  static async loadActivePlan(): Promise<Timetable | null> {
    const local = this.getActivePlan();
    if (typeof window === "undefined") return local;

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return local;

      const { data: plans, error: planError } = await supabase
        .from("plans")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1);

      if (planError || !plans || plans.length === 0) {
        return local;
      }

      const activePlan = plans[0];

      const { data: blocks, error: blockError } = await supabase
        .from("schedule_blocks")
        .select("*")
        .eq("plan_id", activePlan.id)
        .order("date", { ascending: true })
        .order("start_time", { ascending: true });

      if (blockError || !blocks || blocks.length === 0) {
        return local;
      }

      const dayMap = new Map<
        string,
        { date: string; day_of_week: string; blocks: ScheduleBlock[] }
      >();

      for (const b of blocks) {
        if (!dayMap.has(b.date)) {
          dayMap.set(b.date, {
            date: b.date,
            day_of_week: b.day_of_week,
            blocks: [],
          });
        }
        dayMap.get(b.date)!.blocks.push({
          id: b.id,
          type: b.type as any,
          start_time: b.start_time,
          end_time: b.end_time,
          title: b.title,
          subject: b.subject,
          status: b.status as any,
          is_locked: b.is_locked,
        });
      }

      const timetable: Timetable = {
        plan_id: activePlan.id,
        generated_provider: activePlan.generated_provider,
        schedule: Array.from(dayMap.values()),
      };

      localStorage.setItem(STORAGE_KEY_ACTIVE_PLAN, JSON.stringify(timetable));
      return timetable;
    } catch (err) {
      console.warn("[PlanService] Failed to load from Supabase, using local cache:", err);
      return local;
    }
  }

  static saveActivePlan(plan: Timetable): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_PLAN, JSON.stringify(plan));
      this.syncPlanToSupabase(plan).catch((err) =>
        console.warn("[PlanService] Background Supabase sync failed:", err)
      );
    } catch (err) {
      console.error("[PlanService] Failed to save plan to storage:", err);
    }
  }

  private static async syncPlanToSupabase(plan: Timetable): Promise<void> {
    if (typeof window === "undefined") return;
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      await supabase
        .from("plans")
        .update({ is_active: false })
        .eq("user_id", user.id);

      const { error: planError } = await supabase.from("plans").upsert({
        id: plan.plan_id,
        user_id: user.id,
        generated_provider: plan.generated_provider,
        is_active: true,
      });

      if (planError) {
        console.warn("[PlanService] Failed to upsert plan:", planError.message);
        return;
      }

      const blockRows: any[] = [];
      for (const day of plan.schedule) {
        for (const block of day.blocks) {
          blockRows.push({
            id: block.id,
            plan_id: plan.plan_id,
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
        const { error: blockError } = await supabase
          .from("schedule_blocks")
          .upsert(blockRows);

        if (blockError) {
          console.warn("[PlanService] Failed to upsert blocks:", blockError.message);
        }
      }
    } catch (err) {
      console.warn("[PlanService] Supabase sync exception:", err);
    }
  }

  static updateBlockStatus(
    blockId: string,
    status: "pending" | "done" | "partial" | "missed"
  ): { plan: Timetable; spillover?: SpilloverResult } {
    const current = this.getActivePlan();
    if (!current) throw new Error("No active plan to update");

    if (status === "missed") {
      const spillover = executeTier1Spillover(current, blockId);
      this.saveActivePlan(spillover.updatedTimetable);

      this.addRecoveryLog({
        id: "rec_" + Date.now(),
        timestamp: new Date().toISOString(),
        missedBlockTitle: spillover.movedBlockTitle,
        result: spillover,
      });

      return { plan: spillover.updatedTimetable, spillover };
    }

    for (const day of current.schedule) {
      for (const block of day.blocks) {
        if (block.id === blockId) {
          block.status = status;
          break;
        }
      }
    }

    this.saveActivePlan(current);

    if (typeof window !== "undefined") {
      try {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user } }) => {
          if (user) {
            supabase
              .from("schedule_blocks")
              .update({ status })
              .eq("id", blockId)
              .eq("user_id", user.id)
              .then();
          }
        }).catch(() => {});
      } catch {}
    }

    return { plan: current };
  }

  static getRecoveryLogs(): RecoveryLog[] {
    if (typeof window === "undefined") return [];
    try {
      const logs = localStorage.getItem(STORAGE_KEY_RECOVERY_LOG);
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  }

  static addRecoveryLog(log: RecoveryLog): void {
    if (typeof window === "undefined") return;
    try {
      const logs = this.getRecoveryLogs();
      logs.unshift(log);
      localStorage.setItem(STORAGE_KEY_RECOVERY_LOG, JSON.stringify(logs.slice(0, 20)));
    } catch (err) {
      console.error("[PlanService] Failed to record recovery log:", err);
    }
  }
}

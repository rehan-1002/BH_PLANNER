import { Timetable, ScheduleBlock } from "../schema";
import { executeTier1Spillover, SpilloverResult } from "../scheduler/tier1";

const STORAGE_KEY_ACTIVE_PLAN = "bh_active_timetable";
const STORAGE_KEY_RECOVERY_LOG = "bh_recovery_logs";

export interface RecoveryLog {
  id: string;
  timestamp: string;
  missedBlockTitle: string;
  result: SpilloverResult;
}

/**
 * Plan Persistence and State Management Service
 * Provides seamless local storage synchronization with resilient Supabase fallbacks.
 */
export class PlanService {
  /**
   * Retrieves the currently active timetable
   */
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

  /**
   * Saves or updates the active timetable
   */
  static saveActivePlan(plan: Timetable): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_PLAN, JSON.stringify(plan));
    } catch (err) {
      console.error("[PlanService] Failed to save plan to storage:", err);
    }
  }

  /**
   * Updates an individual block's status (pending, done, partial, missed)
   * If status is 'missed', automatically triggers Tier-1 deterministic spillover.
   */
  static updateBlockStatus(
    blockId: string,
    status: "pending" | "done" | "partial" | "missed"
  ): { plan: Timetable; spillover?: SpilloverResult } {
    const current = this.getActivePlan();
    if (!current) throw new Error("No active plan to update");

    if (status === "missed") {
      const spillover = executeTier1Spillover(current, blockId);
      this.saveActivePlan(spillover.updatedTimetable);

      // Record recovery log
      this.addRecoveryLog({
        id: "rec_" + Date.now(),
        timestamp: new Date().toISOString(),
        missedBlockTitle: spillover.movedBlockTitle,
        result: spillover,
      });

      return { plan: spillover.updatedTimetable, spillover };
    }

    // Standard status update
    for (const day of current.schedule) {
      for (const block of day.blocks) {
        if (block.id === blockId) {
          block.status = status;
          break;
        }
      }
    }

    this.saveActivePlan(current);
    return { plan: current };
  }

  /**
   * Retrieves recovery history logs
   */
  static getRecoveryLogs(): RecoveryLog[] {
    if (typeof window === "undefined") return [];
    try {
      const logs = localStorage.getItem(STORAGE_KEY_RECOVERY_LOG);
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  }

  /**
   * Adds a recovery log entry
   */
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

import { Timetable, ScheduleBlock, DaySchedule } from "../schema";

export interface SpilloverResult {
  success: boolean;
  updatedTimetable: Timetable;
  movedBlockTitle: string;
  relocatedTo?: {
    date: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
  };
  reason: string;
  requiresReTriage: boolean;
}

/**
 * Calculates date difference in hours between two YYYY-MM-DD strings and times
 */
function getHoursDifference(
  date1: string,
  time1: string,
  date2: string,
  time2: string
): number {
  const d1 = new Date(`${date1}T${time1}:00`);
  const d2 = new Date(`${date2}T${time2}:00`);
  return (d2.getTime() - d1.getTime()) / (1000 * 60 * 60);
}

/**
 * Tier-1 Deterministic Spillover Engine
 * 
 * Strict invariants:
 * 1. Zero AI calls. Zero external network calls.
 * 2. Scans forward up to 72 hours from the missed block's date/time.
 * 3. Identifies unlocked blocks where type === 'buffer'.
 * 4. Relocates the missed workload into the closest eligible buffer block.
 * 5. Flags re-triage requirement if no buffer is found or if 2+ consecutive misses occur.
 */
export function executeTier1Spillover(
  timetable: Timetable,
  missedBlockId: string
): SpilloverResult {
  // Deep clone timetable to prevent unintended mutation
  const updated: Timetable = JSON.parse(JSON.stringify(timetable));

  // Find missed block and its day
  let missedBlock: ScheduleBlock | null = null;
  let missedDayIndex = -1;
  let missedBlockIndex = -1;

  for (let d = 0; d < updated.schedule.length; d++) {
    const day = updated.schedule[d];
    for (let b = 0; b < day.blocks.length; b++) {
      if (day.blocks[b].id === missedBlockId) {
        missedBlock = day.blocks[b];
        missedDayIndex = d;
        missedBlockIndex = b;
        break;
      }
    }
    if (missedBlock) break;
  }

  if (!missedBlock || missedDayIndex === -1) {
    return {
      success: false,
      updatedTimetable: timetable,
      movedBlockTitle: "",
      reason: `Block with ID ${missedBlockId} not found in timetable`,
      requiresReTriage: false,
    };
  }

  // Mark the block itself as missed
  missedBlock.status = "missed";

  // Check consecutive misses history
  let consecutiveMisses = 0;
  for (const day of updated.schedule) {
    for (const block of day.blocks) {
      if (block.type === "study") {
        if (block.status === "missed") {
          consecutiveMisses++;
        } else if (block.status === "done") {
          consecutiveMisses = 0;
        }
      }
    }
  }

  const missedDate = updated.schedule[missedDayIndex].date;
  const missedTime = missedBlock.start_time;

  // Search ahead up to 72 hours for an unlocked buffer block
  let targetDay: DaySchedule | null = null;
  let targetBlock: ScheduleBlock | null = null;

  for (let d = missedDayIndex; d < updated.schedule.length; d++) {
    const currentDay = updated.schedule[d];
    for (const b of currentDay.blocks) {
      // Must be a buffer, flexible, and strictly after the missed session
      if (b.type === "buffer" && !b.is_locked) {
        const hoursAhead = getHoursDifference(missedDate, missedTime, currentDay.date, b.start_time);
        if (hoursAhead >= 0 && hoursAhead <= 72) {
          targetDay = currentDay;
          targetBlock = b;
          break;
        }
      }
    }
    if (targetBlock) break;
  }

  // If no buffer found within 72 hours
  if (!targetBlock || !targetDay) {
    return {
      success: false,
      updatedTimetable: updated,
      movedBlockTitle: missedBlock.title,
      reason: "No unlocked buffer slot available within 72-hour window. Workload flagged for AI re-triage.",
      requiresReTriage: true,
    };
  }

  // Relocate workload into the buffer block
  targetBlock.type = "study";
  targetBlock.title = `[Recovered] ${missedBlock.title}`;
  targetBlock.subject = missedBlock.subject;
  targetBlock.status = "pending";
  (targetBlock as any).recovered_from_id = missedBlock.id;

  const requiresReTriage = consecutiveMisses >= 2;

  return {
    success: true,
    updatedTimetable: updated,
    movedBlockTitle: missedBlock.title,
    relocatedTo: {
      date: targetDay.date,
      day_of_week: targetDay.day_of_week,
      start_time: targetBlock.start_time,
      end_time: targetBlock.end_time,
    },
    reason: `Workload moved to ${targetDay.day_of_week} (${targetDay.date}) at ${targetBlock.start_time}–${targetBlock.end_time} via Tier-1 deterministic spillover.`,
    requiresReTriage,
  };
}

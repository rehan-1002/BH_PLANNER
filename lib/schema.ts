import { z } from "zod";

/**
 * Block types permitted in the canonical timetable
 */
export const BlockTypeSchema = z.enum(["college", "commute", "study", "buffer"]);
export type BlockType = z.infer<typeof BlockTypeSchema>;

/**
 * Execution statuses for actionable blocks
 */
export const BlockStatusSchema = z.enum(["pending", "done", "partial", "missed"]);
export type BlockStatus = z.infer<typeof BlockStatusSchema>;

/**
 * Canonical Schedule Block Schema
 */
export const ScheduleBlockSchema = z
  .object({
    id: z.string().min(1, "Block ID is required"),
    type: BlockTypeSchema,
    start_time: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be HH:MM format (24-hour)"),
    end_time: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be HH:MM format (24-hour)"),
    title: z.string().min(1, "Title is required"),
    subject: z.string().nullable().optional().default(null),
    status: BlockStatusSchema.optional().default("pending"),
    is_locked: z.boolean().default(false),
  })
  .refine(
    (data) => {
      // Validate start_time < end_time
      const [startH, startM] = data.start_time.split(":").map(Number);
      const [endH, endM] = data.end_time.split(":").map(Number);
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;
      return startMinutes < endMinutes;
    },
    {
      message: "start_time must be strictly before end_time",
      path: ["end_time"],
    }
  );

export type ScheduleBlock = z.infer<typeof ScheduleBlockSchema>;

/**
 * Day Schedule Schema with non-overlapping blocks validation
 */
export const DayScheduleSchema = z
  .object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
    day_of_week: z.string().min(1, "Day of week is required"),
    blocks: z.array(ScheduleBlockSchema),
  })
  .refine(
    (day) => {
      // Check for overlapping blocks within the same day
      const sorted = [...day.blocks].sort((a, b) => {
        const [aH, aM] = a.start_time.split(":").map(Number);
        const [bH, bM] = b.start_time.split(":").map(Number);
        return aH * 60 + aM - (bH * 60 + bM);
      });

      for (let i = 0; i < sorted.length - 1; i++) {
        const curr = sorted[i];
        const next = sorted[i + 1];
        const [currEndH, currEndM] = curr.end_time.split(":").map(Number);
        const [nextStartH, nextStartM] = next.start_time.split(":").map(Number);
        const currEndMinutes = currEndH * 60 + currEndM;
        const nextStartMinutes = nextStartH * 60 + nextStartM;

        if (currEndMinutes > nextStartMinutes) {
          return false; // Overlap detected
        }
      }
      return true;
    },
    {
      message: "Schedule blocks within the same day must not overlap in time",
      path: ["blocks"],
    }
  );

export type DaySchedule = z.infer<typeof DayScheduleSchema>;

/**
 * Canonical Timetable Schema
 */
export const TimetableSchema = z.object({
  plan_id: z.string().min(1, "plan_id is required"),
  generated_provider: z.string().min(1, "generated_provider is required"),
  schedule: z.array(DayScheduleSchema),
});

export type Timetable = z.infer<typeof TimetableSchema>;

/**
 * Student Intake Context for AI generation
 */
export const IntakeContextSchema = z.object({
  collegeHours: z.object({
    start_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
    end_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  }),
  commuteMinutes: z.number().int().min(0).max(300).default(60),
  examDates: z.array(
    z.object({
      subject: z.string().min(1),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    })
  ),
  syllabusTopics: z.array(
    z.object({
      id: z.string().min(1),
      subject: z.string().min(1),
      title: z.string().min(1),
      weightage: z.number().min(1).max(5).default(3),
    })
  ),
});

export type IntakeContext = z.infer<typeof IntakeContextSchema>;

import { z } from "zod";

export type WorkoutItemType = "exercise" | "test";

export interface WorkoutItem {
  type: WorkoutItemType;
  name: string;
  details: string | null;
  videoUrl: string | null;
  note: string | null;
}

export interface WorkoutDay {
  date: string;
  weekRange?: string;
  items: WorkoutItem[];
}

const workoutItemSchema = z.object({
  type: z.union([z.literal("exercise"), z.literal("test")]).default("exercise"),
  name: z.string().min(1),
  details: z.string().nullable().default(null),
  videoUrl: z.string().nullable().default(null),
  note: z.string().nullable().default(null),
});

const workoutDaySchema = z.object({
  date: z
    .string()
    .min(1)
    .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), { message: "date must be in YYYY-MM-DD format" }),
  weekRange: z.string().nullable().optional(),
  items: z.array(workoutItemSchema),
});

const workoutScheduleSchema = z.array(workoutDaySchema);

function resolveScheduleUrl(): string {
  const url = import.meta.env.VITE_WORKOUT_SCHEDULE_URL;
  if (!url) {
    throw new Error("Missing VITE_WORKOUT_SCHEDULE_URL in environment configuration.");
  }
  return url;
}

export async function fetchWorkoutSchedule(): Promise<WorkoutDay[]> {
  const url = resolveScheduleUrl();
  const response = await fetch(url, { cache: "no-cache" });

  if (!response.ok) {
    throw new Error(`Failed to load workout schedule (status ${response.status}).`);
  }

  const data = await response.json();
  const parsed = workoutScheduleSchema.parse(data);

  return parsed.map((day) => ({
    date: day.date,
    weekRange: day.weekRange ?? undefined,
    items: day.items.map((item) => ({
      type: item.type,
      name: item.name,
      details: item.details ?? null,
      videoUrl: item.videoUrl ? item.videoUrl : null,
      note: item.note ?? null,
    })),
  }));
}

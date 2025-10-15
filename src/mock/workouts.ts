export interface WorkoutEntry {
  /** ISO date string in the format YYYY-MM-DD */
  date: string;
  /** Display name for the workout */
  title: string;
  /** Optional short description to give more context */
  description?: string;
  /** Link to the workout video (e.g. YouTube) */
  videoUrl: string;
}

/**
 * Temporary mock data for the workout history. Update or extend this list
 * when real data is available from the backend.
 */
export const workoutHistory: WorkoutEntry[] = [
  {
    date: "2025-01-02",
    title: "Khởi động toàn thân",
    description: "Chuỗi động tác nhẹ giúp thức tỉnh cơ thể.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    date: "2025-01-03",
    title: "Cardio tăng nhịp tim",
    description: "15 phút cardio cường độ trung bình.",
    videoUrl: "https://www.youtube.com/watch?v=ml6cT4AZdqI",
  },
  {
    date: "2025-01-05",
    title: "Sức mạnh thân trên",
    description: "Bài tập tăng cường cơ tay và vai.",
    videoUrl: "https://www.youtube.com/watch?v=IODxDxX7oi4",
  },
];

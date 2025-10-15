import { useMemo, useState } from "react";
import { format, isAfter, isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { workoutHistory, WorkoutEntry } from "@/mock/workouts";
import { ExternalLink } from "lucide-react";

function normalizeDateKey(date: Date) {
  return format(date, "yyyy-MM-dd");
}

function createWorkoutLookup(entries: WorkoutEntry[]) {
  const map = new Map<string, WorkoutEntry>();
  entries.forEach((entry) => {
    map.set(entry.date, entry);
  });
  return map;
}

export default function Workouts() {
  const sortedWorkouts = useMemo(() => {
    return [...workoutHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, []);

  const workoutsByDate = useMemo(() => createWorkoutLookup(sortedWorkouts), [sortedWorkouts]);

  const defaultSelectedDate = useMemo(() => {
    if (!sortedWorkouts.length) return undefined;
    return new Date(sortedWorkouts[sortedWorkouts.length - 1].date);
  }, [sortedWorkouts]);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(defaultSelectedDate);

  const selectedWorkout = useMemo(() => {
    if (!selectedDate) return undefined;
    return workoutsByDate.get(normalizeDateKey(selectedDate));
  }, [selectedDate, workoutsByDate]);

  const today = new Date();
  const workoutDates = useMemo(() => sortedWorkouts.map((entry) => new Date(entry.date)), [sortedWorkouts]);

  return (
    <AuthenticatedLayout
      title="Bài tập"
      description="Xem lại lịch sử bài tập và truy cập nhanh video hướng dẫn"
      className="bg-muted/40"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 lg:flex-row">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Lịch bài tập</CardTitle>
            <CardDescription>Chọn một ngày đã hoàn thành để xem chi tiết bài tập.</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (!date) {
                  setSelectedDate(undefined);
                  return;
                }

                if (isAfter(date, today)) {
                  return;
                }

                setSelectedDate(date);
              }}
              disabled={{ after: today }}
              modifiers={{
                hasWorkout: workoutDates,
              }}
              modifiersClassNames={{
                hasWorkout: "border border-primary bg-primary/10 text-primary hover:bg-primary/20",
              }}
              className="rounded-md border"
            />
            <p className="mt-4 text-sm text-muted-foreground">
              Các ngày được đánh dấu hiển thị bài tập đã thực hiện trước đây. Ngày tương lai sẽ được mở khi có lịch.
            </p>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Chi tiết bài tập</CardTitle>
            <CardDescription>
              {selectedDate ? `Ngày ${format(selectedDate, "dd/MM/yyyy")}` : "Chọn một ngày trong lịch để xem bài tập."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selectedDate ? (
              <p className="text-sm text-muted-foreground">
                Vui lòng chọn một ngày trên lịch để xem bài tập tương ứng.
              </p>
            ) : selectedWorkout ? (
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{selectedWorkout.title}</h3>
                  {selectedWorkout.description ? (
                    <p className="mt-1 text-sm text-muted-foreground">{selectedWorkout.description}</p>
                  ) : null}
                </div>
                <a
                  href={selectedWorkout.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                >
                  Xem video hướng dẫn
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ) : (
              <div className="rounded-md border border-dashed border-muted-foreground/40 bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">
                  Không có bài tập nào được ghi nhận cho ngày {format(selectedDate, "dd/MM/yyyy")}. Hãy quay lại sau khi lịch được cập nhật.
                </p>
              </div>
            )}

            {selectedDate && workoutDates.some((date) => isSameDay(date, selectedDate)) ? null : (
              <p className="text-xs text-muted-foreground">
                Nếu bạn đã hoàn thành bài tập trong ngày này, hãy bổ sung thông tin để cập nhật lịch sử luyện tập.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}

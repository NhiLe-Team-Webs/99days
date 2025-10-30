import { useCallback, useEffect, useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { useSearchParams } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  firstWorkoutDate,
  getWorkoutForDate,
  lastWorkoutDate,
  workoutPlan,
  workoutPlanByDate,
  workoutDates,
  type WorkoutDay,
  type WorkoutItem,
  type WorkoutResource,
  type WorkoutResourceType,
} from "@/data/workouts";
import type { LucideIcon } from "lucide-react";
import { ExternalLink, FileText, PlayCircle } from "lucide-react";

const RESOURCE_TEXT: Record<WorkoutResourceType, { label: string; icon: LucideIcon }> = {
  video: { label: "Xem video hướng dẫn", icon: PlayCircle },
  link: { label: "Mở tài liệu", icon: ExternalLink },
  form: { label: "Điền biểu mẫu kết quả", icon: FileText },
};

const RESOURCE_PRIORITY: Record<WorkoutResourceType, number> = {
  video: 0,
  link: 1,
  form: 2,
};

const PRIMARY_COLOR = "#FF6F00";
const PRIMARY_COLOR_LIGHT = "#FFE3C2";
const PRIMARY_COLOR_DARK = "#CC5800";

function normalizeTitle(item: WorkoutItem, day: WorkoutDay) {
  const raw = item.title.trim();
  if (/^Buoi tap ngay/i.test(raw)) {
    const datePart = raw.replace(/^Buoi tap ngay\s*/i, "").trim();
    return `Video luyện tập ngày ${datePart || format(parseISO(day.date), "dd/MM/yyyy")}`;
  }
  return raw;
}

function getDateFromKey(key: string | undefined) {
  if (!key) return undefined;
  const parsed = parseISO(key);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export default function Workouts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryDate = searchParams.get("date");

  const today = useMemo(() => new Date(), []);
  const todayKey = format(today, "yyyy-MM-dd");

  const isDateUnlocked = useCallback(
    (dateKey: string | undefined) => {
      if (!dateKey) return false;
      return dateKey <= todayKey;
    },
    [todayKey]
  );

  const normalizedQuery = useMemo(() => {
    if (!queryDate) return undefined;
    const parsed = getDateFromKey(queryDate);
    return parsed ? format(parsed, "yyyy-MM-dd") : undefined;
  }, [queryDate]);

  const unlockedDateKeys = useMemo(() => workoutDates.filter((dateKey) => isDateUnlocked(dateKey)), [isDateUnlocked]);
  const latestUnlockedDateKey = unlockedDateKeys.length ? unlockedDateKeys[unlockedDateKeys.length - 1] : undefined;

  const initialDateKey = useMemo(() => {
    if (normalizedQuery) {
      return normalizedQuery;
    }
    if (latestUnlockedDateKey) {
      return latestUnlockedDateKey;
    }
    return todayKey;
  }, [normalizedQuery, latestUnlockedDateKey, todayKey]);

  useEffect(() => {
    if (!initialDateKey) return;
    if (queryDate !== initialDateKey) {
      setSearchParams({ date: initialDateKey }, { replace: true });
    }
  }, [initialDateKey, queryDate, setSearchParams]);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => getDateFromKey(initialDateKey) ?? today);

  useEffect(() => {
    const next = getDateFromKey(initialDateKey) ?? today;
    setSelectedDate(next);
  }, [initialDateKey, today]);

  const selectedDateKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined;
  const selectedDay = selectedDateKey ? getWorkoutForDate(selectedDateKey) : undefined;
  const selectedDayUnlocked = selectedDay ? isDateUnlocked(selectedDay.date) : false;

  const formResources = useMemo<WorkoutResource[]>(() => {
    if (!selectedDay || !selectedDayUnlocked) return [];
    const seen = new Set<string>();
    const aggregated: WorkoutResource[] = [];
    selectedDay.items.forEach((item) => {
      (item.resources ?? []).forEach((resource) => {
        if (resource.type === "form" && !seen.has(resource.url)) {
          seen.add(resource.url);
          aggregated.push(resource);
        }
      });
    });
    return aggregated;
  }, [selectedDay, selectedDayUnlocked]);

  const calendarData = useMemo(() => {
    const workoutDays: Date[] = [];
    const testDays: Date[] = [];
    const lockedDays: Date[] = [];
    workoutPlan.forEach((day) => {
      const parsed = parseISO(day.date);
      if (day.type === "test") {
        testDays.push(parsed);
      } else {
        workoutDays.push(parsed);
      }
      if (!isDateUnlocked(day.date)) {
        lockedDays.push(parsed);
      }
    });
    return { workoutDays, testDays, lockedDays };
  }, [isDateUnlocked]);

  const firstDate = firstWorkoutDate ? parseISO(firstWorkoutDate) : undefined;
  const lastDate = lastWorkoutDate ? parseISO(lastWorkoutDate) : undefined;

  return (
    <AuthenticatedLayout
      title="Bài tập"
      description="Theo dõi toàn bộ lịch trình trong 99 ngày và mở nhanh video hướng dẫn cho từng buổi tập hoặc bài kiểm tra."
      className="bg-transparent"
    >
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Lịch hành trình</CardTitle>
            <CardDescription>Chọn một ngày trong kế hoạch 99 ngày để xem chi tiết nội dung luyện tập.</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (!date) return;
                const iso = format(date, "yyyy-MM-dd");
                setSelectedDate(date);
                setSearchParams({ date: iso }, { replace: true });
              }}
              fromDate={firstDate}
              toDate={lastDate}
              modifiers={{
                hasWorkout: calendarData.workoutDays,
                hasTest: calendarData.testDays,
                locked: calendarData.lockedDays,
              }}
              modifiersStyles={{
                hasWorkout: {
                  backgroundColor: PRIMARY_COLOR_LIGHT,
                  color: PRIMARY_COLOR_DARK,
                },
                hasTest: {
                  backgroundColor: "#D32F2F",
                  color: "#FFF4F4",
                },
                locked: {
                  opacity: 0.5,
                },
              }}
              className="rounded-md border"
            />
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: PRIMARY_COLOR }}
                />
                Buổi tập
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-700" />
                Bài test
              </div>
              <div className="flex-1 text-right text-xs italic">
                {workoutDates.length} ngày được thiết kế sẵn trong chương trình.
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chi tiết nội dung</CardTitle>
            <CardDescription>
              {selectedDate
                ? format(selectedDate, "EEEE, dd/MM/yyyy", { locale: vi })
                : "Chọn một ngày trong lịch để xem nội dung luyện tập."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selectedDate ? (
              <p className="text-sm text-muted-foreground">
                Hãy chọn một ngày bất kỳ trong hành trình 99 ngày để xem video luyện tập hoặc bài test tương ứng.
              </p>
            ) : !selectedDay ? (
              <div className="rounded-md border border-dashed border-muted-foreground/40 bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">
                  Chưa có dữ liệu cho ngày {format(selectedDate, "dd/MM/yyyy")}. Khi kế hoạch cập nhật, nội dung sẽ xuất hiện ở
                  đây.
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge
                    variant="outline"
                    className="px-3 py-1 text-xs font-semibold uppercase tracking-wide"
                    style={{
                      borderColor: selectedDay.type === "test" ? "#B71C1C" : PRIMARY_COLOR,
                      color: selectedDay.type === "test" ? "#B71C1C" : PRIMARY_COLOR,
                    }}
                  >
                    {selectedDay.type === "test" ? "Bài test" : "Buổi tập"}
                  </Badge>
                  {selectedDay.label ? <span className="text-sm font-medium text-foreground">{selectedDay.label}</span> : null}
                  {selectedDay.week ? (
                    <span className="text-xs text-muted-foreground">Tuần: {selectedDay.week}</span>
                  ) : null}
                </div>

                {!selectedDayUnlocked ? (
                  <div className="rounded-lg border border-dashed border-muted-foreground/40 bg-white p-4">
                    <p className="text-sm font-semibold text-foreground">
                      Nội dung của bài tập sẽ được mở vào 7h sáng ngày {format(parseISO(selectedDay.date), "dd/MM/yyyy")}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Vui lòng quay lại sau khi link được cập nhật. Bạn vẫn có thể xem lại các buổi tập truớc đó trong lịch.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {selectedDay.items.map((item, index) => (
                        <div
                          key={`${selectedDay.date}-${index}`}
                          className="rounded-lg border border-muted bg-white p-4 shadow-sm"
                        >
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-base font-semibold text-foreground">{normalizeTitle(item, selectedDay)}</h3>
                              {item.reps ? (
                                <Badge variant="secondary" className="text-xs font-medium text-foreground">
                                  {item.reps}
                                </Badge>
                              ) : null}
                            </div>

                            {item.description ? (
                              <p className="text-sm text-muted-foreground whitespace-pre-line">{item.description}</p>
                            ) : null}

                            {item.notes && item.notes.length ? (
                              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                                {item.notes.map((note, noteIndex) => (
                                  <li key={`${selectedDay.date}-${index}-note-${noteIndex}`}>{note}</li>
                                ))}
                              </ul>
                            ) : null}

                            {item.resources && item.resources.length ? (
                              <div className="flex flex-col gap-2 pt-1">
                                {item.resources
                                  .filter((resource) => resource.type !== "form")
                                  .sort((a, b) => RESOURCE_PRIORITY[a.type] - RESOURCE_PRIORITY[b.type])
                                  .map((resource, resourceIndex) => {
                                    const meta = RESOURCE_TEXT[resource.type];
                                    const Icon = meta.icon;
                                    const href = resource.url;
                                    const buttonStyle =
                                      resource.type === "video"
                                        ? { backgroundColor: PRIMARY_COLOR, color: "#FFFFFF" }
                                        : { backgroundColor: PRIMARY_COLOR_DARK, color: "#FFFFFF" };

                                    return (
                                      <Button
                                        key={`${selectedDay.date}-${index}-resource-${resourceIndex}`}
                                        size="sm"
                                        className="inline-flex items-center gap-2 justify-start"
                                        style={buttonStyle}
                                        asChild
                                      >
                                        <a href={href} target="_blank" rel="noreferrer">
                                          <Icon className="h-4 w-4" />
                                          {meta.label}
                                        </a>
                                      </Button>
                                    );
                                  })}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>

                    {formResources.length ? (
                      <div className="rounded-lg border border-dashed border-muted-foreground/40 bg-white p-4">
                        <p className="text-sm font-semibold text-foreground">Dien bieu mau ket qua</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Hoan thanh tat ca cac bai tap truoc khi gui bieu mau tong ket.
                        </p>
                        <div className="mt-3 flex flex-col gap-2">
                          {formResources.map((resource, index) => (
                            <Button
                              key={`${selectedDay.date}-form-${index}`}
                              size="sm"
                              className="inline-flex items-center gap-2 justify-start"
                              style={{ backgroundColor: "#E65100", color: "#FFFFFF" }}
                              asChild
                            >
                              <a href={resource.url} target="_blank" rel="noreferrer">
                                <FileText className="h-4 w-4" />
                                {formResources.length > 1 ? `${RESOURCE_TEXT.form.label} ${index + 1}` : RESOURCE_TEXT.form.label}
                              </a>
                            </Button>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}

import { useEffect, useMemo, useState } from "react";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useCurrentMember } from "@/hooks/use-current-member";
import { fetchHomeworkSubmissions, upsertHomeworkSubmission } from "@/lib/member-data";

interface HomeworkEntry {
  date: string;
  submission: string;
  updatedAt: string;
}

function formatISODate(date?: Date) {
  if (!date) return new Date().toISOString().split("T")[0]!;
  const zonedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return zonedDate.toISOString().split("T")[0]!;
}

function formatDisplayDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function Homework() {
  const { toast } = useToast();
  const { member, loading: memberLoading, error: memberError } = useCurrentMember();

  const [entries, setEntries] = useState<HomeworkEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [submission, setSubmission] = useState("");

  const today = formatISODate();

  const selectedEntry = useMemo(() => {
    const key = formatISODate(selectedDate);
    return entries.find((entry) => entry.date === key) ?? null;
  }, [entries, selectedDate]);

  useEffect(() => {
    if (!member) {
      setEntries([]);
      return;
    }

    let active = true;
    setLoadingEntries(true);

    fetchHomeworkSubmissions(member.id)
      .then((data) => {
        if (!active) return;
        const mapped: HomeworkEntry[] = data.map((item) => ({
          date: item.submission_date,
          submission: item.submission ?? "",
          updatedAt: item.updated_at,
        }));
        mapped.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
        setEntries(mapped);
      })
      .catch((error) => {
        if (!active) return;
        console.error("Failed to load homework submissions:", error);
        toast({
          variant: "destructive",
          title: "Không thể tải bài nộp",
          description: "Vui lòng thử lại sau.",
        });
      })
      .finally(() => {
        if (active) setLoadingEntries(false);
      });

    return () => {
      active = false;
    };
  }, [member, toast]);

  useEffect(() => {
    if (selectedEntry) {
      setSubmission(selectedEntry.submission);
    } else {
      setSubmission("");
    }
  }, [selectedEntry]);

  const dayHasSubmission = useMemo(
    () =>
      entries.map((entry) => {
        const date = new Date(`${entry.date}T00:00:00`);
        return date;
      }),
    [entries],
  );

  const isFormDisabled = memberLoading || loadingEntries || !member;
  const isTodaySelected = selectedDate ? formatISODate(selectedDate) === today : false;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!member) return;

    if (!isTodaySelected) {
      toast({
        variant: "destructive",
        title: "Chỉ chỉnh sửa được ngày hôm nay",
        description: "Bạn chỉ có thể cập nhật bài nộp của ngày hiện tại.",
      });
      return;
    }

    const trimmedSubmission = submission.trim();

    if (!trimmedSubmission) {
      toast({
        variant: "destructive",
        title: "Thiếu nội dung bài nộp",
        description: "Vui lòng mô tả lại những gì bạn đã thực hành hoặc học được trong ngày.",
      });
      return;
    }

    setIsSaving(true);
    try {
      const saved = await upsertHomeworkSubmission(member.id, today, trimmedSubmission);
      const updated: HomeworkEntry = {
        date: saved.submission_date,
        submission: saved.submission ?? "",
        updatedAt: saved.updated_at,
      };

      setEntries((prev) => {
        const filtered = prev.filter((entry) => entry.date !== updated.date);
        return [updated, ...filtered].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
      });

      toast({
        title: "Đã lưu bài học trong ngày",
        description: "Bạn đã cập nhật tiến trình học tập của mình thành công.",
      });
    } catch (error) {
      console.error("Failed to save homework submission:", error);
      toast({
        variant: "destructive",
        title: "Không thể lưu bài nộp",
        description: "Vui lòng thử lại sau.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AuthenticatedLayout
      title="Trực nhật bài học"
      description="Ghi lại kết quả luyện tập mỗi ngày và theo dõi phản hồi từ mentor."
      className="bg-transparent"
    >
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Lịch nộp bài</CardTitle>
            <CardDescription>
              Các ngày đã nộp bài sẽ được tô màu. Chọn ngày để xem lại hoặc cập nhật thêm chi tiết.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={{ submitted: dayHasSubmission }}
              modifiersClassNames={{ submitted: "bg-emerald-500 text-emerald-50 hover:bg-emerald-600" }}
              disabled={isFormDisabled}
            />
            <p className="mt-4 text-sm text-muted-foreground">
              Những ngày màu xanh hiển thị các lần bạn đã nộp bài. Bạn có thể cập nhật lại nội dung nếu muốn.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{selectedEntry ? "Cập nhật bài đã nộp" : "Tạo bài nộp mới"}</CardTitle>
              <CardDescription>Ngày {formatDisplayDate(formatISODate(selectedDate))}</CardDescription>
            </CardHeader>
            <CardContent>
              {memberError ? (
                <div className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                  {memberError.message}
                </div>
              ) : null}
              {loadingEntries ? (
                <p className="text-sm text-muted-foreground">Đang tải bài nộp...</p>
              ) : null}
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="submission">Nội dung bài nộp</Label>
                  <Textarea
                    id="submission"
                    value={submission}
                    onChange={(event) => setSubmission(event.target.value)}
                    placeholder="Chia sẻ những gì bạn đã thực hành, cảm nhận và ghi chú quan trọng trong ngày."
                    className="min-h-[160px]"
                    disabled={isFormDisabled || !isTodaySelected}
                    required
                  />
                </div>

                <Button type="submit" disabled={isFormDisabled || isSaving || !isTodaySelected}>
                  {isSaving ? "Đang lưu..." : "Lưu nội dung bài nộp"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

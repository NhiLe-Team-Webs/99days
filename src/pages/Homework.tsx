import { useEffect, useMemo, useState } from "react";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface HomeworkEntry {
  date: string;
  lesson: string;
  submission: string;
  mentorNotes: string;
}

const seedHomework: HomeworkEntry[] = [
  {
    date: new Date().toISOString().split("T")[0],
    lesson: "Thói quen buổi sáng #12",
    submission: "Tổng hợp 5 bài tập cardio đã hoàn thành, kèm video ghi lại động tác chuẩn.",
    mentorNotes: "Tiếp tục giữ nhịp độ như vậy, chú ý thêm vào phần khởi động khớp cổ tay.",
  },
  {
    date: new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0],
    lesson: "Ghi chép dinh dưỡng ngày 07",
    submission: "Chia sẻ thực đơn 3 bữa và cảm nhận cơ thể trong ngày.",
    mentorNotes: "Bổ sung thêm trái cây vào bữa phụ chiều để cải thiện năng lượng.",
  },
];

function formatISODate(date?: Date) {
  if (!date) return new Date().toISOString().split("T")[0];
  const zonedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return zonedDate.toISOString().split("T")[0];
}

function formatDisplayDate(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function Homework() {
  const [entries, setEntries] = useState<HomeworkEntry[]>(seedHomework);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [lesson, setLesson] = useState("");
  const [submission, setSubmission] = useState("");
  const [mentorNotes, setMentorNotes] = useState("");

  const selectedEntry = useMemo(() => {
    const key = formatISODate(selectedDate);
    return entries.find((entry) => entry.date === key) ?? null;
  }, [entries, selectedDate]);

  useEffect(() => {
    if (selectedEntry) {
      setLesson(selectedEntry.lesson);
      setSubmission(selectedEntry.submission);
      setMentorNotes(selectedEntry.mentorNotes);
    } else {
      setLesson("");
      setSubmission("");
      setMentorNotes("");
    }
  }, [selectedEntry]);

  const dayHasSubmission = useMemo(
    () => entries.map((entry) => new Date(entry.date + "T00:00:00")),
    [entries]
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const key = formatISODate(selectedDate);
    const nextEntry: HomeworkEntry = {
      date: key,
      lesson: lesson.trim(),
      submission: submission.trim(),
      mentorNotes: mentorNotes.trim(),
    };

    setEntries((prev) => {
      const existingIndex = prev.findIndex((entry) => entry.date === key);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = nextEntry;
        return updated.sort((a, b) => (a.date < b.date ? 1 : -1));
      }
      return [...prev, nextEntry].sort((a, b) => (a.date < b.date ? 1 : -1));
    });
  };

  return (
    <AuthenticatedLayout
      title="Trả bài hằng ngày"
      description="Nộp kết quả học tập, cập nhật phản hồi từ mentor và theo dõi lịch sử luyện tập"
      className="bg-transparent"
    >
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Lịch nộp bài</CardTitle>
            <CardDescription>Chọn ngày để xem nội dung đã nộp hoặc tiếp tục chỉnh sửa.</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={{ submitted: dayHasSubmission }}
              modifiersClassNames={{ submitted: "bg-emerald-500 text-emerald-50 hover:bg-emerald-600" }}
            />
            <p className="mt-4 text-sm text-muted-foreground">
              Các ngày màu xanh lá là những lần bạn đã nộp bài. Bạn có thể cập nhật lại nhưng không thể xoá.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{selectedEntry ? "Cập nhật bài đã nộp" : "Tạo bài nộp mới"}</CardTitle>
              <CardDescription>
                Ngày {formatDisplayDate(formatISODate(selectedDate))} – hãy mô tả chi tiết kết quả luyện tập.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="lesson">Chủ đề hoặc tên bài tập</Label>
                  <Input
                    id="lesson"
                    value={lesson}
                    onChange={(event) => setLesson(event.target.value)}
                    placeholder="Ví dụ: Bài tập sức bền tuần 4"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="submission">Nội dung trả bài</Label>
                  <Textarea
                    id="submission"
                    value={submission}
                    onChange={(event) => setSubmission(event.target.value)}
                    placeholder="Chia sẻ bạn đã thực hành như thế nào, cảm nhận ra sao và đính kèm đường dẫn nếu có"
                    className="min-h-[140px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mentor-notes">Ghi chú từ mentor</Label>
                  <Textarea
                    id="mentor-notes"
                    value={mentorNotes}
                    onChange={(event) => setMentorNotes(event.target.value)}
                    placeholder="Ghi lại lời nhắc hoặc phản hồi quan trọng để dễ dàng theo dõi"
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm text-muted-foreground">
                    {selectedEntry ? "Bạn đang chỉnh sửa bài đã nộp." : "Bài mới sẽ tự động lưu sau khi bấm hoàn thành."}
                  </span>
                  <Button type="submit">Lưu nội dung trả bài</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lịch sử trả bài</CardTitle>
              <CardDescription>
                Cùng xem lại các cột mốc quan trọng để điều chỉnh kế hoạch luyện tập phù hợp hơn.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {entries.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Bạn chưa nộp bài nào. Chọn ngày trên lịch để bắt đầu ghi lại thành quả nhé!
                </p>
              ) : (
                entries.map((entry) => (
                  <div key={entry.date} className="rounded-lg border border-border bg-card/50 p-4">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Ngày nộp</p>
                        <p className="text-base font-semibold text-foreground">{formatDisplayDate(entry.date)}</p>
                      </div>
                      <span className="text-xs uppercase tracking-wide text-primary">Chỉ có thể chỉnh sửa</span>
                    </div>
                    <div className="mt-3 space-y-3 text-sm text-muted-foreground">
                      <p>
                        <span className="font-semibold text-foreground">Chủ đề: </span>
                        {entry.lesson}
                      </p>
                      <p>
                        <span className="font-semibold text-foreground">Nội dung: </span>
                        {entry.submission}
                      </p>
                      <p>
                        <span className="font-semibold text-foreground">Ghi chú mentor: </span>
                        {entry.mentorNotes}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

import { useEffect, useMemo, useState } from "react";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface GratitudeEntry {
  date: string;
  gratitude: string;
  highlight: string;
  intention: string;
}

const initialEntries: GratitudeEntry[] = [
  {
    date: new Date().toISOString().split("T")[0],
    gratitude: "Biết ơn vì cơ thể khoẻ mạnh và tinh thần bền bỉ trong hành trình 99 ngày.",
    highlight: "Hoàn thành đầy đủ bài tập buổi sáng cùng đội nhóm.",
    intention: "Tiếp tục lan toả năng lượng tích cực đến cộng đồng học viên.",
  },
  {
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    gratitude: "Biết ơn vì nhận được sự động viên từ mentor trong buổi học tối qua.",
    highlight: "Tổng kết lại những điều học được và áp dụng ngay vào buổi sáng.",
    intention: "Nhắc nhở bản thân ghi chú đầy đủ sau mỗi buổi học.",
  },
];

function formatDisplayDate(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatISODate(date?: Date) {
  if (!date) return new Date().toISOString().split("T")[0];
  const zonedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return zonedDate.toISOString().split("T")[0];
}

export default function Gratitude() {
  const [entries, setEntries] = useState<GratitudeEntry[]>(initialEntries);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [gratitude, setGratitude] = useState("");
  const [highlight, setHighlight] = useState("");
  const [intention, setIntention] = useState("");

  const selectedEntry = useMemo(() => {
    const key = formatISODate(selectedDate);
    return entries.find((entry) => entry.date === key) ?? null;
  }, [entries, selectedDate]);

  useEffect(() => {
    if (selectedEntry) {
      setGratitude(selectedEntry.gratitude);
      setHighlight(selectedEntry.highlight);
      setIntention(selectedEntry.intention);
    } else {
      setGratitude("");
      setHighlight("");
      setIntention("");
    }
  }, [selectedEntry]);

  const daysWithEntries = useMemo(
    () => entries.map((entry) => new Date(entry.date + "T00:00:00")),
    [entries]
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const key = formatISODate(selectedDate);

    const nextEntry: GratitudeEntry = {
      date: key,
      gratitude: gratitude.trim(),
      highlight: highlight.trim(),
      intention: intention.trim(),
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
      title="Nhật ký biết ơn"
      description="Ghi lại điều bạn trân trọng mỗi ngày và xem lại hành trình tích cực của bản thân"
      className="bg-transparent"
    >
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Chọn ngày</CardTitle>
            <CardDescription>
              Chạm vào ngày bất kỳ để xem lại nội dung biết ơn trước đó.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={{ hasEntry: daysWithEntries }}
              modifiersClassNames={{ hasEntry: "bg-primary text-primary-foreground hover:bg-primary/90" }}
            />
            <p className="mt-4 text-sm text-muted-foreground">
              Những ngày được tô màu là ngày bạn đã lưu lại điều biết ơn.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{formatDisplayDate(formatISODate(selectedDate))}</CardTitle>
              <CardDescription>
                Bạn chỉ có thể cập nhật nội dung, không thể xoá nhật ký đã lưu.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="gratitude">Hôm nay bạn biết ơn điều gì?</Label>
                  <Textarea
                    id="gratitude"
                    value={gratitude}
                    onChange={(event) => setGratitude(event.target.value)}
                    placeholder="Hãy viết ra ít nhất một điều khiến bạn cảm thấy biết ơn hôm nay"
                    className="min-h-[120px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="highlight">Khoảnh khắc đáng nhớ nhất</Label>
                  <Textarea
                    id="highlight"
                    value={highlight}
                    onChange={(event) => setHighlight(event.target.value)}
                    placeholder="Ghi lại điều khiến bạn tự hào hoặc cảm thấy hạnh phúc"
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="intention">Dự định tích cực cho ngày mai</Label>
                  <Input
                    id="intention"
                    value={intention}
                    onChange={(event) => setIntention(event.target.value)}
                    placeholder="Ví dụ: Thức dậy sớm hơn 10 phút để thiền"
                    required
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm text-muted-foreground">
                    {selectedEntry ? "Bạn đang chỉnh sửa nội dung đã lưu." : "Đây sẽ là mục mới trong hành trình biết ơn."}
                  </span>
                  <Button type="submit">Lưu nhật ký biết ơn</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lịch sử biết ơn</CardTitle>
              <CardDescription>
                Mỗi dòng chữ là một dấu mốc chuyển mình. Cùng nhìn lại để tiếp thêm động lực nhé!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {entries.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Bạn chưa có nhật ký nào. Hãy bắt đầu bằng cách chọn ngày và viết những điều biết ơn.
                </p>
              ) : (
                entries.map((entry) => (
                  <div key={entry.date} className="rounded-lg border border-border bg-card/50 p-4">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                      <h3 className="text-base font-semibold text-foreground">
                        {formatDisplayDate(entry.date)}
                      </h3>
                      <span className="text-xs uppercase tracking-wide text-primary">Không thể xoá</span>
                    </div>
                    <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                      <p>
                        <span className="font-semibold text-foreground">Điều biết ơn: </span>
                        {entry.gratitude}
                      </p>
                      <p>
                        <span className="font-semibold text-foreground">Điểm sáng trong ngày: </span>
                        {entry.highlight}
                      </p>
                      <p>
                        <span className="font-semibold text-foreground">Ý định cho ngày mai: </span>
                        {entry.intention}
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

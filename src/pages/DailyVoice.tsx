import { useEffect, useMemo, useState } from "react";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { useCurrentMember } from "@/hooks/use-current-member";
import { fetchDailyVoiceEntries, upsertDailyVoiceEntry } from "@/lib/member-data";

interface DailyVoiceEntry {
  date: string;
  message: string;
  updatedAt: string;
}

const promptTitle = "What do you feel like saying today?";

function formatISODate(date?: Date) {
  if (!date) return new Date().toISOString().split("T")[0]!;
  const zonedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return zonedDate.toISOString().split("T")[0]!;
}

function formatDisplayDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function DailyVoice() {
  const { toast } = useToast();
  const { member, loading: memberLoading, error: memberError } = useCurrentMember();

  const [entries, setEntries] = useState<DailyVoiceEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const today = formatISODate();
  const selectedKey = selectedDate ? formatISODate(selectedDate) : today;

  const daysWithEntries = useMemo(
    () =>
      entries.map((entry) => {
        const date = new Date(`${entry.date}T00:00:00`);
        return date;
      }),
    [entries],
  );

  const selectedEntry = useMemo(
    () => entries.find((entry) => entry.date === selectedKey) ?? null,
    [entries, selectedKey],
  );

  const todaysEntry = useMemo(
    () => entries.find((entry) => entry.date === today) ?? null,
    [entries, today],
  );

  const isFormDisabled = memberLoading || loadingEntries || !member;
  const isTodaySelected = selectedKey === today;

  useEffect(() => {
    if (!member) {
      setEntries([]);
      setLoadingEntries(false);
      return;
    }

    let active = true;
    setLoadingEntries(true);

    fetchDailyVoiceEntries(member.id)
      .then((data) => {
        if (!active) return;
        const mapped: DailyVoiceEntry[] =
          data?.map((entry) => ({
            date: entry.entry_date,
            message: entry.message ?? "",
            updatedAt: entry.updated_at,
          })) ?? [];
        mapped.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
        setEntries(mapped);
      })
      .catch((error) => {
        if (!active) return;
        console.error("Failed to load daily voice entries:", error);
        toast({
          variant: "destructive",
          title: "Không thể tải câu trả lời",
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
    if (isTodaySelected) {
      setMessage(selectedEntry?.message ?? "");
    } else {
      setMessage("");
    }
  }, [selectedEntry, isTodaySelected]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!member || !isTodaySelected) {
      toast({
        variant: "destructive",
        title: "Chỉ có thể ghi cho ngày hôm nay",
        description: "Hãy chọn đúng ngày hiện tại để tiếp tục.",
      });
      return;
    }

    const entryDate = today;

    setIsSaving(true);
    try {
      const saved = await upsertDailyVoiceEntry(member.id, entryDate, message.trim());
      const updated: DailyVoiceEntry = {
        date: saved.entry_date,
        message: saved.message ?? "",
        updatedAt: saved.updated_at,
      };

      setEntries((prev) => {
        const filtered = prev.filter((entry) => entry.date !== updated.date);
        return [updated, ...filtered].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
      });

      toast({
        title: "Đã lưu chia sẻ hôm nay",
        description: "Cảm ơn bạn đã dành thời gian ghi lại cảm nhận của mình.",
      });
    } catch (error) {
      console.error("Failed to save daily voice entry:", error);
      toast({
        variant: "destructive",
        title: "Không thể lưu chia sẻ",
        description: "Vui lòng thử lại sau.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AuthenticatedLayout
      title={promptTitle}
      description="Ghi lại cảm xúc hoặc thông điệp cho hành trình của bạn. Mỗi ngày chỉ ghi được cho hôm nay và bạn có thể bỏ qua nếu bận."
      className="bg-transparent"
    >
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Chọn ngày</CardTitle>
            <CardDescription>
              Ngày đánh dấu màu là ngày đã có nội dung. Bạn chỉ có thể ghi hoặc chỉnh sửa câu trả lời cho ngày hôm nay.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={{ hasEntry: daysWithEntries }}
              modifiersClassNames={{ hasEntry: "bg-primary text-primary-foreground hover:bg-primary/90" }}
              disabled={isFormDisabled}
            />
            <p className="mt-4 text-sm text-muted-foreground">
              Chọn ngày để xem lại lịch sử. Để ghi mới, hãy chọn đúng ngày hôm nay (đã được làm nổi bật trong lịch).
            </p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{formatDisplayDate(selectedKey)}</CardTitle>
              {selectedEntry ? (
                <CardDescription>
                  Lần cập nhật gần nhất: {new Date(selectedEntry.updatedAt).toLocaleString("vi-VN")}
                </CardDescription>
              ) : (
                <CardDescription>Chưa có chia sẻ cho ngày này.</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {memberError ? (
                <div className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                  {memberError.message}
                </div>
              ) : null}
              {loadingEntries ? <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p> : null}
              {isTodaySelected ? (
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="daily-message">{promptTitle}</Label>
                    <Textarea
                      id="daily-message"
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      placeholder="Chia sẻ suy nghĩ hoặc cảm nhận của bạn cho hôm nay..."
                      className="min-h-[140px]"
                      disabled={isFormDisabled}
                    />
                    <p className="text-xs text-muted-foreground">
                      Mỗi ngày chỉ có một câu trả lời. Bạn có thể cập nhật lại nội dung trong ngày nếu muốn.
                    </p>
                  </div>
                  <Button type="submit" disabled={isFormDisabled || isSaving}>
                    {isSaving ? "Đang lưu..." : todaysEntry ? "Cập nhật chia sẻ hôm nay" : "Lưu chia sẻ hôm nay"}
                  </Button>
                </form>
              ) : (
                <div className="rounded-lg border border-dashed border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                  {selectedEntry
                    ? selectedEntry.message
                    : "Ngày này chưa có nội dung. Hãy chọn ngày hôm nay để bắt đầu ghi chú mới."}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

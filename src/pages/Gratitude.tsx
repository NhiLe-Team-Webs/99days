import { useEffect, useMemo, useState } from "react";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useCurrentMember } from "@/hooks/use-current-member";
import { fetchGratitudeEntries, upsertGratitudeEntry } from "@/lib/member-data";

interface GratitudeEntry {
  date: string;
  gratitude: string;
  updatedAt: string;
}

function formatDisplayDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatISODate(date?: Date) {
  if (!date) return new Date().toISOString().split("T")[0]!;
  const zonedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return zonedDate.toISOString().split("T")[0]!;
}

export default function Gratitude() {
  const { toast } = useToast();
  const { member, loading: memberLoading, error: memberError } = useCurrentMember();

  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [gratitude, setGratitude] = useState("");

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

    fetchGratitudeEntries(member.id)
      .then((data) => {
        if (!active) return;
        const mapped: GratitudeEntry[] = data.map((entry) => ({
          date: entry.entry_date,
          gratitude: entry.gratitude ?? "",
          updatedAt: entry.updated_at,
        }));
        mapped.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
        setEntries(mapped);
      })
      .catch((error) => {
        if (!active) return;
        console.error("Failed to load gratitude entries:", error);
        toast({
          variant: "destructive",
          title: "Không thể tải nhật ký",
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
      setGratitude(selectedEntry.gratitude);
    } else {
      setGratitude("");
    }
  }, [selectedEntry]);

  const daysWithEntries = useMemo(
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
        description: "Bạn chỉ có thể cập nhật nhật ký biết ơn của ngày hiện tại.",
      });
      return;
    }

    const trimmed = gratitude.trim();
    if (!trimmed) {
      toast({
        variant: "destructive",
        title: "Thiếu nội dung",
        description: "Hãy chia sẻ ít nhất một điều khiến bạn cảm thấy biết ơn trong ngày hôm nay.",
      });
      return;
    }

    setIsSaving(true);
    try {
      const saved = await upsertGratitudeEntry(member.id, today, trimmed);
      const updated: GratitudeEntry = {
        date: saved.entry_date,
        gratitude: saved.gratitude ?? "",
        updatedAt: saved.updated_at,
      };

      setEntries((prev) => {
        const filtered = prev.filter((entry) => entry.date !== updated.date);
        return [updated, ...filtered].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
      });

      toast({
        title: "Đã lưu nhật ký",
        description: "Cảm ơn bạn vì đã ghi lại điều tích cực hôm nay.",
      });
    } catch (error) {
      console.error("Failed to save gratitude entry:", error);
      toast({
        variant: "destructive",
        title: "Không thể lưu nhật ký",
        description: "Vui lòng thử lại sau.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AuthenticatedLayout
      title="Nhật ký biết ơn"
      description="Ghi lại điều tích cực mỗi ngày để nuôi dưỡng sự biết ơn và động lực bản thân."
      className="bg-transparent"
    >
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Chọn ngày</CardTitle>
            <CardDescription>
              Chạm vào ngày đã được đánh dấu để xem lại nội dung. Những ngày chưa có ghi chép sẽ để trống.
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
              Những ngày được tô màu là các ngày bạn đã lưu nhật ký biết ơn.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{formatDisplayDate(formatISODate(selectedDate))}</CardTitle>
              {selectedEntry ? (
                <CardDescription>
                  Lần cập nhật gần nhất: {new Date(selectedEntry.updatedAt).toLocaleString("vi-VN")}
                </CardDescription>
              ) : (
                <CardDescription>Chưa có ghi chép cho ngày này.</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {memberError ? (
                <div className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                  {memberError.message}
                </div>
              ) : null}
              {loadingEntries ? (
                <p className="text-sm text-muted-foreground">Đang tải nhật ký...</p>
              ) : null}
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="gratitude">Hôm nay bạn biết ơn điều gì?</Label>
                  <Textarea
                    id="gratitude"
                    value={gratitude}
                    onChange={(event) => setGratitude(event.target.value)}
                    placeholder="Viết ra ít nhất một điều khiến bạn cảm thấy biết ơn trong ngày hôm nay."
                    className="min-h-[120px]"
                    disabled={isFormDisabled || !isTodaySelected}
                    required
                  />
                </div>
                <Button type="submit" disabled={isFormDisabled || isSaving || !isTodaySelected}>
                  {isSaving ? "Đang lưu..." : "Lưu nhật ký biết ơn"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

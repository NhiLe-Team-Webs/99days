import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";

interface ProgressEntry {
  date: string;
  weight: number;
  height: number;
  note: string;
  photo?: string;
}

const demoEntries: ProgressEntry[] = [
  {
    date: new Date(Date.now() - 3 * 86400000).toISOString(),
    weight: 58.4,
    height: 162,
    note: "Tuần này duy trì đều đặn 5 buổi tập, cơ thể cảm giác khoẻ và nhẹ nhõm hơn.",
  },
  {
    date: new Date(Date.now() - 7 * 86400000).toISOString(),
    weight: 59,
    height: 162,
    note: "Bắt đầu thử thách, đo đạc các chỉ số ban đầu để tiện đối chiếu.",
  },
];

function formatDisplayDate(dateString: string) {
  return new Date(dateString).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function calculateBMI(weight: number, height: number) {
  const heightInMeters = height / 100;
  if (!heightInMeters) return 0;
  return +(weight / (heightInMeters * heightInMeters)).toFixed(1);
}

async function convertFileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Progress() {
  const [entries, setEntries] = useState<ProgressEntry[]>(demoEntries);
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const latestEntry = entries[0];
  const bmi = latestEntry ? calculateBMI(latestEntry.weight, latestEntry.height) : 0;

  const weightTrend = useMemo(() => {
    if (entries.length < 2) return 0;
    const newest = entries[0].weight;
    const previous = entries[1].weight;
    return +(previous - newest).toFixed(1);
  }, [entries]);

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setPhotoPreview((previous) => {
        if (previous?.startsWith("blob:")) {
          URL.revokeObjectURL(previous);
        }
        return null;
      });
      setPhotoFile(null);
      return;
    }
    setPhotoFile(file);
    setPhotoPreview((previous) => {
      if (previous?.startsWith("blob:")) {
        URL.revokeObjectURL(previous);
      }
      return URL.createObjectURL(file);
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!weight || !height) return;

    const numericWeight = parseFloat(weight);
    const numericHeight = parseFloat(height);
    const now = new Date();
    const isoString = now.toISOString();
    const base64Photo = photoFile ? await convertFileToDataUrl(photoFile) : undefined;

    setEntries((prev) => {
      const formattedDate = isoString.split("T")[0];
      const existingIndex = prev.findIndex((entry) => entry.date.startsWith(formattedDate));
      const newEntry: ProgressEntry = {
        date: isoString,
        weight: numericWeight,
        height: numericHeight,
        note: note.trim(),
        photo: base64Photo,
      };

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newEntry;
        return updated.sort((a, b) => (a.date < b.date ? 1 : -1));
      }

      return [newEntry, ...prev].sort((a, b) => (a.date < b.date ? 1 : -1));
    });

    setWeight("");
    setHeight("");
    setNote("");
    setPhotoFile(null);
    setPhotoPreview((previous) => {
      if (previous?.startsWith("blob:")) {
        URL.revokeObjectURL(previous);
      }
      return null;
    });
  };

  return (
    <AuthenticatedLayout
      title="Cập nhật tiến độ"
      description="Theo dõi cân nặng, chiều cao và hình ảnh thay đổi của bạn trong suốt hành trình 99 ngày"
      className="bg-transparent"
    >
      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Chỉ số gần nhất</CardTitle>
            <CardDescription>
              Cập nhật vào {latestEntry ? formatDisplayDate(latestEntry.date) : "--"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-xs uppercase text-muted-foreground">Cân nặng</p>
                <p className="text-2xl font-semibold text-foreground">{latestEntry?.weight ?? "--"} kg</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-xs uppercase text-muted-foreground">Chiều cao</p>
                <p className="text-2xl font-semibold text-foreground">{latestEntry?.height ?? "--"} cm</p>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Chỉ số BMI ước tính</span>
                <Badge variant="secondary">{bmi || "--"}</Badge>
              </div>
              <ProgressBar value={Math.min(100, (bmi / 30) * 100)} className="mt-2" />
              <p className="mt-1 text-xs text-muted-foreground">
                Giá trị lý tưởng thường nằm trong khoảng 18.5 – 22.9. Điều chỉnh dinh dưỡng và vận động phù hợp nhé!
              </p>
            </div>
            <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 p-4 text-sm text-primary">
              {weightTrend > 0
                ? `Bạn đã nhẹ hơn ${weightTrend} kg so với lần đo trước!`
                : weightTrend < 0
                  ? `Cân nặng tăng ${Math.abs(weightTrend)} kg – hãy xem lại chế độ ăn và lịch tập của mình.`
                  : "Chưa có thay đổi nhiều kể từ lần cập nhật gần nhất."}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ghi nhận chỉ số mới</CardTitle>
              <CardDescription>Cập nhật bất cứ lúc nào bạn muốn – mỗi bản ghi đều được lưu giữ cẩn thận.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Cân nặng (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="Ví dụ: 58.3"
                      value={weight}
                      onChange={(event) => setWeight(event.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Chiều cao (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="Ví dụ: 162"
                      value={height}
                      onChange={(event) => setHeight(event.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Cảm nhận của bạn</Label>
                  <Textarea
                    id="note"
                    placeholder="Chia sẻ ngắn gọn về trạng thái cơ thể, năng lượng hoặc điều tự hào hôm nay"
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photo">Hình ảnh minh chứng (tuỳ chọn)</Label>
                  <Input id="photo" type="file" accept="image/*" onChange={handlePhotoChange} />
                  {photoPreview ? (
                    <div className="mt-2 overflow-hidden rounded-lg border border-border bg-muted/20">
                      <img src={photoPreview} alt="Xem trước ảnh tiến độ" className="h-48 w-full object-cover" />
                    </div>
                  ) : null}
                  <p className="text-xs text-muted-foreground">
                    Ảnh sẽ chỉ lưu trên tài khoản của bạn. Bạn có thể cập nhật ảnh mới bất cứ lúc nào.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm text-muted-foreground">
                    Mỗi lần lưu mới trong ngày sẽ thay thế bản ghi cũ của cùng ngày.
                  </span>
                  <Button type="submit">Lưu tiến độ</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nhật ký thay đổi</CardTitle>
              <CardDescription>
                Theo dõi hành trình biến đổi của bạn qua từng con số và câu chuyện nhỏ mỗi ngày.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {entries.length === 0 ? (
                <p className="text-sm text-muted-foreground">Hãy là người đầu tiên ghi dấu cột mốc mới hôm nay.</p>
              ) : (
                entries.map((entry, index) => (
                  <div key={entry.date} className="grid gap-4 rounded-lg border border-border bg-card/50 p-4 lg:grid-cols-[200px_1fr]">
                    <div className="space-y-2 text-sm">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Thời gian</p>
                      <p className="font-semibold text-foreground">{formatDisplayDate(entry.date)}</p>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <span className="text-sm">{entry.weight} kg</span>
                        <span className="text-sm">{entry.height} cm</span>
                      </div>
                      <Badge variant="outline">BMI {calculateBMI(entry.weight, entry.height)}</Badge>
                      {index === 0 ? <Badge className="bg-primary text-primary-foreground">Mới nhất</Badge> : null}
                    </div>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      {entry.photo ? (
                        <img
                          src={entry.photo}
                          alt={`Tiến độ ngày ${formatDisplayDate(entry.date)}`}
                          className="h-48 w-full rounded-lg object-cover"
                        />
                      ) : null}
                      {entry.note ? (
                        <p>
                          <span className="font-semibold text-foreground">Ghi chú: </span>
                          {entry.note}
                        </p>
                      ) : (
                        <p className="italic text-muted-foreground/80">Bạn chưa thêm ghi chú cho lần cập nhật này.</p>
                      )}
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

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useCurrentMember } from "@/hooks/use-current-member";
import { fetchProgressUpdates, upsertProgressUpdate } from "@/lib/member-data";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface ProgressEntry {
  recordedAt: string;
  recordedFor: string;
  weight: number;
  height: number;
  photoUrl: string | null;
}

function formatDisplayDateTime(dateString: string) {
  return new Date(dateString).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function calculateBMI(weight: number, height: number) {
  if (!weight || !height) return 0;
  const heightInMeters = height / 100;
  if (!heightInMeters) return 0;
  return +(weight / (heightInMeters * heightInMeters)).toFixed(1);
}

function todayISODate() {
  return new Date().toISOString().split("T")[0]!;
}

export default function Progress() {
  const { toast } = useToast();
  const { member, loading: memberLoading, error: memberError } = useCurrentMember();

  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoData, setPhotoData] = useState<string | null>(null);

  useEffect(() => {
    if (!member) {
      setEntries([]);
      return;
    }

    let active = true;
    setLoadingEntries(true);

    fetchProgressUpdates(member.id)
      .then((data) => {
        if (!active) return;
        const mapped: ProgressEntry[] = data.map((item) => ({
          recordedAt: item.recorded_at,
          recordedFor: item.recorded_for,
          weight: item.weight,
          height: item.height,
          photoUrl: item.photo_url,
        }));
        mapped.sort((a, b) => {
          if (a.recordedFor === b.recordedFor) return a.recordedAt < b.recordedAt ? 1 : -1;
          return a.recordedFor < b.recordedFor ? 1 : -1;
        });
        setEntries(mapped);
        const latest = mapped[0];
        if (latest) {
          setWeight(latest.weight.toString());
          setHeight(latest.height.toString());
          setPhotoPreview(latest.photoUrl);
          setPhotoData(latest.photoUrl);
        }
      })
      .catch((error) => {
        if (!active) return;
        console.error("Failed to load progress updates:", error);
        toast({
          variant: "destructive",
          title: "Không thể tải dữ liệu tiến độ",
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

  const latestEntry = entries[0] ?? null;
  const previousEntry = entries.length > 1 ? entries[1] : null;

  const bmi = latestEntry ? calculateBMI(latestEntry.weight, latestEntry.height) : 0;

  const weightDelta = useMemo(() => {
    if (!latestEntry || !previousEntry) return null;
    return +(latestEntry.weight - previousEntry.weight).toFixed(1);
  }, [latestEntry, previousEntry]);

  const heightDelta = useMemo(() => {
    if (!latestEntry || !previousEntry) return null;
    return +(latestEntry.height - previousEntry.height).toFixed(1);
  }, [latestEntry, previousEntry]);

  const chartData = useMemo(() => {
    return [...entries]
      .sort((a, b) => (a.recordedFor > b.recordedFor ? 1 : -1))
      .map((entry) => ({
        date: new Date(`${entry.recordedFor}T00:00:00`).toLocaleDateString("vi-VN"),
        weight: entry.weight,
        height: entry.height,
      }));
  }, [entries]);

  const isFormDisabled = memberLoading || loadingEntries || !member;

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setPhotoPreview(null);
      setPhotoData(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : null;
      setPhotoPreview(result);
      setPhotoData(result);
    };
    reader.onerror = () => {
      toast({
        variant: "destructive",
        title: "Không thể đọc ảnh",
        description: "Hãy thử chọn lại hoặc dùng một ảnh khác.",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setPhotoData(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!member) return;

    const numericWeight = Number(weight);
    const numericHeight = Number(height);

    if (!numericWeight || !numericHeight || Number.isNaN(numericWeight) || Number.isNaN(numericHeight)) {
      toast({
        variant: "destructive",
        title: "Thiếu chỉ số",
        description: "Vui lòng nhập đầy đủ cân nặng và chiều cao hợp lệ.",
      });
      return;
    }

    setIsSaving(true);
    const recordedFor = todayISODate();

    try {
      const saved = await upsertProgressUpdate(member.id, recordedFor, numericWeight, numericHeight, photoData);
      const updated: ProgressEntry = {
        recordedAt: saved.recorded_at,
        recordedFor: saved.recorded_for,
        weight: saved.weight,
        height: saved.height,
        photoUrl: saved.photo_url,
      };

      setEntries((prev) => {
        const filtered = prev.filter((entry) => entry.recordedFor !== updated.recordedFor);
        const next = [updated, ...filtered];
        next.sort((a, b) => {
          if (a.recordedFor === b.recordedFor) return a.recordedAt < b.recordedAt ? 1 : -1;
          return a.recordedFor < b.recordedFor ? 1 : -1;
        });
        return next;
      });

      toast({
        title: "Đã lưu số liệu tiến độ",
        description: "Hãy tiếp tục duy trì thói quen theo dõi mỗi ngày.",
      });
    } catch (error) {
      console.error("Failed to save progress update:", error);
      toast({
        variant: "destructive",
        title: "Không thể lưu tiến độ",
        description: "Vui lòng thử lại sau.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AuthenticatedLayout
      title="Theo dõi tiến độ"
      description="Lưu lại cân nặng, chiều cao và ảnh minh họa để quan sát sự thay đổi của cơ thể."
      className="bg-transparent"
    >
      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Chỉ số gần nhất</CardTitle>
            <CardDescription>
              Cập nhật vào {latestEntry ? formatDisplayDateTime(latestEntry.recordedAt) : "--"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-xs uppercase text-muted-foreground">Cân nặng</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-semibold text-foreground">
                    {latestEntry ? `${latestEntry.weight.toFixed(1)} kg` : "--"}
                  </p>
                  {weightDelta !== null ? (
                    <span
                      className={`flex items-center gap-1 text-sm font-medium ${
                        weightDelta > 0 ? "text-rose-600" : weightDelta < 0 ? "text-emerald-600" : "text-muted-foreground"
                      }`}
                    >
                      {weightDelta > 0 ? <ArrowUpRight className="h-4 w-4" /> : null}
                      {weightDelta < 0 ? <ArrowDownRight className="h-4 w-4" /> : null}
                      {weightDelta === 0 ? <Minus className="h-4 w-4" /> : null}
                      {weightDelta > 0 ? `+${weightDelta} kg` : weightDelta < 0 ? `${weightDelta} kg` : "0 kg"}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-xs uppercase text-muted-foreground">Chiều cao</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-semibold text-foreground">
                    {latestEntry ? `${latestEntry.height.toFixed(1)} cm` : "--"}
                  </p>
                  {heightDelta !== null ? (
                    <span
                      className={`flex items-center gap-1 text-sm font-medium ${
                        heightDelta > 0
                          ? "text-emerald-600"
                          : heightDelta < 0
                            ? "text-rose-600"
                            : "text-muted-foreground"
                      }`}
                    >
                      {heightDelta > 0 ? <ArrowUpRight className="h-4 w-4" /> : null}
                      {heightDelta < 0 ? <ArrowDownRight className="h-4 w-4" /> : null}
                      {heightDelta === 0 ? <Minus className="h-4 w-4" /> : null}
                      {heightDelta > 0 ? `+${heightDelta} cm` : heightDelta < 0 ? `${heightDelta} cm` : "0 cm"}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ghi nhận chỉ số</CardTitle>
              <CardDescription>Nhập cân nặng và chiều cao để cập nhật tiến độ ngày hôm nay.</CardDescription>
            </CardHeader>
            <CardContent>
              {memberError ? (
                <div className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                  {memberError.message}
                </div>
              ) : null}
              {loadingEntries ? (
                <p className="text-sm text-muted-foreground">Đang tải dữ liệu tiến độ...</p>
              ) : null}
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground" htmlFor="weight">
                      Cân nặng (kg)
                    </label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="Ví dụ: 58.3"
                      value={weight}
                      onChange={(event) => setWeight(event.target.value)}
                      disabled={isFormDisabled}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground" htmlFor="height">
                      Chiều cao (cm)
                    </label>
                    <Input
                      id="height"
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="Ví dụ: 162"
                      value={height}
                      onChange={(event) => setHeight(event.target.value)}
                      disabled={isFormDisabled}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="photo">
                    Ảnh minh chứng (tuỳ chọn)
                  </label>
                  <Input id="photo" type="file" accept="image/*" onChange={handlePhotoChange} disabled={isFormDisabled} />
                  {photoPreview ? (
                    <div className="mt-2 space-y-2">
                      <div className="overflow-hidden rounded-lg border border-border bg-muted/20">
                        <img
                          src={photoPreview}
                          alt="Ảnh tiến độ"
                          className="h-48 w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <Button type="button" variant="outline" onClick={handleRemovePhoto} disabled={isFormDisabled}>
                        Xóa ảnh này
                      </Button>
                    </div>
                  ) : null}
                  <p className="text-xs text-muted-foreground">
                    Ảnh được lưu trong cơ sở dữ liệu của bạn. Nếu không chọn ảnh mới, hệ thống sẽ giữ lại ảnh đã lưu trước đó.
                  </p>
                </div>

                <Button type="submit" disabled={isFormDisabled || isSaving}>
                  {isSaving ? "Đang lưu..." : "Lưu tiến độ"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

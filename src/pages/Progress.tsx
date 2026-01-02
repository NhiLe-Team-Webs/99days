import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useCurrentMember } from "@/hooks/use-current-member";
import { fetchProgressUpdates, upsertProgressUpdate } from "@/lib/member-data";
import { uploadProgressPhoto, deleteProgressPhoto, validateImageFile } from "@/lib/storage";
import { ArrowDownRight, ArrowUpRight, Minus, Upload, X, Image as ImageIcon } from "lucide-react";
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
  waist: number | null;
  bust: number | null;
  hips: number | null;
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

function parseMeasurement(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  if (Number.isNaN(parsed) || parsed <= 0) return null;
  return +parsed.toFixed(1);
}

function formatMeasurement(value: number | null, unit: string) {
  if (value == null) return "--";
  return `${value.toFixed(1)} ${unit}`;
}

function getBMIStatus(bmi: number) {
  if (!bmi) return { label: "Chưa có dữ liệu", variant: "secondary" as const };
  if (bmi < 18.5) return { label: "Thiếu cân", variant: "secondary" as const };
  if (bmi < 23) return { label: "Cân đối", variant: "default" as const };
  if (bmi < 25) return { label: "Tiền thừa cân", variant: "outline" as const };
  return { label: "Thừa cân", variant: "destructive" as const };
}

export default function Progress() {
  const { toast } = useToast();
  const { member, loading: memberLoading, error: memberError } = useCurrentMember();

  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [waist, setWaist] = useState<string>("");
  const [bust, setBust] = useState<string>("");
  const [hips, setHips] = useState<string>("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoData, setPhotoData] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

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
          waist: item.waist,
          bust: item.bust,
          hips: item.hips,
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
          setWaist(latest.waist != null ? latest.waist.toString() : "");
          setBust(latest.bust != null ? latest.bust.toString() : "");
          setHips(latest.hips != null ? latest.hips.toString() : "");
          setPhotoPreview(latest.photoUrl);
          setPhotoUrl(latest.photoUrl);
          setPhotoData(null);
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
  const bmiStatus = getBMIStatus(bmi);

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
        waist: entry.waist,
        bust: entry.bust,
        hips: entry.hips,
      }));
  }, [entries]);

  const photosWithEntries = useMemo(() => {
    return entries.filter((entry) => entry.photoUrl != null);
  }, [entries]);

  const selectedPhoto = selectedPhotoIndex !== null ? photosWithEntries[selectedPhotoIndex] ?? null : null;

  useEffect(() => {
    if (selectedPhotoIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedPhotoIndex(null);
      } else if (event.key === "ArrowLeft" && photosWithEntries.length > 1) {
        event.preventDefault();
        setSelectedPhotoIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : photosWithEntries.length - 1));
      } else if (event.key === "ArrowRight" && photosWithEntries.length > 1) {
        event.preventDefault();
        setSelectedPhotoIndex((prev) => (prev !== null && prev < photosWithEntries.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhotoIndex, photosWithEntries.length]);

  const chartTooltipFormatter = useCallback((value: number | string, name: string) => {
    if (typeof value !== "number") return [value, name];
    const unit = name === "Cân nặng" ? "kg" : "cm";
    return [`${value.toFixed(1)} ${unit}`, name];
  }, []);

  const isFormDisabled = memberLoading || loadingEntries || !member;

  const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setPhotoPreview(null);
      setPhotoData(null);
      return;
    }

    try {
      validateImageFile(file);

      setIsCompressing(true);

      const reader = new FileReader();
      reader.onload = () => {
        const result = typeof reader.result === "string" ? reader.result : null;
        setPhotoPreview(result);
      };
      reader.onerror = () => {
        throw new Error("Không thể đọc ảnh. Hãy thử chọn lại hoặc dùng một ảnh khác.");
      };
      reader.readAsDataURL(file);

      setPhotoData(file);
      setIsCompressing(false);
    } catch (error) {
      setIsCompressing(false);
      setPhotoPreview(null);
      setPhotoData(null);
      toast({
        variant: "destructive",
        title: "Lỗi chọn ảnh",
        description: error instanceof Error ? error.message : "Hãy thử chọn lại hoặc dùng một ảnh khác.",
      });
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setPhotoData(null);
    setPhotoUrl(null);
    const fileInput = document.getElementById("photo") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!member) return;

    const numericWeight = parseMeasurement(weight);
    const numericHeight = parseMeasurement(height);

    if (numericWeight == null || numericHeight == null) {
      toast({
        variant: "destructive",
        title: "Thiếu chỉ số",
        description: "Vui lòng nhập đầy đủ cân nặng và chiều cao hợp lệ.",
      });
      return;
    }

    setIsSaving(true);
    const recordedFor = todayISODate();

    const numericWaist = parseMeasurement(waist);
    const numericBust = parseMeasurement(bust);
    const numericHips = parseMeasurement(hips);

    try {
      let finalPhotoUrl: string | null = photoUrl;

      if (photoData) {
        setIsUploadingPhoto(true);
        try {
          const existingEntry = entries.find((e) => e.recordedFor === recordedFor);
          if (existingEntry?.photoUrl) {
            await deleteProgressPhoto(existingEntry.photoUrl);
          }

          finalPhotoUrl = await uploadProgressPhoto(member.id, photoData, recordedFor);
          setPhotoUrl(finalPhotoUrl);
          setPhotoData(null);
        } catch (uploadError) {
          console.error("Failed to upload photo:", uploadError);
          toast({
            variant: "destructive",
            title: "Không thể upload ảnh",
            description: uploadError instanceof Error ? uploadError.message : "Vui lòng thử lại sau.",
          });
          setIsUploadingPhoto(false);
          setIsSaving(false);
          return;
        } finally {
          setIsUploadingPhoto(false);
        }
      }

      const saved = await upsertProgressUpdate(
        member.id,
        recordedFor,
        numericWeight,
        numericHeight,
        numericWaist,
        numericBust,
        numericHips,
        finalPhotoUrl,
      );
      const updated: ProgressEntry = {
        recordedAt: saved.recorded_at,
        recordedFor: saved.recorded_for,
        weight: saved.weight,
        height: saved.height,
        waist: saved.waist,
        bust: saved.bust,
        hips: saved.hips,
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
      setWeight(numericWeight.toString());
      setHeight(numericHeight.toString());
      setBust(numericBust != null ? numericBust.toString() : "");
      setWaist(numericWaist != null ? numericWaist.toString() : "");
      setHips(numericHips != null ? numericHips.toString() : "");

      toast({
        title: "Đã lưu số liệu tiến độ",
        description: "Hãy tiếp tục duy trì thói quen theo dõi mỗi ngày.",
      });
    } catch (error) {
      console.error("Failed to save progress update:", error);
      toast({
        variant: "destructive",
        title: "Không thể lưu tiến độ",
        description: error instanceof Error ? error.message : "Vui lòng thử lại sau.",
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

            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-xs uppercase text-muted-foreground">BMI</p>
              <div className="mt-1 flex items-center justify-between gap-3">
                <p className="text-2xl font-semibold text-foreground">{latestEntry ? bmi.toFixed(1) : "--"}</p>
                <Badge variant={bmiStatus.variant}>{bmiStatus.label}</Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">Số đo ba vòng</p>
                <span className="text-xs text-muted-foreground">Đơn vị: cm</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-muted/20 p-4">
                  <p className="text-xs uppercase text-muted-foreground">Vòng ngực</p>
                  <p className="text-xl font-semibold text-foreground">
                    {formatMeasurement(latestEntry?.bust ?? null, "cm")}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-muted/20 p-4">
                  <p className="text-xs uppercase text-muted-foreground">Vòng eo</p>
                  <p className="text-xl font-semibold text-foreground">
                    {formatMeasurement(latestEntry?.waist ?? null, "cm")}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-muted/20 p-4">
                  <p className="text-xs uppercase text-muted-foreground">Vòng mông</p>
                  <p className="text-xl font-semibold text-foreground">
                    {formatMeasurement(latestEntry?.hips ?? null, "cm")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Biểu đồ tiến độ</CardTitle>
              <CardDescription>Quan sát sự thay đổi của cân nặng và số đo mỗi lần bạn cập nhật.</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length ? (
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ left: 0, right: 16, top: 8, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.2} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={chartTooltipFormatter} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="weight"
                        name="Cân nặng"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="bust"
                        name="Vòng ngực"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        connectNulls
                      />
                      <Line
                        type="monotone"
                        dataKey="waist"
                        name="Vòng eo"
                        stroke="#f97316"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        connectNulls
                      />
                      <Line
                        type="monotone"
                        dataKey="hips"
                        name="Vòng mông"
                        stroke="#a855f7"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        connectNulls
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Chưa có dữ liệu để hiển thị. Hãy lưu ít nhất một lần cập nhật để xem biểu đồ tiến độ.
                </p>
              )}
            </CardContent>
          </Card>

          {photosWithEntries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Ảnh tiến độ</CardTitle>
                <CardDescription>Lịch sử các ảnh bạn đã upload để theo dõi sự thay đổi của cơ thể.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {photosWithEntries.map((entry, index) => (
                    <div
                      key={`${entry.recordedFor}-${entry.recordedAt}`}
                      className="group cursor-pointer space-y-2"
                      onClick={() => setSelectedPhotoIndex(index)}
                    >
                      <div className="relative overflow-hidden rounded-lg border border-border bg-muted/20 aspect-square">
                        <img
                          src={entry.photoUrl!}
                          alt={`Ảnh tiến độ ngày ${entry.recordedFor}`}
                          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                          loading={index < 6 ? "eager" : "lazy"}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 transition-opacity group-hover:opacity-100">
                          <p className="text-sm font-medium">
                            {new Date(`${entry.recordedFor}T00:00:00`).toLocaleDateString("vi-VN")}
                          </p>
                          <p className="text-xs text-white/80">
                            {entry.weight.toFixed(1)} kg / {entry.height.toFixed(1)} cm
                          </p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          {new Date(`${entry.recordedFor}T00:00:00`).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {entry.weight.toFixed(1)} kg • {entry.height.toFixed(1)} cm
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

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
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">Số đo ba vòng (cm)</p>
                    <span className="text-xs text-muted-foreground">Không bắt buộc</span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground" htmlFor="bust">
                        Vòng ngực
                      </label>
                      <Input
                        id="bust"
                        type="number"
                        step="0.1"
                        min="0"
                        placeholder="Ví dụ: 85"
                        value={bust}
                        onChange={(event) => setBust(event.target.value)}
                        disabled={isFormDisabled}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground" htmlFor="waist">
                        Vòng eo
                      </label>
                      <Input
                        id="waist"
                        type="number"
                        step="0.1"
                        min="0"
                        placeholder="Ví dụ: 60"
                        value={waist}
                        onChange={(event) => setWaist(event.target.value)}
                        disabled={isFormDisabled}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground" htmlFor="hips">
                        Vòng mông
                      </label>
                      <Input
                        id="hips"
                        type="number"
                        step="0.1"
                        min="0"
                        placeholder="Ví dụ: 90"
                        value={hips}
                        onChange={(event) => setHips(event.target.value)}
                        disabled={isFormDisabled}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="photo">
                    Ảnh tiến độ (tuỳ chọn)
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("photo")?.click()}
                      disabled={isFormDisabled || isCompressing || isUploadingPhoto}
                      className="cursor-pointer"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload ảnh
                    </Button>
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      disabled={isFormDisabled || isCompressing || isUploadingPhoto}
                      className="hidden"
                    />
                    {photoData && (
                      <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {photoData.name}
                      </span>
                    )}
                  </div>
                  {(isCompressing || isUploadingPhoto) && (
                    <p className="text-xs text-muted-foreground">
                      {isCompressing ? "Đang xử lý ảnh..." : "Đang upload ảnh..."}
                    </p>
                  )}
                  {photoPreview ? (
                    <div className="mt-2 space-y-2">
                      <div className="relative overflow-hidden rounded-lg border-2 border-border bg-muted/10 shadow-sm">
                        <div className="flex items-center justify-center min-h-[300px] max-h-[500px] bg-muted/5 p-4">
                          <img
                            src={photoPreview}
                            alt="Ảnh tiến độ"
                            className="max-w-full max-h-[460px] w-auto h-auto object-contain rounded-md shadow-md"
                            loading="eager"
                          />
                        </div>
                        {photoData && (
                          <div className="absolute top-2 right-2 flex items-center gap-2">
                            <div className="rounded-md bg-black/70 px-2 py-1 text-xs text-white backdrop-blur-sm">
                              {(photoData.size / 1024).toFixed(1)} KB
                            </div>
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleRemovePhoto}
                        disabled={isFormDisabled || isUploadingPhoto}
                        className="w-full"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Xóa ảnh này
                      </Button>
                    </div>
                  ) : photoUrl && !photoData ? (
                    <div className="mt-2 space-y-2">
                      <div className="relative overflow-hidden rounded-lg border-2 border-border bg-muted/10 shadow-sm">
                        <div className="flex items-center justify-center min-h-[300px] max-h-[500px] bg-muted/5 p-4">
                          <img
                            src={photoUrl}
                            alt="Ảnh tiến độ hiện tại"
                            className="max-w-full max-h-[460px] w-auto h-auto object-contain rounded-md shadow-md"
                            loading="lazy"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Ảnh đã lưu. Chọn ảnh mới để thay thế.
                      </p>
                    </div>
                  ) : null}
                  <p className="text-xs text-muted-foreground">
                    Bạn chỉ có thể upload một ảnh mỗi lần. Ảnh sẽ được tự động nén để tối ưu dung lượng.
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

      {/* Photo Lightbox Dialog */}
      <Dialog open={selectedPhotoIndex !== null} onOpenChange={(open) => !open && setSelectedPhotoIndex(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedPhoto
                ? `Ảnh tiến độ - ${new Date(`${selectedPhoto.recordedFor}T00:00:00`).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}`
                : "Ảnh tiến độ"}
            </DialogTitle>
          </DialogHeader>
          {selectedPhoto && (
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-lg border border-border bg-muted/20">
                <img
                  src={selectedPhoto.photoUrl!}
                  alt={`Ảnh tiến độ ngày ${selectedPhoto.recordedFor}`}
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <p className="text-xs uppercase text-muted-foreground mb-1">Ngày ghi nhận</p>
                  <p className="text-sm font-medium">
                    {new Date(`${selectedPhoto.recordedFor}T00:00:00`).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <p className="text-xs uppercase text-muted-foreground mb-1">Cân nặng / Chiều cao</p>
                  <p className="text-sm font-medium">
                    {selectedPhoto.weight.toFixed(1)} kg / {selectedPhoto.height.toFixed(1)} cm
                  </p>
                </div>
                {(selectedPhoto.waist || selectedPhoto.bust || selectedPhoto.hips) && (
                  <div className="rounded-lg border border-border bg-muted/30 p-4 sm:col-span-2">
                    <p className="text-xs uppercase text-muted-foreground mb-2">Số đo ba vòng</p>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedPhoto.bust && (
                        <div>
                          <p className="text-xs text-muted-foreground">Ngực</p>
                          <p className="text-sm font-medium">{selectedPhoto.bust.toFixed(1)} cm</p>
                        </div>
                      )}
                      {selectedPhoto.waist && (
                        <div>
                          <p className="text-xs text-muted-foreground">Eo</p>
                          <p className="text-sm font-medium">{selectedPhoto.waist.toFixed(1)} cm</p>
                        </div>
                      )}
                      {selectedPhoto.hips && (
                        <div>
                          <p className="text-xs text-muted-foreground">Mông</p>
                          <p className="text-sm font-medium">{selectedPhoto.hips.toFixed(1)} cm</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {photosWithEntries.length > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPhotoIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : photosWithEntries.length - 1))}
                  >
                    Ảnh trước
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    {selectedPhotoIndex !== null ? selectedPhotoIndex + 1 : 0} / {photosWithEntries.length}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPhotoIndex((prev) => (prev !== null && prev < photosWithEntries.length - 1 ? prev + 1 : 0))}
                  >
                    Ảnh sau
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  );
}

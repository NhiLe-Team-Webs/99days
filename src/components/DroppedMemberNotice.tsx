import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

interface DroppedMemberNoticeProps {
  memberName?: string | null;
  memberCode?: string;
  rebornUrl: string;
  onStop: () => void;
}

const DroppedMemberNotice = ({ memberName, memberCode, rebornUrl, onStop }: DroppedMemberNoticeProps) => {
  const displayName = memberName?.trim()?.length ? memberName : "Chiến binh 99 Days";

  const handleContinue = () => {
    if (!rebornUrl) return;
    const target = rebornUrl.startsWith("mailto:") ? "_self" : "_blank";
    window.open(rebornUrl, target, "noopener,noreferrer");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-white px-4 py-10">
      <div className="w-full max-w-2xl rounded-3xl border border-rose-100 bg-white p-8 text-center shadow-2xl shadow-rose-100/50">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-500">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
          Thử thách đã dừng
        </p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">Bạn đã bị loại khỏi thử thách</h1>
        <p className="mt-4 text-base text-slate-600">
          Bạn có muốn tham gia chương trình ReBorn để tiếp tục hành trình hay không?
        </p>
        {memberCode ? (
          <p className="mt-2 text-sm text-slate-500">
            Số báo danh của bạn: <span className="font-semibold text-slate-800">{memberCode}</span>
          </p>
        ) : null}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700"
            onClick={handleContinue}
          >
            Có, tôi muốn đi tiếp
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50"
            onClick={onStop}
          >
            Không, tôi muốn dừng lại
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DroppedMemberNotice;

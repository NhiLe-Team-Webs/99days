import { AlertTriangle, Info } from "lucide-react";

import { Button } from "@/components/ui/button";

type DroppedNoticeMode = "decision" | "final";

interface DroppedMemberNoticeProps {
  memberName?: string | null;
  memberCode?: string;
  dropReason?: string | null;
  isProcessing?: boolean;
  mode?: DroppedNoticeMode;
  onAccept?: () => void;
  onDecline?: () => void;
  onExit?: () => void;
}

const DroppedMemberNotice = ({
  memberName,
  memberCode,
  dropReason,
  isProcessing = false,
  mode = "decision",
  onAccept,
  onDecline,
  onExit,
}: DroppedMemberNoticeProps) => {
  const displayName = memberName?.trim()?.length ? memberName : "Chiến binh 99 Days";
  const showActions = mode === "decision";

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
          {showActions
            ? `${displayName}, bạn có muốn tham gia chương trình ReBorn để tiếp tục hành trình hay không?`
            : `${displayName}, bạn đã xác nhận dừng lại. Bạn sẽ cần chờ mùa tiếp theo để quay lại.`
          }
        </p>
        {memberCode ? (
          <p className="mt-2 text-sm text-slate-500">
            Số báo danh hiện tại: <span className="font-semibold text-slate-800">{memberCode}</span>
          </p>
        ) : null}
        {dropReason ? (
          <div className="mt-6 rounded-2xl border border-rose-100 bg-rose-50/60 p-4 text-left text-sm text-rose-900">
            <p className="font-semibold">Lý do bị loại</p>
            <p className="mt-1 leading-relaxed">{dropReason}</p>
          </div>
        ) : null}
        {showActions ? (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={onAccept}
              disabled={isProcessing}
            >
              {isProcessing ? "Đang xử lý..." : "Có, tôi muốn đi tiếp"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50"
              onClick={onDecline}
              disabled={isProcessing}
            >
              {isProcessing ? "Vui lòng chờ..." : "Không, tôi muốn dừng lại"}
            </Button>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
              <Info className="h-4 w-4" />
              <span>Bạn có thể quay lại vào mùa tiếp theo.</span>
            </div>
            <Button
              size="lg"
              className="bg-slate-900 text-white hover:bg-slate-800"
              onClick={onExit}
            >
              Quay về trang đăng nhập
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DroppedMemberNotice;

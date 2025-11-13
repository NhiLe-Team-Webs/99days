import { useCallback, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import DroppedMemberNotice from "@/components/DroppedMemberNotice";
import { acceptRebornInvitation, declineRebornInvitation } from "@/lib/api";
import { supabase } from "@/lib/supabase";

type MemberAccessInfo = {
  id: string;
  email: string;
  status: "active" | "paused" | "dropped" | "reborn_pending" | "reborn_active";
  ho_ten: string | null;
  so_bao_danh: string | null;
  drop_reason: string | null;
};

interface ProtectedRouteProps {
  children: JSX.Element;
}

interface AuthState {
  loading: boolean;
  isAuthenticated: boolean;
  member: MemberAccessInfo | null;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [auth, setAuth] = useState<AuthState>({
    loading: true,
    isAuthenticated: false,
    member: null,
  });
  const [actionLoading, setActionLoading] = useState<null | "accept" | "decline">(null);

  const checkAuth = useCallback(async () => {
    try {
      setAuth((prev) => ({ ...prev, loading: true }));

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Không thể kiểm tra phiên Supabase:", sessionError);
      }

      if (!session) {
        setAuth({ loading: false, isAuthenticated: false, member: null });
        return;
      }

      const { data: member, error: memberError } = await supabase
        .from("members")
        .select("id, email, status, ho_ten, so_bao_danh, drop_reason")
        .eq("email", session.user.email)
        .maybeSingle<MemberAccessInfo>();

      if (memberError) {
        console.error("Không thể lấy thông tin thành viên:", memberError);
        setAuth({ loading: false, isAuthenticated: false, member: null });
        return;
      }

      if (!member) {
        setAuth({ loading: false, isAuthenticated: false, member: null });
        return;
      }

      setAuth({ loading: false, isAuthenticated: true, member });
    } catch (error) {
      console.error("Lỗi xác thực:", error);
      setAuth({ loading: false, isAuthenticated: false, member: null });
    }
  }, []);

  useEffect(() => {
    void checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setAuth({ loading: false, isAuthenticated: false, member: null });
      } else {
        void checkAuth();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [checkAuth]);

  const handleStopReborn = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleAcceptReborn = useCallback(async () => {
    if (!auth.member) return;
    setActionLoading("accept");
    try {
      await acceptRebornInvitation(auth.member.id, auth.member.so_bao_danh ?? null);
      console.info("Chào mừng bạn quay trở lại với thử thách.");
      window.alert("Chào mừng bạn quay trở lại với thử thách!");
      await checkAuth();
    } catch (error) {
      console.error("Không thể ghi nhận tham gia ReBorn:", error);
      window.alert("Không thể ghi nhận tham gia ReBorn. Vui lòng thử lại sau.");
    } finally {
      setActionLoading(null);
    }
  }, [auth.member, checkAuth]);

  const handleDeclineReborn = useCallback(async () => {
    if (!auth.member) return;
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn dừng lại? Sau khi xác nhận, bạn sẽ phải đợi mùa sau để quay lại."
    );
    if (!confirmed) return;

    setActionLoading("decline");
    try {
      await declineRebornInvitation(auth.member.id);
      window.alert("Bạn đã chọn dừng lại. Hẹn gặp lại bạn ở mùa tiếp theo.");
      await handleStopReborn();
    } catch (error) {
      console.error("Không thể ghi nhận trạng thái ReBorn:", error);
      window.alert("Không thể cập nhật lựa chọn của bạn. Vui lòng thử lại.");
    } finally {
      setActionLoading(null);
    }
  }, [auth.member, handleStopReborn]);

  if (auth.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
          <p className="mt-3 text-sm text-slate-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (auth.member?.status === "reborn_pending") {
    return (
      <DroppedMemberNotice
        memberName={auth.member.ho_ten ?? auth.member.email}
        memberCode={auth.member.so_bao_danh ?? undefined}
        dropReason={auth.member.drop_reason ?? undefined}
        isProcessing={actionLoading !== null}
        onAccept={handleAcceptReborn}
        onDecline={handleDeclineReborn}
      />
    );
  }

  if (auth.member?.status === "dropped") {
    return (
      <DroppedMemberNotice
        memberName={auth.member.ho_ten ?? auth.member.email}
        memberCode={auth.member.so_bao_danh ?? undefined}
        dropReason={auth.member.drop_reason ?? undefined}
        mode="final"
        onExit={handleStopReborn}
      />
    );
  }

  return children;
};

export default ProtectedRoute;

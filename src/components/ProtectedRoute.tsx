import { useCallback, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import DroppedMemberNotice from "@/components/DroppedMemberNotice";
import { supabase } from "@/lib/supabase";

type MemberAccessInfo = {
  id: string;
  email: string;
  status: "active" | "paused" | "dropped";
  ho_ten: string | null;
  so_bao_danh: string | null;
};

const DEFAULT_REBORN_URL =
  "mailto:hello@99days.com?subject=ReBorn%20-%20T%C3%B4i%20mu%E1%BB%91n%20ti%E1%BA%BFp%20tục";
const configuredRebornUrl = (import.meta.env.VITE_REBORN_SIGNUP_URL ?? "").trim();
const rebornIntentUrl = configuredRebornUrl || DEFAULT_REBORN_URL;

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
        .select("id, email, status, ho_ten, so_bao_danh")
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

  if (auth.member?.status === "dropped") {
    return (
      <DroppedMemberNotice
        memberName={auth.member.ho_ten ?? auth.member.email}
        memberCode={auth.member.so_bao_danh ?? undefined}
        rebornUrl={rebornIntentUrl}
        onStop={handleStopReborn}
      />
    );
  }

  return children;
};

export default ProtectedRoute;

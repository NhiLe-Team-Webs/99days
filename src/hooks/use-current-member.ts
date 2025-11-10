import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface MemberProfile {
  id: string;
  email: string;
  ho_ten: string | null;
  so_bao_danh: string | null;
}

interface UseCurrentMemberState {
  member: MemberProfile | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export function useCurrentMember(): UseCurrentMemberState {
  const [member, setMember] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      const email = session?.user?.email;
      if (!email) throw new Error("Không tìm thấy email đăng nhập.");

      const { data, error: memberError } = await supabase
        .from("members")
        .select("id, email, ho_ten, so_bao_danh")
        .eq("email", email)
        .maybeSingle<MemberProfile>();

      if (memberError) throw memberError;
      if (!data) throw new Error("Không tìm thấy hồ sơ thành viên.");

      setMember(data);
    } catch (err) {
      setMember(null);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { member, loading, error, refresh };
}

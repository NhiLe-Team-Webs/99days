import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);

  useEffect(() => {
    const exchangeSessionFromHash = async () => {
      const hash = window.location.hash.replace('#', '');
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });

        if (!error) {
          setIsTokenValid(true);
          setIsVerifying(false);
          return;
        }
      }

      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsTokenValid(true);
      }
      setIsVerifying(false);
    };

    exchangeSessionFromHash();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isTokenValid) {
      toast({
        title: "Liên kết không hợp lệ",
        description: "Vui lòng yêu cầu liên kết đặt lại mới.",
        variant: "destructive"
      });
      return;
    }

    if (newPassword.trim().length < 8) {
      toast({
        title: "Mật khẩu quá ngắn",
        description: "Mật khẩu mới cần ít nhất 8 ký tự.",
        variant: "destructive"
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Mật khẩu không khớp",
        description: "Vui lòng nhập lại mật khẩu xác nhận.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Đặt lại mật khẩu thành công",
        description: "Bạn có thể dùng mật khẩu mới để đăng nhập."
      });

      await supabase.auth.signOut();
      navigate('/login');
    } catch (error: any) {
      toast({
        title: "Không thể đặt lại mật khẩu",
        description: error.message ?? "Đã có lỗi xảy ra, vui lòng thử lại sau.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="text-center mb-8">
        <Link to="/" className="text-3xl font-bold text-gray-900">
          <span className="text-primary">99 Days</span> with NhiLe
        </Link>
      </div>

      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        {isVerifying ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang xác thực liên kết...</p>
          </div>
        ) : isTokenValid ? (
          <>
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Tạo mật khẩu mới</h1>
            <p className="text-gray-600 text-center mb-6">
              Vui lòng đặt mật khẩu mới cho tài khoản của bạn.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu mới
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Nhập mật khẩu mới"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary/50 focus:border-primary outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Xác nhận mật khẩu
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary/50 focus:border-primary outline-none transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg text-lg font-semibold hover:bg-primary/90 transition duration-300 disabled:opacity-70"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Liên kết không hợp lệ</h1>
            <p className="text-gray-600 mb-6">
              Liên kết đặt lại mật khẩu đã hết hạn hoặc không chính xác. Vui lòng yêu cầu lại.
            </p>
            <Link to="/forgot-password" className="text-primary hover:underline">
              Gửi lại liên kết đặt lại mật khẩu
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;

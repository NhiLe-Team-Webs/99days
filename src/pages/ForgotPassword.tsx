import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        throw error;
      }

      setIsSent(true);
      toast({
        title: 'Đã gửi email khôi phục',
        description: 'Hãy kiểm tra hộp thư và làm theo hướng dẫn để đặt lại mật khẩu.'
      });
      setEmail('');
    } catch (error: any) {
      toast({
        title: 'Gửi email thất bại',
        description: error.message ?? 'Không thể gửi email khôi phục. Vui lòng thử lại sau.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-white to-orange-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl grid gap-10 lg:grid-cols-2">
        <div className="hidden lg:flex flex-col justify-center space-y-6 text-gray-800">
          <h1 className="text-4xl font-bold">
            Quên mật khẩu <span className="text-primary">99 Days</span>?
          </h1>
          <p className="text-lg leading-relaxed">
            Đừng lo! Chỉ với vài bước đơn giản bạn đã có thể đặt lại mật khẩu mới và quay lại hành trình 99 ngày cùng đội nhóm.
          </p>
          <ul className="space-y-3 text-base">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
              <span>Nhập email bạn đã dùng để đăng ký chương trình.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
              <span>Kiểm tra hộp thư (kể cả mục Spam) để lấy liên kết đặt lại mật khẩu.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
              <span>Tạo mật khẩu mới và đăng nhập lại để tiếp tục chinh phục mục tiêu.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white shadow-xl rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-2">Đặt lại mật khẩu</h2>
          <p className="text-center text-gray-600 mb-8">
            Nhập email đã đăng ký để nhận hướng dẫn đặt lại mật khẩu.
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email đăng ký
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                placeholder="email@company.com"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-lg hover:bg-primary/90 transition focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi liên kết khôi phục'}
            </button>
          </form>

          {isSent && (
            <div className="mt-8 rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-700">
              <p>
                Liên kết khôi phục đã được gửi tới <strong>email của bạn</strong>. Nếu không thấy email sau vài phút,
                hãy kiểm tra thư mục spam/quảng cáo hoặc bấm gửi lại.
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-col items-center gap-3 text-sm text-gray-600">
            <Link to="/login" className="hover:text-primary transition">
              Quay lại đăng nhập
            </Link>
            <div>
              Chưa có tài khoản?{' '}
              <Link to="/#dang-ky" className="font-medium text-primary hover:underline">
                Đăng ký ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

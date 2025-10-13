import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

type ViewState = 'verifying' | 'ready' | 'success' | 'error';

const parseHashParams = () => {
  const hash = window.location.hash.startsWith('#')
    ? window.location.hash.substring(1)
    : window.location.hash;

  const params = new URLSearchParams(hash);

  return {
    access_token: params.get('access_token'),
    refresh_token: params.get('refresh_token'),
    type: params.get('type')
  };
};

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [viewState, setViewState] = useState<ViewState>('verifying');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recoveryCode = searchParams.get('code');
  const hashParams = useMemo(() => parseHashParams(), []);

  useEffect(() => {
    const establishSession = async () => {
      try {
        if (recoveryCode) {
          const { error } = await supabase.auth.exchangeCodeForSession({ code: recoveryCode });
          if (error) {
            throw error;
          }
          setViewState('ready');
          return;
        }

        if (hashParams.type === 'recovery' && hashParams.access_token && hashParams.refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token: hashParams.access_token,
            refresh_token: hashParams.refresh_token
          });
          if (error) {
            throw error;
          }
          setViewState('ready');
          return;
        }

        throw new Error('Liên kết không hợp lệ hoặc đã hết hạn.');
      } catch (error: any) {
        console.error('Failed to establish recovery session', error);
        setViewState('error');
        toast({
          title: 'Không thể xác thực liên kết',
          description: error.message ?? 'Liên kết đặt lại mật khẩu đã hết hạn hoặc không hợp lệ.',
          variant: 'destructive'
        });
      }
    };

    void establishSession();
  }, [hashParams.access_token, hashParams.refresh_token, hashParams.type, recoveryCode, toast]);

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password.length < 8) {
      toast({
        title: 'Mật khẩu quá ngắn',
        description: 'Mật khẩu mới phải có ít nhất 8 ký tự.',
        variant: 'destructive'
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Mật khẩu không khớp',
        description: 'Vui lòng nhập lại mật khẩu giống nhau.',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        throw error;
      }

      setViewState('success');
      toast({
        title: 'Đặt lại mật khẩu thành công',
        description: 'Bạn có thể đăng nhập ngay bây giờ bằng mật khẩu mới.'
      });

      await supabase.auth.signOut();
      setPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast({
        title: 'Không thể đặt lại mật khẩu',
        description: error.message ?? 'Vui lòng thử lại sau ít phút.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    if (viewState === 'verifying') {
      return (
        <>
          <h1 className="text-2xl font-semibold text-gray-900 text-center mb-2">Đang xác thực liên kết</h1>
          <p className="text-center text-gray-600">Xin chờ trong giây lát...</p>
          <div className="mt-8 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          </div>
        </>
      );
    }

    if (viewState === 'error') {
      return (
        <>
          <h1 className="text-2xl font-semibold text-gray-900 text-center mb-4">Liên kết không hợp lệ</h1>
          <p className="text-center text-gray-600">
            Liên kết đặt lại mật khẩu đã hết hạn hoặc không thể xác thực. Vui lòng yêu cầu liên kết mới.
          </p>
          <Link
            to="/forgot-password"
            className="mt-8 inline-flex justify-center rounded-xl bg-primary px-6 py-3 text-primary-foreground font-semibold hover:bg-primary/90 transition"
          >
            Gửi lại liên kết
          </Link>
        </>
      );
    }

    if (viewState === 'success') {
      return (
        <>
          <h1 className="text-2xl font-semibold text-gray-900 text-center mb-4">Đặt lại mật khẩu thành công</h1>
          <p className="text-center text-gray-600">Bạn có thể đăng nhập lại với mật khẩu mới.</p>
          <Link
            to="/login"
            className="mt-8 inline-flex justify-center rounded-xl bg-primary px-6 py-3 text-primary-foreground font-semibold hover:bg-primary/90 transition"
          >
            Quay lại đăng nhập
          </Link>
        </>
      );
    }

    return (
      <>
        <h1 className="text-2xl font-semibold text-gray-900 text-center mb-2">Tạo mật khẩu mới</h1>
        <p className="text-center text-gray-600 mb-8">
          Nhập mật khẩu mới để hoàn tất quá trình khôi phục. Hãy đảm bảo mật khẩu đủ mạnh và dễ nhớ đối với bạn.
        </p>

        <form className="space-y-6" onSubmit={handleResetPassword}>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu mới
            </label>
            <input
              id="password"
              type="password"
              value={password}
              minLength={8}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
              placeholder="Ít nhất 8 ký tự"
              required
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
              Nhập lại mật khẩu
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              minLength={8}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
              placeholder="Nhập lại mật khẩu"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-primary py-3 text-lg font-semibold text-primary-foreground hover:bg-primary/90 transition focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Nếu bạn gặp vấn đề khi đặt lại mật khẩu, hãy liên hệ với đội hỗ trợ của chương trình.
        </p>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-rose-50 to-orange-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-xl p-8 md:p-10">
        {renderContent()}
      </div>
    </div>
  );
};

export default ResetPassword;

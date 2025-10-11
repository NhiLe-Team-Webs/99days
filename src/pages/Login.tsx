// src/pages/Login.tsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Kiểm tra session sau khi Google login
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Chuyển đến trang kiểm tra trạng thái
        navigate('/auth-status');
      }
    };

    checkSession();
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth-status` // 👈 Chuyển đến trang kiểm tra
      }
    });

    if (error) {
      toast({
        title: "Lỗi",
        description: "Không thể đăng nhập bằng Google. Vui lòng thử lại.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        throw signInError;
      }

      const { data: member, error: memberError } = await supabase
        .from('members')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (memberError || !member) {
        await supabase.auth.signOut();
        throw new Error('Email chưa được duyệt tham gia chương trình');
      }

      toast({
        title: "Đăng nhập thành công",
        description: "Chào mừng bạn quay lại 99 Days with NhiLe!"
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Lỗi đăng nhập",
        description: error.message ?? "Không thể đăng nhập. Vui lòng thử lại.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {/* Logo */}
      <div className="text-center mb-8">
        <Link to="/" className="text-3xl font-bold text-gray-900">
          <span className="text-primary">99 Days</span> with NhiLe
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Đăng Nhập Tài Khoản</h2>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300 mb-4"
        >
          <svg className="w-6 h-6" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            <path fill="none" d="M0 0h48v48H0z" />
          </svg>
          <span className="text-gray-700 font-medium">Đăng nhập bằng Google</span>
        </button>

        {/* Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-4 text-gray-500 text-sm">hoặc</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Traditional Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary/50 focus:border-primary outline-none transition-all"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary/50 focus:border-primary outline-none transition-all"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg text-lg font-semibold hover:bg-primary/90 transition duration-300"
          >
            Đăng Nhập
          </button>

          {/* Forgot Password */}
          <div className="text-center mt-4">
            <Link to="/forgot-password" className="text-sm text-primary hover:underline">
              Quên mật khẩu?
            </Link>
          </div>
        </form>
      </div>

      {/* Register Link */}
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Chưa có tài khoản?{' '}
          <Link
            to="/#dang-ky"
            className="font-semibold text-primary hover:underline"
            onClick={() => {
              setTimeout(() => {
                const element = document.getElementById('dang-ky');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }, 100);
            }}
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
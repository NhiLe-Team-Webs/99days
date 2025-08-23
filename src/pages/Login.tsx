// src/pages/Login.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom'; // nếu dùng routing

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Đăng nhập với:', { email, password });
    // Gọi API đăng nhập ở đây
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-primary text-primary-foreground text-center py-8">
          <h1 className="text-3xl font-bold">Chào mừng trở lại</h1>
          <p className="text-primary-foreground/80 mt-2">Vui lòng đăng nhập để tiếp tục</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-800 font-medium mb-2">
              Địa chỉ Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nhile@example.com"
              className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-gray-800 font-medium mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 border border-input rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-sm"
              >
                {showPassword ? 'Ẩn' : 'Hiện'}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 active:scale-95 transition-all shadow-md hover:shadow-lg"
          >
            Đăng nhập
          </button>
        </form>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 text-center text-sm text-gray-600 border-t border-muted">
        Chưa có tài khoản?{' '}
        <Link
            to="/#dang-ky"
            className="text-primary font-medium hover:underline"
            onClick={() => {
            // Đảm bảo trang sẽ scroll khi load lại hash
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
        </div>
      </div>
    </div>
  );
}
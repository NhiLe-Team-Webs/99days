// src/components/AuthStatusHandler.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const AuthStatusHandler = () => {
  const [status, setStatus] = useState<
    | 'checking'
    | 'not-registered'
    | 'pending'
    | 'rejected'
    | 'approved-awaiting'
    | 'approved'
  >('checking');
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate('/login');
        return;
      }

      const email = session.user.email;
      setUserEmail(email || '');

      // 1. Kiểm tra trong bảng members (đã được duyệt)
      const { data: member, error: memberError } = await supabase
        .from('members')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (member) {
        setStatus('approved');
        navigate('/dashboard');
        return;
      }

      // 2. Kiểm tra trong bảng applicants
      const { data: applicant, error } = await supabase
        .from('applicants')
        .select('status, approved_at')
        .eq('email', email)
        .maybeSingle();

      if (error || !applicant) {
        setStatus('not-registered');
        return;
      }

      if (applicant.status === 'approved') {
        setStatus('approved-awaiting');
        return;
      }

      setStatus(applicant.status as 'pending' | 'rejected');
    };

    checkUserStatus();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const renderContent = () => {
    switch (status) {
      case 'not-registered':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Chưa Đăng Ký</h1>
            <p className="text-gray-600 mb-6">
              Email của bạn chưa đăng ký tham gia chương trình.<br/>
              Vui lòng đăng ký để tiếp tục.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Đăng Ký Ngay
            </button>
          </div>
        );

      case 'pending':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Đang Chờ Duyệt</h1>
            <p className="text-gray-600 mb-6">
              Đơn đăng ký của bạn đang chờ admin duyệt.<br/>
              Bạn sẽ nhận được email thông báo khi được chấp nhận.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Lưu ý:</strong> Thời gian duyệt thường trong 24 giờ.
              </p>
            </div>
          </div>
        );

      case 'rejected':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Đã Bị Từ Chối</h1>
            <p className="text-gray-600 mb-6">
              Đơn đăng ký của bạn đã bị admin từ chối.<br/>
              Vui lòng liên hệ hỗ trợ để biết thêm chi tiết.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">
                <strong>Gợi ý:</strong> Bạn có thể đăng ký lại sau 7 ngày.
              </p>
            </div>
          </div>
        );

      case 'approved-awaiting':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Đã được duyệt</h1>
            <p className="text-gray-600 mb-6">
              Đơn đăng ký của bạn đã được chấp nhận. Admin sẽ kích hoạt tài khoản thành viên trong ít phút nữa.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-green-800">
                <strong>Bước tiếp theo:</strong> Sau khi tài khoản thành viên được tạo, bạn sẽ nhận email hướng dẫn đặt mật khẩu.
                Vui lòng thử đăng nhập lại hoặc liên hệ admin nếu chưa nhận được email.
              </p>
            </div>
          </div>
        );

      case 'checking':
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Đang kiểm tra trạng thái tài khoản...</p>
          </div>
        );

      default:
        return null;
    }
  };

  if (status === 'approved') return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="max-w-md w-full px-6 py-8 bg-white rounded-xl shadow-lg">
        {renderContent()}
        
        {status !== 'checking' && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthStatusHandler;

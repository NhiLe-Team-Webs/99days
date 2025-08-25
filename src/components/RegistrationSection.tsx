import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { submitApplication, checkEmailExists } from '@/lib/api';

const RegistrationSection = () => {
  const [formData, setFormData] = useState({
    ho_ten: '',
    email: '',
    so_dien_thoai: '',
    telegram: '',
    nam_sinh: '',
    ly_do: '',
    dong_y: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [status, setStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  setStatus('checking');
  setErrorMessage(null);

  try {
    const exists = await checkEmailExists(formData.email);
    if (exists) {
      setErrorMessage('Email này đã được đăng ký rồi.');
      setStatus('error');
      return;
    }
  } catch (error) {
    setErrorMessage('Không thể kiểm tra email. Vui lòng thử lại sau.');
    setStatus('error');
    return;
  }

  // Nếu không tồn tại → gửi form
  setIsSubmitting(true);
  try {
    await submitApplication(formData);
    setStatus('success');
    // Có thể reset form nếu muốn
    setFormData({
      ho_ten: '',
      email: '',
      so_dien_thoai: '',
      telegram: '',
      nam_sinh: '',
      ly_do: '',
      dong_y: false
    });
  } catch (error) {
    setErrorMessage(`Gửi đơn thất bại: ${error.message || 'Lỗi mạng'}`);
    setStatus('error');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <section id="dang-ky" className="py-20 bg-primary text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Hãy Bắt Đầu Ngay Hôm Nay!</h2>
          <p className="mt-4 max-w-2xl mx-auto">
            Đừng để bất cứ lý do nào ngăn cản bạn. Điền thông tin để nhận vé tham gia hành trình thay đổi bản thân!
          </p>
        </div>
        <div className="max-w-2xl mx-auto bg-white text-gray-800 p-8 md:p-10 rounded-xl shadow-2xl">
          {status !== 'success' && (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="ho_ten" className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và Tên *
                  </label>
                  <input
                    type="text"
                    id="ho_ten"
                    name="ho_ten"
                    required
                    value={formData.ho_ten}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-input w-full ${
                      errorMessage ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                    }`}
                    disabled={status === 'checking' || status === 'success'}
                  />
                  {errorMessage && (
                    <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="so_dien_thoai" className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    id="so_dien_thoai"
                    name="so_dien_thoai"
                    required
                    value={formData.so_dien_thoai}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div>
                  <label htmlFor="telegram" className="block text-sm font-medium text-gray-700 mb-1">
                    Username Telegram *
                  </label>
                  <input
                    type="text"
                    id="telegram"
                    name="telegram"
                    placeholder="@username"
                    required
                    value={formData.telegram}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="nam_sinh" className="block text-sm font-medium text-gray-700 mb-1">
                  Năm sinh *
                </label>
                <input
                  type="number"
                  id="nam_sinh"
                  name="nam_sinh"
                  placeholder="Ví dụ: 1990"
                  required
                  value={formData.nam_sinh}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="ly_do" className="block text-sm font-medium text-gray-700 mb-1">
                  Tại sao bạn muốn tham gia thử thách này? *
                </label>
                <textarea
                  id="ly_do"
                  name="ly_do"
                  rows={4}
                  required
                  value={formData.ly_do}
                  onChange={handleInputChange}
                  className="form-input resize-none"
                />
              </div>
              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    id="dong_y"
                    name="dong_y"
                    type="checkbox"
                    required
                    checked={formData.dong_y}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="dong_y" className="ml-2 block text-sm text-gray-900">
                    Tôi đã đọc và đồng ý với các điều khoản của chương trình.
                  </label>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full btn-primary text-lg"
                  disabled={isCheckingEmail || isSubmitting}
                >
                  {isCheckingEmail
                    ? 'Đang kiểm tra email...'
                    : isSubmitting
                    ? 'Đang gửi...'
                    : 'GỬI ĐĂNG KÝ'}
                </button>
              </div>
            </form>
          )}

          {status === 'success' && (
            <div className="mt-6 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg">
              <h3 className="font-bold text-lg">🎉 Đăng ký thành công!</h3>
              <p className="mt-1">
                Cảm ơn bạn đã đăng ký. Chúng tôi sẽ liên hệ qua email trong thời gian sớm nhất.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RegistrationSection;

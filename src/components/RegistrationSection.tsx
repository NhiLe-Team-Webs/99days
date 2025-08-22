import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const RegistrationSection = () => {
  const [formData, setFormData] = useState({
    hoTen: '',
    email: '',
    soDienThoai: '',
    telegram: '',
    namSinh: '',
    lyDo: '',
    dongY: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.hoTen || !formData.email || !formData.soDienThoai || !formData.telegram || !formData.namSinh || !formData.lyDo || !formData.dongY) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin và đồng ý với điều khoản.",
        variant: "destructive"
      });
      return;
    }

    // Age validation
    const currentYear = new Date().getFullYear();
    const age = currentYear - parseInt(formData.namSinh);
    if (age < 14 || age > 55) {
      toast({
        title: "Lỗi",
        description: "Độ tuổi tham gia phải từ 14 đến 55 tuổi.",
        variant: "destructive"
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập địa chỉ email hợp lệ.",
        variant: "destructive"
      });
      return;
    }

    // Simulate form submission
    setIsSubmitted(true);
    toast({
      title: "Đăng ký thành công!",
      description: "Chúng tôi sẽ xem xét và gửi thông tin đăng nhập qua email trong thời gian sớm nhất."
    });
  };

  if (isSubmitted) {
    return (
      <section id="dang-ky" className="py-20 bg-primary text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto bg-white text-gray-800 p-8 md:p-10 rounded-xl shadow-2xl text-center">
            <div className="mb-6 text-center p-4 bg-green-100 text-green-800 rounded-lg">
              <p className="font-semibold">Đăng ký thành công! Cảm ơn bạn.</p>
              <p className="text-sm">Chúng tôi sẽ xem xét và gửi thông tin đăng nhập qua email trong thời gian sớm nhất.</p>
            </div>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="btn-primary"
            >
              Đăng ký thêm
            </button>
          </div>
        </div>
      </section>
    );
  }

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
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="hoTen" className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và Tên *
                </label>
                <input
                  type="text"
                  id="hoTen"
                  name="hoTen"
                  required
                  value={formData.hoTen}
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
                  className="form-input"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="soDienThoai" className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  id="soDienThoai"
                  name="soDienThoai"
                  required
                  value={formData.soDienThoai}
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
              <label htmlFor="namSinh" className="block text-sm font-medium text-gray-700 mb-1">
                Năm sinh *
              </label>
              <input
                type="number"
                id="namSinh"
                name="namSinh"
                placeholder="Ví dụ: 1990"
                required
                min="1969"
                max="2010"
                value={formData.namSinh}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="lyDo" className="block text-sm font-medium text-gray-700 mb-1">
                Tại sao bạn muốn tham gia thử thách này? *
              </label>
              <textarea
                id="lyDo"
                name="lyDo"
                rows={4}
                required
                value={formData.lyDo}
                onChange={handleInputChange}
                className="form-input resize-none"
              />
            </div>
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  id="dongY"
                  name="dongY"
                  type="checkbox"
                  required
                  checked={formData.dongY}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="dongY" className="ml-2 block text-sm text-gray-900">
                  Tôi đã đọc và đồng ý với các điều khoản của chương trình.
                </label>
              </div>
            </div>
            <div>
              <button type="submit" className="w-full btn-primary text-lg">
                GỬI ĐĂNG KÝ
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RegistrationSection;
// src/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [countdown99, setCountdown99] = useState('--');
  const [progressText, setProgressText] = useState('Ngày 0 / 99');
  const [progressWidth, setProgressWidth] = useState(0);
  const [sessionTime, setSessionTime] = useState('00:00:00');
  const [motivationQuote, setMotivationQuote] = useState('Đang tải động lực...');
  const [badges, setBadges] = useState({
    7: false,
    30: false,
    66: false,
    99: false,
  });

  // Cấu hình: Ngày bắt đầu thử thách
  const startDate = new Date('2025-08-22T00:00:00');

  useEffect(() => {
    const now = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 99);

    const daysRemaining = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));
    const currentDay = Math.max(1, 99 - daysRemaining + 1);

    // 1. Cập nhật countdown 99 ngày
    setCountdown99(daysRemaining.toString().padStart(2, '0'));

    // 2. Cập nhật thanh tiến trình
    const percentage = Math.min(100, (currentDay / 99) * 100);
    setProgressText(`Ngày ${currentDay} / 99`);
    setProgressWidth(percentage);

    // 3. Cập nhật huy hiệu
    setBadges({
      7: currentDay >= 7,
      30: currentDay >= 30,
      66: currentDay >= 66,
      99: currentDay >= 99,
    });

    // 4. Cập nhật đếm ngược buổi tập 4:45 sáng
    const updateSessionCountdown = () => {
      const targetTime = new Date(now);
      targetTime.setHours(4, 45, 0, 0);
      if (now > targetTime) targetTime.setDate(targetTime.getDate() + 1);

      const diff = targetTime - now;
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setSessionTime(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    };

    updateSessionCountdown();
    const interval = setInterval(updateSessionCountdown, 1000);

    // 5. Lấy quote tạo động lực (dùng fetch hoặc fallback)
    const fetchMotivationQuote = async () => {
      const defaultQuote = "Mỗi giọt mồ hôi hôm nay là một bước gần hơn đến chiến thắng ngày mai.";
      try {
        // Trong môi trường thật, bạn sẽ dùng API như Gemini
        // Vì không thể gọi API ở đây, dùng fallback
        const motivationalQuotes = [
        "Thành công là tích lũy của những nỗ lực nhỏ mỗi ngày.",
        "Hãy tin vào hành trình của bạn – 99 ngày sẽ thay đổi cuộc đời bạn.",
        "Sức mạnh không đến từ những gì bạn có thể làm, mà từ những gì bạn đã vượt qua.",
        "Bạn không cần phải nhanh, chỉ cần không ngừng lại.",
        "Mỗi giọt mồ hôi hôm nay là một bước gần hơn đến chiến thắng ngày mai.",
        "Không có ngày nào quá nhỏ để tạo nên sự khác biệt.",
        "Bạn đang tiến gần hơn mỗi khi không bỏ cuộc.",
        "Ngày hôm nay là viên gạch đầu tiên cho tòa lâu đài của bạn.",
        "Chỉ cần một bước nhỏ mỗi ngày – bạn sẽ đi rất xa.",
        "Bạn không cần hoàn hảo, chỉ cần bắt đầu."
        ];

        const getQuoteOfTheDay = () => {
            const today = new Date();
            const start = new Date('2024-01-01'); // Mốc thời gian cố định
            const oneDay = 1000 * 60 * 60 * 24;
            const diffTime = today.getTime() - start.getTime();
            const diffDays = Math.floor(diffTime / oneDay);
            return motivationalQuotes[diffDays % motivationalQuotes.length];
        };

        const motivationQuote = getQuoteOfTheDay();
        setMotivationQuote(motivationQuote);
      } catch (error) {
        setMotivationQuote(defaultQuote);
      }
    };

    fetchMotivationQuote();

    return () => clearInterval(interval);
  }, [startDate]);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gray-900">
            <span className="text-primary">99 Days</span> with NhiLe
          </Link>
          <nav className="flex space-x-6 items-center">
            <span className="hidden sm:block text-gray-700">Chào mừng, Thuỳ Dung!</span>
            <Link
              to="/"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition duration-300 text-sm font-medium"
            >
              Đăng xuất
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* Động lực */}
        <div className="bg-gradient-to-r from-primary to-orange-500 text-white p-6 rounded-xl shadow-lg mb-8 text-center">
          <h2 className="text-lg font-semibold mb-2">🔥 Động lực cho hôm nay 🔥</h2>
          <p className="text-xl italic">{motivationQuote}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cột chính */}
          <div className="lg:col-span-2 space-y-8">
            {/* Buổi tập */}
            <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-primary">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Buổi tập sáng nay đã sẵn sàng!</h2>
              <p className="text-gray-600 mb-6">Hãy tham gia đúng giờ vào lúc 4:45 sáng để không bỏ lỡ khoảnh khắc nào nhé.</p>

              <div className="bg-gray-50 p-6 rounded-lg text-center mb-6">
                <p className="text-gray-500 mb-2">Buổi tập tiếp theo sẽ bắt đầu sau:</p>
                <div className="text-4xl font-bold text-primary tracking-wider">{sessionTime}</div>
              </div>

              <button className="w-full text-center bg-primary text-primary-foreground px-8 py-4 rounded-lg text-xl font-semibold hover:bg-primary/90 transition duration-300 transform hover:scale-105 shadow-md">
                🚀 THAM GIA BUỔI TẬP 4:45 SÁNG
              </button>
              <p className="text-center text-xs text-gray-500 mt-3">Lưu ý: Link sẽ được cập nhật mỗi ngày.</p>
            </div>

            {/* Huy hiệu */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4">Huy hiệu đã đạt được</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                {[
                  { day: 7, name: 'Khởi Đầu Rực Lửa', icon: 'M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 00-2.725 2.472z' },
                  { day: 30, name: 'Chiến Binh Bền Bỉ', icon: 'M16.5 18.75h-9a9.75 9.75 0 100-13.5h9a9.75 9.75 0 000 13.5zM10.5 6.75h.008v.008h-.008V6.75z' },
                  { day: 66, name: 'Bậc Thầy Thói Quen', icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM18 13.5l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 18l-1.035.259a3.375 3.375 0 00-2.456 2.456L18 21.75l-.259-1.035a3.375 3.375 0 00-2.456-2.456L14.25 18l1.035-.259a3.375 3.375 0 002.456-2.456L18 13.5z' },
                  { day: 99, name: 'Huyền Thoại 99', icon: 'M16.5 18.75h-9a9.75 9.75 0 100-13.5h9a9.75 9.75 0 000 13.5zM10.5 6.75h.008v.008h-.008V6.75z' },
                ].map((badge) => (
                  <div
                    key={badge.day}
                    className={`badge ${badges[badge.day as keyof typeof badges] ? '' : 'locked'}`}
                  >
                    <div
                      className={`rounded-full w-24 h-24 mx-auto flex items-center justify-center ${
                        badges[badge.day as keyof typeof badges]
                          ? 'bg-primary/10'
                          : 'bg-gray-200'
                      }`}
                    >
                      <svg
                        className={`w-12 h-12 ${
                          badges[badge.day as keyof typeof badges]
                            ? 'text-primary'
                            : 'text-gray-500'
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d={badge.icon} />
                      </svg>
                    </div>
                    <p className="font-semibold mt-2">{badge.name}</p>
                    <p className="text-sm text-gray-500">{badge.day} ngày</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Đếm ngược 99 ngày */}
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <h3 className="text-xl font-bold mb-2">Hành Trình 99 Ngày</h3>
              <p className="text-gray-600 mb-4">Số ngày còn lại để chinh phục:</p>
              <div className="text-6xl font-extrabold text-primary">{countdown99}</div>
              <div className="mt-6">
                <div className="flex justify-between mb-1">
                  <span className="text-base font-medium text-primary">Tiến trình</span>
                  <span className="text-sm font-medium text-primary">{progressText}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-primary h-4 rounded-full transition-all duration-500"
                    style={{ width: `${progressWidth}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Thông báo */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4">Thông báo</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-red-200 pl-4">
                  <p className="font-semibold">Chủ đề tuần này: Rèn luyện sức bền</p>
                  <p className="text-sm text-gray-600">Hãy chuẩn bị tinh thần cho các bài tập cardio!</p>
                  <span className="text-xs text-gray-400">20/08/2024</span>
                </div>
              </div>
            </div>

            {/* Truy cập nhanh */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4">Truy cập nhanh</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-primary hover:underline">Thư viện bài tập</a></li>
                <li><a href="#" className="text-primary hover:underline">Hướng dẫn dinh dưỡng</a></li>
                <li><a href="#" className="text-primary hover:underline">Nhóm Telegram cộng đồng</a></li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
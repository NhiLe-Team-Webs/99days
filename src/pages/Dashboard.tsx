// src/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { generateMotivationalQuote } from '@/lib/gemini';
import { fetchTodayZoomLink } from '@/lib/api';

export default function Dashboard() {
  const [countdown99, setCountdown99] = useState('--');
  const [userName, setUserName] = useState(''); 
  const [quote, setQuote] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [progressText, setProgressText] = useState('Ngày 0 / 99');
  const [progressWidth, setProgressWidth] = useState(0);
  const [sessionTime, setSessionTime] = useState('00:00:00');
  const [badges, setBadges] = useState({
    7: false,
    30: false,
    66: false,
    99: false,
  });
  const [zoomLink, setZoomLink] = useState<string | null>(null);
  const [zoomLoading, setZoomLoading] = useState(true);

  const navigate = useNavigate();

  // Cấu hình: Ngày bắt đầu thử thách
  const startDate = new Date('2025-05-10T00:00:00');

  // Badge configurations with new SVG icons
  const badgeConfigs = [
    {
      day: 7,
      name: 'Khởi Đầu Rực Lửa',
      unlockedIcon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#EA3323">
          <path d="M220-400q0 63 28.5 118.5T328-189q-4-12-6-24.5t-2-24.5q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60q0 12-2 24.5t-6 24.5q51-37 79.5-92.5T740-400q0-54-23-105.5T651-600q-21 15-44 23.5t-46 8.5q-61 0-101-41.5T420-714v-20q-46 33-83 73t-63 83.5q-26 43.5-40 89T220-400Zm260 24-71 70q-14 14-21.5 31t-7.5 37q0 41 29 69.5t71 28.5q42 0 71-28.5t29-69.5q0-20-7.5-37T551-306l-71-70Zm0-464v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-128 86-246.5T480-840Z"/>
        </svg>
      ),
      lockedIcon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#9CA3AF">
          <path d="M220-400q0 63 28.5 118.5T328-189q-4-12-6-24.5t-2-24.5q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60q0 12-2 24.5t-6 24.5q51-37 79.5-92.5T740-400q0-54-23-105.5T651-600q-21 15-44 23.5t-46 8.5q-61 0-101-41.5T420-714v-20q-46 33-83 73t-63 83.5q-26 43.5-40 89T220-400Zm260 24-71 70q-14 14-21.5 31t-7.5 37q0 41 29 69.5t71 28.5q42 0 71-28.5t29-69.5q0-20-7.5-37T551-306l-71-70Zm0-464v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-128 86-246.5T480-840Z"/>
        </svg>
      )
    },
    {
      day: 30,
      name: 'Chiến Binh Bền Bỉ',
      unlockedIcon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#5985E1">
          <path d="M769-88 645-212l-88 88-43-43q-17-17-17-42t17-42l199-199q17-17 42-17t42 17l43 43-88 88 123 124q9 9 9 21t-9 21l-64 65q-9 9-21 9t-21-9Zm111-636L427-271l19 20q17 17 17 42t-17 42l-43 43-88-88L191-88q-9 9-21 9t-21-9l-65-65q-9-9-9-21t9-21l124-124-88-88 43-43q17-17 42-17t42 17l20 19 453-453h160v160ZM320-568l38-38 38-38-38 38-38 38Zm-42 42L80-724v-160h160l198 198-42 42-181-180h-75v75l180 181-42 42Zm105 212 437-435v-75h-75L308-389l75 75Zm0 0-37-38-38-37 38 37 37 38Z"/>
        </svg>
      ),
      lockedIcon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#9CA3AF">
          <path d="M769-88 645-212l-88 88-43-43q-17-17-17-42t17-42l199-199q17-17 42-17t42 17l43 43-88 88 123 124q9 9 9 21t-9 21l-64 65q-9 9-21 9t-21-9Zm111-636L427-271l19 20q17 17 17 42t-17 42l-43 43-88-88L191-88q-9 9-21 9t-21-9l-65-65q-9-9-9-21t9-21l124-124-88-88 43-43q17-17 42-17t42 17l20 19 453-453h160v160ZM320-568l38-38 38-38-38 38-38 38Zm-42 42L80-724v-160h160l198 198-42 42-181-180h-75v75l180 181-42 42Zm105 212 437-435v-75h-75L308-389l75 75Zm0 0-37-38-38-37 38 37 37 38Z"/>
        </svg>
      )
    },
    {
      day: 66,
      name: 'Bậc Thầy Thói Quen',
      unlockedIcon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#F19E39">
          <path d="M852-226 746-332l42-42 106 106-42 42ZM708-706l-42-42 106-106 42 42-106 106Zm-456 0L146-812l42-42 106 106-42 42ZM108-226l-42-42 106-106 42 42-106 106Zm215-19 157-94 157 95-42-178 138-120-182-16-71-168-71 167-182 16 138 120-42 178Zm-90 125 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-365Z"/>
        </svg>
      ),
      lockedIcon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#9CA3AF">
          <path d="M852-226 746-332l42-42 106 106-42 42ZM708-706l-42-42 106-106 42 42-106 106Zm-456 0L146-812l42-42 106 106-42 42ZM108-226l-42-42 106-106 42 42-106 106Zm215-19 157-94 157 95-42-178 138-120-182-16-71-168-71 167-182 16 138 120-42 178Zm-90 125 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-365Z"/>
        </svg>
      )
    },
    {
      day: 99,
      name: 'Huyền Thoại',
      unlockedIcon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#EAC452">
          <path d="m226-120-90-498q-35 13-65.5-8T40-685q0-29.7 20.8-50.85Q81.59-757 110.8-757q29.2 0 50.2 21.15 21 21.15 21 50.85 0 15.11-5.5 28.05Q171-644 161-634q26.21 17.33 53.01 28.67Q240.81-594 270.59-594 323-594 365-624t68-76l23-42q-21-8-34-26t-13-41q0-29.29 20.8-50.14 20.79-20.86 50-20.86 29.2 0 50.2 20.86 21 20.85 21 50.14 0 23-13 41t-34 26l23 42q26 46 68.5 76t94.99 30q29.83 0 56.67-11.5Q774-617 800-633q-11-10-16.5-23.46T778-685q0-29.7 20.8-50.85 20.79-21.15 50-21.15 29.2 0 50.2 21.15 21 21.15 21 50.85 0 37-29.5 58T827-617l-92 497H226Zm50-60h408l66-361q-15 3-30 5.5t-30 2.5q-66 0-120.5-35T480-660q-35 56-89 91.5T271-533q-16 0-31-2.5t-30-4.5l66 360Zm204 0Z"/>
        </svg>
      ),
      lockedIcon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#9CA3AF">
          <path d="m226-120-90-498q-35 13-65.5-8T40-685q0-29.7 20.8-50.85Q81.59-757 110.8-757q29.2 0 50.2 21.15 21 21.15 21 50.85 0 15.11-5.5 28.05Q171-644 161-634q26.21 17.33 53.01 28.67Q240.81-594 270.59-594 323-594 365-624t68-76l23-42q-21-8-34-26t-13-41q0-29.29 20.8-50.14 20.79-20.86 50-20.86 29.2 0 50.2 20.86 21 20.85 21 50.14 0 23-13 41t-34 26l23 42q26 46 68.5 76t94.99 30q29.83 0 56.67-11.5Q774-617 800-633q-11-10-16.5-23.46T778-685q0-29.7 20.8-50.85 20.79-21.15 50-21.15 29.2 0 50.2 21.15 21 21.15 21 50.85 0 37-29.5 58T827-617l-92 497H226Zm50-60h408l66-361q-15 3-30 5.5t-30 2.5q-66 0-120.5-35T480-660q-35 56-89 91.5T271-533q-16 0-31-2.5t-30-4.5l66 360Zm204 0Z"/>
        </svg>
      )
    }
  ];

  // Lấy thông tin user từ Supabase - PHIÊN BẢN FINAL
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        // Lấy session hiện tại
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Session error:', sessionError);
          navigate('/');
          return;
        }

        if (!session) {
          console.log('❌ No session found');
          navigate('/');
          return;
        }

        const userEmail = session.user.email;
        console.log('✅ Session user email:', userEmail);

        // Query KHÔNG có nam_sinh
        let { data: memberData, error: memberError } = await supabase
          .from('members')
          .select('ho_ten, email, telegram, so_dien_thoai')
          .eq('email', userEmail)
          .single();

        console.log('📊 Query result - memberData:', memberData);
        console.log('📊 Query result - memberError:', memberError);

        if (memberError || !memberData) {
          console.log('❌ Using fallback - memberError:', memberError);
          const fallbackName = userEmail?.split('@')[0] || 'Người dùng';
          console.log('🔄 Fallback name:', fallbackName);
          
          setUserName(fallbackName);
          setUserEmail(userEmail || '');
        } else {
          console.log('✅ Found member data:', memberData);
          
          let displayName = 'Người dùng';
          
          if (memberData.ho_ten && memberData.ho_ten.trim() !== '') {
            displayName = memberData.ho_ten.trim();
            console.log('✅ Using ho_ten:', displayName);
          } else {
            displayName = userEmail?.split('@')[0] || 'Người dùng';
            console.log('🔄 Using email fallback:', displayName);
          }
          
          setUserName(displayName);
          setUserEmail(memberData.email || userEmail || '');
          
          console.log('✅ Final state - Name:', displayName, 'Email:', memberData.email || userEmail);
        }

        setLoading(false);
      } catch (error) {
        console.error('❌ Error in getUserInfo:', error);
        setLoading(false);
        navigate('/');
      }
    };

    getUserInfo();
  }, [navigate]);

  // Xử lý đăng xuất
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // useEffect để cập nhật countdown và progress
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

    return () => clearInterval(interval);
  }, [startDate]);

  useEffect(() => {
    const getZoomLink = async () => {
      try {
        const link = await fetchTodayZoomLink();
        setZoomLink(link);
      } catch (error) {
        console.error("Error fetching zoom link:", error);
      } finally {
        setZoomLoading(false);
      }
    };

    getZoomLink();
  }, []);

  // useEffect riêng để fetch quote khi đã có thông tin user
  useEffect(() => {
    const fetchMotivationQuote = async () => {
      if (!userName || !userEmail) return; // Đảm bảo có đủ thông tin
      
      try {
        const today = new Date().toDateString();
        const cacheKey = `quote_${userName}_${userEmail}_${today}`;
        const cachedQuote = localStorage.getItem(cacheKey);
        
        if (cachedQuote) {
          setQuote(cachedQuote);
          return;
        }

        const newQuote = await generateMotivationalQuote(userName, {
          email: userEmail,
          phone: '',
          telegram: '',
        });
        
        setQuote(newQuote);
        localStorage.setItem(cacheKey, newQuote);
        
      } catch (error) {
        console.error('Lỗi khi tạo câu động lực:', error);
        setQuote(`Chào ${userName}! Hãy cùng nhau chinh phục thử thách hôm nay nhé! 💪`);
      }
    };

    fetchMotivationQuote();
  }, [userName, userEmail]); // Chỉ chạy khi có đủ thông tin user

  // Loading state
  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gray-900">
            <span className="text-primary">99 Days</span> with NhiLe
          </Link>
          <nav className="flex space-x-6 items-center">
            <span className="hidden sm:block text-gray-700">
              Chào mừng, <span className="font-semibold text-primary">{userName}</span>!
            </span>
            <button
              onClick={handleLogout}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition duration-300 text-sm font-medium"
            >
              Đăng xuất
            </button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* Động lực */}
        <div className="bg-gradient-to-r from-primary to-orange-500 text-white p-6 rounded-xl shadow-lg mb-8 text-center">
          <h2 className="text-lg font-semibold mb-2">🔥 Động lực cho hôm nay 🔥</h2>
          {loading ? (
            <div className="h-6 bg-yellow-200 rounded animate-pulse"></div>
          ) : (
          <p className="text-white italic font-medium">"{quote}"</p>
          )}
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

              <div className="flex justify-center">
              {zoomLink ? (
                <a
                  href={zoomLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center bg-primary text-primary-foreground px-8 py-4 rounded-lg text-xl font-semibold hover:bg-primary/90 transition duration-300 transform hover:scale-105 shadow-md"
                >
                  🚀 THAM GIA BUỔI TẬP 4:45 SÁNG HÔM NAY
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="text-center bg-gray-300 text-white px-8 py-4 rounded-lg text-xl font-semibold"
                >
                  {zoomLoading ? "Dang tai link Zoom..." : "Link se som duoc cap nhat"}
                </button>
              )}
              </div>
              
              <p className="text-center text-xs text-gray-500 mt-3">Lưu ý: Link sẽ được cập nhật mỗi ngày.</p>
            </div>

            {/* Huy hiệu */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4">Huy hiệu đã đạt được</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                {badgeConfigs.map((badge) => {
                  const isUnlocked = badges[badge.day as keyof typeof badges];
                  return (
                    <div
                      key={badge.day}
                      className={`badge ${isUnlocked ? 'unlocked' : 'locked'}`}
                    >
                      <div
                        className={`rounded-full w-24 h-24 mx-auto flex items-center justify-center ${
                          isUnlocked
                            ? 'bg-gradient-to-br from-white-100 to-orange-100 shadow-lg border-2 border-yellow-300'
                            : 'bg-gray-200'
                        }`}
                      >
                        {isUnlocked ? badge.unlockedIcon : badge.lockedIcon}
                      </div>
                      <p className={`font-semibold mt-2 ${isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                        {badge.name}
                      </p>
                      <p className="text-sm text-gray-500">{badge.day} ngày</p>
                      {isUnlocked && (
                        <div className="mt-1">
                          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            ✓ Đã đạt được
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
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

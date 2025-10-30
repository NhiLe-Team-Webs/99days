// src/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { fetchTodayZoomLink, getAdminProgramStartDate } from '@/lib/api';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getWorkoutForDate } from '@/data/workouts';
import { dailyQuotes } from '@/lib/quotes';
import { ArrowUpRight } from 'lucide-react';

type BadgeConfig = {
  day: number;
  name: string;
  icon: string;
};

const BADGE_CONFIGS: BadgeConfig[] = [
  { day: 7, name: 'Khởi Đầu Rực Lửa', icon: '🔥' },
  { day: 14, name: 'Giữ Nhịp 14 Ngày', icon: '⚡' },
  { day: 21, name: 'Đà Thói Quen', icon: '💪' },
  { day: 30, name: 'Chiến Binh Bền Bỉ', icon: '🛡️' },
  { day: 45, name: 'Bước Đệm Vững Chắc', icon: '🚀' },
  { day: 60, name: 'Bậc Thầy Thói Quen', icon: '🏆' },
  { day: 75, name: 'Bền Bỉ Không Ngừng', icon: '🌟' },
  { day: 99, name: 'Huyền Thoại', icon: '👑' },
];

function formatISODate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatPlanItemTitle(title: string) {
  if (/^Buoi tap ngay/i.test(title)) {
    return 'Video luyện tập';
  }
  return title;
}

export default function Dashboard() {
  const [countdown99, setCountdown99] = useState('--');
  const [userName, setUserName] = useState('');
  const [quote, setQuote] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [progressText, setProgressText] = useState('Ngày 0 / 99');
  const [progressWidth, setProgressWidth] = useState(0);
  const [sessionTime, setSessionTime] = useState('00:00:00');
  const [badges, setBadges] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    BADGE_CONFIGS.forEach((badge) => {
      initial[badge.day] = false;
    });
    return initial;
  });
  const [zoomLink, setZoomLink] = useState<string | null>(null);
  const [zoomLoading, setZoomLoading] = useState(true);
  const [isZoomWindowOpen, setIsZoomWindowOpen] = useState(false);
  const [programStartDate, setProgramStartDate] = useState<Date | null>(null);

  const navigate = useNavigate();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowISO = formatISODate(tomorrow);
  const tomorrowPlan = getWorkoutForDate(tomorrowISO);
  const tomorrowLabel = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
  }).format(tomorrow);
  const programStartLabel = programStartDate
    ? new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(programStartDate)
    : '';
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
        const { data: memberData, error: memberError } = await supabase
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

  useEffect(() => {
    const fetchProgramStartDate = async () => {
      try {
        const dateString = await getAdminProgramStartDate();
        if (dateString) {
          setProgramStartDate(new Date(dateString));
        } else {
          // Fallback to a default date if not set by admin
          setProgramStartDate(new Date('2025-05-10T00:00:00'));
        }
      } catch (error) {
        console.error("Error fetching admin program start date:", error);
        setProgramStartDate(new Date('2025-05-10T00:00:00')); // Fallback on error
      }
    };

    fetchProgramStartDate();
  }, []);

  // useEffect để cập nhật countdown và progress
  useEffect(() => {
    if (!programStartDate) return;

    const now = new Date();
    const endDate = new Date(programStartDate);
    endDate.setDate(programStartDate.getDate() + 99);

    const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    const currentDay = Math.max(1, 99 - daysRemaining + 1);

    // 1. Cập nhật countdown 99 ngày
    setCountdown99(daysRemaining.toString().padStart(2, '0'));

    // 2. Cập nhật thanh tiến trình
    const percentage = Math.min(100, (currentDay / 99) * 100);
    setProgressText(`Ngày ${currentDay} / 99`);
    setProgressWidth(percentage);

    // 3. Cập nhật huy hiệu
    const updatedBadges: Record<number, boolean> = {};
    BADGE_CONFIGS.forEach((badge) => {
      updatedBadges[badge.day] = currentDay >= badge.day;
    });
    setBadges(updatedBadges);

    // 4. Cập nhật đếm ngược buổi tập 4:45 sáng
    const updateSessionCountdown = () => {
      const current = new Date();
      const targetTime = new Date(current);
      targetTime.setHours(4, 45, 0, 0);
      if (current > targetTime) targetTime.setDate(targetTime.getDate() + 1);

      const diff = targetTime.getTime() - current.getTime();
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setSessionTime(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    };

    updateSessionCountdown();
    const interval = setInterval(updateSessionCountdown, 1000);

    return () => clearInterval(interval);
  }, [programStartDate]);

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

  useEffect(() => {
    const updateZoomWindow = () => {
      const now = new Date();
      const start = new Date(now);
      start.setHours(4, 0, 0, 0);
      const end = new Date(now);
      end.setHours(9, 0, 0, 0);
      const inWindow = now >= start && now < end;
      setIsZoomWindowOpen(inWindow);
    };

    updateZoomWindow();
    const timer = setInterval(updateZoomWindow, 60000);
    return () => clearInterval(timer);
  }, []);

  // useEffect riêng để chọn quote khi đã có thông tin user
  useEffect(() => {
    if (dailyQuotes.length === 0) {
      setQuote(`Chào ${userName || 'bạn'}! Hãy cùng nhau chinh phục thử thách hôm nay nhé! 💪`);
      return;
    }

    const randomQuote = dailyQuotes[Math.floor(Math.random() * dailyQuotes.length)].text;
    setQuote(randomQuote);
  }, [userEmail, userName]);

  // Loading state
  if (loading || programStartDate === null) {
    return (
      <AuthenticatedLayout title="Trang điều khiển" description="Tổng quan hành trình 99 ngày của bạn">
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-20 w-20 animate-spin rounded-full border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Đang tải thông tin...</p>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout title="Trang điều khiển" description={`Chào mừng ${userName || 'bạn'} trở lại hành trình 99 ngày`}>
      <div className="mx-auto max-w-6xl space-y-10">
        {/* Động lực */}
        <div className="mb-2 rounded-xl bg-gradient-to-r from-primary to-orange-500 p-5 text-center text-white shadow-lg sm:p-6">
          {loading ? (
            <div className="h-6 rounded bg-yellow-200 animate-pulse"></div>
          ) : (
            <p className="font-medium italic text-white">"{quote}"</p>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cột chính */}
          <div className="space-y-8 lg:col-span-2">
            {/* Buổi tập */}
            <div className="rounded-xl border-t-4 border-primary bg-white p-6 shadow-lg sm:p-8">
              <h2 className="mb-2 text-xl font-bold text-gray-800 sm:text-2xl">Buổi tập sáng nay đã sẵn sàng!</h2>
              <p className="mb-6 text-gray-600">Hãy tham gia đúng giờ vào lúc 4:45 sáng để không bỏ lỡ khoảnh khắc nào nhé.</p>

              <div className="mb-6 rounded-lg bg-gray-50 p-6 text-center">
                <p className="mb-2 text-gray-500">Buổi tập tiếp theo sẽ bắt đầu sau:</p>
                <div className="text-4xl font-bold tracking-wider text-primary">{sessionTime}</div>
              </div>

              <div className="flex justify-center">
                {zoomLoading ? (
                  <button
                    type="button"
                    disabled
                    className="w-full rounded-lg bg-gray-300 px-8 py-4 text-center text-xl font-semibold text-white"
                  >
                    Đang tải link Zoom...
                  </button>
                ) : isZoomWindowOpen && zoomLink ? (
                  <a
                    href={zoomLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full transform rounded-lg bg-primary px-8 py-4 text-center text-xl font-semibold text-primary-foreground shadow-md transition duration-300 hover:scale-105 hover:bg-primary/90"
                  >
                    🚀 THAM GIA BUỔI TẬP 4:45 SÁNG HÔM NAY
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full rounded-lg bg-gray-300 px-8 py-4 text-center text-xl font-semibold text-white"
                  >
                    {isZoomWindowOpen ? 'Link Zoom sớm được cập nhật' : 'Link Zoom chỉ hiện từ 4h đến 9h sáng'}
                  </button>
                )}
              </div>
            </div>

            {/* Huy hiệu */}
            <div className="rounded-xl bg-white p-5 shadow-lg sm:p-6">
              <h3 className="mb-4 text-xl font-bold">Huy hiệu đã đạt được</h3>
              <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
                {BADGE_CONFIGS.map((badge) => {
                  const isUnlocked = badges[badge.day];
                  return (
                    <div
                      key={badge.day}
                      className={`rounded-xl border p-4 shadow-sm transition ${
                        isUnlocked ? 'border-primary/60 bg-primary/10' : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div
                        className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full text-3xl ${
                          isUnlocked ? 'bg-white text-primary shadow-sm' : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        <span role="img" aria-label={badge.name}>
                          {badge.icon}
                        </span>
                      </div>
                      <p className="mt-3 text-sm font-semibold text-gray-800">{badge.name}</p>
                      <p className="text-xs text-gray-500">Ngày {badge.day}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-xl bg-white p-5 shadow-lg sm:p-6">
              <h3 className="text-xl font-bold text-gray-800">Thông báo hôm nay</h3>
              <p className="mt-1 text-sm capitalize text-gray-500">{tomorrowLabel}</p>
              {tomorrowPlan ? (
                <div className="mt-4 space-y-3 text-left">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={tomorrowPlan.type === 'test' ? 'destructive' : 'outline'}>
                      {tomorrowPlan.type === 'test' ? 'Bài test' : 'Buổi tập'}
                    </Badge>
                    {tomorrowPlan.label ? (
                      <span className="text-sm font-semibold text-gray-900">{tomorrowPlan.label}</span>
                    ) : null}
                  </div>

                  <p className="text-sm text-gray-600">
                    {tomorrowPlan.type === 'test'
                      ? 'Ngày mai bạn có bài test thể lực, hãy chuẩn bị đầy đủ dụng cụ và ghi lại kết quả sau khi hoàn thành.'
                      : 'Xem trước danh sách động tác để chủ động thời gian luyện tập và chuẩn bị dụng cụ cần thiết.'}
                  </p>

                  {tomorrowPlan.items.length ? (
                    <ul className="ml-4 list-disc space-y-1 text-sm text-gray-600">
                      {tomorrowPlan.items.slice(0, 3).map((item, index) => (
                        <li key={`${tomorrowPlan.date}-${index}`}>{formatPlanItemTitle(item.title)}</li>
                      ))}
                    </ul>
                  ) : null}

                  {tomorrowPlan.items.length > 3 ? (
                    <p className="text-xs text-gray-500">
                      Còn {tomorrowPlan.items.length - 3} nội dung khác, xem đầy đủ trong trang Bài tập.
                    </p>
                  ) : null}

                  <Button
                    onClick={() => navigate(`/workouts?date=${tomorrowPlan.date}`)}
                    className="inline-flex items-center gap-2"
                  >
                    Xem chi tiết
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <p className="mt-4 text-sm text-gray-600">
                  Lịch tập cho ngày mai đang được cập nhật. Vui lòng quay lại sau nhé!
                </p>
              )}
            </div>

            <div className="rounded-xl bg-white p-5 shadow-lg sm:p-6">
              <h3 className="text-lg font-bold text-gray-800">Truy cập nhanh</h3>
              <ul className="mt-4 space-y-3 text-left text-sm">
                <li>
                  <a
                    href="https://docs.google.com/document/d/1B8WZOvy6B0UbaE6q1yl7slxVehpNOcK8KAL90Fpgucw/edit?tab=t.0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
                  >
                    🥗 Hướng dẫn dinh dưỡng
                  </a>
                </li>
                <li>
                  <a
                    href="https://t.me/+ejI5L4hEBD03OGM1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
                  >
                    🤝 Cộng đồng Telegram
                  </a>
                </li>
              </ul>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-lg sm:p-6">
              <h3 className="text-lg font-bold text-gray-800">Tiến độ hành trình</h3>
              <p className="mt-2 text-sm text-gray-500">{progressText}</p>
              <div className="mt-4 h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${progressWidth}%` }}
                ></div>
              </div>
              <p className="mt-4 text-xs text-gray-500">
                Còn lại {countdown99} ngày để hoàn thành mục tiêu 99 ngày.
              </p>
              {programStartLabel && (
                <p className="mt-2 text-xs text-gray-400">Bắt đầu từ ngày {programStartLabel}</p>
              )}
            </div>

            <div className="rounded-xl bg-white p-5 shadow-lg sm:p-6">
              <h3 className="text-lg font-bold text-gray-800">Nhắc nhở hàng ngày</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li>• Ghi nhận 3 điều biết ơn.</li>
                <li>• Thực hiện thói quen quan trọng trong ngày.</li>
                <li>• Chia sẻ cảm nhận với đội nhóm.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

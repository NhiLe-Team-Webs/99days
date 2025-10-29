import { useEffect, useState } from "react";

type CountdownTarget = {
  id: string;
  date: string;
  time: string;
  title: string;
  subtitle?: string;
  timezoneNote?: string;
  iso: string;
};

type CountdownValue = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
};

const COUNTDOWN_TARGETS: CountdownTarget[] = [
  {
    id: "open",
    date: "01/11/2025",
    time: "11:00",
    title: "MỞ ĐĂNG KÝ THAM GIA",
    timezoneNote: "Giờ Việt Nam (GMT+7)",
    iso: "2025-11-01T11:00:00+07:00",
  },
  {
    id: "close",
    date: "11/11/2025",
    time: "11:00",
    title: "ĐÓNG ĐĂNG KÝ THAM GIA",
    timezoneNote: "Giờ Việt Nam (GMT+7)",
    iso: "2025-11-11T11:00:00+07:00",
  },
  {
    id: "start",
    date: "19/11/2025",
    time: "04:45",
    title: "SẴN SÀNG THỬ THÁCH",
    subtitle: "Zoom online",
    timezoneNote: "Giờ Việt Nam (GMT+7)",
    iso: "2025-11-19T04:45:00+07:00",
  },
  {
    id: "end",
    date: "25/02/2026",
    time: "06:00",
    title: "THỜI GIAN CÒN LẠI",
    subtitle: "Zoom online",
    timezoneNote: "Giờ Việt Nam (GMT+7)",
    iso: "2026-02-25T06:00:00+07:00",
  },
];

function calculateCountdown(target: Date, now: Date): CountdownValue {
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, completed: true };
  }
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, completed: false };
}

const CountdownSection = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const upcomingTarget =
    COUNTDOWN_TARGETS.find((target) => new Date(target.iso).getTime() > now.getTime()) ??
    COUNTDOWN_TARGETS[COUNTDOWN_TARGETS.length - 1];

  const countdown = calculateCountdown(new Date(upcomingTarget.iso), now);

  return (
    <section id="countdown" className="bg-[#FFF9F0] py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 text-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#FF6F00]">
            Hành Trình 99 Days with NhiLe
          </p>
          <h2 className="mt-2 text-3xl font-black text-gray-900 md:text-4xl">
            Đếm Ngược Các Cột Mốc Quan Trọng
          </h2>
          <p className="mt-3 text-base text-muted-foreground md:text-lg">
            Theo dõi thời gian mở đăng ký, đóng đăng ký và các mốc Zoom quan trọng
            để luôn sẵn sàng.
          </p>
        </div>
        <div className="mx-auto w-full max-w-3xl">
          <div className="flex flex-col gap-4 rounded-2xl border border-[#FF6F00]/20 bg-white p-8 shadow-lg">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#FF6F00]">
                {upcomingTarget.date}
              </p>
              <p className="text-2xl font-bold text-gray-900">{upcomingTarget.time}</p>
              {upcomingTarget.subtitle ? (
                <p className="text-sm font-medium text-gray-700">{upcomingTarget.subtitle}</p>
              ) : null}
              {upcomingTarget.timezoneNote ? (
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {upcomingTarget.timezoneNote}
                </p>
              ) : null}
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-gray-900 md:text-3xl">
                {upcomingTarget.title}
              </h3>
              {countdown.completed ? (
                <p className="mt-2 text-sm font-semibold text-emerald-600">
                  Sự kiện đã diễn ra, hãy sẵn sàng cho cột mốc tiếp theo!
                </p>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  Thời gian còn lại trước cột mốc quan trọng tiếp theo.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {["days", "hours", "minutes", "seconds"].map((unit) => {
                const value = countdown[unit as keyof CountdownValue] as number;
                return (
                  <div
                    key={unit}
                    className="flex flex-col items-center rounded-xl bg-[#FFF3E6] px-4 py-3"
                  >
                    <span className="text-3xl font-black text-[#FF6F00]">
                      {String(value).padStart(2, "0")}
                    </span>
                    <span className="text-xs uppercase tracking-wide text-[#B65A00]">
                      {unit}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="text-xs text-muted-foreground">
              Bạn sẽ tự động thấy cột mốc mới khi thời gian phía trên đã tới.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CountdownSection;

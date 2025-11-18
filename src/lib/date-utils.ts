// Hàm để lấy ngày hiện tại chính xác theo múi giờ Việt Nam (GMT+7)
export function getCurrentDateInVietnam(): string {
  // Lấy thời gian hiện tại
  const now = new Date();
  
  // Điều chỉnh sang múi giờ Việt Nam (GMT+7)
  // getTimezoneOffset() trả về sự chênh lệch phút giữa UTC và giờ địa phương
  // Ví dụ: Nếu ở Việt Nam (GMT+7), getTimezoneOffset() sẽ trả về -420
  const vietnamTime = new Date(now.getTime() + (now.getTimezoneOffset() + 420) * 60000);
  
  // Trả về ngày ở định dạng YYYY-MM-DD
  return vietnamTime.toISOString().split('T')[0]!;
}

// Hàm để định dạng ngày theo múi giờ Việt Nam
export function formatISODateInVietnam(date?: Date): string {
  if (!date) return getCurrentDateInVietnam();
  
  // Điều chỉnh sang múi giờ Việt Nam
  const vietnamTime = new Date(date.getTime() + (date.getTimezoneOffset() + 420) * 60000);
  return vietnamTime.toISOString().split('T')[0]!;
}

// Hàm để hiển thị ngày theo định dạng Việt Nam
export function formatDisplayDateInVietnam(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Hàm để kiểm tra xem một ngày có phải là ngày hiện tại không (theo múi giờ Việt Nam)
export function isTodayInVietnam(date: string): boolean {
  return date === getCurrentDateInVietnam();
}

// Hàm để lấy ngày mai theo múi giờ Việt Nam
export function getTomorrowInVietnam(): string {
  const today = new Date(getCurrentDateInVietnam());
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  return tomorrow.toISOString().split('T')[0]!;
}

// Hàm để lấy ngày hôm qua theo múi giờ Việt Nam
export function getYesterdayInVietnam(): string {
  const today = new Date(getCurrentDateInVietnam());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return yesterday.toISOString().split('T')[0]!;
}
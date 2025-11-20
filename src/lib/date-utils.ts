// Hàm để lấy ngày hiện tại chính xác theo múi giờ Việt Nam (GMT+7)
export function getCurrentDateInVietnam(): string {
  // Lấy thời gian hiện tại
  const now = new Date();
  
  // Sử dụng toLocaleString với múi giờ Việt Nam để lấy ngày chính xác
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  };
  
  const vietnamDate = now.toLocaleString('en-CA', options); // en-CA format gives YYYY-MM-DD
  return vietnamDate;
}

// Hàm để định dạng ngày theo múi giờ Việt Nam
export function formatISODateInVietnam(date?: Date): string {
  if (!date) return getCurrentDateInVietnam();
  
  // Sử dụng toLocaleString với múi giờ Việt Nam để lấy ngày chính xác
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  };
  
  const vietnamDate = date.toLocaleString('en-CA', options); // en-CA format gives YYYY-MM-DD
  return vietnamDate;
}

// Hàm để hiển thị ngày theo định dạng Việt Nam
export function formatDisplayDateInVietnam(date: string): string {
  // Parse the date string and format it with Vietnam timezone
  const dateObj = new Date(`${date}T00:00:00`);
  return dateObj.toLocaleDateString("vi-VN", {
    timeZone: 'Asia/Ho_Chi_Minh',
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
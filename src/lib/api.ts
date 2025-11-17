import { supabase } from './supabase';

export interface Applicant {
  id?: string;
  ho_ten: string;
  email: string;
  so_bao_danh?: string | null;
  so_dien_thoai?: string | null;
  telegram: string;
  nam_sinh: number | null;
  gioi_tinh: string;
  dia_chi: string;
  da_tham_gia_truoc: string;
  link_bai_chia_se: string | null;
  muc_tieu: string;
  ky_luat_rating: number | null;
  ly_do: string;
  thoi_gian_thuc_day: string;
  tan_suat_tap_the_duc: string;
  muc_do_van_dong: number | null;
  tinh_trang_suc_khoe: string;
  dong_y: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  created_at?: string;
  updated_at?: string;
  approved_at?: string | null;
}

export interface AdminSetting {
  key: string;
  value: string;
  updated_at: string;
}

export type ApplicantFormInput = Omit<
  Applicant,
  'id' | 'status' | 'created_at' | 'updated_at' | 'approved_at' | 'nam_sinh' | 'ky_luat_rating' | 'muc_do_van_dong'
> & {
  nam_sinh: string | number;
  ky_luat_rating: string | number;
  muc_do_van_dong: string | number;
};

export const submitApplication = async (data: ApplicantFormInput) => {
  const rawNamSinh = data.nam_sinh;
  const namSinhValue =
    typeof rawNamSinh === 'number'
      ? rawNamSinh
      : rawNamSinh.trim() === ''
      ? Number.NaN
      : Number(rawNamSinh);

  const currentYear = new Date().getFullYear();
  const isValidNamSinh =
    Number.isInteger(namSinhValue) && namSinhValue >= 1900 && namSinhValue <= currentYear;

  if (!isValidNamSinh) {
    throw new Error('Năm sinh không hợp lệ');
  }

  const rawKyLuat = data.ky_luat_rating;
  const kyLuatValue =
    typeof rawKyLuat === 'number'
      ? rawKyLuat
      : rawKyLuat.toString().trim() === ''
      ? Number.NaN
      : Number(rawKyLuat);

  if (!Number.isInteger(kyLuatValue) || kyLuatValue < 1 || kyLuatValue > 5) {
    throw new Error('Đánh giá kỷ luật không hợp lệ');
  }

  const rawActivity = data.muc_do_van_dong;
  const mucDoVanDongValue =
    typeof rawActivity === 'number'
      ? rawActivity
      : rawActivity.toString().trim() === ''
      ? Number.NaN
      : Number(rawActivity);

  if (!Number.isInteger(mucDoVanDongValue) || mucDoVanDongValue < 1 || mucDoVanDongValue > 5) {
    throw new Error('Mức độ vận động không hợp lệ');
  }

  const insertPayload = {
    ho_ten: data.ho_ten,
    email: data.email,
    so_dien_thoai: data.so_dien_thoai ?? null,
    telegram: data.telegram,
    nam_sinh: namSinhValue,
    gioi_tinh: data.gioi_tinh,
    dia_chi: data.dia_chi,
    da_tham_gia_truoc: data.da_tham_gia_truoc,
    link_bai_chia_se: data.link_bai_chia_se ?? null,
    muc_tieu: data.muc_tieu,
    ky_luat_rating: kyLuatValue,
    ly_do: data.ly_do,
    thoi_gian_thuc_day: data.thoi_gian_thuc_day,
    tan_suat_tap_the_duc: data.tan_suat_tap_the_duc,
    muc_do_van_dong: mucDoVanDongValue,
    tinh_trang_suc_khoe: data.tinh_trang_suc_khoe,
    dong_y: data.dong_y,
    status: 'pending' as const
  };

  const { data: result, error } = await supabase
    .from('applicants')
    .insert([insertPayload])
    .select();

  if (error) throw error;

  const webhookUrl = import.meta.env.VITE_FORM_RESPONSES_WEBHOOK_URL;
  if (webhookUrl) {
    const [created] = result ?? [];
    const sheetPayload = {
      timestamp: new Date().toISOString(),
      emailAddress: data.email,
      fullName: data.ho_ten,
      birthYear: namSinhValue,
      gender: data.gioi_tinh,
      address: data.dia_chi,
      email: data.email,
      telegram: data.telegram,
      participatedBefore: data.da_tham_gia_truoc,
      shareLink: data.link_bai_chia_se ?? '',
      goal: data.muc_tieu,
      discipline: kyLuatValue,
      motivation: data.ly_do,
      wakeUpTime: data.thoi_gian_thuc_day,
      workoutFrequency: data.tan_suat_tap_the_duc,
      activityLevel: mucDoVanDongValue,
      healthNotes: data.tinh_trang_suc_khoe,
      applicantId: created?.id ?? null
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sheetPayload)
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(
        errorText.trim().length > 0
          ? `Không thể đồng bộ đăng ký lên Google Sheet: ${errorText}`
          : 'Không thể đồng bộ đăng ký lên Google Sheet'
      );
    }
  }

  return result;
};

export const checkEmailExists = async (email: string) => {
  console.log('Đang kiểm tra email:', email);

  const { data: applicants, error: error1 } = await supabase
    .from('applicants')
    .select('id')
    .eq('email', email)
    .limit(1);

  if (error1) {
    console.error('Lỗi query applicants:', error1);
    throw error1;
  }

  console.log('Kết quả applicants:', applicants);

  if (applicants.length > 0) return true;

  const { data: members, error: error2 } = await supabase
    .from('members')
    .select('id')
    .eq('email', email)
    .limit(1);

  if (error2) {
    console.error('Lỗi query members:', error2);
    throw error2;
  }

  console.log('Kết quả members:', members);

  return members.length > 0;
};

// Hardcoded Zoom links for rotation
const ZOOM_LINKS = [
  'https://zoom.us/j/91099405116?pwd=amLoPr1KDy7peEq4zOwPib1hVCGZ2i.1',
  'https://zoom.us/j/98009145941?pwd=9V0bg9PGrvyManbMyBNl904AOd7waC.1',
  'https://zoom.us/j/93932757317?pwd=PYQDif2aXZYO5W6nzGypyYlGQ0pJiY.1',
  'https://zoom.us/j/96202879776?pwd=2nT6J6kflA0GKOovqOoYdqoLnIfb0D.1',
  'https://zoom.us/j/95006619662?pwd=NkRXfIsVOrT8eWenvNtlQYTVp2o60i.1'
];

// Function to get the appropriate Zoom link based on date rotation
const getRotatingZoomLink = (date: Date): string => {
  // Start date for rotation (19-11-2025)
  const startDate = new Date('2025-11-19T00:00:00');
  
  // Calculate days difference
  const timeDiff = date.getTime() - startDate.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  
  // Calculate index (modulo 5 for 5 links)
  const linkIndex = ((daysDiff % 5) + 5) % 5; // Ensure positive result
  
  return ZOOM_LINKS[linkIndex];
};

export const fetchTodayZoomLink = async (): Promise<string | null> => {
  // Use the rotating system instead of database lookup
  const today = new Date();
  const zoomLink = getRotatingZoomLink(today);
  
  console.log(`Today's Zoom link (index: ${ZOOM_LINKS.indexOf(zoomLink)}):`, zoomLink);
  
  return zoomLink;
};

export const getAdminProgramStartDate = async (): Promise<string | null> => {
  const { data, error } = await supabase
    .from('admin_settings')
    .select('value')
    .eq('key', 'program_start_date')
    .single();

  if (error) {
    if (error.code === 'PGRST205') {
      console.warn("Table 'admin_settings' not found. Returning default start date.");
      return null;
    }
    console.error("Error fetching program start date:", error);
    throw error;
  }

  return data?.value ?? null;
};

const formatRebornCode = (code: string | null) => {
  if (!code) return null;
  return code.startsWith("R") ? code : `R${code}`;
};

export const acceptRebornInvitation = async (memberId: string, currentSoBaoDanh: string | null) => {
  const rebornCode = formatRebornCode(currentSoBaoDanh);

  const { error } = await supabase
    .from("members")
    .update({
      status: "reborn_active",
      so_bao_danh: rebornCode,
      drop_reason: null,
    })
    .eq("id", memberId);

  if (error) throw error;
  return rebornCode;
};

export const declineRebornInvitation = async (memberId: string) => {
  const { error } = await supabase
    .from("members")
    .update({
      status: "dropped",
    })
    .eq("id", memberId);

  if (error) throw error;
};

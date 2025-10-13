import { supabase } from './supabase';

export interface Applicant {
  id?: string;
  ho_ten: string;
  email: string;
  so_dien_thoai: string;
  telegram: string;
  nam_sinh: number | null;
  ly_do: string;
  dong_y: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  created_at?: string;
}

export type ApplicantFormInput = Omit<Applicant, 'id' | 'status' | 'created_at' | 'nam_sinh'> & {
  nam_sinh: string | number;
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
    throw new Error('Nam sinh khong hop le');
  }

  const { data: result, error } = await supabase
    .from('applicants')
    .insert([
      {
        ...data,
        nam_sinh: namSinhValue,
        status: 'pending'
      }
    ])
    .select();

  if (error) throw error;
  return result;
};

export const checkEmailExists = async (email: string) => {
  console.log('Dang kiem tra email:', email);

  const { data: applicants, error: error1 } = await supabase
    .from('applicants')
    .select('id')
    .eq('email', email)
    .limit(1);

  if (error1) {
    console.error('Loi query applicants:', error1);
    throw error1;
  }

  console.log('Ket qua applicants:', applicants);

  if (applicants.length > 0) return true;

  const { data: members, error: error2 } = await supabase
    .from('members')
    .select('id')
    .eq('email', email)
    .limit(1);

  if (error2) {
    console.error('Loi query members:', error2);
    throw error2;
  }

  console.log('Ket qua members:', members);

  return members.length > 0;
};

export const fetchTodayZoomLink = async (): Promise<string | null> => {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('daily_zoom_links')
    .select('zoom_link:zoom_links(url)')
    .eq('scheduled_for', today)
    .maybeSingle<{ zoom_link: { url: string } | null }>();

  if (error) {
    if (error.code === 'PGRST205') {
      console.warn("Bang 'daily_zoom_links' chua duoc tao. Vui long chay supabase.sql.");
      return null;
    }

    throw error;
  }

  return data?.zoom_link?.url ?? null;
};

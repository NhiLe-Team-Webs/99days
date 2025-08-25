import { supabase } from './supabase';

export interface Applicant {
  id?: string;
  ho_ten: string;
  email: string;
  so_dien_thoai: string;
  telegram: string;
  nam_sinh: string;
  ly_do: string;
  dong_y: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  created_at?: string;
}

// Gửi đơn đăng ký
export const submitApplication = async (data: Omit<Applicant, 'id' | 'status' | 'created_at'>) => {
  const { data: result, error } = await supabase
    .from('applicants')
    .insert([
      {
        ...data,
        status: 'pending'
      }
    ])
    .select();

  if (error) throw error;
  return result;
};

export const checkEmailExists = async (email: string) => {
  console.log('Đang kiểm tra email:', email); // 🔍 Debug

  const { data: applicants, error: error1 } = await supabase
    .from('applicants')
    .select('id')
    .eq('email', email)
    .limit(1);

  if (error1) {
    console.error('Lỗi query applicants:', error1);
    throw error1;
  }

  console.log('Kết quả applicants:', applicants); // 📊

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

  console.log('Kết quả members:', members); // 📊

  return members.length > 0;
};
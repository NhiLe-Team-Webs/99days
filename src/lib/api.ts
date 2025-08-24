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
  const { data, error } = await supabase
    .from('applicants')
    .select('id')
    .eq('email', email)
    .limit(1);

  if (error) throw error;
  return data.length > 0;
};
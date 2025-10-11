# Huong dan cau hinh Supabase cho 99 Days

Tai lieu nay tom tat cac buoc can thiet de landing page (thu muc `99days`) va bang dieu khien admin (thu muc `admin-99days`) co the dang ky, duyet va quan ly thanh vien thong qua Supabase.

## 1. Tao project Supabase va bien moi truong

1. Dang nhap https://supabase.com va tao mot project moi.
2. Mo **Project Settings → API** va sao chep:
   - **Project URL** → dat vao `VITE_SUPABASE_URL`
   - **anon public API key** → dat vao `VITE_SUPABASE_KEY`
3. Tao file `.env` cho ca hai ung dung (neu chua co):

   ```bash
   VITE_SUPABASE_URL="https://<your-project-ref>.supabase.co"
   VITE_SUPABASE_KEY="<public-anon-key>"
   ```

4. Khoi dong lai server dev de nhan gia tri moi.

## 2. Cau hinh Authentication

1. Trong **Authentication → Providers** bat:
   - **Email** (OTP + Password recovery)
   - **Google** (dien OAuth Client ID/Secret neu muon dang nhap Google)
2. Them cac redirect hop le trong **Authentication → URL Configuration**:
   - `http://localhost:5173/auth-status`
   - `http://localhost:5173/reset-password`
   - URL production tuong ung cua ban (neu co)
3. Tinh chinh email template neu muon ca nhan hoa noi dung.

## 3. Tao schema va chinh sach

Chay toan bo file [`supabase.sql`](../supabase.sql) trong SQL Editor cua Supabase. Script nay:

- Tao extension `pgcrypto`/`uuid-ossp`
- Tao function cap nhat cot `updated_at`
- Tao bang `public.applicants` (luu don dang ky) va `public.members` (luu thanh vien duoc cap quyen)
- Kich hoat Row Level Security va khai bao cac policy phu hop voi landing page va admin panel

Bang `applicants` su dung cac cot tieng Viet nhu `ho_ten`, `so_dien_thoai`, `nam_sinh`... nen khop voi payload ma form dang ky dang gui.

> Neu muon tuy chinh chin sach nghiem ngat hon (vidu chi de `service_role` duoc phep update), hay chinh sua lai phan policy trong script cho phu hop.

## 4. Kiem tra luu luong dang nhap tren ung dung landing

1. Dien form dang ky tren trang chu. Dong moi duoc luu vao `public.applicants` voi trang thai `pending`.
2. Dang nhap bang email + password hoac Google:
   - Neu email chua co trong `public.members`, ung dung se thong bao chua duoc duyet.
   - Khi admin duyet, ban co the dang nhap va duoc dieu huong vao `/dashboard`.
3. Thu tac vu quen mat khau de dam bao email khoi phuc hoat dong.

## 5. Quy trinh duyet tren admin panel

1. Tab “Don dang ky moi” goi `getApplicants('pending')` de hien danh sach cho duyet.
2. Khi bam “Duyet”:
   - Admin panel cap nhat `applicants.status = 'approved'` va gan `approved_at`.
   - Bang `members` duoc `upsert` theo email (status `active`). Neu email ton tai se ghi de thong tin moi.
3. Tab “Tat ca thanh vien” lay danh sach `members` co `status = 'active'`. Neu bam “Loai bo” thi ghi nhan `status = 'dropped'`.
4. So luong ung vien va thanh vien tren dashboard duoc tinh bang do dai mang du lieu vua fetch tu Supabase.

> Admin panel dang su dung public `anon` key. Hay dam bao trang quan tri chi duoc truy cap noi bo hoac thay bang service key voi co che xac thuc rieng neu dua len moi truong cong khai.

- Mo **Database �+' Replication** hoac tab **Realtime** trong Supabase va bat theo doi (Enable) cho cac bang `applicants` va `members` de bang dieu khien admin cap nhat du lieu moi ngay khi co dang ky hoac duyet thanh vien.

## 6. Meo quan ly them

- Su dung cot `approved_at` + `start_date` de thong ke tien trinh (cung cap san trong schema).
- Neu can ly do loai bo thanh vien, truyen tham so `dropReason` vao `removeMember`.
- De tu dong thong bao, co the bat Supabase Webhook/Function khi `members.status` thay doi.

Hoan tat! Ca hai ung dung se hoat dong voi cung mot project Supabase sau khi script va bien moi truong duoc thiet lap dung.

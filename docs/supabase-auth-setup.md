# Hướng dẫn cấu hình Supabase cho chức năng đăng nhập và quên mật khẩu

Tài liệu này giải thích các bước cần thiết để cấu hình Supabase để ứng dụng 99 Days with NhiLe có thể đăng nhập và khôi phục mật khẩu.

## 1. Chuẩn bị dự án Supabase

1. Đăng nhập vào [https://supabase.com](https://supabase.com) và tạo một Project mới.
2. Mở trang **Project Settings → API** và sao chép 2 giá trị:
   - **Project URL** → dùng cho `VITE_SUPABASE_URL`.
   - **anon public API key** → dùng cho `VITE_SUPABASE_KEY`.
3. Tạo file `.env.local` trong thư mục gốc dự án (cùng cấp với `package.json`) và thêm nội dung:

   ```bash
   VITE_SUPABASE_URL="https://<your-project-ref>.supabase.co"
   VITE_SUPABASE_KEY="<public-anon-key>"
   ```

4. Khởi động lại server Vite (nếu đang chạy) để nhận biến môi trường mới.

## 2. Thiết lập Authentication

1. Vào **Authentication → Providers** và bật:
   - **Email** (OTP + Password recovery).
   - **Google** (để người dùng đăng nhập bằng Google). Điền OAuth Client ID/Secret theo hướng dẫn của Supabase.
2. Trong **Authentication → URL Configuration** thêm các đường dẫn sau:
   - `http://localhost:5173/auth-status`
   - `http://localhost:5173/reset-password`
   - URL tương ứng trên môi trường production (ví dụ `https://app.yourdomain.com/auth-status`, `https://app.yourdomain.com/reset-password`).
3. (Tuỳ chọn) Tuỳ chỉnh email template trong **Authentication → Templates** nếu muốn cá nhân hoá nội dung email đặt lại mật khẩu.

## 3. Tạo bảng dữ liệu cần thiết

Sử dụng nội dung trong file [`supabase.sql`](../supabase.sql) để tham khảo cấu trúc các bảng `members` và `applicants`. Hai bảng này được dùng để kiểm tra quyền truy cập của người dùng:

- **members**: Lưu thông tin những tài khoản đã được duyệt. Người dùng chỉ có thể truy cập Dashboard nếu email của họ xuất hiện trong bảng này.
- **applicants**: (tuỳ chọn) theo dõi trạng thái phê duyệt của người đăng ký mới.

Có thể tạo bảng trực tiếp trong Supabase Table Editor hoặc chạy truy vấn SQL:

```sql
create table if not exists public.members (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  name text,
  status text default 'active' not null,
  drop_reason text,
  start_date date not null default current_date,
  applicant_id uuid references public.applicants(id),
  created_at timestamptz default now()
);

create table if not exists public.applicants (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  ho_ten text not null,
  so_dien_thoai text,
  telegram text,
  nam_sinh int,
  ly_do text,
  dong_y boolean default false,
  status text default 'pending' not null,
  approved_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

> 💡 Các cột tiếng Việt (`ho_ten`, `so_dien_thoai`, …) khớp với payload mà Landing Page gửi từ form đăng ký. Bạn có thể đổi tên
> chúng nếu muốn nhưng cần cập nhật lại ở `src/lib/api.ts`.

## 4. Chính sách bảo mật (RLS)

Bật **Row Level Security** cho các bảng và tạo policy để người dùng đã đăng nhập chỉ có thể đọc bản ghi của chính họ.

Ví dụ cho bảng `members`:

```sql
alter table public.members enable row level security;

create policy "Members can view their own record"
  on public.members
  for select
  using (auth.email() = email);
```

Với bảng `applicants`, chỉ cần cho phép người dùng đã đăng nhập xem bản ghi theo email của họ (nếu cần hiển thị trạng thái đăng ký):

```sql
alter table public.applicants enable row level security;

create policy "Applicants can view their own application"
  on public.applicants
  for select
  using (auth.email() = email);
```

Quản trị viên có thể tạo thêm policy cho thao tác insert/update theo nhu cầu quản lý.

## 5. Kiểm tra lại luồng đăng nhập

Sau khi cấu hình xong, xác nhận các bước sau:

1. Đăng ký/duyệt một tài khoản để có email nằm trong bảng `members`.
2. Đăng nhập bằng email & mật khẩu hoặc Google → người dùng được chuyển hướng tới `/dashboard`.
3. Nhấn "Quên mật khẩu" → nhập email → nhận email đặt lại.
4. Nhấp link trong email → trang `/reset-password` hiển thị form đặt mật khẩu mới và cập nhật thành công.

Nếu gặp lỗi:
- Kiểm tra Console của trình duyệt để biết thông báo chi tiết.
- Xác nhận biến môi trường Supabase đã được cấu hình chính xác.
- Đảm bảo các policy RLS cho phép thao tác `select` cần thiết.

## 6. Quy trình duyệt đơn và nâng cấp thành viên

1. **Ứng viên đăng ký** trên Landing Page → bản ghi mới được thêm vào bảng `applicants` với trạng thái `pending`.
2. **Admin kiểm tra hồ sơ** tại Supabase (hoặc công cụ quản trị tuỳ chỉnh). Khi quyết định chấp nhận, cập nhật trường `status`
   thành `approved` và (tuỳ chọn) điền `approved_at`.
3. **Tạo tài khoản Supabase** cho ứng viên bằng tính năng "Invite user" trong phần Authentication hoặc thông qua Admin API.
   Khi người dùng hoàn thành đặt mật khẩu, một dòng mới sẽ xuất hiện trong `auth.users`.
4. **Chèn bản ghi vào bảng `members`** để cấp quyền truy cập Dashboard. Có thể chạy truy vấn sau trong SQL Editor:

   ```sql
   insert into public.members (id, email, name, applicant_id)
   select u.id, a.email, a.ho_ten, a.id
   from auth.users u
   join public.applicants a on a.email = u.email
   where a.status = 'approved'
     and not exists (
       select 1 from public.members m where m.id = u.id
     );
   ```

   Truy vấn trên đảm bảo chỉ những ứng viên đã được duyệt và chưa có hồ sơ thành viên mới được thêm vào bảng `members`.
5. Sau khi bản ghi `members` xuất hiện, người dùng có thể đăng nhập bình thường bằng email/mật khẩu hoặc Google.

Hoàn thành! Ứng dụng hiện đã sẵn sàng đăng nhập và khôi phục mật khẩu thông qua Supabase.

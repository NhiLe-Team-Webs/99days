# Hướng Dẫn Setup Supabase Storage cho Upload Ảnh Tiến Độ

## Tổng Quan

Hướng dẫn này sẽ giúp bạn setup Storage bucket trên Supabase để lưu trữ ảnh tiến độ của người dùng.

## Bước 1: Tạo Storage Bucket

1. **Đăng nhập vào Supabase Dashboard**
   - Truy cập: https://supabase.com/dashboard
   - Chọn project của bạn

2. **Vào mục Storage**
   - Click vào **Storage** trong menu bên trái

3. **Tạo bucket mới**
   - Click nút **"New bucket"** (hoặc **"Create bucket"**)
   - Điền thông tin:
     - **Name**: `progress-photos` (phải đúng tên này)
     - **Public bucket**: ✅ **Bật** (quan trọng!)
     - **File size limit**: `5242880` (5MB - ảnh sau nén sẽ < 500KB)
     - **Allowed MIME types**: `image/jpeg,image/png,image/webp`
   - Click **"Create bucket"**

   ![Screenshot: Tạo bucket với tên progress-photos]

## Bước 2: Thiết Lập Storage Policies

Sau khi tạo bucket, bạn cần thiết lập policies để cho phép users upload và quản lý ảnh.

### Cách 1: Chạy SQL File (Khuyến nghị)

1. Mở file `supabase-storage-setup.sql` trong project
2. Copy toàn bộ nội dung từ phần "BƯỚC 2" trở đi
3. Vào Supabase Dashboard → **SQL Editor**
4. Click **"New query"**
5. Paste SQL code vào
6. Click **"Run"** (hoặc nhấn `Ctrl/Cmd + Enter`)

### Cách 2: Tạo Policies Thủ Công

Nếu muốn tạo từng policy một trong Dashboard:

1. Vào **Storage** → **progress-photos** → **Policies**
2. Click **"New Policy"** cho mỗi policy sau:

#### Policy 1: Upload
- **Policy name**: `Authenticated users can upload progress photos`
- **Allowed operation**: `INSERT`
- **Target roles**: `authenticated`
- **Policy definition**: 
  ```sql
  (bucket_id = 'progress-photos')
  ```

#### Policy 2: Read (Authenticated)
- **Policy name**: `Authenticated users can view progress photos`
- **Allowed operation**: `SELECT`
- **Target roles**: `authenticated`
- **Policy definition**:
  ```sql
  (bucket_id = 'progress-photos')
  ```

#### Policy 3: Delete
- **Policy name**: `Authenticated users can delete progress photos`
- **Allowed operation**: `DELETE`
- **Target roles**: `authenticated`
- **Policy definition**:
  ```sql
  (bucket_id = 'progress-photos')
  ```

#### Policy 4: Read (Public)
- **Policy name**: `Public can view progress photos`
- **Allowed operation**: `SELECT`
- **Target roles**: `public`
- **Policy definition**:
  ```sql
  (bucket_id = 'progress-photos')
  ```

## Bước 3: Kiểm Tra Setup

### Test từ Dashboard

1. Vào **Storage** → **progress-photos**
2. Thử upload một file ảnh test (nếu có quyền admin)
3. Verify file được tạo thành công

### Test từ Application

1. Start development server:
   ```bash
   npm run dev
   ```

2. Đăng nhập vào app
3. Vào trang **Theo dõi tiến độ** (`/progress`)
4. Thử upload một ảnh:
   - Click chọn file
   - Chọn ảnh từ máy tính
   - Click "Lưu tiến độ"
5. Kiểm tra:
   - ✅ Ảnh được hiển thị trong preview
   - ✅ Sau khi lưu, ảnh xuất hiện trong phần "Ảnh tiến độ"
   - ✅ Không có lỗi trong console

## Cấu Trúc Lưu Trữ

Ảnh được lưu với cấu trúc folder như sau:

```
progress-photos/
  └── {member_id}/
      └── {date}/
          └── {timestamp}-{filename}.jpg
```

Ví dụ:
```
progress-photos/
  └── 550e8400-e29b-41d4-a716-446655440000/
      └── 2025-01-15/
          └── 1736928000000-photo.jpg
```

## Troubleshooting

### Lỗi: "new row violates row-level security policy"

**Nguyên nhân**: Storage policies chưa được thiết lập đúng.

**Giải pháp**:
1. Kiểm tra lại đã chạy SQL setup chưa
2. Verify policies trong Storage → progress-photos → Policies
3. Đảm bảo bucket name đúng là `progress-photos`

### Lỗi: "Bucket not found"

**Nguyên nhân**: Bucket chưa được tạo hoặc tên sai.

**Giải pháp**:
1. Kiểm tra bucket name trong code (`src/lib/storage.ts`) phải là `progress-photos`
2. Verify bucket đã được tạo trong Dashboard

### Lỗi: "Permission denied" khi xem ảnh

**Nguyên nhân**: Bucket không phải public hoặc thiếu public read policy.

**Giải pháp**:
1. Vào Storage → progress-photos → Settings
2. Đảm bảo "Public bucket" đã bật
3. Kiểm tra policy "Public can view progress photos" đã được tạo

### Ảnh không hiển thị sau khi upload

**Kiểm tra**:
1. Mở browser DevTools → Network tab
2. Tìm request đến Supabase Storage
3. Kiểm tra response code:
   - ✅ 200: Upload thành công
   - ❌ 403: Permission issue (kiểm tra policies)
   - ❌ 404: Bucket không tồn tại
   - ❌ 413: File quá lớn

## Bảo Mật

### Lưu Ý Quan Trọng

- ✅ **Bucket là public** để hiển thị ảnh dễ dàng
- ✅ **Application-level security**: Code kiểm tra ownership qua RLS trên `progress_updates` table
- ✅ **Folder structure**: Mỗi user có folder riêng (`{member_id}`) để dễ quản lý
- ✅ **File validation**: Code validate file type và size trước khi upload
- ✅ **Image compression**: Ảnh được tự động nén xuống < 500KB

### Khuyến Nghị Bổ Sung (Tùy chọn)

Nếu muốn bảo mật hơn, có thể:
1. Tắt public bucket
2. Sử dụng signed URLs thay vì public URLs
3. Implement stricter policies dựa trên folder path

Nhưng với use case hiện tại (chỉ authenticated users), setup hiện tại đã đủ an toàn.

## Kết Luận

Sau khi hoàn thành 3 bước trên, bạn đã sẵn sàng để:
- ✅ Upload ảnh tiến độ từ ứng dụng
- ✅ Xem lịch sử ảnh đã upload
- ✅ Quản lý và xóa ảnh cũ

Nếu gặp vấn đề, tham khảo phần Troubleshooting hoặc kiểm tra logs trong Supabase Dashboard.


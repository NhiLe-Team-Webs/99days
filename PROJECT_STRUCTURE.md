# 99days - Cau truc va Muc tieu

## Muc tieu san pham
- Xay dung landing page gioi thieu hanh trinh 99 ngay va loi ich khoa hoc.
- Ho tro nguoi dung dang ky tham gia chuong trinh, kiem tra email trung lap va theo doi trang thai duyet.
- Cung cap bang dieu khien cho thanh vien da duoc duyet: dem nguoc, huy hieu, dong luc tu AI, tien do tap luyen va link buoi tap.

## Cong nghe nen tang
- Vite + React + TypeScript lam nen tang front-end.
- Tailwind CSS va bo UI shadcn giup tai su dung phong cach giao dien nhat quan.
- Supabase (Auth + Database) de luu tru ho so dang ky va thong tin thanh vien.
- Google Gemini API tao cau noi dong luc trong man hinh bang dieu khien.

## Cau truc thu muc chinh
- `public/`: Tai nguyen tĩnh va file `index.html` goc cho Vite.
- `src/`: Ma nguon chinh cua ung dung.
  - `components/`: Cac khoi UI chinh (header, section landing page, form dang ky, route bao ve, xu ly trang thai dang nhap) va thu vien UI tu shadcn.
  - `hooks/`: Hook tuy bien, bao gom `use-mobile` (xu ly logic giao dien tren thiet bi nho) va `use-toast`.
  - `lib/`: Ham lam viec voi Supabase (`api.ts`, `supabase.ts`), tien ich chung (`utils.ts`) va tich hop Gemini (`gemini.ts`).
  - `pages/`: Cac trang dinh tuyen voi React Router (`Index`, `Login`, `Dashboard`, `NotFound`) va cac trang trung gian nhu `PendingApproval`.
  - `App.tsx`: Dinh nghia tuyen duong va bao ve trang noi bo bang `ProtectedRoute`.
  - `main.tsx`: Diem vao chinh, mount ung dung vao DOM va load theme.
- `tailwind.config.ts`, `postcss.config.js`: Cau hinh build CSS.
- `package.json`: Dinh nghia script va phu thuoc cua du an.

## Luong chuc nang chinh
- Nguoi dung truy cap trang chu (`/`), tim hieu chuong trinh va gui form dang ky (`RegistrationSection`).
- He thong kiem tra truoc email trong bang `applicants` va `members` de tranh trung lap.
- Sau khi dang ky, nguoi dung co the dang nhap (`/login`), theo doi trang thai duyet (`/pending-approval`) hay truy cap bang dieu khien (`/dashboard`) khi tai khoan duoc phe duyet.
- Bang dieu khien goi Supabase de lay thong tin thanh vien, tinh toan tien do theo `startDate`, tao cau noi dong luc qua `generateMotivationalQuote` va cap nhat UI (badges, dem nguoc, thong bao).

## Ghi chu van hanh
- Dien cac bien moi truong trong `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_KEY`) truoc khi chay `npm run dev`.
- Su dung cung mot co so du lieu voi ung dung admin de dong bo thong tin applicants/members.

## Dinh huong mo rong
- Tich hop thong bao email hoac Telegram khi ho so duoc duyet.
- Bo sung lich tap, log bai tap hang ngay va thong ke nang cao tren dashboard.
- Cho phep thanh vien cap nhat ho so va ket noi voi lich su tien trinh trong Supabase.

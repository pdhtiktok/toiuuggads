# 🚀 HƯỚNG DẪN DEPLOY TOIUUGGADS-WEB LÊN VERCEL

Tài liệu này tổng hợp toàn bộ thông tin cần thiết để anh deploy dự án lên Vercel một cách nhanh nhất.

## 1. Thông tin Environment Variables (CỰC KỲ QUAN TRỌNG)
Anh hãy copy chính xác các cặp Tên và Giá trị dưới đây vào phần **Settings > Environment Variables** trên Vercel:

| Tên Biến (Key) | Giá trị (Value) | Ghi chú |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | `[URL_SUPABASE_CỦA_BẠN]` | *Lấy từ Supabase Dashboard* |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `[ANON_KEY_CỦA_BẠN]` | *Lấy từ Supabase Dashboard* |
| `DEVELOPER_TOKEN` | `[TOKEN_CỦA_BẠN]` | Token Google Ads |
| `CLIENT_ID` | `[CLIENT_ID_CỦA_BẠN]` | Google OAuth Client ID |
| `CLIENT_SECRET` | `[CLIENT_SECRET_CỦA_BẠN]` | Google OAuth Client Secret |
| `REFRESH_TOKEN` | `[REFRESH_TOKEN_CỦA_BẠN]` | Quyền truy cập Google Ads |
| `MANAGER_CUSTOMER_ID` | `[MCC_ID_CỦA_BẠN]` | ID tài khoản MCC |

---

## 2. Các bước thực hiện trên Vercel

1.  **Liên kết GitHub:** Đưa code của dự án lên một repo GitHub (hoặc GitLab/Bitbucket).
2.  **Import Project:** Trên giao diện Vercel, chọn **Add New > Project**, sau đó chọn repo vừa tạo.
3.  **Cấu hình Build:**
    *   **Framework Preset:** Next.js
    *   **Root Directory:** `./` (hoặc thư mục chứa code nếu anh để trong thư mục con)
4.  **Thêm Environment Variables:** Copy bảng ở mục 1 dán vào.
5.  **Deploy:** Nhấn nút **Deploy** và đợi khoảng 1-2 phút.

---

## 3. Cách kiểm tra sau khi Deploy
Sau khi Vercel báo **Congratulations!**, anh hãy mở link (ví dụ: `https://toiuuggads-web.vercel.app`) và kiểm tra:
1.  **Trang Performance:** Xem biểu đồ có load mượt mà không.
2.  **Nút Analyze:** Thử phân tích một chiến dịch để xem AI hoạt động và kết nối Google Ads ổn định không.
3.  **Landing Page Scan:** Thử nhập một URL và bấm Scan.

---

## 4. Lưu ý về Bảo mật
Dự án được deploy dưới dạng **"Tự xem tự test"**, nên hiện tại các API chưa có lớp bảo mật đăng nhập. 
- **Khuyên dùng:** Nếu anh muốn an toàn hơn, hãy giới hạn tên miền trong phần cấu hình Google Ads API hoặc thêm lớp Basic Auth đơn giản.

---
*Chúc anh deploy thành công! Nếu gặp lỗi gì, cứ gõ `/debug` để em hỗ trợ nhé.*

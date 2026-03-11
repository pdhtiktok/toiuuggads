# ToiuuAds - Custom Google Ads SaaS Engine

Hệ thống tối ưu hóa Google Ads tự động dành cho chuyên gia và đại lý (Agency).

## Chức năng cốt lõi
1. **OAuth2 Connection**: Kết nối an toàn với Google Ads API qua Manager Account (MCC).
2. **Smart Campaign Creator**: 
   - Tự động nghiên cứu từ khóa từ URL.
   - Gợi ý ngân sách thông minh dựa trên giá thầu thị trường.
   - Tự động tạo Chiến dịch (Campaign), Nhóm quảng cáo (AdGroup), và Từ khóa (Keywords).
3. **Negative Lasso**: Tự động chặn các từ khóa rác ngay khi khởi tạo để tiết kiệm ngân sách.
4. **AI Ready**: Cấu trúc sẵn sàng để tích hợp Gemini AI cho việc phân tích Landing Page và viết nội dung RSA.

## Hướng dẫn sử dụng
1. Cấu hình các chìa khóa trong file `.env`.
2. Lấy Refresh Token bằng cách chạy: `node auth_server.js` và truy cập `http://localhost:3000/auth`.
3. Chạy lệnh tạo chiến dịch tự động:
   ```powershell
   node smart_campaign_creator.js <URL_KHACH_HANG> <CUSTOMER_ID>
   ```

## Lộ trình phát triển (Roadmap)
- [ ] Tích hợp AI viết nội dung quảng cáo (RSA Builder).
- [ ] Dashboard Web quản lý tập trung nhiều khách hàng.
- [ ] Hệ thống báo cáo tự động qua Telegram/Email.
- [ ] Script tự động tối ưu hóa giá thầu 24/7.

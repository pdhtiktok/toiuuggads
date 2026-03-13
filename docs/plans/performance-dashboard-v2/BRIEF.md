# 💡 BRIEF: Performance Dashboard V2 (Google Search Ads Focus)

**Ngày tạo:** 2026-03-12
**Brainstorm cùng:** Sếp

---

## 1. VẤN ĐỀ CẦN GIẢI QUYẾT
- Màn hình Performance hiện tại có thiết kế chưa đủ chuyên nghiệp, thiếu thẩm mỹ của một công cụ Data Analytics chuyên sâu.
- Bảng dữ liệu mẫu (Demo Data) đang nghèo nàn, không làm nổi bật được khả năng phân tích, đánh giá, tối ưu chiến dịch thực tế.
- Văn phong của AI phân tích có phần "nịnh nọt", chưa đủ khách quan, điềm đạm và đi thẳng vào nghiệp vụ chuyên môn.

## 2. GIẢI PHÁP ĐỀ XUẤT
- Đập đi xây lại giao diện Performance (Dashboard) theo phong cách Modern Data Dashboard (UI/UX gọn gàng), bổ sung các biểu đồ dữ liệu chuyển động (Line/Bar charts).
- Thiết kế một cấu trúc Mock Data cực kỳ chi tiết, giả lập chặt chẽ dữ liệu chạy thật của Google Search Ads (gồm các nhóm chỉ số: Impr., Clicks, CTR, Avg. CPC, Cost, Conv., CPA).
- Điều chỉnh lại System Prompt của AI để output ra những chẩn đoán sắc bén, chỉ đích danh lỗ hổng ngân sách dựa vào số liệu học được và đề xuất Action xử lý rõ ràng.

## 3. ĐỐI TƯỢNG SỬ DỤNG
- **Chính:** Nhà Quảng cáo, Doanh chủ trực tiếp sử dụng hệ thống.

## 4. TÍNH NĂNG CHÍNH

### 🚀 Tính Năng MVP (Bắt buộc Focus):
- [ ] Khung Giao diện Performance mới (Overview Cards, Main Chart, Detail Tables).
- [ ] Tích hợp thư viện Chart (Recharts/Libraray tương tự) để trực quan hóa số liệu.
- [ ] Render Demo Data chi tiết cho MỘT dự án Search Campaign (có Keyword tốt, Keyword ngốn tiền, Ad Group hoạt động).
- [ ] Khối "AI Diagnostician": Nhận xét khách quan, chuyên nghiệp, không nịnh bợ.

### 🎁 Tính Năng Phase 2 (Mở rộng trong tương lai):
- [ ] Hiển thị Báo Cáo cụm từ tìm kiếm (Search Terms) để chặn từ khóa mới.
- [ ] Hỗ trợ Dashboard phân tích cho các loại Campaign khác (PMax, Display, Video).

## 5. ƯỚC TÍNH SƠ BỘ
- **Độ phức tạp:** Trung Bình. Trọng tâm nằm ở việc render Chart đẹp và thiết kế cấu trúc JSON cho Mock Data đủ phức tạp.

## 6. BƯỚC TIẾP THEO
→ Chạy `/plan` để lên thiết kế chi tiết (Database Schema, UI Component Breakdown).

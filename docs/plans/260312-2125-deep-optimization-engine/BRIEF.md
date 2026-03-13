# 💡 BRIEF: Deep Optimization Engine (Context-Aware + Quality Score)

**Ngày tạo:** 2026-03-12
**Brainstorm cùng:** Sếp

---

## 1. VẤN ĐỀ CẦN GIẢI QUYẾT

### Vấn đề A: Mock Data không đồng bộ theo Account
- Dashboard Performance dùng mock data cứng (hoa sáp) cho tất cả account.
- Khi chuyển sang account khác (ví dụ: LUXURY JEWELRY VN), dữ liệu chart, keyword table, AI diagnostics vẫn hiển thị "hoa sáp" → mất uy tín, vô lý.

### Vấn đề B: Phân tích tối ưu quá nông
- AI Diagnostician hiện chỉ nhìn CPA/Conversions để đưa ra nhận xét.
- Thực tế Google Ads đánh giá keyword qua nhiều yếu tố hơn:
  - **Quality Score** (1-10): Gồm Expected CTR + Ad Relevance + Landing Page Experience
  - **Ad Strength**: Đánh giá độ đa dạng headlines/descriptions
  - **Search Intent Match**: Từ khóa có đúng ý định tìm kiếm không

## 2. GIẢI PHÁP ĐỀ XUẤT

### A. Context-Aware Mock Engine
- Sinh mock data tự động theo tên/ngành nghề của account đang chọn.
- Mock data bao gồm: keywords, chart data, AI diagnostic reports — tất cả đều thay đổi khi switch account.
- Logic: account.name → detect industry → generate relevant mock data set.

### B. Deep Optimization Metrics
- Bổ sung Quality Score (1-10), Expected CTR, Ad Relevance, Landing Page Score vào bảng keyword.
- AI Diagnostician phân tích dựa trên toàn bộ metrics mới, không chỉ CPA.
- Kiến trúc sẵn sàng swap sang real API data khi có kết nối Google Ads thật.

### C. RSA Health Check (Phase sau)
- Phân tích RSA asset diversity (đủ headlines/descriptions chưa).
- Gợi ý cải thiện theo Google RSA best practices 2023.

## 3. ĐỐI TƯỢNG SỬ DỤNG
- **Chính:** Nhà quảng cáo Google Ads, doanh chủ tự chạy ads.
- **Phụ:** Agency quản lý nhiều account khách hàng.

## 4. NGHIÊN CỨU THỊ TRƯỜNG (Từ Google RSA Guide 2023)

### Key Insights áp dụng được:
| Insight | Áp dụng vào tool |
|---------|-------------------|
| Quality Score = f(Expected CTR, Ad Relevance, Landing Page) | Thêm 3 sub-metrics này vào keyword table |
| Ad Strength ≠ Performance (Google nói rõ) | AI cần phân tích conversion > ad strength |
| Diversity of headlines/descriptions tăng reach | RSA Health Check đánh giá diversity |
| Keyword stuffing giảm quality | AI cảnh báo khi keyword density quá cao |
| Landing Page Experience ảnh hưởng QS | Tool nên check landing page relevance |

### Điểm khác biệt của OptimaAds AI:
- Tool khác chỉ hiển thị số liệu → OptimaAds AI **chẩn đoán + đề xuất action**
- Mock Engine thông minh theo ngữ cảnh → demo ấn tượng với mọi ngành

## 5. TÍNH NĂNG

### 🚀 MVP (Bắt buộc):
- [ ] Context-Aware Mock Engine: Sinh data theo account industry
- [ ] Quality Score column (1-10) trong keyword table
- [ ] Expected CTR / Ad Relevance / Landing Page Score indicators
- [ ] AI Diagnostician V2: Phân tích dựa trên full metrics
- [ ] Chart data & keyword data đồng bộ khi switch account

### 🎁 Phase 2 (Làm sau):
- [ ] RSA Health Check & Ad Strength analysis
- [ ] Search Terms Report mock
- [ ] Real Google Ads API integration cho QS

### 💭 Backlog (Cân nhắc):
- [ ] Multi-campaign type support (PMax, Display, Video)
- [ ] Export PDF báo cáo AI diagnostics

## 6. ƯỚC TÍNH SƠ BỘ
- **Độ phức tạp:** Trung bình. Core logic là sinh mock data theo context + render thêm columns.
- **Rủi ro:** Cần đảm bảo data sinh ra đủ realistic, không bị lặp patterns.

## 7. BƯỚC TIẾP THEO
→ Chạy `/plan` để thiết kế chi tiết phases.

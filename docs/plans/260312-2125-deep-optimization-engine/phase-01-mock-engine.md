# Phase 01: Context-Aware Mock Engine
Status: 🔴 Not Started
Dependencies: None

## Objective
Thay thế hệ thống mock data cứng (hardcoded "hoa sáp") bằng engine sinh mock data tự động theo ngành nghề/tên account đang chọn. Khi user switch account, toàn bộ dashboard (chart, keyword table, AI diagnostics) phải thay đổi tương ứng.

## Implementation Steps
1. [ ] Tạo file `src/lib/mockDataEngine.ts` — Industry Detection & Data Generation.
   - Hàm `detectIndustry(accountName: string): Industry` — phân tích tên account → xác định ngành.
   - Định nghĩa type `Industry` với ít nhất 4 ngành mẫu: `jewelry`, `flowers`, `agriculture`, `fashion`.
   
2. [ ] Tạo mock data presets cho mỗi ngành:
   - `generateKeywordPerformance(industry)` → Mảng keyword + Impr, Clicks, CTR, Cost, Conv, CPA, status.
   - `generateChartData(industry)` → Dữ liệu 7 ngày (clicks, cost, conversions, cpa).
   - Mỗi ngành có bộ keyword riêng thực tế (ví dụ: jewelry → "nhẫn bạc 925", "vòng tay vàng 18k"...).

3. [ ] Cập nhật `page.tsx` Dashboard section:
   - Thay `MOCK_DEEP_CHART_DATA` và `MOCK_KEYWORD_PERFORMANCE` cứng → gọi engine.
   - Khi `selectedAccount` thay đổi → re-generate mock data tương ứng.
   - Đảm bảo Key Metrics Cards (Total Spend, Clicks, Conv, CPA) cũng tính từ data mới.

4. [ ] Verify: Chuyển account trên UI → chart, keyword table, metrics cards đều thay đổi theo ngành.

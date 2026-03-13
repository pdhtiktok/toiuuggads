# Phase 02: Quality Score & Deep Metrics
Status: 🔴 Not Started
Dependencies: phase-01

## Objective
Bổ sung các metrics chuyên sâu theo chuẩn Google Ads vào bảng keyword và mock data engine. Gồm: Quality Score (1-10), Expected CTR, Ad Relevance, Landing Page Experience. Tất cả đều sinh tự động theo ngành nghề từ Phase 01.

## Implementation Steps
1. [ ] Mở rộng interface `KeywordPerformance` trong mockDataEngine.ts:
   - Thêm `qualityScore: number` (1-10)
   - Thêm `expectedCtr: 'above' | 'average' | 'below'`
   - Thêm `adRelevance: 'above' | 'average' | 'below'`
   - Thêm `landingPageExp: 'above' | 'average' | 'below'`
   - Logic: keyword "good" → QS 7-9, keyword "bad" → QS 2-4, v.v.

2. [ ] Cập nhật keyword table trong `page.tsx`:
   - Thêm cột "QS" hiển thị score 1-10 với color coding (xanh/vàng/đỏ).
   - Thêm cột "Factors" hiển thị 3 indicators nhỏ (CTR ↑/↓, Relevance ↑/↓, LP ↑/↓).
   - Responsive: trên mobile có thể collapse factors vào tooltip.

3. [ ] Cập nhật Key Metrics Cards:
   - Card "Avg. CPA" → giờ tính thật từ mock data (tổng cost / tổng conv).
   - Thêm hoặc thay 1 card thành "Avg. Quality Score" hiển thị trung bình QS.

4. [ ] Verify: Mỗi keyword hiển thị QS + 3 sub-factors. Chuyển account → QS data cũng thay đổi.

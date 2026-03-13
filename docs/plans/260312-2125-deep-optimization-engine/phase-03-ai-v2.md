# Phase 03: AI Diagnostician V2
Status: 🔴 Not Started
Dependencies: phase-02

## Objective
Nâng cấp AI Diagnostician để phân tích dựa trên toàn bộ metrics mới (Quality Score, Expected CTR, Ad Relevance, Landing Page). Output không chỉ là cảnh báo CPA mà còn đào sâu vào nguyên nhân gốc rễ: tại sao keyword tệ? Do QS thấp? Do ad không relevant? Do landing page?

## Implementation Steps
1. [ ] Tạo hàm `generateAIDiagnostics(industry, keywordData)` trong mockDataEngine.ts:
   - Input: danh sách keyword với full metrics (bao gồm QS, CTR, Relevance, LP).
   - Output: mảng diagnostic cards với cấu trúc: `{ type, severity, title, body, action }`.
   - Logic phân tích:
     a. **Bleeding Alert** (đỏ): Keyword có QS ≤ 3 VÀ CPA cao → "QS quá thấp, Google phạt CPC"
     b. **QS Warning** (cam): Keyword có QS 4-5, expectedCtr = 'below' → "CTR đang kéo QS xuống"
     c. **Relevance Alert** (cam): adRelevance = 'below' → "Ad copy chưa khớp keyword"
     d. **Landing Page Alert** (cam): landingPageExp = 'below' → "Trang đích cần cải thiện"
     e. **Growth Opportunity** (xanh): QS ≥ 8 + Conv cao → "Tăng bid, mở rộng match type"
     f. **Quick Win** (xanh): QS trung bình nhưng có tiềm năng cải thiện LP → "Fix LP để tăng QS"

2. [ ] Cập nhật UI AI Diagnostician trong `page.tsx`:
   - Render diagnostic cards từ hàm mới (thay vì hardcode 3 cards cũ).
   - Mỗi card có badge hiển thị keyword liên quan + QS score.
   - Icon phù hợp theo severity.

3. [ ] Đảm bảo khi switch account → AI diagnostics thay đổi theo data mới.

4. [ ] Văn phong: Giữ nguyên style Senior Data Analyst — điềm đạm, thẳng thắn, dứt khoát. Không nịnh, không vòng vo.

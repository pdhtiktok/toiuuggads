# Phase 02: Budget & Targeting Setup
Status: ✅ Complete
Dependencies: phase-01

## Objective
Thiết lập Tiền đút ống heo (Budget) mỗi ngày và giới hạn vị trí (Targeting) trước khi khởi chạy Campaign lên Google Ads.

## Implementation Steps
1. [x] Ở Keyword Lab, thêm AI Suggestion cho Budget (dựa vào tổng Vol & CPC của bộ từ khóa). Truyền budget gợi ý sang Launch Center.
2. [x] Tại `Launch Center`, thêm section UI "Budget & Location Settings".
3. [x] Thêm Slider hoặc Input để tinh chỉnh số tiền (Daily Budget - VND).
4. [x] Thêm Dropdown chọn Hướng mục tiêu vị trí (Toàn VN, TPHCM, Hà Nội, ...).
5. [x] Cập nhật API Create Campaign để log thông số Budget, Location.

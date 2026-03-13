# Phase 01: Cấu trúc UI & Tích hợp Biểu đồ
Status: ✅ Complete
Dependencies: none

## Objective
Thay đổi giao diện của màn hình Performance hiện tại. Chia layout rõ ràng gồm các thẻ (Cards) tổng quan và khu vực biểu đồ (Charts) để xem tiến độ.

## Implementation Steps
1. [x] Cài đặt thư viện `recharts` (hoặc module tương đương) để vẽ biểu đồ Line/Bar.
2. [x] Thiết kế Layout mới cho tab `Performance` trong UI:
   - Hàng 1: Tổng quan chỉ số chuyên sâu (Cost, Clicks, Conversions, CPA).
   - Hàng 2: Main Chart (Biểu đồ đường) thể hiện biến động 7 ngày qua.
   - Hàng 3: Khung chứa Bảng dữ liệu chi tiết (Detailed Table).
3. [x] Áp dụng triệt để Dark Mode Data Analytics aesthetic cho khối Performance, loại bỏ thiết kế rườm rà.

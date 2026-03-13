# Phase 03: Negative Keywords Lab
Status: ✅ Complete
Dependencies: phase-02

## Objective
Tích hợp hệ thống tự động nhận diện và chặn các từ "rác", từ vựng sai ngữ cảnh dễ gây nhấp chuột tặc từ lúc Scan ban đầu.

## Implementation Steps
1. [x] Ngay tại `KeywordLab.tsx`, tạo tab phụ hoặc khu vực cảnh báo đỏ: "Từ khóa cấm (Negative Keywords)".
2. [x] Gắn thêm Mock Data ở hàm Scan để trả về thêm mảng `negativeKeywords`.
3. [x] Cho phép user tích chọn/không chọn những từ khóa cấm này.
4. [x] Khi ấn gửi qua Launch Center, update banner Launch Center hiển thị rõ "đã duyệt X từ khóa kích hoạt, Y từ khóa cấm".
5. [x] Cập nhật Create Target/API để apply Negative Keyword List.

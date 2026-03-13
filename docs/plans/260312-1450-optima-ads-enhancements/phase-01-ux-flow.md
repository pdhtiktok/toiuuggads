# Phase 01: UX Data Flow
Status: ✅ Complete
Dependencies: None

## Objective
Tự động đồng bộ đường dẫn URL và các thông tin cơ bản từ thao tác quét tại `Keyword Lab` sang `Launch Center`, bỏ thao tác nhập đi nhập lại.

## Implementation Steps
1. [x] Lưu trữ trạng thái `scannedUrl` ở `page.tsx` cấp cao nhất khi quét Keyword Lab.
2. [x] Truyền `scannedUrl` làm giá trị mặc định cho ô Landing Page URL ở Launch Center.
3. [x] Tự động ẩn hoặc vô hiệu hóa ô nhập URL ở Launch Center nếu người dùng đến từ Keyword Lab.
4. [x] Khóa các trường rườm rà khác trong Launch Center (ví dụ: tạo tên campaign tự động dựa theo Website).

# Báo Cáo Bài Tập 4: Mô Phỏng Quy Trình Hotfix & Gitflow Thực Tế

- **Học viên:** Longle183
- **Repository:** [https://github.com/Longle183/Session05_IT209_Ex4](https://github.com/Longle183/Session05_IT209_Ex4)
- **Công nghệ sử dụng:** HTML5, CSS3, JavaScript (Không sử dụng Python).

---

## 1. Bối Cảnh & Mục Tiêu

### 1.1. Bối Cảnh
- Hệ thống **Quản lý Người dùng (User Management System)** đang chạy ở môi trường Production trên nhánh `main` với phiên bản phát hành **`v1.0.0`**.
- Phát hiện lỗ hổng an ninh nghiêm trọng: hàm `getUserById()` trong tệp `app.js` trả về trực tiếp toàn bộ đối tượng người dùng, làm **rò rỉ dữ liệu nhạy cảm** (bao gồm `password_hash`, `ssn`, `secret_token`) ra ngoài phía giao diện người dùng (client).
- Trong khi đó, nhánh phát triển **`develop`** đang trong quá trình xây dựng dở dang tính năng mới (Mô-đun phân tích hoạt động người dùng - `analytics.js`) cho phiên bản tương lai `v1.1.0`, chứa mã nguồn chưa qua kiểm thử đầy đủ nên **tuyệt đối không được phép deploy ngay lên Production**.

### 1.2. Mục Tiêu Thực Hiện
1. Tách nhánh sửa lỗi khẩn cấp **`hotfix/v1.0.1`** trực tiếp từ nhánh **`main`**.
2. Thực hiện vá lỗi bảo mật (lọc sạch thông tin nhạy cảm trước khi trả dữ liệu về giao diện).
3. Gộp nhánh `hotfix/v1.0.1` vào `main` (sử dụng cờ `--no-ff`) và gắn thẻ phiên bản phát hành **`v1.0.1`**.
4. Gộp ngược lại nhánh `hotfix/v1.0.1` vào nhánh **`develop`** để đảm bảo các bản dựng trong tương lai không bị trôi lỗi (regression bug).
5. Xóa nhánh tạm `hotfix/v1.0.1` để giữ kho mã nguồn gọn gàng.

---

## 2. Sơ Đồ Phân Nhánh Gitflow

### 2.1. Sơ Đồ Khái Niệm Gitflow Hotfix (ASCII Diagram)

```text
main      ●─────────────────────────────────────────● (Merge Hotfix & Tag v1.0.1)
         (v1.0.0)                                  / \
            │                                     /   \
            │                         hotfix/v1.0.1    \
            │                         ●─────────────────┘
            │                        /  (Vá lỗ hổng bảo mật)
            │                       /
develop     ●──────────●───────────● (Merge Hotfix vào develop)
          (v1.0.0)     │
                       │
                  feat(analytics)
                  (Tính năng mới dở dang)
```

### 2.2. Đồ Thị Lịch Sử Commit Thực Tế (Git Graph)

```text
*   bd47634 (HEAD -> develop) Merge branch 'hotfix/v1.0.1' into develop - sync security patch
|\  
* | 1c181a5 feat(analytics): Add WIP user metrics module for v1.1.0
| | * 8e9abd2 (tag: v1.0.1, main) Merge branch 'hotfix/v1.0.1' into main
| |/| 
|/|/  
| * b6acf73 fix(hotfix): Prevent sensitive user data leak (password_hash, ssn, secret_token)
|/  
* eab85cc (tag: v1.0.0) Initial commit: Release v1.0.0 - User Management System (HTML/JS)
```

---

## 3. Các Bước Thực Hiện Chi Tiết

### Bước 1: Khởi tạo dự án và phát hành phiên bản Production v1.0.0 trên nhánh `main`
- Xây dựng ứng dụng thuần Web gồm: `index.html`, `style.css`, `app.js` (chứa lỗi rò rỉ dữ liệu).
- Thực hiện commit ban đầu và đánh dấu phiên bản `v1.0.0`:
```bash
git init
git checkout -b main
git add .
git commit -m "Initial commit: Release v1.0.0 - User Management System (HTML/JS)"
git tag -a v1.0.0 -m "Release v1.0.0 - Stable production release"
```

### Bước 2: Tạo nhánh `develop` và phát triển tính năng mới dở dang
- Tách nhánh `develop` từ `main`:
```bash
git checkout -b develop
```
- Bổ sung tệp `analytics.js` (tính năng thống kê đang làm dở):
```bash
git add analytics.js
git commit -m "feat(analytics): Add WIP user metrics module for v1.1.0"
```

### Bước 3: Phát hiện sự cố, tách nhánh `hotfix/v1.0.1` khẩn cấp từ `main`
- Quay về nhánh `main` để tách nhánh hotfix:
```bash
git checkout main
git checkout -b hotfix/v1.0.1
```
- Khắc phục lỗ hổng trong `app.js` bằng cách xây dựng hàm `sanitizeUser()` để loại bỏ hoàn toàn các trường `password_hash`, `ssn`, `secret_token`:
```javascript
// Danh sách các trường nhạy cảm bị nghiêm cấm trả về client
const SENSITIVE_FIELDS = ["password_hash", "ssn", "secret_token"];

function sanitizeUser(user) {
  if (!user) return null;
  const safeProfile = {};
  for (const [key, value] of Object.entries(user)) {
    if (!SENSITIVE_FIELDS.includes(key)) {
      safeProfile[key] = value;
    }
  }
  return safeProfile;
}

function getUserById(id) {
  const rawUser = database.find(user => user.id === id);
  return sanitizeUser(rawUser); // Dữ liệu an toàn đã được lọc sạch
}
```
- Cập nhật số hiệu phiên bản hiển thị trên giao diện `index.html` thành `v1.0.1`.
- Tiến hành commit bản vá:
```bash
git add .
git commit -m "fix(hotfix): Prevent sensitive user data leak (password_hash, ssn, secret_token)"
```

### Bước 4: Gộp `hotfix/v1.0.1` vào nhánh `main` và đánh tag phát hành `v1.0.1`
- Chuyển về nhánh `main`, thực hiện gộp nhánh với cờ `--no-ff` để lưu lại vết merge commit:
```bash
git checkout main
git merge --no-ff hotfix/v1.0.1 -m "Merge branch 'hotfix/v1.0.1' into main"
```
- Gắn thẻ Annotated Tag `v1.0.1`:
```bash
git tag -a v1.0.1 -m "Release Hotfix 1.0.1 - Fix critical security vulnerability"
```

### Bước 5: Gộp ngược lại `hotfix/v1.0.1` vào nhánh `develop`
- Chuyển sang nhánh `develop` và gộp bản vá vào để đồng bộ code:
```bash
git checkout develop
git merge --no-ff hotfix/v1.0.1 -m "Merge branch 'hotfix/v1.0.1' into develop - sync security patch"
```

### Bước 6: Xóa nhánh Hotfix cục bộ sau khi hoàn tất
```bash
git branch -d hotfix/v1.0.1
```

---

## 4. Kết Quả Kiểm Tra (Verification)

### 4.1. Kiểm tra danh sách nhánh (`git branch -a`)
```text
* develop
  main
```
> Nhánh `hotfix/v1.0.1` đã được thu dọn và xóa hoàn toàn sau khi tích hợp.

### 4.2. Kiểm tra danh sách tag (`git tag -n`)
```text
v1.0.0          Release v1.0.0 - Stable production release
v1.0.1          Release Hotfix 1.0.1 - Fix critical security vulnerability
```
> Tag `v1.0.1` được gắn chính xác trên commit gộp mới nhất của nhánh `main`.

### 4.3. Kiểm tra sơ đồ lịch sử gộp nhánh (`git log --graph --oneline --all`)
```text
*   bd47634 (HEAD -> develop) Merge branch 'hotfix/v1.0.1' into develop - sync security patch
|\  
* | 1c181a5 feat(analytics): Add WIP user metrics module for v1.1.0
| | * 8e9abd2 (tag: v1.0.1, main) Merge branch 'hotfix/v1.0.1' into main
| |/| 
|/|/  
| * b6acf73 fix(hotfix): Prevent sensitive user data leak (password_hash, ssn, secret_token)
|/  
* eab85cc (tag: v1.0.0) Initial commit: Release v1.0.0 - User Management System (HTML/JS)
```

---

## 5. Kết Luận & Bài Học Kinh Nghiệm

1. **Tách biệt luồng phát triển và luồng vận hành:** Nhánh `hotfix` cho phép đội ngũ kỹ thuật phản ứng tức thì trước các sự cố bảo mật nghiêm trọng mà không làm gián đoạn hay bị phụ thuộc vào các tính năng đang thử nghiệm dở dang trên nhánh `develop`.
2. **Quy tắc đồng bộ ngược (Back-merge):** Luôn bắt buộc phải gộp nhánh Hotfix ngược về `develop`. Nếu quên bước này, khi phiên bản `v1.1.0` được release trong tương lai, lỗi rò rỉ dữ liệu cũ sẽ bị ghi đè trở lại vào nhánh `main` (hiện tượng trôi lỗi / regression).
3. **Ý nghĩa của cờ `--no-ff` (No Fast-Forward):** Đảm bảo Git luôn sinh ra một Merge Commit, giúp đồ thị nhánh thể hiện tường minh thời điểm tách ra và gộp vào của bản vá, tạo điều kiện thuận lợi cho việc kiểm toán bảo mật và revert khi cần thiết.

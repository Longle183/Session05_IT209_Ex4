/**
 * User Management System - v1.0.1
 * Release Date: Hotfix Security Patch
 * 
 * HOTFIX PATCH (v1.0.1):
 * Đã khắc phục lỗ hổng lộ thông tin người dùng:
 * Tách bỏ toàn bộ các trường nhạy cảm (password_hash, ssn, secret_token)
 * trước khi trả về dữ liệu cho tầng giao diện (client-side).
 */

const database = [
  {
    id: 1,
    name: "Nguyen Van A",
    email: "vana@example.com",
    role: "User",
    password_hash: "$2a$12$e8YkZ1N8...CRITICAL_SECRET_HASH",
    ssn: "001201009988",
    secret_token: "sk_live_998877665544332211"
  },
  {
    id: 2,
    name: "Tran Thi B",
    email: "thib@example.com",
    role: "Admin",
    password_hash: "$2a$12$m7ZkP9X2...ADMIN_SECRET_HASH",
    ssn: "001202007766",
    secret_token: "sk_live_112233445566778899"
  },
  {
    id: 3,
    name: "Le Van C",
    email: "vanc@example.com",
    role: "Moderator",
    password_hash: "$2a$12$q4LmK3R1...MOD_SECRET_HASH",
    ssn: "001203005544",
    secret_token: "sk_live_556677889900112233"
  }
];

// Danh sách các trường nhạy cảm bị nghiêm cấm trả về client
const SENSITIVE_FIELDS = ["password_hash", "ssn", "secret_token"];

function sanitizeUser(user) {
  if (!user) return null;
  // Trích lọc chỉ giữ lại các trường thông tin an toàn công khai
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
  // ĐÃ VÁ LỖI: Làm sạch dữ liệu trước khi trả về
  return sanitizeUser(rawUser);
}

function handleFetchUser() {
  const selectedId = parseInt(document.getElementById("userId").value, 10);
  const user = getUserById(selectedId);
  const outputEl = document.getElementById("output");

  if (user) {
    outputEl.textContent = JSON.stringify(user, null, 2);
  } else {
    outputEl.textContent = "Không tìm thấy người dùng.";
  }
}

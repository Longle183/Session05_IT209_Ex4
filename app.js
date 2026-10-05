/**
 * User Management System - v1.0.0
 * Release Date: Stable Production Release
 * 
 * VULNERABILITY NOTE (v1.0.0):
 * Lỗi nghiêm trọng: Hàm getUserById trả về toàn bộ trường dữ liệu của người dùng,
 * bao gồm cả thông tin nhạy cảm: password_hash, ssn, secret_token.
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

function getUserById(id) {
  // LỖI BẢO MẬT v1.0.0: Trả về trực tiếp object gốc không qua lọc trường nhạy cảm!
  return database.find(user => user.id === id);
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

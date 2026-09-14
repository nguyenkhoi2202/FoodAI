# 🍲 Hôm Nay Ăn Gì? - FoodAI (Trợ Lý Ẩm Thực Google Gemini AI)

Một ứng dụng web thông minh hỗ trợ giải quyết câu hỏi muôn thuở **"Trưa nay ăn gì? Tối nay nấu gì?"**, tích hợp trí tuệ nhân tạo **Google Gemini AI**. Ứng dụng tự động gợi ý món ăn, cân đối định lượng nguyên liệu theo số người, lên danh sách đi chợ và tính toán chi phí chi tiết theo thời giá Việt Nam.

---

## 🌟 Tính Năng Nổi Bật

1. 🎯 **Gợi Ý Theo Sở Thích Thực Tế (5 Câu Hỏi Vàng)**:
   - Thể loại món: Mâm cơm gia đình, Đổi vị món nước, 1 món siêu tốc, Healthy / Eat Clean, Lẩu / Nướng.
   - Khẩu phần & Khung giờ: Tự động chia định lượng nguyên liệu chính xác theo số người ăn.
   - Loại đạm ưa thích: Thịt heo, bò, gà, cá hải sản, trứng đậu phụ hoặc tùy AI chọn.
   - Ngân sách & Vùng miền: Tiết kiệm (<60k), Bình dân (80k-150k), Thịnh soạn (>180k) theo chuẩn vị Bắc, Trung, Nam.
   - Thời tiết & Cảm xúc vị giác: Trời nóng thèm canh chua mát, trời lạnh thèm kho tiêu đậm đà.

2. 🥗 **Chuyên Mục Giảm Cân / Eat Clean / Gymer**:
   - Tùy chọn mục tiêu: Thâm hụt calo giảm mỡ, Eat Clean, Gymer tăng cơ (>40g Protein), Low-Carb / KETO.
   - Tính toán chi tiết Bảng Chỉ Số Macro: **Calories · Protein (Đạm) · Carbs (Tinh bột tốt) · Fat (Chất béo)**.

3. 🎰 **Vòng Quay May Mắn (Lucky Food Wheel)**:
   - Hiệu ứng quay số mượt mà kèm pháo hoa Confetti 🎉 khi không muốn nghĩ nhiều.
   - 1-Click để AI lên ngay công thức & danh sách đi chợ cho món quay trúng.

4. 🧊 **Dọn Sạch Tủ Lạnh (Zero Food Waste)**:
   - Nhập hoặc chọn các nguyên liệu còn thừa trong nhà, AI sẽ kết hợp thành món ngon nhất mà không cần đi chợ.

5. 🍱 **Mâm Cơm 3 Món Chuẩn Vị Việt**:
   - Combo kinh điển: **[1 Món Mặn] + [1 Món Canh] + [1 Món Xào/Rau]** cân bằng vị giác và dinh dưỡng.

6. 🛒 **Danh Sách Đi Chợ Thông Minh**:
   - Checklist tick chọn nguyên liệu đã mua, kèm nút **"Chép gửi Zalo"** tiện lợi.

7. 👨‍🍳 **Popup Hoạt Họa Bếp Trưởng AI Đang Suy Nghĩ**:
   - Hiệu ứng hoạt họa vui nhộn, hiển thị từng bước tính toán calo và công thức theo thời gian thực.

---

## 🛡️ Kiến Trúc Phân Quyền 2 Roles

- **Role 1: Người Dùng Thường (`/`)**:
  - Giao diện sạch sẽ, thân thiện, không lộ bất kỳ cài đặt hay khóa API nào.
- **Role 2: Quản Trị Viên (`/config`)**:
  - Được bảo mật bằng mật khẩu: **`2202`**.
  - Cho phép nhập Google Gemini API Key, chọn model (`gemini-2.0-flash`, `gemini-3.8-flash`, `gemini-1.5-flash`...).
  - Công cụ quét model trực tiếp từ tài khoản Google và kiểm tra kết nối (Test Connection).

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### Yêu Cầu:
- Node.js >= 18
- Trình duyệt hiện đại

### Cài Đặt:
```bash
# Cài đặt dependencies
npm install

# Chạy môi trường phát triển (Dev)
npm run dev

# Build sản phẩm hoàn chỉnh (Production)
npm run build
```

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide Icons, Canvas Confetti
- **AI Engine**: Google Gemini API (`gemini-2.0-flash`, `gemini-3.8-flash`, `gemini-1.5-flash`)
- **Storage**: Browser LocalStorage & SessionStorage

---

*Phát triển bởi [nguyenkhoi2202](https://github.com/nguyenkhoi2202) với sự hỗ trợ của Google Antigravity.*

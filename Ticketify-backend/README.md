
//Cấu trúc file và vai trò của từng file trong project
```.
├── node_modules/                    # Thư viện cài từ npm (tự động tạo)
│
├── src/                             # Thư mục chính chứa mã nguồn backend
│   ├── config/                      # Cấu hình hệ thống (DB, third-party...)
│   │   └── db.js                    # Kết nối PostgreSQL dùng Pool + biến môi trường
│
│   ├── controllers/                 # Xử lý logic cho các request (business logic)
│   │   └── user.controller.js       # Controller cho các API user: login, register,...
│
│   ├── middlewares/                 # Các hàm trung gian chạy trước khi tới controller
│   │   ├── auth.js                  # Xác thực người dùng qua JWT
│   │   ├── errorHandle.js           # Bắt và xử lý lỗi chung
│   │   ├── logger.js                # Ghi log request (nếu có)
│   │   ├── role.js                  # Middleware kiểm tra quyền (admin, user...)
│   │   └── validate.js              # Kiểm tra dữ liệu đầu vào (body, params...)
│
│   ├── models/                      # Định nghĩa model tương ứng với bảng DB
│   │   └── user.model.js            # Model đại diện cho bảng `users`
│
│   ├── routes/                      # Định nghĩa endpoint và mapping đến controller
│   │   └── user.routes.js           # Route cho user: POST /login, GET /profile,...
│
│   ├── utils/                       # Hàm tiện ích dùng chung trong toàn project
│   │   ├── hash.js                  # Mã hóa và so sánh password với bcrypt
│   │   ├── jwt.js                   # Tạo và kiểm tra JWT token
│   │   └── app.js                   # Tạo đối tượng Express app, gắn middleware, routes
│
├── .env                             # Lưu biến môi trường như DB, PORT, JWT_SECRET
├── .env.example                     # Tài liệu các biến môi trường cho lập trình viên khác tham khảo như DB, PORT, JWT_SECRET
├── .gitignore                       # Bỏ qua file/thư mục không đẩy lên Git (node_modules, .env,...)
├── package.json                     # Thông tin project + dependencies + scripts
├── package-lock.json                # Ghi chính xác phiên bản package được cài
├── README.md                        # Tài liệu mô tả project: cấu trúc, cách chạy,...
└── server.js                        # Entry point khởi động server (import từ app.js)
```
//

- Node.js  
- Express  
- PostgreSQL  
- Sequelize (ORM)
- JWT (Authentication)  
- dotenv  
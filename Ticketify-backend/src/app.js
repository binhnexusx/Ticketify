const express = require("express");
const cors = require("cors");
const path = require("path");
const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandle");
const app = express();
app.disable('etag');
require("./jobs/bookingStatusJob");

const adminRoutes = require("./routes/admin.routes");
const authRoutes = require("./routes/auth.routes");
const roomRoutes = require("./routes/room.routes");
const bookingRoutes = require("./routes/booking.routes");
const floorRoutes = require("./routes/floor.routes");
const amenityRoutes = require("./routes/amenity.routes");
const userRoutes = require("./routes/user.routes");
const dealRoutes = require("./routes/deal.routes");
const paymentRoutes = require("./routes/payment.routes");
const profileRoutes = require("./routes/profile.routes");
const { updateAllDealStatuses } = require("./schedulers/scheduler");
const feedbackRoutes = require("./routes/feedback.routes");
const homeRoutes = require("./routes/home.routes");
const cron = require("node-cron");
// Serve ảnh trong public/uploads qua đường dẫn /uploads
app.use(
  "/uploads/rooms",
  express.static(path.join(__dirname, "public/uploads/rooms"))
);
app.use(
  "/uploads/amenities",
  express.static(path.join(__dirname, "public/uploads/amenities"))
);
app.use(
  "/uploads/avatars",
  express.static(path.join(__dirname, "public/uploads/avatars"))
);

// Thiết lập Cron job để chạy mỗi ngày vào lúc 00:00
cron.schedule("0 0 * * *", () => {
  console.log("Cập nhật trạng thái deal...");
  updateAllDealStatuses().catch((error) => {
    console.error("Error updating deal statuses:", error.message);
  });
});
updateAllDealStatuses()
  .then(() => {
    console.log("Đã cập nhật trạng thái deal khi khởi động app.");
  })
  .catch((error) => {
    console.error("Lỗi khi cập nhật deal lúc khởi động:", error.message);
  });
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(errorHandler);

app.use("/api/", roomRoutes);
app.use("/api", adminRoutes);
app.use("/api", authRoutes);
app.use("/api", bookingRoutes);
app.use("/api", floorRoutes);
app.use("/api", amenityRoutes);
app.use("/api", userRoutes);
app.use("/api", dealRoutes);
app.use("/api", paymentRoutes);
app.use("/api", profileRoutes);
app.use("/api/feedbacks", feedbackRoutes);
app.use("/api/homepage", homeRoutes);
module.exports = app;
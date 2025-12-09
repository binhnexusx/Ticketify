const express = require("express");
const router = express.Router();
const roomController = require("../controllers/room.controller");
const {
  validateRoom,
  validateRoomId,
} = require("../validations/room.validate");
const { authenticateToken } = require("../middlewares/auth");
const { adminOnly } = require("../middlewares/role");
const upload = require("../utils/upload");
const {
  getUserListController,
  getCheckinGuestsController,
  getCheckoutGuestsController,
  getAdminDashboardStatusController,
  getAdminDashboardDealController,
  getFeedbackController,
  getTop5MostBookedRoomsController,
  getHotelFeedbackController,
  getGuestListController,
  updateUserStatusController,
  getRateController,
  getRateDetailController
} = require("../controllers/admin.controller");
router.use(authenticateToken, adminOnly);

const roomDealController = require("../controllers/roomDeal.controller");

router.get("/admin/rooms/", roomController.getAllRooms);
router.get("/admin/rooms/:id", validateRoomId, roomController.getRoomById);
router.post(
  "/admin/rooms/",
  // validateRoom,
  upload.multiImages,
  roomController.createRoom
);
router.put(
  "/admin/rooms/:id",
  // validateRoomId,
  // validateRoom,
  upload.multiImages,
  roomController.updateRoom
);
router.delete("/admin/rooms/:id", validateRoomId, roomController.deleteRoom);

router.get("/admin/booking-list", getUserListController);

router.get("/admin/checkin-guests", getCheckinGuestsController);

router.get("/admin/checkout-guests", getCheckoutGuestsController);

router.get("/admin/dashboard-status", getAdminDashboardStatusController);

router.get("/admin/dashboard-deals", getAdminDashboardDealController);

router.get("/admin/dashboard-feedback", getFeedbackController);

router.get("/admin/dashboard-hotel-feedback", getHotelFeedbackController);

router.get("/admin/dashboard-most-booked", getTop5MostBookedRoomsController);

router.get("/admin/guest-list", getGuestListController);

router.patch("/admin/users/:user_id/status", updateUserStatusController);

router.get("/admin/rate", getRateController);

router.get("/admin/rate-detail/:room_id", getRateDetailController);

router.post("/admin/rooms/:room_id/deal", roomDealController.assignDealToRoom);

router.get("/admin/rooms/status/:status", roomController.getRoomsByStatus);

router.put("/admin/rooms/:id/remove-deal", roomController.removeDealFromRoom);

module.exports = router;

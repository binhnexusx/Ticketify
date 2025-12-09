const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/auth");
const {
  getFavoriteRoomController,
  createHotelFeedbackController,
  deleteFavoriteRoomController,
  addFavoriteRoomController,
  createRoomFeedbackController,
} = require("../controllers/profile.controller");

router.post("/profile/hotel-feedback", createHotelFeedbackController);

router.post(
  "/profile/room-feedback",
  authenticateToken,
  createRoomFeedbackController
);

router.get(
  "/profile/favorite_rooms",
  authenticateToken,
  getFavoriteRoomController
);

router.delete(
  "/profile/delete-favorite-room/:room_id",
  authenticateToken,
  deleteFavoriteRoomController
);

router.post(
  "/profile/add-favorite-room/:room_id",
  authenticateToken,
  addFavoriteRoomController
);

module.exports = router;

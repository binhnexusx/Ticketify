const express = require("express");
const router = express.Router();
const roomController = require("../controllers/room.controller");
router.get("/rooms", roomController.getAllRooms);
router.get("/rooms/filter", roomController.filterRooms);
router.get("/rooms/:id/details", roomController.getRoomDetail);
router.get("/rooms/filter-options", roomController.getFilterOptions);
router.get("/front-desk/check-available/filter", roomController.filterRooms);

module.exports = router;

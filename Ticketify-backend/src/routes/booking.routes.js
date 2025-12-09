const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller");
const authenticate = require("../middlewares/auth");
const validateParams = require("../middlewares/validateParams");
const { bookingIdParamSchema } = require("../validations/booking.validate");
const {
  getBookingSummaryDetailController,
} = require("../controllers/booking.controller");

router.post("/bookings", authenticate, bookingController.createBooking);
router.get(
  "/bookings/user/:user_id",
  authenticate,
  bookingController.getBookingDetailsByUserIdController
);
router.get("/bookings/all", bookingController.getAllBookingDetailsController);

router.get(
  "/bookings/:booking_id",
  authenticate,
  bookingController.getBookingDetailbyId
);
router.patch(
  "/bookings/:booking_id/confirm",
  authenticate,
  validateParams(bookingIdParamSchema),
  bookingController.confirmBookingController
);
router.get(
  "/booking-details/:booking_detail_id",
  getBookingSummaryDetailController
);
router.post("/booking/auto-status", bookingController.handleAutoUpdateStatus);
router.get(
  "/rooms/:roomId/disabled-dates",
  bookingController.getDisabledDatesController
);

//Admin
router.post(
  "/bookings/front-desk",
  authenticate,
  bookingController.frontDeskCreateBooking
);
module.exports = router;

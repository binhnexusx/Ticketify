const roomRepository = require("../repositories/room.repository");
const bookingService = require("../services/booking.service");
const { validateBookingInput } = require("../validations/booking.validate");
const { success, sendError } = require("../utils/response");
const validateParams = require("../middlewares/validateParams");
const userService = require("../services/user.service");

// Create booking
const createBooking = async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate } = req.body;
    const userId = req.user?.user_id || req.user?.id;
    const errors = await validateBookingInput({
      roomId,
      checkInDate,
      checkOutDate,
    });

    if (errors.length > 0) {
      return sendError(res, 400, "Room not available for booking", errors);
    }

    const room = await roomRepository.getRoomDetail(roomId);
    if (!room) {
      return sendError(res, 404, "Room not found");
    }
    
    const booking = await bookingService.createBookingWithDetails(
      userId,
      room,
      checkInDate,
      checkOutDate
    );

    return success(
      res,
      {
        booking_id: booking.booking_id,
        user_id: userId,
      },
      "Booking created successfully",
      201
    );
  } catch (err) {
    console.error("Booking error:", err);
    return sendError(res, 500, "Server error", [err.message]);
  }
};
// get booking detail
const getBookingDetailsByUserIdController = async (req, res) => {
  try {
    const user_id = parseInt(req.params.user_id, 10);
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const status = req.query.status || undefined;

    if (isNaN(user_id)) {
      return sendError(res, 400, "Invalid user ID", [
        "user_id must be a number",
      ]);
    }

    const data = await bookingService.getBookingDetailsByUserId(
      user_id,
      page,
      limit,
      status
    );

    return success(res, data, "Get bookings for user successfully");
  } catch (err) {
    return sendError(res, 404, "No bookings found for this user", [
      err.message,
    ]);
  }
};

const getBookingDetailbyId = async (req, res) => {
  const booking_id = Number(req.params.booking_id);
  console.log("Booking ID from params:", booking_id);

  if (isNaN(booking_id)) {
    return sendError(res, 400, "Invalid booking ID");
  }

  try {
    const bookingList = await bookingService.getBookingDetailsById(booking_id);

    if (!bookingList || bookingList.length === 0) {
      return sendError(res, 404, "Booking not found");
    }

    const booking = bookingList;
    return success(res, booking, "Booking fetched successfully");
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Internal Server Error");
  }
};

const confirmBookingController = async (req, res) => {
  try {
    const result = await bookingService.confirmBookingService(
      req.params.booking_id
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBookingSummaryDetailController = async (req, res) => {
  try {
    const booking_detail_id = parseInt(req.params.booking_detail_id);
    const data = await bookingService.getBookingSummaryDetailService(
      booking_detail_id
    );
    return success(res, data, "Get booking summary by detail_id successfully");
  } catch (err) {
    return sendError(res, 404, "Booking detail not found", [err.message]);
  }
};

const handleAutoUpdateStatus = async (req, res) => {
  try {
    const checkinCount = await bookingService.autoUpdateCheckinStatus();
    const checkoutCount = await bookingService.autoUpdateCheckoutStatus();

    return success(
      res,
      { checkinCount, checkoutCount },
      "Booking status updated"
    );
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Failed to auto-update booking status");
  }
};

const getAllBookingDetailsController = async (req, res) => {
  try {
    const data = await bookingService.getAllBookingDetailsService();
    return success(res, data, "Fetched all booking details successfully");
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách bookings:", err);
    return sendError(res, 500, "Failed to fetch bookings", [err.message]);
  }
};

const getDisabledDatesController = async (req, res) => {
  console.log("req.params:", req.params);

  const roomId = Number(req.params.roomId);
  if (isNaN(roomId)) {
    return res.status(400).json({ status: "error", message: "Invalid roomId" });
  }

  console.log("roomId:", roomId);
  try {
    const dates = await bookingService.getDisabledDates(roomId);
    return success(res, dates, "Select date successfully!");
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "failed to select date!");
  }
};

const frontDeskCreateBooking = async (req, res) => {
  try {
    console.log("------- BODY RECEIVED FROM FE -------");
    console.log(req.body);

    const { roomId, checkInDate, checkOutDate, firstName, lastName, phone, email, status, name } =
      req.body;

    console.log("📥 Frontdesk input:", {
      roomId,
      checkInDate,
      checkOutDate,
      firstName,
      lastName,
      phone,
      email,
      status,
      name
    });

    let customerUserId;

    const existedUser = await userService.getUserByEmail(email);

    if (existedUser) {
      customerUserId = existedUser.user_id;
      console.log("👉 Existing user:", customerUserId);
    } else {
      const newUser = await userService.createUser({
        name: `${firstName} ${lastName}`,
        first_name: firstName,
        last_name: lastName,
        phone,
        email,
        password: "123456",
        role: "user",
      });
      customerUserId = newUser.user_id;
      console.log("✅ Created new user:", customerUserId);
    }

    const errors = await validateBookingInput({
      roomId,
      checkInDate,
      checkOutDate,
    });
    if (errors.length > 0) {
      return sendError(res, 400, "Room not available for booking", errors);
    }
    const room = await roomRepository.getRoomDetail(roomId);
    if (!room) return sendError(res, 404, "Room not found");

    const booking = await bookingService.createBookingWithDetails(
      customerUserId,
      room,
      checkInDate,
      checkOutDate,
      status
    );
    console.log("✅ Booking created", booking);

    return success(
      res,
      {
        booking_id: booking.booking_id,
        user_id: customerUserId,
        status: booking.status,
      },
      "Front-desk booking created successfully",
      201
    );
  } catch (err) {
    console.error("❌ frontDeskCreateBooking error:", err);
    return sendError(res, 500, err.message || "Server error");
  }
};

module.exports = {
  createBooking,
  createBooking,
  getBookingDetailsByUserIdController,
  getBookingDetailbyId,
  confirmBookingController,
  getBookingSummaryDetailController,
  handleAutoUpdateStatus,
  getAllBookingDetailsController,
  getDisabledDatesController,
  frontDeskCreateBooking
};

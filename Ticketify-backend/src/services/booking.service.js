const pool = require("../config/db");
const bookingRepo = require("../repositories/booking.repository");
const dayjs = require("../utils/dayjs");

const createBookingWithDetails = async (
  userId,
  room,
  checkIn,
  checkOut,
  status
) => {
  const checkInDate = dayjs(checkIn).startOf("day");
  const checkOutDate = dayjs(checkOut).startOf("day");

  const nights = checkOutDate.diff(checkInDate, "day");

  if (nights <= 0) {
    throw new Error("Check-out must be after check-in");
  }

  const discountRate = await bookingRepo.getDiscountRateByRoomId(
    room.room_id,
    checkIn,
    checkOut
  );

  const pricePerNight = room.price;
  const originalPrice = pricePerNight * nights;
  const discountAmount = originalPrice * discountRate;
  const totalPrice = parseFloat((originalPrice - discountAmount).toFixed(2));
  // console.log({
  //   checkInDate,
  //   checkOutDate,
  //   pricePerNight,
  //   nights,
  //   discountRate,
  //   originalPrice,
  //   discountAmount,
  //   totalPrice,
  // });


  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const bookingId = await bookingRepo.createBooking(
      userId,
      totalPrice,
      client,
      status || "booked"
    );

    const checkInTimestamp = dayjs(checkIn)
      .hour(14)
      .minute(0)
      .second(0)
      .millisecond(0)
      .toDate();

    const checkOutTimestamp = dayjs(checkOut)
      .hour(12)
      .minute(0)
      .second(0)
      .millisecond(0)
      .toDate();

    await bookingRepo.createBookingDetail(
      bookingId,
      {
        roomId: room.room_id,
        pricePerUnit: pricePerNight,
        checkIn,
        checkOut,
        checkInTimestamp,
        checkOutTimestamp,
      },
      client
    );

    await client.query("COMMIT");

    return {
      booking_id: bookingId,
      total_price: totalPrice,
      nights,
      status: status || "booked",
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

const getBookingDetailsByUserId = async (
  user_id,
  page = 1,
  limit = 5,
  status
) => {
  const rows = await bookingRepo.getBookingInfoById(user_id);

  // if (rows.length === 0) throw new Error("No bookings found for this user");

  const groupedBookings = {};
  rows.forEach((r) => {
    const bookingId = r.booking_id;
    const checkInDate = new Date(r.check_in_date);
    const checkOutDate = new Date(r.check_out_date);
    const nights = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
    const quantity = Number(r.quantity || 1);

    if (!groupedBookings[bookingId]) {
      groupedBookings[bookingId] = {
        booking_id: r.booking_id,
        user_id: r.user_id,
        status: r.booking_status,
        check_in_date: r.check_in_date,
        check_out_date: r.check_out_date,
        nights,
        total_price: 0,
        total_discounted_price: 0,
        booking_details: [],
      };
    }

    const unit_price =
      Number(r.room_type_price || 0) + Number(r.room_level_price || 0);
    const discounted_unit_price = Number(r.discounted_unit_price || unit_price);

    const detailPrice = unit_price * quantity * nights;
    const discountedPrice = discounted_unit_price * quantity * nights;

    groupedBookings[bookingId].total_price += detailPrice;
    groupedBookings[bookingId].total_discounted_price += discountedPrice;

    groupedBookings[bookingId].booking_details.push({
      booking_detail_id: r.booking_detail_id,
      room_description: r.room_description,
      room_id: r.room_id,
      room_name: r.room_name,
      room_type: r.room_type,
      room_type_price: r.room_type_price,
      room_level: r.room_level,
      room_image: Array.isArray(r.room_images) ? r.room_images[0] : null,
      room_level_price: r.room_level_price,
      quantity,
      unit_price,
      discounted_unit_price,
      deal_discount_rate: r.discount_rate,
      deal_name:r.deal_name,
      price_per_unit: r.price_per_unit,
    });
  });

  const bookingsArray = Object.values(groupedBookings).map((b) => ({
    ...b,
    total_price: Number(b.total_price.toFixed(2)),
    total_discounted_price: Number(b.total_discounted_price.toFixed(2)),
    room_quantity: b.booking_details.length,
  }));

  bookingsArray.sort((a, b) => b.booking_id - a.booking_id);
  const filtered = status
    ? bookingsArray.filter((b) => b.status === status)
    : bookingsArray;

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paginatedData = filtered.slice(start, start + limit);

  return {
    total,
    totalPages,
    page,
    limit,
    data: paginatedData,
  };
};

const getBookingDetailsById = async (booking_id) => {
  const rows = await bookingRepo.getBookingById(booking_id);

  if (rows.length === 0)
    throw new Error("No bookings found for this booking_id");

  const groupedBookings = {};

  rows.forEach((r) => {
    const bookingId = r.booking_id;
    const checkInDate = new Date(r.check_in_date);
    const checkOutDate = new Date(r.check_out_date);
    const nights =
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24);
    const quantity = Number(r.quantity || 1);

    if (!groupedBookings[bookingId]) {
      groupedBookings[bookingId] = {
        booking_id: r.booking_id,
        user_id: r.user_id,
        status: r.booking_status,
        check_in_date: r.check_in_date,
        check_out_date: r.check_out_date,
        nights,
        total_price: 0,
        total_discounted_price: 0,
        booking_details: [],
      };
    }

    const unit_price =
      Number(r.room_type_price || 0) + Number(r.room_level_price || 0);
    const discounted_unit_price = Number(r.discounted_unit_price || unit_price);
    const detailPrice = unit_price * quantity * nights;
    const discountedPrice = discounted_unit_price * quantity * nights;

    groupedBookings[bookingId].total_price += detailPrice;
    groupedBookings[bookingId].total_discounted_price += discountedPrice;

    groupedBookings[bookingId].booking_details.push({
      room_id: r.room_id,
      room_name: r.room_name,
      room_type: r.room_type,
      room_type_price: r.room_type_price,
      room_level: r.room_level,
      room_image: Array.isArray(r.room_images) ? r.room_images[0] : null,
      room_level_price: r.room_level_price,
      quantity,
      unit_price,
      discounted_unit_price,
      deal_discount_rate: r.discount_rate,
      price_per_unit: r.price_per_unit,
    });
  });

  const booking = Object.values(groupedBookings)[0];

  return {
    ...booking,
    total_price: Number(booking.total_price.toFixed(2)),
    total_discounted_price: Number(booking.total_discounted_price.toFixed(2)),
    room_quantity: booking.booking_details.length,
  };
};

const confirmBookingService = async (booking_id) => {
  const result = await bookingRepo.updateBookingStatusToConfirmed(booking_id);

  if (result.affectedRows === 0) {
    throw new Error("Booking not found");
  }

  return {
    success: true,
    message: "Booking confirmed successfully",
  };
};

const getBookingSummaryDetailService = async (booking_detail_id) => {
  const data = await bookingRepo.getBookingSummaryById(booking_detail_id);
  if (!data) throw new Error("Booking detail not found");
  return data;
};
const autoUpdateCheckinStatus = async () => {
  const now = dayjs();
  const today = now.format("YYYY-MM-DD");

  const bookings = await bookingRepo.getBookingsForAutoCheckin(today);

  for (const booking of bookings) {
    await bookingRepo.updateStatus(booking.booking_id, "checked_in");
  }

  return bookings.length;
};

const autoUpdateCheckoutStatus = async () => {
  const now = new Date();
  const vietnamDate = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
  );

  const todayDateOnly = vietnamDate.toISOString().split("T")[0];

  const bookings = await bookingRepo.getBookingsForAutoCheckout(todayDateOnly);

  for (const booking of bookings) {
    await bookingRepo.updateStatus(booking.booking_id, "checked_out");
  }

  return bookings.length;
};
const getAllBookingDetailsService = async () => {
  return await bookingRepo.getAllBookingsWithDetails();
};

const getDisabledDates = async (roomId) => {
  const rawDates = await bookingRepo.getDisabledDatesByRoomId(roomId);

  return rawDates.map((row) => ({
    from: row.check_in,
    to: row.check_out,
  }));
};



module.exports = {
  createBookingWithDetails,
  getBookingDetailsByUserId,
  getBookingDetailsById,
  confirmBookingService,
  getBookingSummaryDetailService,
  autoUpdateCheckinStatus,
  autoUpdateCheckoutStatus,
  getAllBookingDetailsService,
  getDisabledDates,
};

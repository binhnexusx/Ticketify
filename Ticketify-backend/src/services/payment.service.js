const bookingRepo = require("../repositories/booking.repository");
const paymentRepo = require("../repositories/payment.repository");
const userRepo = require("../models/auth.model");
const {
  updateStatusById,
  updateRoomStatusByBookingId,
} = require("../models/booking.model");
const db = require("../config/db");
const { sendBookingEmail } = require("../utils/emailService");
const dayjs = require("dayjs");

const handleSuccess = async ({
  booking_id,
  method,
  amount,
  card_name,
  card_number,
  exp_date,
}) => {
  const booking = await bookingRepo.findById(booking_id);
  if (!booking) {
    throw new Error("Booking not found");
  }

  const existedPayment = await paymentRepo.checkPaymentExists(booking_id);
  if (existedPayment) {
    throw new Error("This booking has already been paid.");
  }

  await updateStatusById(booking_id, "booked");
  // await updateRoomStatusByBookingId(booking_id, "booked");
  await bookingRepo.updatePaymentStatusById(booking_id, "paid");

  const paymentRecord = await paymentRepo.createPayment({
    booking_id,
    amount,
    card_name,
    card_number,
    exp_date,
    method,
    paid_at: new Date(),
  });

  const user = await userRepo.getUserById(booking.user_id);
  if (!user) throw new Error("User not found");

  const userBookings = await bookingRepo.getBookingInfoById(booking.user_id);
const newestBooking = [...userBookings].sort((a, b) => b.booking_id - a.booking_id)[0];
  // console.log("n:", newestBooking);

  const checkInDate = dayjs(newestBooking.check_in_date);
  const checkOutDate = dayjs(newestBooking.check_out_date);

  const checkInFormatted = `${checkInDate.format("YYYY-MM-DD")}`;
  const checkOutFormatted = `${checkOutDate.format(
    "YYYY-MM-DD"
  )}`;

  const nights = checkOutDate.diff(checkInDate, "day");

  const room = {
    room_type_name: newestBooking.room_type,
    room_level_name: newestBooking.room_level,
  };

  const emailPayload = {
    user: {
      email: user.email,
      name:
        `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Guest",
    },
    booking: {
      booking_id: newestBooking.booking_id.toString(),
      check_in_date: checkInFormatted,
      check_out_date: checkOutFormatted,
    },
    room,
    total_price: Number(
      newestBooking.discounted_unit_price
    ),
    nights,
  };

  await sendBookingEmail(emailPayload);
  // console.log(emailPayload);
  return paymentRecord;
};

const getPaymentByBookingId = async (booking_id) => {
  const { rows } = await db.query(
    "SELECT card_name, card_number, exp_date, method FROM payments WHERE booking_id = $1 ORDER BY paid_at DESC LIMIT 1",
    [booking_id]
  );
  return rows[0] || null;
};

const updateOrCreatePayment = async (booking_id, data) => {
  const { card_name, card_number, exp_date, method } = data;
  const { rows: existing } = await db.query(
    "SELECT * FROM payments WHERE booking_id = $1",
    [booking_id]
  );
  if (existing.length > 0) {
    await db.query(
      `UPDATE payments 
       SET card_name=$1, card_number=$2, exp_date=$3, method=$4
       WHERE booking_id=$5`,
      [card_name, card_number, exp_date, method, booking_id]
    );
  } else {
    await db.query(
      `INSERT INTO payments (booking_id, card_name, card_number, exp_date, method)
       VALUES ($1, $2, $3, $4, $5)`,
      [booking_id, card_name, card_number, exp_date, method]
    );
  }
  return getPaymentByBookingId(booking_id);
};

module.exports = {
  handleSuccess,
  getPaymentByBookingId,
  updateOrCreatePayment,
};

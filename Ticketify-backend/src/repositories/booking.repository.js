const pool = require("../config/db");
const bookingModel = require("../models/booking.model");

async function createBooking(userId, totalPrice, client,status) {
  const { rows } = await client.query(
    `INSERT INTO bookings (user_id, total_price, status)
     VALUES ($1, $2, $3) RETURNING booking_id`,
    [userId, totalPrice, status]
  );
  return rows[0].booking_id;
}

async function createBookingDetail(bookingId, detail, client) {
  try {
    const {
      roomId,
      pricePerUnit,
      checkIn,
      checkOut,
      checkInTimestamp,
      checkOutTimestamp,
    } = detail;

    await client.query(
      `INSERT INTO booking_details
       (booking_id, room_id, price_per_unit, check_in_date, check_out_date, check_in_timestamp, check_out_timestamp)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        bookingId,
        roomId,
        pricePerUnit,
        checkIn || null,
        checkOut || null,
        checkInTimestamp || null,
        checkOutTimestamp || null,
      ]
    );
  } catch (err) {
    console.error("Failed to insert booking detail:", err.message);
    throw err;
  }
}

const getDiscountRateByRoomId = async (roomId) => {
  const { rows } = await pool.query(
    `SELECT d.discount_rate
     FROM rooms r
     JOIN deals d ON r.deal_id = d.deal_id
     WHERE r.room_id = $1
       AND d.status = 'Ongoing'
     LIMIT 1`,
    [roomId]
  );
  return rows[0]?.discount_rate || 0;
};

const getBookingInfoById = async (user_id) => {
  return await bookingModel.getBookingByUserId(user_id);
};
const getBookingById = async (booking_id) => {
  return await bookingModel.getBookingById(booking_id);
};

const findById = async (bookingId) => {
  const result = await pool.query(
    `SELECT * FROM bookings WHERE booking_id = $1`,
    [bookingId]
  );
  return result.rows[0] || null;
};

const updateBookingStatusToConfirmed = async (bookingId) => {
  try {
    const result = await bookingModel.updateStatusById(bookingId, "booked");
    return result;
  } catch (error) {
    console.error("❌ Error updating booking status:", error);
    throw error;
  }
};

const getBookingSummaryById = async (bookingDetailId) => {
  return await bookingModel.getBookingSummaryByDetailId(bookingDetailId);
};

const updatePaymentStatusById = async (bookingId) => {
  const query = `UPDATE bookings SET status = 'booked' WHERE booking_id = $1`;
  const result = await pool.query(query, [bookingId]);
  return result.rowCount > 0;
};

const getBookingsForAutoCheckin = async (currentDate) => {
  return await bookingModel.findBookingsForAutoCheckin(currentDate);
};

const getBookingsForAutoCheckout = async (currentDate) => {
  return await bookingModel.findBookingsForAutoCheckout(currentDate);
};

const updateStatus = async (bookingId, status) => {
  return await bookingModel.updateBookingStatus(bookingId, status);
};

const getAllBookingsWithDetails = async () => {
  const query = `
    SELECT
      b.booking_id,
      u.name AS user_name,
      r.name AS room_name,
      bd.check_in_date,
      bd.check_out_date,
      b.status
    FROM bookings b
    JOIN booking_details bd ON b.booking_id = bd.booking_id
    JOIN "users" u ON b.user_id = u.user_id
    JOIN rooms r ON bd.room_id = r.room_id
    ORDER BY bd.check_in_date;
  `;
  try {
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách booking chi tiết:", error);
    throw error;
  }
};

const getDisabledDatesByRoomId = async (roomId) => {
  const { rows } = await pool.query(
    `
SELECT 
  bd.check_in_timestamp AS check_in,
  bd.check_out_timestamp AS check_out
FROM booking_details bd
JOIN bookings b ON bd.booking_id = b.booking_id
WHERE bd.room_id = $1
  AND b.status IN ('booked', 'checked_in')
ORDER BY bd.check_in_timestamp

    `,
    [roomId]
  );

  return rows;
};
module.exports = {
  createBooking,
  createBookingDetail,
  getDiscountRateByRoomId,
  getBookingInfoById,
  updateBookingStatusToConfirmed,
  findById,
  getBookingById,
  getBookingSummaryById,
  updatePaymentStatusById,
  getBookingsForAutoCheckin,
  getBookingsForAutoCheckout,
  updateStatus,
  getAllBookingsWithDetails,
  getDisabledDatesByRoomId,
  // autoDeleteExpiredBookingsService,

};

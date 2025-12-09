const pool = require("../config/db");

// func to record info booking to db
class Booking {
  static async create({ user_id, total_price }) {
    const query = `
      INSERT INTO bookings (user_id,status, total_price)
      VALUES ($1, $2,$3)
      RETURNING *;
    `;
    const values = [user_id, total_price];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(booking_id) {
    const query = "SELECT * FROM bookings WHERE booking_id = $1";
    const result = await pool.query(query, [booking_id]);
    return result.rows[0];
  }
}

// func to select bookingdetail's user
const getBookingByUserId = async (user_id, page = 1, limit = 5, status) => {
  const offset = (page - 1) * limit;

  // Mảng params để truyền tham số cho query
  const values = [user_id];

  // Query base
  let query = `
    SELECT
      b.booking_id,
      b.user_id,
      b.total_price AS total_price,
      b.status AS booking_status,

      bd.booking_detail_id,
      bd.price_per_unit,
      bd.check_in_date,
      bd.check_out_date,

      r.room_id,
      r.name AS room_name,
      r.description AS room_description,

      COALESCE(img.images, '[]') AS room_images,

      rt.room_type_id,
      rt.name AS room_type,
      rt.price AS room_type_price,

      rl.room_level_id,
      rl.name AS room_level,
      rl.price AS room_level_price,

      d.deal_id,
      d.deal_name,
      d.discount_rate,

      (rt.price + rl.price) AS total_price,

      ROUND(((rt.price + rl.price) * (1 - COALESCE(d.discount_rate, 0)))::numeric, 2) AS discounted_unit_price

    FROM bookings b
    JOIN booking_details bd ON b.booking_id = bd.booking_id
    LEFT JOIN rooms r ON bd.room_id = r.room_id

    LEFT JOIN LATERAL (
      SELECT json_agg(ri.image_url) AS images
      FROM room_images ri
      WHERE ri.room_id = r.room_id
    ) img ON TRUE

    LEFT JOIN room_types rt ON r.room_type_id = rt.room_type_id
    LEFT JOIN room_levels rl ON r.room_level_id = rl.room_level_id
    LEFT JOIN deals d ON d.deal_id = r.deal_id

    WHERE b.user_id = $1
  `;

  // Nếu có status lọc thêm vào điều kiện WHERE
  if (status && status !== 'all') {
    query += ` AND b.status = $2`;
    values.push(status);
  }

  // Thêm order, limit, offset cho phân trang
  query += ` ORDER BY b.booking_id DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
  values.push(limit, offset);

  const result = await pool.query(query, values);
  return result.rows;
};

const getBookingById = async (booking_id) => {
  const query = `
    SELECT
      b.booking_id,
      b.user_id,
      b.total_price AS total_price,
      b.status AS booking_status,

      bd.booking_detail_id,
      bd.price_per_unit,
      bd.check_in_date,
      bd.check_out_date,

      r.room_id,
      r.name AS room_name,
      r.description AS room_description,
      rt.room_type_id,
      rt.name AS room_type,
      rt.price AS room_type_price,

      rl.room_level_id,
      rl.name AS room_level,
      rl.price AS room_level_price,

      d.deal_id,
      d.discount_rate,

      (rt.price + rl.price) AS total_price,
      ROUND(((rt.price + rl.price) * (1 - COALESCE(d.discount_rate, 0)))::numeric, 2) AS discounted_unit_price

    FROM bookings b
    JOIN booking_details bd ON b.booking_id = bd.booking_id
    LEFT JOIN rooms r ON bd.room_id = r.room_id
    LEFT JOIN room_types rt ON r.room_type_id = rt.room_type_id
    LEFT JOIN room_levels rl ON r.room_level_id = rl.room_level_id
    LEFT JOIN deals d ON d.deal_id = r.deal_id

    WHERE b.booking_id = $1
    ORDER BY b.booking_id DESC;
  `;

  const values = [booking_id];
  const result = await pool.query(query, values);
  return result.rows;
};

// func update status booking and room = booked
const updateStatusById = async (bookingId, status = "booked") => {
  const query = `UPDATE bookings SET status = $1 WHERE booking_id = $2`;
  const result = await pool.query(query, [status, bookingId]);
  return result;
};

const getBookingSummaryByDetailId = async (booking_detail_id) => {
  const query = `
    SELECT 
      u.first_name,
      u.last_name,
      (u.first_name || ' ' || u.last_name) AS user_name,
      u.avatar_url,
      u.email,
      bd.check_in_date,
      rt.name AS room_type,
      (bd.check_out_date - bd.check_in_date) AS stay_days,
      r.price AS price_per_day,
      (r.price * (bd.check_out_date - bd.check_in_date)) AS total_price,
      COALESCE((r.price * (bd.check_out_date - bd.check_in_date) * d.discount_rate), 0) AS discount_amount,
      (r.price * (bd.check_out_date - bd.check_in_date)) - 
        COALESCE((r.price * (bd.check_out_date - bd.check_in_date) * d.discount_rate), 0) AS final_price
    FROM booking_details bd
    JOIN bookings b ON b.booking_id = bd.booking_id
    JOIN users u ON u.user_id = b.user_id
    JOIN rooms r ON r.room_id = bd.room_id
    JOIN room_types rt ON r.room_type_id = rt.room_type_id
    LEFT JOIN deals d
      ON r.room_type_id = d.room_type
     AND bd.check_in_date BETWEEN d.start_date AND d.end_date
    WHERE bd.booking_detail_id = $1
    LIMIT 1;
  `;
  const result = await pool.query(query, [booking_detail_id]);
  return result.rows[0];
};

// Function find booking to check status
const findBookingsForAutoCheckin = async (currentDate) => {
  const result = await pool.query(
    `
    SELECT bd.booking_id
    FROM booking_details bd
    JOIN bookings b ON b.booking_id = bd.booking_id
    WHERE b.status = 'booked'
      AND bd.check_in_date = $1
      AND (NOW() AT TIME ZONE 'Asia/Ho_Chi_Minh')::time >= '14:00:00'
  `,
    [currentDate]
  );

  return result.rows;
};

const findBookingsForAutoCheckout = async (currentDate) => {
  const result = await pool.query(
    `
    SELECT bd.booking_id
    FROM booking_details bd
    JOIN bookings b ON b.booking_id = bd.booking_id
    WHERE b.status = 'checked_in'
      AND bd.check_out_date = $1
      AND (NOW() AT TIME ZONE 'Asia/Ho_Chi_Minh')::time >= '12:00:00'
  `,
    [currentDate]
  );

  return result.rows;
};

const updateBookingStatus = async (bookingId, status) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `UPDATE bookings SET status = $1 WHERE booking_id = $2`,
      [status, bookingId]
    );

    const { rows } = await client.query(
      `SELECT room_id FROM booking_details WHERE booking_id = $1`,
      [bookingId]
    );

    if (rows.length === 0) {
      throw new Error(`No room found for booking ID ${bookingId}`);
    }

    const roomId = rows[0].room_id;

    let roomStatus = null;
    if (status === "checked_in") {
      roomStatus = "occupied";
    } else if (status === "checked_out") {
      roomStatus = "available";
    }

    if (roomStatus) {
      await client.query(`UPDATE rooms SET status = $1 WHERE room_id = $2`, [
        roomStatus,
        roomId,
      ]);
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating booking/room status:", error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  getBookingByUserId,
  getBookingById,
  updateStatusById,
  getBookingSummaryByDetailId,
  // updateRoomStatusByBookingId,
  findBookingsForAutoCheckin,
  findBookingsForAutoCheckout,
  updateBookingStatus,
  Booking,
};

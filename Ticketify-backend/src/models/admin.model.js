const pool = require("../config/db");

const getUserListModel = async (limit, offset) => {
  const query = `
    SELECT 
      u.user_id, u.email, CONCAT(u.first_name, ' ', u.last_name) AS name, u.phone, u.role, u.is_active,
      b.booking_id, b.status AS booking_status, b.total_price,
      bd.booking_detail_id, bd.price_per_unit, bd.check_in_date, bd.check_out_date,
      r.room_id, r.name AS room_name, r.description AS room_description, r.room_type_id, r.floor_id
    FROM users u
    LEFT JOIN bookings b ON u.user_id = b.user_id
    LEFT JOIN booking_details bd ON b.booking_id = bd.booking_id
    LEFT JOIN rooms r ON bd.room_id = r.room_id
    WHERE u.role <> 'admin'
    ORDER BY b.booking_id ASC
    LIMIT $1 OFFSET $2
  `;
  const result = await pool.query(query, [limit, offset]);
  return result.rows;
};

const countUsersModel = async () => {
  const query = `
    SELECT COUNT(*) 
    FROM bookings b
    JOIN users u ON b.user_id = u.user_id
    WHERE u.role <> 'admin'
  `;
  const result = await pool.query(query);
  return parseInt(result.rows[0].count, 10);
};

const getCheckinGuestsModel = async (limit, offset) => {
  const query = `
    SELECT 
      u.user_id, u.email, u.name, u.phone, u.role, u.is_active,
      b.booking_id, b.status AS booking_status, b.total_price,
      bd.booking_detail_id, bd.price_per_unit, bd.check_in_date, bd.check_out_date,
      r.room_id, r.name AS room_name, r.description AS room_description, r.room_type_id, r.floor_id
    FROM users u
    JOIN bookings b ON u.user_id = b.user_id
    JOIN booking_details bd ON b.booking_id = bd.booking_id
    JOIN rooms r ON bd.room_id = r.room_id
    WHERE b.status = 'checked_in'
      AND u.role <> 'admin'
    ORDER BY b.booking_id ASC
    LIMIT $1 OFFSET $2
  `;
  const result = await pool.query(query, [limit, offset]);
  return result.rows;
};

const countCheckinGuestsModel = async () => {
  const query = `
    SELECT COUNT(DISTINCT u.user_id) AS count
    FROM users u
    JOIN bookings b ON u.user_id = b.user_id
    JOIN booking_details bd ON b.booking_id = bd.booking_id
    WHERE bd.check_in_date <= CURRENT_DATE
      AND bd.check_out_date > CURRENT_DATE
      AND u.role <> 'admin'
  `;
  const result = await pool.query(query);
  return parseInt(result.rows[0].count, 10);
};

const getCheckoutGuestsModel = async (limit, offset) => {
  const query = `
    SELECT 
      u.user_id, u.email, u.name, u.phone, u.role, u.is_active,
      b.booking_id, b.status AS booking_status, b.total_price,
      bd.booking_detail_id, bd.price_per_unit, bd.check_in_date, bd.check_out_date,
      r.room_id, r.name AS room_name, r.description AS room_description, r.room_type_id, r.floor_id
    FROM users u
    JOIN bookings b ON u.user_id = b.user_id
    JOIN booking_details bd ON b.booking_id = bd.booking_id
    JOIN rooms r ON bd.room_id = r.room_id
    WHERE b.status = 'checked_out'
    AND u.role <> 'admin'
    ORDER BY b.booking_id ASC
    LIMIT $1 OFFSET $2
  `;
  const result = await pool.query(query, [limit, offset]);
  return result.rows;
};

const countCheckoutGuestsModel = async () => {
  const query = `
    SELECT COUNT(DISTINCT u.user_id) AS count
    FROM users u
    JOIN bookings b ON u.user_id = b.user_id
    JOIN booking_details bd ON b.booking_id = bd.booking_id
    WHERE bd.check_out_date < CURRENT_DATE
    AND u.role <> 'admin'
  `;
  const result = await pool.query(query);
  return parseInt(result.rows[0].count, 10);
};

const getAdminDashboardStatusModel = async () => {
  const query = `
     SELECT
      (SELECT COUNT(*) 
      FROM booking_details 
      WHERE check_in_date = CURRENT_DATE) AS check_in_today,

      (SELECT COUNT(*) 
      FROM booking_details 
      WHERE check_out_date = CURRENT_DATE) AS check_out_today,

      (SELECT COUNT(*) 
       FROM rooms 
       WHERE status = 'available') AS available_room_count,

      (SELECT COUNT(*) 
       FROM rooms 
       WHERE status = 'occupied') AS occupied_room_count,

       (SELECT COUNT(*) 
       FROM rooms 
       WHERE status = 'booked') AS booked_room_count;
    `;
  const result = await pool.query(query);
  return result.rows[0];
};

const getAdminDashboardDealModel = async () => {
  const query = `
    SELECT 
        rt.name AS room_type_name,
        rt.price,
        COUNT(DISTINCT d.deal_id) AS total_deals,
        COUNT(DISTINCT r.room_id) AS total_rooms,
        SUM(CASE WHEN r.status IN ('booked', 'occupied') THEN 1 ELSE 0 END) AS used_rooms
      FROM room_types rt
      LEFT JOIN rooms r ON rt.room_type_id = r.room_type_id
      LEFT JOIN deals d ON rt.room_type_id = d.deal_id
      GROUP BY rt.room_type_id, rt.name, rt.price
      ORDER BY rt.name;
      `;
  const result = await pool.query(query);
  return result.rows;
};

const getFeedbackModel = async () => {
  const query = `
      SELECT 
        u.name AS customer_name,
        r.name AS room_name,
        f.rating,
        f.comment
      FROM feedbacks f
      JOIN booking_details bd ON f.booking_details_id = bd.booking_detail_id
      JOIN bookings b ON bd.booking_id = b.booking_id
      JOIN users u ON b.user_id = u.user_id
      JOIN rooms r ON bd.room_id = r.room_id
      ORDER BY f.created_at DESC;
    `;
  const result = await pool.query(query);
  return result.rows;
};

const getHotelFeedbackModel = async () => {
  const query = `
      SELECT 
          u.name AS customer_name,
          hf.comment,
          hf.rating,
          hf.submitted_at
      FROM hotel_feedbacks hf
      JOIN users u ON hf.user_id = u.user_id
      ORDER BY hf.submitted_at DESC;
    `;
  const result = await pool.query(query);
  return result.rows;
};

const getTop5MostBookedRoomsModel = async (month, year) => {
  const query = `
    SELECT 
      r.room_id,
      r.name AS room_name,
      COUNT(bd.booking_detail_id) AS total_bookings
    FROM booking_details bd
    JOIN rooms r ON bd.room_id = r.room_id
    JOIN bookings b ON bd.booking_id = b.booking_id
    WHERE EXTRACT(MONTH FROM bd.check_in_date) = $1
      AND EXTRACT(YEAR FROM bd.check_in_date) = $2
    GROUP BY r.room_id, r.name
    ORDER BY total_bookings DESC
    LIMIT 5;
  `;
  const { rows } = await pool.query(query, [month, year]);
  return rows;
};

const getGuestListModel = async (limit, offset) => {
  const query = `
    SELECT 
    u.user_id AS guest_number,
    u.name,
    u.email,
    u.phone,
    CASE 
      WHEN u.status = 'active' THEN 'Active'
      ELSE 'Blocked'
    END AS status,
    COUNT(bd.booking_detail_id) AS booking_count
  FROM users u
  LEFT JOIN bookings b ON u.user_id = b.user_id
  LEFT JOIN booking_details bd ON b.booking_id = bd.booking_id
  WHERE u.role <> 'admin'
  GROUP BY u.user_id, u.name, u.email, u.phone, u.status
  ORDER BY u.user_id
  LIMIT $1 OFFSET $2;

  `;
  const result = await pool.query(query, [limit, offset]);
  return result.rows;
};

const countGuestListModel = async () => {
  const result = await pool.query(`SELECT COUNT(*) FROM users;`);
  return parseInt(result.rows[0].count, 10);
};

const updateUserStatusModel = async (user_id, status) => {
  const query = `UPDATE users SET status = $1 WHERE user_id = $2`;
  await pool.query(query, [status.toLowerCase(), user_id]);
};

const getRateModel = async (month, year, limit, offset) => {
  const query = `
    SELECT
      r.room_id,
      r.name AS room_number,
      d.deal_name AS deal_name,
      rt.name AS room_type,
      rl.name AS room_level,
      (rt.price + rl.price) AS original_price,
      COUNT(bd.booking_detail_id) FILTER (
        WHERE EXTRACT(MONTH FROM bd.check_in_date) = $1
          AND EXTRACT(YEAR FROM bd.check_in_date) = $2
      ) AS number_of_booking,

      SUM(
        (rt.price + rl.price)
        * GREATEST(1, (bd.check_out_date - bd.check_in_date))
        * (1 - COALESCE(d.discount_rate, 0))
      ) AS total_revenue
      
    FROM rooms r
    LEFT JOIN deals d ON r.deal_id = d.deal_id
    JOIN room_types rt ON r.room_type_id = rt.room_type_id
    JOIN room_levels rl ON r.room_level_id = rl.room_level_id
    JOIN booking_details bd ON bd.room_id = r.room_id
    JOIN bookings b ON b.booking_id = bd.booking_id
    WHERE EXTRACT(MONTH FROM bd.check_in_date) = $1
      AND EXTRACT(YEAR FROM bd.check_in_date) = $2
    GROUP BY r.room_id, r.name, rt.name, rl.name, rt.price, rl.price, d.deal_name, d.discount_rate
    ORDER BY number_of_booking DESC
    LIMIT $3 OFFSET $4;
  `;
  const result = await pool.query(query, [limit, offset, month, year]);
  return result.rows;
};

const getBestSellerRoomModel = async (month, year) => {
  const query = `
    SELECT
      r.name AS room_number,
      rt.name AS room_type,
      rl.name AS room_level,
      (rt.price + rl.price) AS original_price,
      COUNT(bd.booking_detail_id) AS number_of_booking,
      SUM(b.total_price) AS total_revenue
    FROM rooms r
    JOIN room_types rt ON r.room_type_id = rt.room_type_id
    JOIN room_levels rl ON r.room_level_id = rl.room_level_id
    LEFT JOIN booking_details bd ON bd.room_id = r.room_id
    LEFT JOIN bookings b ON b.booking_id = bd.booking_id
    WHERE EXTRACT(MONTH FROM bd.check_in_date) = $1
      AND EXTRACT(YEAR FROM bd.check_in_date) = $2
    GROUP BY r.room_id, r.name, rt.name, rl.name, rt.price, rl.price
    ORDER BY COUNT(bd.booking_detail_id) DESC
    LIMIT 1;
  `;
  const result = await pool.query(query, [month, year]);
  return result.rows[0] || null;
};

const getTotalRevenueModel = async (month, year) => {
  const query = `
    SELECT
      COALESCE(SUM(b.total_price), 0) AS total_revenue
    FROM booking_details bd
    JOIN bookings b ON b.booking_id = bd.booking_id
    WHERE EXTRACT(MONTH FROM bd.check_in_date) = $1
      AND EXTRACT(YEAR FROM bd.check_in_date) = $2
  `;

  const result = await pool.query(query, [month, year]);
  return result.rows[0].total_revenue;
};

const totalRoomModel = async (month, year) => {
  const query = `
    SELECT COUNT(DISTINCT r.room_id) AS total
    FROM rooms r
    LEFT JOIN booking_details bd ON bd.room_id = r.room_id
    WHERE EXTRACT(MONTH FROM bd.check_in_date) = $1
      AND EXTRACT(YEAR FROM bd.check_in_date) = $2
  `;
  const result = await pool.query(query, [month, year]);
  return parseInt(result.rows[0].total);
};

const getRateDetailModel = async (room_id, month, year) => {
  const query = `
    SELECT
    r.name as room_number,
      b.booking_id AS booking_id,
      d.deal_name AS deal_name,
      bd.check_in_date || ' - ' || bd.check_out_date AS date_of_stay,
       GREATEST(1, (bd.check_out_date - bd.check_in_date)) AS number_of_days,
      (
        (rt.price + rl.price) * 
GREATEST(1, (bd.check_out_date - bd.check_in_date))
        * (1 - COALESCE(d.discount_rate, 0))
      ) AS price
    FROM rooms r
    LEFT JOIN deals d ON r.deal_id = d.deal_id
    JOIN room_types rt ON r.room_type_id = rt.room_type_id
    JOIN room_levels rl ON r.room_level_id = rl.room_level_id
    LEFT JOIN booking_details bd ON bd.room_id = r.room_id
    LEFT JOIN bookings b ON b.booking_id = bd.booking_id
    WHERE r.room_id = $1
      AND EXTRACT(MONTH FROM bd.check_in_date) = $2
      AND EXTRACT(YEAR FROM bd.check_in_date) = $3;
    `;
    const result = await pool.query(query, [room_id,month, year]);
  return result.rows;
};
module.exports = {
  getUserListModel,
  countUsersModel,
  getCheckinGuestsModel,
  getCheckoutGuestsModel,
  getAdminDashboardStatusModel,
  getAdminDashboardDealModel,
  getFeedbackModel,
  getTop5MostBookedRoomsModel,
  getHotelFeedbackModel,
  getGuestListModel,
  countGuestListModel,
  updateUserStatusModel,
  getRateModel,
  getTotalRevenueModel,
  getBestSellerRoomModel,
  totalRoomModel,
  countCheckinGuestsModel,
  countCheckoutGuestsModel,
  getRateDetailModel
};

const pool = require("../config/db");

const createHotelFeedbackModel = async (user_id, rating, comment) => {
  const query = `
    INSERT INTO hotel_feedbacks (user_id, rating, comment)
    VALUES ($1, $2, $3)
    RETURNING *
  `;

  const result = await pool.query(query, [user_id, rating, comment]);
  return result.rows[0];
};

const getFavoriteRoomModel = async (user_id, limit, offset) => {
  const query = `
    SELECT 
      r.room_id,
      r.name AS room_name,
      rt.name AS room_type,
      rl.name AS room_level,
      r.description as room_description,
      CONCAT(MIN(ri.image_url)) AS image_url
      
    FROM favorite_rooms fr
    JOIN rooms r ON fr.room_id = r.room_id
    JOIN room_types rt ON r.room_type_id = rt.room_type_id
    JOIN room_levels rl ON r.room_level_id = rl.room_level_id
    LEFT JOIN room_images ri ON r.room_id = ri.room_id
    WHERE fr.user_id = $1
    GROUP BY r.room_id, r.name, rt.name, rl.name
    ORDER BY r.room_id
    LIMIT $2 OFFSET $3
   `;
  const result = await pool.query(query, [user_id, limit, offset]);
  return result.rows;
};

const countFavoriteRoomModel = async (user_id) => {
  const query = `
    SELECT COUNT(*) AS total
    FROM favorite_rooms
    WHERE user_id = $1
  `;
  const result = await pool.query(query, [user_id]);
  return result.rows[0].total;
};

const deleteFavoriteRoomModel = async (user_id, room_id) => {
  const query = `
    DELETE FROM favorite_rooms
    WHERE user_id = $1 AND room_id = $2
  `;
  const result = await pool.query(query, [user_id, room_id]);
  return result.rowCount > 0;
};

const addFavoriteRoomModel = async (user_id, room_id) => {
  const checkQuery = `
    SELECT 1 FROM favorite_rooms
    WHERE user_id = $1 AND room_id = $2
    LIMIT 1
  `;
  const checkResult = await pool.query(checkQuery, [user_id, room_id]);

  if (checkResult.rowCount > 0) {
    return false;
  }

  const insertQuery = `
    INSERT INTO favorite_rooms (user_id, room_id, created_at)
    VALUES ($1, $2, NOW())
  `;
  const result = await pool.query(insertQuery, [user_id, room_id]);

  return result.rowCount > 0;
};

const getUserAndRoomModel = async (booking_detail_id) => {
  const query = `
    SELECT b.user_id, bd.room_id, r.description, bd.booking_detail_id, r.name
    FROM booking_details bd
    JOIN rooms r ON r.room_id = bd.room_id
    JOIN bookings b ON bd.booking_id = b.booking_id
    WHERE bd.booking_detail_id = $1
  `;
  const result = await pool.query(query, [booking_detail_id]);
  return result.rows[0];
};

const createRoomFeedbackModel = async (booking_details_id, rating, comment) => {
  const query = `
    INSERT INTO feedbacks (booking_details_id, rating, comment)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const result = await pool.query(query, [booking_details_id, rating, comment]);
  return result.rowCount > 0;
};

module.exports = {
  createHotelFeedbackModel,
  getFavoriteRoomModel,
  countFavoriteRoomModel,
  deleteFavoriteRoomModel,
  addFavoriteRoomModel,
  getUserAndRoomModel,
  createRoomFeedbackModel,
};

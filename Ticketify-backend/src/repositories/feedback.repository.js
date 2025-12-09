const pool = require("../config/db");

const feedbackRepository = {
  getAllFeedbacks: async () => {
    const query = `
      SELECT hotel_feedback_id, user_id, rating, comment, submitted_at
      FROM hotel_feedbacks
      ORDER BY submitted_at DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  getTopRatedFeedbacks: async (limit = 3) => {
    try {
      const query = `
      SELECT 
        hf.hotel_feedback_id,
        hf.user_id,
        hf.rating,
        hf.comment,
        hf.submitted_at,
        u.avatar_url,
        COALESCE(u.name, u.first_name || ' ' || u.last_name) AS full_name
      FROM hotel_feedbacks AS hf
      JOIN users AS u ON hf.user_id = u.user_id
      WHERE hf.rating = 5
      ORDER BY hf.submitted_at DESC
      LIMIT $1
    `;
      const { rows } = await pool.query(query, [limit]);
      return rows || [];
    } catch (error) {
      console.error("Error in getTopRatedFeedbacks:", error);
      return [];
    }
  },
};

module.exports = feedbackRepository;

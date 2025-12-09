const pool = require("../config/db");

const amenityRepository = {
  getAllAmenities: async () => {
    const { rows } = await pool.query("SELECT * FROM amenities");
    return rows;
  },
  getTopUsedAmenities: async (limit = 8) => {
    const query = `
    SELECT a.*, COUNT(ra.amenity_id) AS usage_count
    FROM room_amenities ra
    JOIN amenities a ON ra.amenity_id = a.amenity_id
    GROUP BY a.amenity_id
    ORDER BY usage_count DESC
    LIMIT $1
  `;
    const { rows } = await pool.query(query, [limit]);
    return rows;
  },
};

module.exports = amenityRepository;

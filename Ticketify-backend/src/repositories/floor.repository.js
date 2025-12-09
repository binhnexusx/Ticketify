const pool = require("../config/db");

const floorRepository = {
  getAllFloors: async () => {
    const { rows } = await pool.query("SELECT * FROM floors");
    return rows;
  },
};

module.exports = floorRepository;
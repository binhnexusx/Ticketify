const pool = require("../config/db");

const dealsRepository = {
  getActiveDeals: async function () {
    const { rows } = await pool.query(`
      SELECT * FROM deals
      WHERE status = 'Ongoing';
    `);
    return rows;
  },

  getAllDeals: async function ({ page, limit }) {
    const offset = (page - 1) * limit;

    const deals = await pool.query(
      `
      SELECT * FROM deals
      ORDER BY deal_id DESC
      LIMIT $1 OFFSET $2
    `,
      [limit, offset]
    );

    const count = await pool.query(`SELECT COUNT(*) FROM deals`);

    return {
      items: deals.rows,
      total: parseInt(count.rows[0].count),
      page,
      limit,
      totalPages: Math.ceil(count.rows[0].count / limit),
    };
  },
  getAllDealsWithoutPagination: async function () {
    const result = await pool.query(`
      SELECT deal_id, start_date, end_date 
      FROM deals
      ORDER BY start_date DESC
    `);
    return result.rows;
  },

  createDeal: async function ({
    deal_name,
    discount_rate,
    start_date,
    end_date,
  }) {
    const start = new Date(start_date);
    const end = new Date(end_date);
    end.setHours(23, 59, 59, 999);

    this.validateDeal({ start_date: start, end_date: end });

    const currentDate = new Date();
    let status;

    if (currentDate < start) {
      status = "New";
    } else if (currentDate >= start && currentDate <= end) {
      status = "Ongoing";
    } else {
      status = "Finished";
    }

    const { rows } = await pool.query(
      `
      INSERT INTO deals (deal_name, discount_rate, start_date, end_date, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [deal_name, discount_rate, start, end, status]
    );

    return rows[0];
  },

  updateDeal: async function (
    id,
    { deal_name, discount_rate, start_date, end_date }
  ) {
    const start = new Date(start_date);
    const end = new Date(end_date);
    end.setHours(23, 59, 59, 999);
    this.validateDeal({ start_date, end_date });
    const currentDate = new Date();
    let status;

    if (currentDate < start) {
      status = "New";
    } else if (currentDate >= start && currentDate <= end) {
      status = "Ongoing";
    } else {
      status = "Finished";
    }

    const { rows } = await pool.query(
      `
      UPDATE deals
      SET deal_name = $1,
          discount_rate = $2,
          start_date = $3,
          end_date = $4,
          status = $5
      WHERE deal_id = $6
      RETURNING *`,
      [deal_name, discount_rate, start, end, status, id]
    );

    return rows[0];
  },

  deleteDeal: async function (id) {
    const { rows } = await pool.query(
      `DELETE FROM deals WHERE deal_id = $1 RETURNING *`,
      [id]
    );
    return rows[0];
  },

  validateDeal: function ({ start_date, end_date }) {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const start = new Date(start_date);
    const end = new Date(end_date);

    if (start < currentDate) {
      throw new Error("Start date must not be in the past.");
    }
    if (end < start) {
      throw new Error("End date must be after start date.");
    }
  },

  getDealById: async function (id) {
    const { rows } = await pool.query(
      `
      SELECT * FROM deals WHERE deal_id = $1`,
      [id]
    );
    return rows[0];
  },

  getDealsFiltered: async function (status, startDate, endDate, limit, offset) {
    let query = `SELECT * FROM deals WHERE 1=1`;
    const params = [];
    let paramIndex = 1;

    if (status) {
      query += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (startDate && endDate) {
      query += ` AND start_date::date >= $${paramIndex}::date AND end_date::date <= $${
        paramIndex + 1
      }::date`;
      params.push(startDate, endDate);
      paramIndex += 2;
    } else if (startDate) {
      query += ` AND start_date::date = $${paramIndex}::date`;
      params.push(startDate);
      paramIndex++;
    } else if (endDate) {
      query += ` AND end_date::date = $${paramIndex}::date`;
      params.push(endDate);
      paramIndex++;
    }

    query += ` ORDER BY deal_id DESC LIMIT $${paramIndex} OFFSET $${
      paramIndex + 1
    }`;
    params.push(limit, offset);

    const { rows } = await pool.query(query, params);
    return rows;
  },

  countDealsFiltered: async function (status, startDate, endDate) {
    let query = `SELECT COUNT(*) FROM deals WHERE 1=1`;
    const params = [];
    let paramIndex = 1;

    if (status) {
      query += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (startDate) {
      query += ` AND start_date >= $${paramIndex}`;
      params.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      query += ` AND end_date <= $${paramIndex}`;
      params.push(endDate);
      paramIndex++;
    }

    const { rows } = await pool.query(query, params);
    return parseInt(rows[0].count, 10);
  },

  updateDealStatus: async function (id) {
    const currentDate = new Date();

    const { rows } = await pool.query(
      `SELECT start_date, end_date FROM deals WHERE deal_id = $1`,
      [id]
    );

    if (rows.length > 0) {
      const deal = rows[0];
      const start = new Date(deal.start_date);
      const end = new Date(deal.end_date);

      let status;
      if (currentDate < start) {
        status = "New";
      } else if (currentDate >= start && currentDate <= end) {
        status = "Ongoing";
      } else {
        status = "Finished";
      }

      await pool.query(`UPDATE deals SET status = $1 WHERE deal_id = $2`, [
        status,
        id,
      ]);
    }
  },

  getDealSummary: async function () {
    const { rows } = await pool.query(`
      SELECT 
          COUNT(*) AS total_deals,
          COUNT(CASE WHEN status = 'Ongoing' THEN 1 END) AS ongoing_deals,
          COUNT(CASE WHEN status = 'Finished' THEN 1 END) AS finished_deals
      FROM deals
    `);
    return rows[0];
  },
};

module.exports = dealsRepository;

const db = require("../config/db");

const create = async ({
  booking_id,
  card_number,
  card_name,
  amount,
  method,
  exp_date,
  paid_at,
}) => {
  const { rows } = await db.query(
    `INSERT INTO payments (booking_id,card_number,card_name,amount,method,exp_date, paid_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [booking_id, card_number, card_name, amount, method, exp_date, paid_at]
  );
  return rows[0];
};


const existsByBookingId = async (booking_id) => {
  const { rows } = await db.query(
    `SELECT * FROM payments WHERE booking_id = $1 LIMIT 1`,
    [booking_id]
  );
  return rows[0]; // nếu có => return record
};
module.exports = {
  create,
  existsByBookingId
};

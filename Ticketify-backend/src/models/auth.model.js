const db = require("../config/db");

const findByEmail = (email) =>
  db.query("SELECT * FROM users WHERE email = $1", [email]);

const createUser = async (name, firstname, lastname, email, password, role) => {
  const query = `
    INSERT INTO users (name, first_name, last_name, email, password, role)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  await db.query(query, [name, firstname, lastname, email, password, role]);
};

const updatePassword = (userId, hashedPassword) => {
  return db.query("UPDATE users SET password = $1 WHERE user_id = $2", [
    hashedPassword,
    userId,
  ]);
};

const updateRefreshToken = (userId, refreshToken) =>
  db.query(`UPDATE users SET refresh_token = $1 WHERE user_id = $2`, [
    refreshToken,
    userId,
  ]);

const findUserByRefreshToken = (refreshToken) =>
  db.query(`SELECT * FROM users WHERE refresh_token = $1`, [refreshToken]);

const getUserById = async (userId) => {
  const result = await db.query(
    `SELECT user_id, name, first_name, last_name, email, password, phone, gender,
            to_char(date_of_birth, 'YYYY-MM-DD') AS date_of_birth,
            avatar_url, address, role, is_active
     FROM users WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0];
};

const updateEmail = async (userId, email) => {
  const result = await db.query(
    "UPDATE users SET email = $1 WHERE user_id = $2 RETURNING *",
    [email, userId]
  );

  if (result.rowCount === 0) {
    throw new Error("No user updated");
  }

  return result.rows[0];
};

const getUserByEmail = async (email) => {
  const result = await db.query(
    `SELECT user_id, first_name, last_name, email, password, phone, gender,
            to_char(date_of_birth, 'YYYY-MM-DD') AS date_of_birth,
            avatar_url, address, role, is_active
     FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0];
};

module.exports = {
  findByEmail,
  createUser,
  updateRefreshToken,
  findUserByRefreshToken,
  getUserByEmail,
  updatePassword,
  getUserById,
  updateEmail,
};

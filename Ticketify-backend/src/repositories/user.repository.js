const UserModel = require("../models/auth.model");
const pool = require("../config/db");

const getUserByEmail = async (email) => {
  const result = await UserModel.findByEmail(email);
  return result.rows[0];
};

const insertUser = async (name, email, password, role = "user") => {
  const result = await UserModel.createUser(name, email, password, role);
  return result.rows[0];
};

const updateUserPassword = (userId, hashedPassword) => {
  return UserModel.updatePassword(userId, hashedPassword);
};

const getUserById = async (userId) => {
  return UserModel.getUserById(userId);
};

const updateEmail = async (userId, email) => {
  return await UserModel.updateEmail(userId, email);
};

const updateUser = async (userId, userData) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    address = null,
    avatar_url,
    gender,
    date_of_birth,
    role = 'user',
    is_active = true
  } = userData;

  const full_name = `${first_name} ${last_name}`.trim(); // nối và loại bỏ khoảng trắng thừa

  const result = await pool.query(
    `UPDATE users SET 
      first_name = $1, 
      last_name = $2, 
      name = $3,
      email = $4, 
      phone = $5, 
      avatar_url = $6, 
      gender = $7, 
      date_of_birth = $8,
      address = $9,
      role = $10,
      is_active = $11
    WHERE user_id = $12`,
    [
      first_name,
      last_name,
      full_name,
      email,
      phone,
      avatar_url,
      gender,
      date_of_birth,
      address,
      role,
      is_active,
      userId
    ]
  );

  return result;
};


const createUser = async ({
  name,
  first_name: firstName,
  last_name: lastName,
  email,
  phone,
  password,
  role,
}) => {
  const { rows } = await pool.query(
    `INSERT INTO users (name, first_name, last_name, email, phone, password, role)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [name, firstName, lastName, email, phone, password, role]
  );
  return rows[0];
};

module.exports = {
  getUserByEmail,
  insertUser,
  updateUserPassword,
  getUserById,
  updateUser,
  updateEmail,
  createUser,
};

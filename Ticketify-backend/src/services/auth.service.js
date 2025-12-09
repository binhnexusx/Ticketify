require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  findByEmail,
  findById,
  updateRefreshToken,
  updatePassword,
  createUser,
  findUserByRefreshToken,
} = require("../models/auth.model");
const redis = require("../utils/redis");
const { sendOTPEmail } = require("../utils/emailService");
const UserRepo = require("../repositories/user.repository");
const { sendError } = require("../utils/response");
console.log("JWT_SECRET:", process.env.JWT_SECRET);
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.user_id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.user_id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

const login = async (email, password) => {
  const result = await findByEmail(email);
  const user = result.rows[0];

  if (user.status === "blocked") {
    console.log("Your account has been blocked by admin");
    return sendError(res, 403, "Your account has been blocked by admin");
  }

  if (!user) throw new Error("Incorrect email or password");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Incorrect email or password");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await updateRefreshToken(user.user_id, refreshToken);

  return {
    user: {
      id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      gender: user.gender,
      phone: user.phone,
      address: user.address,
      is_active: user.is_active,
      avatar: user.avatar_url,
    },
    accessToken,
    refreshToken,
  };
};

const register = async ({
  name,
  firstname,
  lastname,
  email,
  password,
  role,
}) => {
  const existing = await findByEmail(email);
  if (existing.rows.length > 0) {
    throw new Error("Email already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  await createUser(
    name,
    firstname,
    lastname,
    email,
    hashedPassword,
    role || "user"
  );

  return { message: "Registration successful" };
};

const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) throw new Error("No refresh token");

  const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const result = await findById(payload.user_id);
  const user = result.rows[0];

  if (!user || user.refresh_token !== refreshToken) {
    throw new Error("Refresh token is invalid");
  }

  return generateAccessToken(user);
};

const resetPassword = async (email, password) => {
  if (!email || !email.includes("@")) {
    throw new Error("Invalid email");
  }

  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const result = await findByEmail(email);
  const user = result.rows[0];
  if (!user) {
    throw new Error("Email does not exist");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await updatePassword(userId, hashedPassword);

  return { message: "Password reset successful", password };
};

const logout = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("No refresh token provided");
  }

  const result = await findUserByRefreshToken(refreshToken);
  const user = result.rows[0];

  if (!user) {
    throw new Error("Token is invalid or has expired");
  }

  await updateRefreshToken(user.user_id, null);

  return { message: "Logout successful" };
};

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const requestEmailChange = async (userId, newEmail) => {
  try {
    const user = await UserRepo.getUserById(userId);
    if (!user) {
      return { success: false, status: 404, message: "User not found" };
    }

    const existing = await UserRepo.getUserByEmail(newEmail);
    if (existing) {
      return { success: false, status: 409, message: "Email already in use" };
    }

    const otp = generateOtp();
    await redis.set(`otp:${userId}`, otp, "EX", 300);
    await redis.set(`otp_email:${userId}`, newEmail, "EX", 300);

    console.log("Generated OTP:", otp);
    await sendOTPEmail(newEmail, otp);

    return { success: true, message: "OTP sent to new email" };
  } catch (err) {
    console.error(err);
    return { success: false, status: 500, message: "Internal server error" };
  }
};

const verifyEmailChange = async (userId, otpInput) => {
  try {
    const otpStored = await redis.get(`otp:${userId}`);
    if (!otpStored) {
      return { success: false, status: 410, message: "OTP expired or invalid" };
    }
    console.log("otpstore:", otpStored);
    console.log("otpinput:", otpInput);

    if (otpStored.trim() !== String(otpInput).trim()) {
      return { success: false, message: "OTP does not match" };
    }

    const newEmail = await redis.get(`otp_email:${userId}`);
    if (!newEmail) {
      return { success: false, status: 400, message: "New email not found" };
    }

    await UserRepo.updateEmail(userId, newEmail);
    await redis.del(`otp:${userId}`);
    await redis.del(`otp_email:${userId}`);

    return { success: true, message: "Email updated successfully" };
  } catch (err) {
    console.error(err);
    return { success: false, status: 500, message: "Internal server error" };
  }
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (currentPassword, hashedPassword) => {
  if (
    typeof currentPassword !== "string" ||
    typeof hashedPassword !== "string"
  ) {
    throw new Error("Password comparison failed: invalid input(s)");
  }
  return await bcrypt.compare(currentPassword, hashedPassword);
};

const changePassword = async (
  userId,
  currentPassword,
  newPassword,
  confirmPassword
) => {
  try {
    const user = await UserRepo.getUserById(userId);
    console.log("User ID:", userId);
    if (!userId) {
      return { success: false, status: 404, message: "User not found" };
    }

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return {
        success: false,
        status: 401,
        message: "Current password is incorrect",
      };
    }

    if (newPassword !== confirmPassword) {
      return { success: false, status: 400, message: "Passwords do not match" };
    }
    const hashed = await hashPassword(newPassword);
    await UserRepo.updateUserPassword(userId, hashed);

    return { success: true, message: "Password changed successfully" };
  } catch (err) {
    console.error("Error changing password:", err);
    return { success: false, status: 500, message: "Internal server error" };
  }
};

const OTP_TTL = Number(process.env.OTP_TTL_SECONDS || 300);
const RESET_TTL = Number(process.env.RESET_TTL_SECONDS || 900);

const forgotPassword = async (email) => {
  const user = await UserModel.findByEmail(email);
  if (!user) {
    return { success: false, status: 404, message: "Email does not exist" };
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await OtpModel.create({
    email,
    otp,
    expiresAt: Date.now() + 2 * 60 * 1000,
  });

  await sendEmail(
    email,
    "Password Reset OTP",
    `Your OTP is: ${otp}`
  );

  return { success: true, message: "OTP sent to email" };
};

const verifyOtp = async (email, otp) => {
  const record = await OtpModel.findValidOtp(email, otp);
  const user = await UserModel.findByEmail(email);
  if (!record) {
    return {
      success: false,
      status: 400,
      message: "OTP is invalid or has expired",
    };
  }

  const resetToken = generateRefreshToken(user);

  return { success: true, message: "OTP is valid", resetToken };
};

const confirmResetPassword = async (token, password) => {
  const tokenRecord = await ResetTokenModel.findValidToken(token);
  if (!tokenRecord) {
    return {
      success: false,
      status: 400,
      message: "Token is invalid or has expired",
    };
  }

  const hashed = await bcrypt.hash(password, 10);
  await UserModel.updatePassword(tokenRecord.email, hashed);

  return { success: true, message: "Password changed successfully" };
};

module.exports = {
  login,
  refreshAccessToken,
  resetPassword,
  register,
  logout,
  requestEmailChange,
  verifyEmailChange,
  changePassword,
  forgotPassword,
  verifyOtp,
  confirmResetPassword,
};

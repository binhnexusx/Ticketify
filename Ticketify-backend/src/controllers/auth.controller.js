require("dotenv").config();
const bcrypt = require("bcryptjs");
const { updatePassword, getUserByEmail } = require("../models/auth.model");
const {
  login,
  resetPassword,
  register,
  logout,
} = require("../services/auth.service");
const authService = require("../services/auth.service");
const { success, sendError } = require("../utils/response");
// const { verifyOtp, forgotPassword,confirmResetPassword } = require("../services/auth.service");
const { sendOTPEmail } = require("../utils/emailService");
const UserModel = require("../models/auth.model");
const redis = require("../utils/redis");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { user, accessToken, refreshToken } = await login(email, password);

    return success(
      res,
      {
        user,
        accessToken,
        refreshToken,
      },
      "Login successful"
    );
  } catch (error) {
    console.error("Login error: ", error.message);
    return sendError(res, 401, error.message || "Login error");
  }
};

exports.register = async (req, res) => {
  const { name, firstname, lastname, email, password, role } = req.body;

  try {
    const result = await register({
      name,
      firstname,
      lastname,
      email,
      password,
      role,
    });
    return success(res, result, "Registration successful", 201);
  } catch (error) {
    console.error("Registration error:", error.message);
    return sendError(res, 400, error.message || "Registration error");
  }
};

exports.resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await resetPassword(email, password);
    return success(res, result, "Password reset successfully");
  } catch (error) {
    return sendError(res, 400, error.message || "Password reset failed");
  }
};

exports.logout = async (req, res) => {
  const refreshToken = req.body.refreshToken;

  try {
    const result = await logout(refreshToken);
    return success(res, result, "Logout successful");
  } catch (error) {
    console.error("Logout error:", error.message);
    return sendError(res, 400, error.message || "Logout error");
  }
};

exports.requestEmailChange = async (req, res) => {
  try {
    const { newEmail, userId } = req.body;

    const result = await authService.requestEmailChange(userId, newEmail);

    if (result.success) {
      return success(res, result.message);
    } else {
      return sendError(res, result.status, result.message);
    }
  } catch (error) {
    console.error("[requestEmailChange] Error:", error);
    return sendError(res, 500, "Internal server error");
  }
};

exports.verifyEmailChange = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const result = await authService.verifyEmailChange(userId, otp);

    if (result.success) {
      return success(res, result.message);
    } else {
      return sendError(res, result.status, result.message || 400);
    }
  } catch (error) {
    console.error("[verifyEmailChange] Error:", error);
    return sendError(res, 500);
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword, confirmPassword } = req.body;

    const result = await authService.changePassword(
      userId,
      currentPassword,
      newPassword,
      confirmPassword
    );

    if (result.success) {
      return success(res, result.message);
    } else {
      return sendError(res, result.status, result.message || 400);
    }
  } catch (error) {
    return sendError(res, 500);
  }
};

exports.forgotPasswordHandler = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Email is required",
      });
    }

    const user = await getUserByEmail(email.trim().toLowerCase());
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Email not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await redis.set(`otp:${email.trim().toLowerCase()}`, otp, "EX", 120);
    await sendOTPEmail(email.trim().toLowerCase(), otp);

    return res.json({
      status: "success",
      message: "OTP sent to your email",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};


exports.verifyOtpHandler = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing email or OTP" });
    }
    const storedOtp = await redis.get(`otp:${email}`);

    if (!storedOtp || storedOtp.trim() !== String(otp).trim()) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid or expired OTP" });
    }

    const resetToken = Math.random().toString(36).substring(2);
    await redis.set(`reset:${email}`, resetToken, "EX", 300);

    await redis.del(`otp:${email}`);

    res.json({ status: "success", message: "OTP verified", resetToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

exports.resetPasswordHandler = async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    const storedToken = await redis.get(`reset:${email}`);
    if (!storedToken || storedToken !== resetToken) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid or expired reset token" });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updatePassword(user.user_id, hashedPassword);
    await redis.del(`reset:${email}`);

    res.json({ status: "success", message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

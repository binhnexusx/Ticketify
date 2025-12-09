const express = require("express");
const router = express.Router();
const {
  login,
  register,
  requestEmailChange,
  verifyEmailChange,
  changePassword,
  logout,
  forgotPasswordHandler,
  verifyOtpHandler,
  resetPasswordHandler,
} = require("../controllers/auth.controller");
const {
  refreshTokenController,
} = require("../controllers/refreshtoken.controller");
const authenticateToken = require("../middlewares/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshTokenController);
router.post("/logout", logout);

router.post("/forgot-password", forgotPasswordHandler);
router.post("/verify-otp", verifyOtpHandler);
router.post("/reset-password", resetPasswordHandler);
router.post("/request-email-change", authenticateToken, requestEmailChange);
router.post("/verify-email-change", authenticateToken, verifyEmailChange);
router.post("/change-password", authenticateToken, changePassword);

module.exports = router;

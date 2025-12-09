const jwt = require("jsonwebtoken");
const { findUserByRefreshToken } = require("../models/auth.model");

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const refreshTokenController = async (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "No token" });

  try {
    const user = await findUserByRefreshToken(refreshToken);
    if (!user.rows[0]) return res.status(403).json({ message: "Invalid token" });

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Token expired" });

      const newAccessToken = jwt.sign(
        { id: decoded.id, role: user.rows[0].role },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      res.json({ accessToken: newAccessToken });
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  refreshTokenController,
};

const userService = require("../services/user.service");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/avatars");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `avatar_${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

const getUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await userService.getUserById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const {
      first_name,
      last_name,
      email,
      phone,
      gender,
      date_of_birth,
      address,
      role,
      is_active,
    } = req.body;

    const currentUser = await userService.getUserById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    let avatar_url = currentUser.avatar_url;

    if (req.file) {
      avatar_url = `/uploads/avatars/${req.file.filename}`;
    } else if (req.body.avatar_url) {
      avatar_url = req.body.avatar_url;
    }

    const userData = {
      first_name,
      last_name,
      email,
      phone,
      gender,
      date_of_birth,
      address,
      role,
      is_active,
      avatar_url,
    };

    await userService.updateUser(userId, userData);

    const updatedUser = await userService.getUserById(userId);

    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createUser = async (req, res) => {
  try {
    console.log("➡️ [CREATE USER] req.body:", req.body);

    const { name, firstName, lastName, phone, email } = req.body;

    if (!name || !phone || !email) {
      return res
        .status(400)
        .json({ message: "name, phone, email are required" });
    }
    const password = "123456";

    const newUser = await userService.createUser({
      name,
      first_name: firstName,
      last_name: lastName,
      phone,
      email,
      password: "123456",
      role: "user",
    });

    console.log("✅ Created User:", newUser);

    return res.status(201).json({
      message: "User created",
      data: newUser,
    });
  } catch (err) {
    console.error("❌ CREATE USER ERROR:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  getUser,
  updateUser,
  upload,
  createUser,
};

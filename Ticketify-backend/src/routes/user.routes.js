const express = require("express");
const userController = require("../controllers/user.controller");
const authenticate = require('../middlewares/auth');
const uploadAvatar = require("../middlewares/uploadAvatar");
const router = express.Router();

router.get("/users/:id", userController.getUser);

router.put("/users/:id", uploadAvatar.single("avatar"), userController.updateUser);
router.post("/users", userController.createUser);

module.exports = router;
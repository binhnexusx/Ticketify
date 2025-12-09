const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedback.controller");

router.get("/", feedbackController.getAllFeedbacks);

module.exports = router;

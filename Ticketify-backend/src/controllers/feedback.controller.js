const feedbackService = require("../services/feedback.service");

const feedbackController = {
  getAllFeedbacks: async (req, res) => {
    try {
      const feedbacks = await feedbackService.getAllFeedbacks();
      res.status(200).json({ message: "Success", data: feedbacks });
    } catch (error) {
      console.error("Error getting feedbacks:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = feedbackController;

const feedbackRepository = require("../repositories/feedback.repository");

const feedbackService = {
  getAllFeedbacks: async () => {
    return await feedbackRepository.getAllFeedbacks();
  },
};

module.exports = feedbackService;

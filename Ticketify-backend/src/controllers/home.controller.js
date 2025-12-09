const homeService = require("../services/home.service");

const homeController = {
  getHomepageData: async (req, res) => {
    try {
      const data = await homeService.getHomepageData();
      res.status(200).json({ message: "Success", data });
    } catch (error) {
      console.error("Error in getHomepageData:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = homeController;

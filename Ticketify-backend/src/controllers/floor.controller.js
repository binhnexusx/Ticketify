const floorService = require("../services/floor.service");

const floorController = {
  getFloors: async (req, res, next) => {
    try {
      const floors = await floorService.getAllFloors();
      return res.status(200).json({ success: true, data: floors });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = floorController;
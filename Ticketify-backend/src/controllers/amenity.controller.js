const amenityService = require("../services/amenity.service");

const amenityController = {
  getAmenities: async (req, res, next) => {
    try {
      const amenities = await amenityService.getAllAmenities();
      return res.status(200).json({ success: true, data: amenities });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = amenityController;
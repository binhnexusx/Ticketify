const amenityRepository = require("../repositories/amenity.repository");

const amenityService = {
  getAllAmenities: async () => {
    return await amenityRepository.getAllAmenities();
  },
};

module.exports = amenityService;
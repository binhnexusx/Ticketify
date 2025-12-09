const floorRepository = require("../repositories/floor.repository");

const floorService = {
  getAllFloors: async () => {
    return await floorRepository.getAllFloors();
  },
};

module.exports = floorService;
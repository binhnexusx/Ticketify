const roomRepository = require("../repositories/room.repository");
const amenityRepository = require("../repositories/amenity.repository");
const feedbackRepository = require("../repositories/feedback.repository");

const homeService = {
  getHomepageData: async () => {
    const [rooms, amenities, feedbacks] = await Promise.all([
      roomRepository.getTopLuxuryRooms(3),
      amenityRepository.getTopUsedAmenities(8),
      feedbackRepository.getTopRatedFeedbacks(3),
    ]);

    return {
      rooms,
      topAmenities: amenities,
      topFeedbacks: feedbacks,
    };
  },
};

module.exports = homeService;

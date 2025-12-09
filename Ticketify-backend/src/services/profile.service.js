const {
  createHotelFeedbackRepo,
  countFavoriteRoomRepo,
  getFavoriteRoomRepo,
  deleteFavoriteRoomRepo,
  addFavoriteRoomRepo,
  createRoomFeedbackRepo,
  getUserAndRoomRepo
} = require("../repositories/profile.repository");

const createHotelFeedbackService = async (user_id, rating, comment) => {
  if (!rating || !comment) {
    throw new Error("Rating and comment are required");
  }

  return await createHotelFeedbackRepo(user_id, rating, comment);
};

const getFavoriteRoomService = async (page = 1, perPage = 10, user_id) => {
  const offset = (page - 1) * perPage;
  const [favoriteRoom, totalRoom] = await Promise.all([
    getFavoriteRoomRepo(user_id, perPage, offset),
    countFavoriteRoomRepo(user_id),
  ]);

  const totalPages = Math.ceil(totalRoom / perPage);

  return {
    total_room: totalRoom,
    favorite_room: favoriteRoom,
    pagination: {
      currentPage: page,
      perPage,
      totalPages,
      totalItems:totalRoom,
    },
  };
};

const deleteFavoriteRoomService = async (user_id, room_id ) => {
  const deleted = await deleteFavoriteRoomRepo(user_id, room_id);

  if (!deleted) {
    throw new Error('Favorite room not found or already deleted');
  }

  return { message: 'Favorite room deleted successfully' };
};

const addFavoriteRoomService = async (user_id, room_id) => {
  const added = await addFavoriteRoomRepo(user_id, room_id);

  if (!added) {
    throw new Error('Favorite room already in your favorite list')
  }

  return { message: 'Added to favorites successfully'}
}

const createRoomFeedbackService = async (user_id, booking_detail_id, rating, comment) => {
  const info = await getUserAndRoomRepo(booking_detail_id);

  if (!rating || !comment) {
    throw new Error("Rating and comment are required");
  }

  if (!info) {
    throw new Error("Booking detail not found");
  }

  if (info.user_id !== user_id) {
    throw new Error("You are not authorized to comment on this booking");
  }

  const room_id = info.room_id;
  const bookingDetailId = info.booking_detail_id
  await createRoomFeedbackRepo(booking_detail_id, rating, comment);

  return {
    room_id: room_id,
    booking_detail_id: bookingDetailId,
    result: {
      rating,
      comment
    }
  }
};
module.exports = {
  createHotelFeedbackService,
  getFavoriteRoomService,
  deleteFavoriteRoomService,
  addFavoriteRoomService,
  createRoomFeedbackService
};

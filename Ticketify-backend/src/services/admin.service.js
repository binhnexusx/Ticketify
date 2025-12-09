const { getCheckinGuestsRepo, 
  getCheckoutGuestsRepo, 
  getAdminDashboardStatusRepo, 
  getAdminDashboardDealRepo , 
  getFeedbackRepo, 
  getTop5MostBookedRoomsRepo, 
  getHotelFeedbackRepo, 
  getGuestListRepo, 
  countGuestListRepo, 
  getUserListRepo,
  updateUserStatusRepo,
getRateRepo,
getTotalRevenueRepo,
getBestSellerRoomRepo,
totalRoomRepo,
getRateDetailRepo
} = require('../repositories/admin.repository');

const { mapUserBookings } = require('../utils/mapUserBookings');

const getUserListService = async (page, perPage) => {
  const offset = (page - 1) * perPage;
  const { users: rows, totalUsers } = await getUserListRepo(perPage, offset);

  return {
    users: mapUserBookings(rows),
    pagination: {
      total: totalUsers,
      page,
      perPage,
      totalPages: Math.ceil(totalUsers / perPage)
    }
  };
};

const getCheckinGuestsService = async (page = 1, perPage = 10) => {
  const offset = (page - 1) * perPage;
  const { users: rows, totalUsers } = await getCheckinGuestsRepo(perPage, offset);

  return {
    users: mapUserBookings(rows, ['is_active']),
    pagination: {
      total: totalUsers,
      page,
      perPage,
      totalPages: Math.ceil(totalUsers / perPage)
    }
  };
};

const getCheckoutGuestsService = async (page = 1, perPage = 10) => {
  const offset = (page - 1) * perPage;
  const { users: rows, totalUsers } = await getCheckoutGuestsRepo(perPage, offset);

  return {
    users: mapUserBookings(rows, ['is_active']),
    pagination: {
      total: totalUsers,
      page,
      perPage,
      totalPages: Math.ceil(totalUsers / perPage)
    }
  };
};

const getAdminDashboardStatusService = async () => {
  return await getAdminDashboardStatusRepo();  
}

const getAdminDashboardDealService = async () => {
  return await getAdminDashboardDealRepo(); 
}

const getFeedbackService = async () => {
  return await getFeedbackRepo();
};

const getHotelFeedbackService = async () => {
  return await getHotelFeedbackRepo();
}

const getTop5MostBookedRoomsService = async (month, year) => {
  if (!month || !year) {
    throw new Error('Month and year are required');
  }
  return await getTop5MostBookedRoomsRepo(month, year);
};

const getGuestListService = async (page = 1, perPage = 10) => {
  const offset = (page - 1) * perPage;

  const [guests, totalItems] = await Promise.all([
    getGuestListRepo(perPage, offset),
    countGuestListRepo(),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    guests,
    pagination : {
      currentPage: page,
      perPage,
      totalPages,
      totalItems,
    },
  };
};

const updateUserStatusService = async (user_id, status) => {
  if (!['active', 'blocked'].includes(status.toLowerCase())) {
    throw new Error('Invalid status');
  }
  return await updateUserStatusRepo(user_id, status);
}


const getRateService = async (page = 1, perPage = 10, month, year) => {
  const offset = (page - 1) * perPage;
  if (!month || !year) {
      throw new Error('Month and year are required');
    }
  const [rate, totalItems, best_seller_room, total_nenevue] = await Promise.all([
    getRateRepo(perPage, offset, month, year),
    totalRoomRepo(month, year),
    getBestSellerRoomRepo(month, year),
    getTotalRevenueRepo(month, year)
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    total_room: totalItems,
    best_seller_room,
    total_nenevue,
    rate,
    pagination: {
      currentPage: page,
      perPage,
      totalPages,
      totalItems,
    },
  };
};

const getRateDetailService = async (room_id, month, year) => {
  if (!room_id || !month || !year) {
    throw new Error('Room ID, month, and year are required');
  }
  return await getRateDetailRepo(room_id, month, year);
}

module.exports = {
  getUserListService,
  getCheckinGuestsService,
  getCheckoutGuestsService,
  getAdminDashboardStatusService,
  getAdminDashboardDealService,
  getFeedbackService,
  getHotelFeedbackService,
  getTop5MostBookedRoomsService,
  getGuestListService,
  updateUserStatusService,
  getRateService,
  getRateDetailService
};

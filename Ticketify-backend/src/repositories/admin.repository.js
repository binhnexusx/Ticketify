const {getUserListModel,
    countUsersModel,
    getCheckinGuestsModel, 
    countCheckinGuestsModel,
    getCheckoutGuestsModel, 
    countCheckoutGuestsModel,
    getAdminDashboardStatusModel, 
    getAdminDashboardDealModel, 
    getFeedbackModel, 
    getTop5MostBookedRoomsModel, 
    getHotelFeedbackModel, 
    getGuestListModel,
    countGuestListModel,
    updateUserStatusModel,
    getRateModel,
    getTotalRevenueModel,
getBestSellerRoomModel,
totalRoomModel,
getRateDetailModel
} = require('../models/admin.model');

const getUserListRepo = async (limit, offset) => {
  const users = await getUserListModel(limit, offset);
  const totalUsers = await countUsersModel();
  return { users, totalUsers };
};

const getCheckinGuestsRepo = async (limit, offset) => {
  const users = await getCheckinGuestsModel(limit, offset);
  const totalUsers = await countCheckinGuestsModel();
  return { users, totalUsers };
};

const getCheckoutGuestsRepo = async (limit, offset) => {
  const users = await getCheckoutGuestsModel(limit, offset);
  const totalUsers = await countCheckoutGuestsModel();
  return { users, totalUsers };
};


const getAdminDashboardStatusRepo = async () => {
    return await getAdminDashboardStatusModel();
}

const getAdminDashboardDealRepo = async () => {
    return await getAdminDashboardDealModel(); 
}

const getFeedbackRepo = async () => {
    return await getFeedbackModel();
}

const getTop5MostBookedRoomsRepo = async (month, year) => {
    return await getTop5MostBookedRoomsModel(month, year);
}

const getHotelFeedbackRepo = async () => {
  return await getHotelFeedbackModel();
}

const getGuestListRepo = async (limit, offset)  => {
    return await getGuestListModel(limit, offset) ;
}

const countGuestListRepo = async () => {
    return await countGuestListModel();
}

const updateUserStatusRepo = async (user_id, status) => {
    return await updateUserStatusModel(user_id, status);
}

const getRateRepo = async (limit, offset, month, year) => {
    return await getRateModel(limit, offset, month, year);
}

const getTotalRevenueRepo = async (month, year) => {
  return await getTotalRevenueModel(month, year);
};

const getBestSellerRoomRepo = async (month, year) => {
    return await getBestSellerRoomModel(month, year)
}
const totalRoomRepo = async (month, year) => {
    return await totalRoomModel(month, year);
}

const getRateDetailRepo = async (room_id, month, year) => {
    return await getRateDetailModel(room_id, month, year);
}
module.exports = {
    getUserListRepo,
    getCheckinGuestsRepo,
    getCheckoutGuestsRepo,
    getAdminDashboardStatusRepo,
    getAdminDashboardDealRepo,
    getFeedbackRepo,
    getTop5MostBookedRoomsRepo,
    getHotelFeedbackRepo,
    getGuestListRepo,
    countGuestListRepo,
    updateUserStatusRepo,
    getRateRepo,
    getTotalRevenueRepo,
    getBestSellerRoomRepo,
    totalRoomRepo,
    getRateDetailRepo
}
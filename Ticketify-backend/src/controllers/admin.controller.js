const {
  getUserListService,
  getCheckinGuestsService,
  getCheckoutGuestsService,
  getAdminDashboardStatusService,
  getAdminDashboardDealService,
  getFeedbackService,
  getTop5MostBookedRoomsService,
  getHotelFeedbackService,
  getGuestListService,
  updateUserStatusService,
  getRateService,
  getRateDetailService
} = require("../services/admin.service");
const { success, sendError } = require("../utils/response");

const getUserListController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    const { users, pagination } = await getUserListService(page, perPage);

    return success(res, { users, pagination }, "Get user list successfully");
  } catch (err) {
    console.error("Error fetching customer bookings:", err);
    return sendError(res, 500, "Error while getting user list");
  }
};

const getCheckinGuestsController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    const { users, pagination } = await getCheckinGuestsService(page, perPage);

    return success(res, { users, pagination }, "Get check-in guests successfully");
  } catch (error) {
    console.error("Error fetching check-in guests:", error);
    return sendError(res, 500, "Error while getting check-in guests");
  }
};

const getCheckoutGuestsController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    const { users, pagination } = await getCheckoutGuestsService(page, perPage);

    return success(res, { users, pagination }, "Get checkout guests successfully");
  } catch (error) {
    console.error("Error fetching checkout guests:", error);
    return sendError(res, 500, "Error while getting checkout guests");
  }
};


const getAdminDashboardStatusController = async (req, res) => {
  try {
    const status = await getAdminDashboardStatusService();
    return success(res, status, "Get admin dashboard status successfully");
  } catch (err) {
    console.error("Error fetching admin dashboard status:", err);
    return sendError(res, 500, "Error while getting admin dashboard status");
  }
};

const getAdminDashboardDealController = async (req, res) => {
  try {
    const deals = await getAdminDashboardDealService();
    return success(res, deals, "Get admin dashboard deals successfully");
  } catch (err) {
    console.error("Error fetching admin dashboard deals:", err);
    return sendError(res, 500, "Error while getting admin dashboard deals");
  }
};

const getFeedbackController = async (req, res) => {
  try {
    const feedbacks = await getFeedbackService();
    return success(res, feedbacks, "Get feedbacks successfully");
  } catch (err) {
    console.error("Error fetching feedbacks:", err);
    return sendError(res, 500, "Error while getting feedbacks");
  }
};

const getTop5MostBookedRoomsController = async (req, res) => {
  try {
    const { month, year } = req.query;

    // const currentYear = new Date().getFullYear();

    if (!month || !year) {
      return sendError(res, 400, "Month and year are required");
    }

    // if (Number(year) > currentYear) {
    //   return sendError(
    //     res,
    //     400,
    //     `Cannot select future year beyond ${currentYear}`
    //   );
    // }

    const rooms = await getTop5MostBookedRoomsService(
      Number(month),
      Number(year)
    );

    if (!rooms || rooms.length === 0) {
      return success(res, [], "No data found for the selected month and year");
    }

    return success(res, rooms, "Get top 5 most booked rooms successfully");
  } catch (err) {
    console.error("Error fetching top 5 most booked rooms:", err);
    return sendError(res, 500, "Error while getting top 5 most booked rooms");
  }
};

const getHotelFeedbackController = async (req, res) => {
  try {
    const feedbacks = await getHotelFeedbackService();
    return success(res, feedbacks, "Get hotel feedbacks successfully");
  } catch (err) {
    console.error("Error fetching hotel feedbacks:", err);
    return sendError(res, 500, "Error while getting hotel feedbacks");
  }
};

const getGuestListController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    const result = await getGuestListService(page, perPage);
    return success(res, result, "Get guest list successfully");
  } catch (error) {
    console.error("Error fetching guest list:", error);
    return sendError(res, 500, "Error while getting guest list");
  }
};

const updateUserStatusController = async (req, res) => {
  const user_id = parseInt(req.params.user_id);
  const { status } = req.body;

  if (!user_id || !status) {
    return sendError(res, 400, "Missing user ID or status");
  }

  try {
    const result = await updateUserStatusService(user_id, status);
    return success(res, result, "User status updated successfully");
  } catch (error) {
    console.error("Error updating user status:", error);
    return sendError(res, 500, "Failed to update user status");
  }
};

const getRateController = async (req, res) => {
  try {
    const { month, year } = req.query;
    // const currentYear = new Date().getFullYear();

    if (!month || !year) {
      return sendError(res, 400, "Month and year are required");
    }

    // if (Number(year) > currentYear) {
    //   return sendError(
    //     res,
    //     400,
    //     `Cannot select future year beyond ${currentYear}`
    //   );
    // }
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const data = await getRateService(
      page,
      perPage,
      Number(month),
      Number(year)
    );
    if (!data || data.length === 0) {
      return success(res, [], "No data found for the selected month and year");
    }

    return success(res, data, "Get rate successfully");
  } catch (error) {
    console.error("Error fetching rate:", error);
    return sendError(res, 500, "Failed to fetch rate data");
  }
};

const getRateDetailController = async (req, res) => {
  const { room_id } = req.params;
   const { month, year } = req.query;

  if (!room_id || !month || !year) {
    return sendError(res, 400, "Room ID, month, and year are required");
  }

  try {
    const rateDetail = await getRateDetailService(room_id,month,year);
    return success(res, rateDetail, "Get rate detail successfully");
  } catch (error) {
    console.error("Error fetching rate detail:", error);
    return sendError(res, 500, "Failed to fetch rate detail");
  }
};
module.exports = {
  getUserListController,
  getCheckinGuestsController,
  getCheckoutGuestsController,
  getAdminDashboardStatusController,
  getAdminDashboardDealController,
  getFeedbackController,
  getTop5MostBookedRoomsController,
  getHotelFeedbackController,
  getGuestListController,
  updateUserStatusController,
  getRateController,
  getRateDetailController
};

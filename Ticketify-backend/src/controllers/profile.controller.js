const {
  createHotelFeedbackService,
  getFavoriteRoomService,
  deleteFavoriteRoomService,
  addFavoriteRoomService,
  createRoomFeedbackService
} = require("../services/profile.service");
const { success, sendError } = require("../utils/response");

const createHotelFeedbackController = async (req, res) => {
  try {
    const { user_id, rating, comment } = req.body;

    if (!user_id || !rating || !comment) {
      return sendError(res, 400, "User ID, rating, and comment are required");
    }

    const feedback = await createHotelFeedbackService(user_id, rating, comment);
    return success(res, feedback, "Hotel feedback created successfully");
  } catch (err) {
    console.error("Error creating hotel feedback:", err);
    return sendError(res, 500, "Error while creating hotel feedback");
  }
};

const getFavoriteRoomController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.limit) || 10;

    const user_id = req.user?.id;

    if (!user_id) {
      return sendError(res, 401, "Unauthorized");
    }
    const data = await getFavoriteRoomService(page, perPage, user_id);
    return success(res, data, "Get rate successfully");
  } catch (error) {
    console.error("Error fetching rate:", error);
    return sendError(res, 500, "Failed to fetch rate data");
  }
};

const deleteFavoriteRoomController = async (req, res) => {
  try {
    const user_id = req.user?.id;
    const { room_id } = req.params;

    if (!room_id) {
      return sendError(res, 400, "room_id is required")
    }

    const result = await deleteFavoriteRoomService(user_id, room_id);
    return success(res, result, "Delete favorite room successfully");
  } catch (error) {
    console.log("Error deleting favorite room", error);
    return sendError(res, 500, "Failed to delete room");
  }
};

const addFavoriteRoomController = async (req, res) => {
  try {
    const user_id = req.user?.id;
    const { room_id } = req.params;

    if (!room_id) {
      return sendError(res, 400, "room_id is required");
    }

    const result = await addFavoriteRoomService(user_id, room_id);
    return success(res, result, "Add room to favorite list successfully");

  } catch (error) {
    console.log("Error adding room to favorite list", error);

    if (error.message === "Favorite room already in your favorite list") {
      return sendError(res, 409, error.message); 
    }

    return sendError(res, 500, "Failed to add room to favorite list");
  } 
};

const createRoomFeedbackController = async (req, res) => {
  try {
    const { booking_detail_id, rating, comment } = req.body;
    const user_id = req.user?.id;

    if (!booking_detail_id || !rating || !comment) {
      return sendError(res, 400, "Missing required fields")
    }

    const result = await createRoomFeedbackService(user_id,booking_detail_id, rating, comment);

    if (result) {
      return success(res, result, "Feedback submitted successfully")
    } else {
      return sendError(res, 500, "Failed to create feedback")
    }
  } catch (error) {
    console.error("Error creating room feedback:",error);
    return sendError(res, 500, "Server error")
  }
};
module.exports = {
  createHotelFeedbackController,
  getFavoriteRoomController,
  deleteFavoriteRoomController,
  addFavoriteRoomController,
  createRoomFeedbackController
};

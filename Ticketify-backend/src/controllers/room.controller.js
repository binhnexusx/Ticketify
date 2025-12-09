const roomService = require("../services/room.service");
const response = require("../utils/response");

const roomController = {
  getAllRooms: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const perPage = parseInt(req.query.perPage, 10) || 10;

      const result = await roomService.getAllRooms(page, perPage);

      return res.status(200).json({
        status: "success",
        message: "Fetched data",
        data: result.data,
        pagination: result.pagination,
      });
    } catch (err) {
      console.error("[getAllRooms] Error:", err.message);
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },
  getRoomById: async (req, res, next) => {
    try {
      const room = await roomService.getRoomById(req.params.id);
      if (!room) return response.sendError(res, 404, "Room not found");
      return response.success(res, room, "Room found");
    } catch (err) {
      return response.sendError(res, 500, err.message);
    }
  },

  createRoom: async (req, res, next) => {
    try {
      const roomData = { ...req.body };

      // Kiểm tra trùng room name
      const existingRoom = await roomService.findRoomByName(roomData.name);
      if (existingRoom) {
        return response.sendError(res, 400, "Room number already exists");
      }

      if (Array.isArray(roomData.image_urls)) {
        roomData.image_urls = roomData.image_urls.map((name) => {
          if (name.startsWith("/uploads/rooms/")) return name;
          if (name.startsWith("/uploads/"))
            return name.replace("/uploads/", "/uploads/rooms/");
          return "/uploads/rooms/" + name;
        });
      }

      if (req.files && req.files.length > 0) {
        roomData.image_urls = req.files.map(
          (f) => "/uploads/rooms/" + f.filename
        );
      }

      const newRoom = await roomService.createRoom(roomData);
      return response.success(res, newRoom, "Room created", 201);
    } catch (err) {
      return response.sendError(res, 400, err.message);
    }
  },

  updateRoom: async (req, res, next) => {
    try {
      const roomData = { ...req.body };
      if (Array.isArray(roomData.image_urls)) {
        roomData.image_urls = roomData.image_urls.map((name) => {
          if (name.startsWith("/uploads/rooms/")) return name;
          if (name.startsWith("/uploads/"))
            return name.replace("/uploads/", "/uploads/rooms/");
          return "/uploads/rooms/" + name;
        });
      }
      if (req.files && req.files.length > 0) {
        roomData.image_urls = req.files.map(
          (f) => "/uploads/rooms/" + f.filename
        );
      }
      const updated = await roomService.updateRoom(req.params.id, roomData);
      if (!updated) return response.sendError(res, 404, "Room not found");
      return response.success(res, updated, "Room updated");
    } catch (err) {
      return response.sendError(res, 400, err.message);
    }
  },

  deleteRoom: async (req, res, next) => {
    try {
      const deleted = await roomService.deleteRoom(req.params.id);
      if (!deleted) return response.sendError(res, 404, "Room not found");
      return response.success(res, null, "Room deleted successfully", 200);
    } catch (err) {
      return response.sendError(res, 500, err.message);
    }
  },

  filterRooms: async (req, res, next) => {
    try {
      // Thêm phân trang parameters
      const page = Number.parseInt(req.query.page, 10) || 1;
      const perPage = Number.parseInt(req.query.perPage, 10) || 22; // Mặc định 5 items

      const filters = {
        min_price: req.query.min_price ? Number.parseFloat(req.query.min_price) : undefined,
        max_price: req.query.max_price ? Number.parseFloat(req.query.max_price) : undefined,
        room_type: req.query.room_type ? Number.parseInt(req.query.room_type) : undefined,
        people: req.query.people ? Number.parseInt(req.query.people) : undefined,
        check_in_date: req.query.check_in_date || undefined,
        check_out_date: req.query.check_out_date || undefined,
        amenities: req.query.amenities || undefined,
        has_deal: req.query.has_deal || undefined,
        status: req.query.status || undefined,
        room_level: req.query.room_level ? Number.parseInt(req.query.room_level) : undefined,
        floor: req.query.floor ? Number.parseInt(req.query.floor) : undefined,
        rating: req.query.rating ? Number.parseInt(req.query.rating) : undefined, // **Thêm dòng này**
      };

      // Gọi service với pagination
      const result = await roomService.getFilteredRooms(filters, page, perPage);

      const roomsWithDeals = result.data.map((room) => ({
        ...room,
        deal_title: room.deal ? room.deal.deal_name : null,
        deal_discount_rate: room.deal ? room.deal.discount_rate : null,
      }));

      const hasDeals = roomsWithDeals.some((room) => room.deal_title !== null);

      return response.success(
        res,
        {
          rooms: roomsWithDeals,
          hasDeals,
          pagination: result.pagination,
        },
        "Filtered rooms"
      );
    } catch (error) {
      return response.sendError(res, 500, error.message);
    }
  },
  getRoomDetail: async (req, res, next) => {
    try {
      const roomId = Number(req.params.id);
      const room = await roomService.getRoomDetail(roomId);

      if (!room) {
        return response.sendError(res, 404, "Room not found");
      }

      return response.success(res, room, "Room details fetched successfully");
    } catch (err) {
      return response.sendError(res, 500, err.message);
    }
  },
  getFilterOptions: async (req, res, next) => {
    try {
      const filterOptions = await roomService.getFilterOptions();
      return response.success(
        res,
        filterOptions,
        "Filter options fetched successfully"
      );
    } catch (err) {
      console.error("[getFilterOptions] Error:", err.message);
      return response.sendError(res, 500, err.message);
    }
  },
  getRoomsByStatus: async (req, res) => {
    try {
      const status = req.params.status;
      const page = parseInt(req.query.page, 10) || 1;
      const perPage = parseInt(req.query.perPage, 10) || 10;
      const result = await roomService.getRoomsByStatus(status, page, perPage);
      return res.status(200).json({
        status: "success",
        message: `Fetched rooms with status: ${status}`,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },

  removeDealFromRoom: async (req, res) => {
    try {
      const roomId = Number(req.params.id);

      const updatedRoom = await roomService.removeDealFromRoom(roomId);

      res.status(200).json({
        status: "success",
        message: "Deal removed from room successfully",
        data: updatedRoom,
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  },
};

module.exports = roomController;

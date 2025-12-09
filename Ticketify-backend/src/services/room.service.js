const roomRepository = require("../repositories/room.repository");

const roomService = {
  async getRoomDetail(id) {
    const room = await roomRepository.getRoomDetail(id);
    if (!room) throw new Error("ROOM_NOT_FOUND");
    return room;
  },

  getFilteredRooms: async (filters, page = 1, perPage = 5) => {
    const result = await roomRepository.getFilteredRooms(
      filters,
      page,
      perPage
    );
    return result;
  },

  findRoomById: async (id) => {
    return await roomRepository.findRoomById(id);
  },

  createRoom: async (roomData) => {
    return await roomRepository.createRoom(roomData);
  },

  getAllRooms: async (page, perPage) => {
    return await roomRepository.getAll(page, perPage);
  },
  getRoomsByStatus: async (status, page = 1, perPage = 10) => {
    return await roomRepository.getRoomsByStatus(status, page, perPage);
  },

  getRoomById: async (id) => {
    const room = await roomRepository.getById(id);
    if (!room) {
      throw new Error("Room not found");
    }
    return room;
  },

  updateRoom: async (id, roomData) => {
    const updatedRoom = await roomRepository.update(id, roomData);
    if (!updatedRoom) {
      throw new Error("Failed to update. Room not found.");
    }
    return updatedRoom;
  },

  deleteRoom: async (id) => {
    const deletedRoom = await roomRepository.remove(id);
    if (!deletedRoom) {
      throw new Error("Failed to delete. Room not found.");
    }
    return deletedRoom;
  },

  getFilterOptions: async () => {
    try {
      const filterOptions = await roomRepository.getFilterOptions();
      return filterOptions;
    } catch (error) {
      throw new Error(`Failed to get filter options: ${error.message}`);
    }
  },
  findRoomByName: async (name) => {
    return await roomRepository.findRoomByName(name);
  },

  removeDealFromRoom: async (roomId) => {
    const updatedRoom = await roomRepository.removeDeal(roomId);
    if (!updatedRoom) {
      throw new Error("Room not found or deal already removed.");
    }
    return updatedRoom;
  },
};

module.exports = roomService;

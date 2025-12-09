const roomRepository = require("../repositories/room.repository");

exports.assignDeal = async (room_id, deal_id) => {
  return await roomRepository.updateDeal(room_id, deal_id);
};

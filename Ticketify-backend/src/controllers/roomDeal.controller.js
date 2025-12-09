const roomDealService = require("../services/roomDeal.service");

exports.assignDealToRoom = async (req, res) => {
  const { room_id } = req.params;
  const { deal_id } = req.body;
  try {
    const room = await roomDealService.assignDeal(room_id, deal_id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json({ message: "Deal assigned successfully", room });
  } catch (error) {
    res.status(500).json({ message: "Error assigning deal", error });
  }
};

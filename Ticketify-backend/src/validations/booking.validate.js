const roomRepo = require('../repositories/room.repository');
const Joi = require('joi');

async function validateBookingInput({ roomId, checkInDate, checkOutDate, totalGuests = 1 }) {
  const errors = [];

  const today = new Date().setHours(0, 0, 0, 0);
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  if (!checkInDate || checkIn < today)
    errors.push('Check‑in date must be today or later');
  if (!checkOutDate || checkOut <= checkIn)
    errors.push('Check‑out date must be after check‑in date');

  const room = await roomRepo.getRoomDetail(roomId);
  if (!room) {
    errors.push('Room not found');
    return errors;
  }

  const isFree = await roomRepo.isRoomAvailable(roomId, checkInDate, checkOutDate);
  if (!isFree) errors.push('Room is unavailable for the selected dates');

  return errors;
}   

const bookingIdParamSchema = Joi.object({
  booking_id: Joi.number().integer().positive().required()
});

module.exports = {
  validateBookingInput,
  bookingIdParamSchema,
};

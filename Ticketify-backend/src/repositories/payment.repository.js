const Payment = require('../models/payment.model');
// func check have already paid to prevent handlepayment
const checkPaymentExists = async (booking_id) => {
  return await Payment.existsByBookingId(booking_id);
};

const createPayment = async (paymentData) => {
  return await Payment.create(paymentData); 
};

module.exports = {
  checkPaymentExists,
  createPayment,
};

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const authenticate = require('../middlewares/auth');

router.post('/payment/success', authenticate,paymentController.handlePaymentSuccess);
router.get('/payment/:booking_id', authenticate, paymentController.getSavedPayment);
router.put('/payment/:booking_id', authenticate, paymentController.updatePayment);
module.exports = router;

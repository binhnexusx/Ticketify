const paymentService = require("../services/payment.service");
const { success, sendError } = require("../utils/response");
const { validatePaymentInput } = require("../validations/payment.validate");

function parseExpDate(exp_date) {
  if (/^\d{2}-\d{2}-\d{4}$/.test(exp_date)) {
    const [day, month, year] = exp_date.split('-');
    return new Date(`${year}-${month}-${day}`);
  }
  return null;
}

function formatDateToDDMMYYYY(date) {
  const d = new Date(date);
  const day = `${d.getDate()}`.padStart(2, '0');
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

exports.handlePaymentSuccess = async (req, res) => {
  try {
    const { valid, data, message } = validatePaymentInput(req.body);

    if (!valid) {
      return sendError(res, 400, message);
    }

    const result = await paymentService.handleSuccess(data);

    if (!result) {
      return sendError(res, 400, "Booking not found or update failed");
    }

    return success(res, null, "Payment processed successfully");
  } catch (err) {
    console.error("[Payment Error]", err);
    return sendError(res, 500, "Internal server error");
  }
};

exports.getSavedPayment = async (req, res) => {
  try {
    const booking_id = req.params.booking_id;
    if (!booking_id) {
      return sendError(res, 400, "Missing booking_id");
    }

    const data = await paymentService.getPaymentByBookingId(booking_id);
    if (!data) {
      return sendError(res, 404, "No saved payment info");
    }

    const formatted = {
      card_name: data.card_name,
      card_number: data.card_number,
      exp_date: formatDateToDDMMYYYY(data.exp_date),
      method: data.method,
    };

    return success(res, formatted, "Fetched payment info");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const { booking_id, card_name, card_number, exp_date, method } = req.body;

    if (!booking_id) return sendError(res, 400, "Missing booking_id");

    if (!card_name || !/^[\p{L}\s]+$/u.test(card_name)) {
      return sendError(res, 400, "Please enter a valid card name");
    }

    if (!/^\d{16}$/.test(card_number)) {
      return sendError(res, 400, "Invalid card number");
    }

    const parsedExpDate = parseExpDate(exp_date);
    if (!parsedExpDate) {
      return sendError(res, 400, "Invalid expiration date format (expected DD-MM-YYYY)");
    }

    const now = new Date();
    if (parsedExpDate < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
      return sendError(res, 400, "Card expired");
    }

    const updated = await paymentService.updateOrCreatePayment(booking_id, {
      card_name,
      card_number,
      exp_date: parsedExpDate,
      method,
    });

    return success(res, {
      card_name: updated.card_name,
      card_number: updated.card_number,
      exp_date: formatDateToDDMMYYYY(updated.exp_date),
      method: updated.method,
    }, "Payment method updated successfully");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

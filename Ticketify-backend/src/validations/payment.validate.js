// utils/validation.js

function validatePaymentInput(data) {
  const errors = [];

  if (!data.booking_id) errors.push("Booking ID is required");
  if (!data.amount) errors.push("Amount is required");
  if (!data.method) errors.push("Payment method is required");
  if (!data.card_name) errors.push("Card name is required");
  if (!data.card_number || data.card_number.length !== 16) errors.push("Card number must be 16 digits");
  if (!data.exp_date) {
    errors.push("Expiration date is required");
  }

  let formattedExpDate = data.exp_date;
  if (data.exp_date && /^(0[1-9]|1[0-2])\/\d{2}$/.test(data.exp_date)) {
    const [month, year] = data.exp_date.split('/');
    formattedExpDate = new Date(`20${year}-${month}-01`);
  } else if (data.exp_date && !/^\d{4}-\d{2}-\d{2}$/.test(data.exp_date)) {
    errors.push("Expiration date format must be MM/YY or YYYY-MM-DD");
  }

  if (errors.length > 0) {
    return { valid: false, message: errors.join(', ') };
  }

  return {
    valid: true,
    data: {
      ...data,
      exp_date: formattedExpDate,
    }
  };
}

module.exports = {
  validatePaymentInput,
};

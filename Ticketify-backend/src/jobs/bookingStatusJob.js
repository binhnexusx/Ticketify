const cron = require("node-cron");
const bookingService = require("../services/booking.service");
const dayjs = require("../utils/dayjs");

cron.schedule("*/10 * * * * *", async () => {
  const now = dayjs();
  const today = now.format("YYYY-MM-DD");
  const time = now.format("HH:mm:ss");

  // console.log(`[${today} ${time}] 🔁 Booking cron job started`);

  try {
    const checkinCount = await bookingService.autoUpdateCheckinStatus();
    const checkoutCount = await bookingService.autoUpdateCheckoutStatus();

    // console.log(
    //   `[${today} ${time}] ✅ Updated check-in: ${checkinCount}, check-out: ${checkoutCount},delete:${deletedCount}`
    // );
  } catch (err) {
    console.error(`[${today} ${time}] ❌ Cron job error:`, err);
  }
});

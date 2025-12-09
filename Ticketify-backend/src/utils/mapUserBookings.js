function mapUserBookings(rows, extraFields = []) {
  const usersMap = {};

  for (const row of rows) {
    if (!usersMap[row.user_id]) {
      const baseUser = {
        user_id: row.user_id,
        email: row.email,
        role: row.role,
        name: row.name,
        phone: row.phone,
        bookings: [],
      };

      extraFields.forEach((field) => {
        baseUser[field] = row[field];
      });

      usersMap[row.user_id] = baseUser;
    }

    if (row.booking_id) {
      let booking = usersMap[row.user_id].bookings.find(
        (b) => b.booking_id === row.booking_id
      );
      if (!booking) {
        booking = {
          booking_id: row.booking_id,
          status: row.booking_status,
          total_price: row.total_price,
          booking_details: [],
        };
        usersMap[row.user_id].bookings.push(booking);
      }

      if (row.booking_detail_id) {
        booking.booking_details.push({
          booking_detail_id: row.booking_detail_id,
          price_per_unit: row.price_per_unit,
          check_in_date: row.check_in_date,
          check_out_date: row.check_out_date,
          room: {
            room_id: row.room_id,
            name: row.room_name,
            description: row.room_description,
            room_type_id: row.room_type_id,
            floor_id: row.floor_id,
          },
        });
      }
    }
  }

  return Object.values(usersMap);
}

module.exports = { mapUserBookings };

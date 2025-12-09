const Room = require("../models/room.model");
const pool = require("../config/db");
const dayjs = require("../utils/dayjs");

const roomRepository = {
  getRoomsByStatus: async (status, page = 1, perPage = 10) => {
    const countResult = await pool.query(
      "SELECT COUNT(*) FROM rooms WHERE status = $1",
      [status]
    );
    const totalItems = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalItems / perPage);
    const offset = (page - 1) * perPage;

    const result = await pool.query(
      `
    SELECT 
      r.room_id, r.name, r.description, r.status,
      r.room_type_id, r.room_level_id, r.floor_id,
      rt.name AS room_type_name, rt.max_people, rt.price AS room_type_price,
      rl.name AS room_level_name, rl.price AS room_level_price,
      (COALESCE(rt.price, 0) + COALESCE(rl.price, 0)) AS total_price,
      f.name AS floor_name,
      d.deal_id AS deal_id,
      d.deal_name AS deal_name,
      d.discount_rate AS deal_discount_rate,
      d.start_date AS deal_start_date,
      d.end_date AS deal_end_date
    FROM rooms r
    LEFT JOIN room_types rt ON r.room_type_id = rt.room_type_id
    LEFT JOIN room_levels rl ON r.room_level_id = rl.room_level_id
    LEFT JOIN floors f ON r.floor_id = f.floor_id
    LEFT JOIN deals d ON r.deal_id = d.deal_id
    WHERE r.status = $1
    ORDER BY r.room_id DESC
    LIMIT $2 OFFSET $3
    `,
      [status, perPage, offset]
    );

    const rooms = result.rows;
    const roomIds = rooms.map((r) => r.room_id);

    const amenities = await pool.query(
      `
    SELECT ra.room_id, a.amenity_id, a.name, a.icon
    FROM room_amenities ra
    JOIN amenities a ON a.amenity_id = ra.amenity_id
    WHERE ra.room_id = ANY($1::int[])
    `,
      [roomIds]
    );

    const images = await pool.query(
      `SELECT room_id, image_url FROM room_images WHERE room_id = ANY($1::int[])`,
      [roomIds]
    );

    const amenitiesMap = {};
    for (const row of amenities.rows) {
      if (!amenitiesMap[row.room_id]) amenitiesMap[row.room_id] = [];
      amenitiesMap[row.room_id].push(row);
    }

    const imagesMap = {};
    for (const row of images.rows) {
      if (!imagesMap[row.room_id]) imagesMap[row.room_id] = [];
      imagesMap[row.room_id].push(row.image_url);
    }

    const fullRooms = rooms.map((room) => {
      const price = (room.room_type_price || 0) + (room.room_level_price || 0);
      const deal = room.deal_name
        ? {
            deal_id: room.deal_id,
            deal_name: room.deal_name,
            discount_rate: room.deal_discount_rate,
            start_date: room.deal_start_date,
            end_date: room.deal_end_date,
          }
        : null;
      return {
        ...room,
        price,
        amenities: amenitiesMap[room.room_id] || [],
        images: imagesMap[room.room_id] || [],
        deal,
      };
    });

    return {
      data: fullRooms,
      pagination: {
        currentPage: page,
        perPage,
        totalPages,
        totalItems,
      },
    };
  },

  getAll: async (page = 1, perPage = 10) => {
    const countResult = await pool.query("SELECT COUNT(*) FROM rooms");
    const totalItems = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalItems / perPage);
    const offset = (page - 1) * perPage;

    const result = await pool.query(
      `
      SELECT 
        r.room_id, r.name, r.description, r.status,
        r.room_type_id, r.room_level_id, r.floor_id,
        rt.name AS room_type_name, rt.max_people, rt.price AS room_type_price,
        rl.name AS room_level_name, rl.price AS room_level_price,
        (COALESCE(rt.price, 0) + COALESCE(rl.price, 0)) AS total_price,
        f.name AS floor_name,
        d.deal_id AS deal_id,
        d.deal_name AS deal_name,
        d.discount_rate AS deal_discount_rate,
        d.start_date AS deal_start_date,
        d.end_date AS deal_end_date
      FROM rooms r
      LEFT JOIN room_types rt ON r.room_type_id = rt.room_type_id
      LEFT JOIN room_levels rl ON r.room_level_id = rl.room_level_id
      LEFT JOIN floors f ON r.floor_id = f.floor_id
      LEFT JOIN deals d ON r.deal_id = d.deal_id
      ORDER BY r.room_id DESC
      LIMIT $1 OFFSET $2

    `,
      [perPage, offset]
    );

    const rooms = result.rows;
    const roomIds = rooms.map((r) => r.room_id);

    const amenities = await pool.query(
      `
      SELECT ra.room_id, a.amenity_id, a.name, a.icon
      FROM room_amenities ra
      JOIN amenities a ON a.amenity_id = ra.amenity_id
      WHERE ra.room_id = ANY($1::int[])
    `,
      [roomIds]
    );

    const images = await pool.query(
      `SELECT room_id, image_url FROM room_images WHERE room_id = ANY($1::int[])`,
      [roomIds]
    );

    const amenitiesMap = {};
    for (const row of amenities.rows) {
      if (!amenitiesMap[row.room_id]) amenitiesMap[row.room_id] = [];
      amenitiesMap[row.room_id].push(row);
    }

    const imagesMap = {};
    for (const row of images.rows) {
      if (!imagesMap[row.room_id]) imagesMap[row.room_id] = [];
      imagesMap[row.room_id].push(row.image_url);
    }

    const fullRooms = rooms.map((room) => {
      const price = (room.room_type_price || 0) + (room.room_level_price || 0);
      const deal = room.deal_name
        ? {
            deal_id: room.deal_id,
            deal_name: room.deal_name,
            discount_rate: room.deal_discount_rate,
            start_date: room.deal_start_date,
            end_date: room.deal_end_date,
          }
        : null;
      return {
        ...room,
        price,
        amenities: amenitiesMap[room.room_id] || [],
        images: imagesMap[room.room_id] || [],
        deal,
      };
    });

    return {
      data: fullRooms,
      pagination: {
        currentPage: page,
        perPage,
        totalPages,
        totalItems,
      },
    };
  },
  findRoomByName: async (name) => {
    const query = `SELECT * FROM rooms WHERE name = $1 LIMIT 1`;
    const values = [name];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  },

  getById: async (id) => {
    const result = await pool.query(
      `
      SELECT 
        r.room_id, r.name, r.description, r.status,
        r.room_type_id, r.room_level_id, r.floor_id,
        rt.name AS room_type_name, rt.max_people, rt.price AS room_type_price,
        rl.name AS room_level_name, rl.price AS room_level_price,
        f.name AS floor_name
      FROM rooms r
      LEFT JOIN room_types rt ON r.room_type_id = rt.room_type_id
      LEFT JOIN room_levels rl ON r.room_level_id = rl.room_level_id
      LEFT JOIN floors f ON r.floor_id = f.floor_id
      WHERE r.room_id = $1
    `,
      [id]
    );

    const room = result.rows[0];
    if (!room) return null;

    const amenityResult = await pool.query(
      `SELECT a.* FROM room_amenities ra JOIN amenities a ON ra.amenity_id = a.amenity_id WHERE ra.room_id = $1`,
      [id]
    );

    const imageResult = await pool.query(
      `SELECT image_url FROM room_images WHERE room_id = $1`,
      [id]
    );

    room.price = (room.room_type_price || 0) + (room.room_level_price || 0);
    room.amenities = amenityResult.rows;
    room.images = imageResult.rows.map((r) => r.image_url);

    return room;
  },

  update: async (roomId, roomData) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const updatedRoom = await Room.update(roomId, roomData, client);

      if (Array.isArray(roomData.amenities)) {
        await Room.deleteRoomAmenities(roomId, client);
        for (const amenity of roomData.amenities) {
          await Room.insertRoomAmenityByName(roomId, amenity, client);
        }
      }

      await client.query("COMMIT");
      return {
        message: "Room updated successfully",
        room: updatedRoom,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  remove: async (id) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(`DELETE FROM room_images WHERE room_id = $1`, [id]);
      await client.query(`DELETE FROM room_amenities WHERE room_id = $1`, [id]);
      const result = await client.query(
        `DELETE FROM rooms WHERE room_id = $1 RETURNING *`,
        [id]
      );
      await client.query("COMMIT");
      return result.rows[0];
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },

  getFilteredRooms: async (filters, page = 1, perPage = 5) => {
    const values = [];
    const countValues = [];
    const amenityFilters = filters.amenities
      ? filters.amenities.split(",").map(Number)
      : [];

    // Câu điều kiện WHERE
    let whereConditions = "WHERE 1=1";

    if (filters.min_price) {
      values.push(filters.min_price);
      countValues.push(filters.min_price);
      whereConditions += ` AND (rt.price + rl.price) >= $${values.length}`;
    }

    if (filters.max_price) {
      values.push(filters.max_price);
      countValues.push(filters.max_price);
      whereConditions += ` AND (rt.price + rl.price) <= $${values.length}`;
    }

    if (filters.room_type) {
      values.push(filters.room_type);
      countValues.push(filters.room_type);
      whereConditions += ` AND r.room_type_id = $${values.length}`;
    }

    if (filters.people) {
      values.push(filters.people);
      countValues.push(filters.people);
      whereConditions += ` AND rt.max_people >= $${values.length}`;
    }

    if (filters.check_in_date && filters.check_out_date) {
      const idx1 = values.length + 1;
      const idx2 = values.length + 2;
      whereConditions += `
        AND r.room_id NOT IN (
          SELECT bd.room_id
          FROM booking_details bd
          JOIN bookings b ON bd.booking_id = b.booking_id
          WHERE NOT (
            bd.check_out_date < $${idx1} OR 
            bd.check_in_date > $${idx2}
          )
        )
      `;
      values.push(filters.check_in_date, filters.check_out_date);
      countValues.push(filters.check_in_date, filters.check_out_date);
    }

    if (amenityFilters.length > 0) {
      values.push(amenityFilters, amenityFilters.length);
      countValues.push(amenityFilters, amenityFilters.length);
      const idxA1 = values.length - 1;
      const idxA2 = values.length;
      whereConditions += `
        AND r.room_id IN (
          SELECT ra.room_id
          FROM room_amenities ra
          WHERE ra.amenity_id = ANY($${idxA1}::int[])
          GROUP BY ra.room_id
          HAVING COUNT(DISTINCT ra.amenity_id) = $${idxA2}
        )
      `;
    }

    if (filters.status) {
      values.push(filters.status);
      countValues.push(filters.status);
      whereConditions += ` AND r.status = $${values.length}`;
    }

    if (filters.room_level) {
      values.push(filters.room_level);
      countValues.push(filters.room_level);
      whereConditions += ` AND r.room_level_id = $${values.length}`;
    }

    if (filters.floor) {
      values.push(filters.floor);
      countValues.push(filters.floor);
      whereConditions += ` AND r.floor_id = $${values.length}`;
    }

    let havingClause = "";
    if (filters.rating !== undefined) {
      if (Number(filters.rating) === 0) {
        havingClause = "HAVING AVG(fb.rating) IS NULL";
      } else {
        values.push(Number(filters.rating));
        countValues.push(Number(filters.rating));
        havingClause = `HAVING CEIL(AVG(fb.rating)) = $${values.length}`;
      }
    }

    // COUNT QUERY - đếm tổng số phòng thỏa mãn điều kiện, có rating filter
    const countQuery = `
      SELECT COUNT(*) AS total FROM (
        SELECT r.room_id
        FROM rooms r
        JOIN room_types rt ON r.room_type_id = rt.room_type_id
        JOIN room_levels rl ON r.room_level_id = rl.room_level_id
        JOIN floors f ON r.floor_id = f.floor_id
        LEFT JOIN deals d 
          ON r.deal_id = d.deal_id
          AND d.start_date <= CURRENT_DATE 
          AND d.end_date >= CURRENT_DATE
        LEFT JOIN booking_details bd ON r.room_id = bd.room_id
        LEFT JOIN feedbacks fb ON bd.booking_detail_id = fb.booking_details_id
        ${whereConditions}
        GROUP BY r.room_id
        ${havingClause}
      ) sub
    `;

    // MAIN QUERY để lấy dữ liệu chi tiết phòng + rating
    let query = `
      SELECT 
        r.room_id,
        r.name,
        r.description,
        rt.name AS room_type_name,
        rt.max_people,
        rt.price AS base_price,
        rl.name AS room_level_name,
        rl.price AS level_price,
        f.name AS floor_name,
        d.deal_id,
        d.deal_name,
        d.discount_rate AS deal_discount_rate,
        d.start_date AS deal_start_date,
        d.end_date AS deal_end_date,
        CEIL(AVG(fb.rating)) AS rating
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.room_type_id
      JOIN room_levels rl ON r.room_level_id = rl.room_level_id
      JOIN floors f ON r.floor_id = f.floor_id
      LEFT JOIN deals d 
        ON r.deal_id = d.deal_id
        AND d.status = 'Ongoing'
      LEFT JOIN booking_details bd ON r.room_id = bd.room_id
      LEFT JOIN feedbacks fb ON bd.booking_detail_id = fb.booking_details_id
      ${whereConditions}
      GROUP BY 
        r.room_id, r.name, r.description,
        rt.name, rt.max_people, rt.price,
        rl.name, rl.price,
        f.name,
        d.deal_id, d.deal_name, d.discount_rate, d.start_date, d.end_date
      ${havingClause}
      ORDER BY r.room_id DESC
      LIMIT $${values.length + 1} OFFSET $${values.length + 2}
    `;

    const offset = (page - 1) * perPage;
    values.push(perPage, offset);

    // Thực hiện count query
    const countResult = await pool.query(countQuery, countValues);
    const totalItems = Number(countResult.rows[0].total) || 0;
    const totalPages = Math.ceil(totalItems / perPage);

    // Thực hiện query lấy dữ liệu
    const roomResult = await pool.query(query, values);
    const rooms = roomResult.rows;

    if (rooms.length === 0) {
      return {
        data: [],
        pagination: { currentPage: page, perPage, totalPages, totalItems },
      };
    }

    // Lấy room_ids để truy vấn amenities và images
    const roomIds = rooms.map((r) => r.room_id);

    // Lấy tiện ích
    const amenityQuery = `
      SELECT ra.room_id, a.amenity_id, a.name, a.icon
      FROM room_amenities ra
      JOIN amenities a ON ra.amenity_id = a.amenity_id
      WHERE ra.room_id = ANY($1::int[])
    `;
    const amenityResult = await pool.query(amenityQuery, [roomIds]);

    // Lấy ảnh
    const imageQuery = `
      SELECT room_id, image_url
      FROM room_images
      WHERE room_id = ANY($1::int[])
    `;
    const imageResult = await pool.query(imageQuery, [roomIds]);

    // Gộp dữ liệu tiện ích
    const amenitiesMap = {};
    for (const row of amenityResult.rows) {
      if (!amenitiesMap[row.room_id]) amenitiesMap[row.room_id] = [];
      amenitiesMap[row.room_id].push({
        amenity_id: row.amenity_id,
        name: row.name,
        icon: row.icon,
      });
    }

    // Gộp dữ liệu ảnh
    const imagesMap = {};
    for (const row of imageResult.rows) {
      if (!imagesMap[row.room_id]) imagesMap[row.room_id] = [];
      imagesMap[row.room_id].push(row.image_url);
    }

    // Chuẩn bị dữ liệu trả về
    const finalRooms = rooms.map((room) => {
      const basePrice = Number(room.base_price || 0);
      const levelPrice = Number(room.level_price || 0);
      const totalPrice = basePrice + levelPrice;
      const finalPrice = room.deal_discount_rate
        ? totalPrice * (1 - room.deal_discount_rate)
        : totalPrice;

      const deal = room.deal_name
        ? {
            deal_id: room.deal_id,
            deal_name: room.deal_name,
            discount_rate: room.deal_discount_rate,
            start_date: room.deal_start_date,
            end_date: room.deal_end_date,
          }
        : null;

      return {
        room_id: room.room_id,
        name: room.name,
        description: room.description,
        price: totalPrice,
        final_price: finalPrice,
        status: room.status,
        roomType: room.room_type_name,
        room_type_id: room.room_type_id,
        roomLevel: room.room_level_name,
        floor: room.floor_name,
        max_people: room.max_people,
        amenities: amenitiesMap[room.room_id] || [],
        images: imagesMap[room.room_id] || [],
        deal: deal,
        rating: room.rating || null,
      };
    });

    return {
      data: finalRooms,
      pagination: { currentPage: page, perPage, totalPages, totalItems },
    };
  },

  findRoomById: async (id) => {
    return await RoomService.getById(id);
  },

  createRoom: async (roomData) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const roomId = await Room.create(roomData, client);

      if (Array.isArray(roomData.image_urls)) {
        for (const url of roomData.image_urls) {
          await Room.insertRoomImage(roomId, url, client);
        }
      }
      if (Array.isArray(roomData.amenities)) {
        for (const amenity of roomData.amenities) {
          await Room.insertRoomAmenityByName(roomId, amenity, client);
        }
      }

      await client.query("COMMIT");
      return {
        message: "Room created successfully",
        room_id: roomId,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  isRoomAvailable: async (roomId, checkIn, checkOut) => {
    const checkInDateTime = dayjs(checkIn)
      .tz("Asia/Ho_Chi_Minh")
      .hour(14)
      .minute(0)
      .second(0)
      .toDate();

    const checkOutDateTime = dayjs(checkOut)
      .tz("Asia/Ho_Chi_Minh")
      .hour(12)
      .minute(0)
      .second(0)
      .toDate();

    const { rows } = await pool.query(
      `
    SELECT 1
    FROM booking_details bd
    JOIN bookings b ON b.booking_id = bd.booking_id
    WHERE bd.room_id = $1
      AND b.status IN ('booked', 'checked_in')
      AND NOT (
        bd.check_out_timestamp <= $2::timestamptz
        OR bd.check_in_timestamp >= $3::timestamptz
      )
    `,
      [roomId, checkInDateTime, checkOutDateTime]
    );

    return rows.length === 0;
  },

  getRoomDetail: async (roomId) => {
    const { rows } = await pool.query(
      `
SELECT
  r.room_id,
  r.description,
  r.name,
  (rl.price + rt.price) AS price,
  rl.price AS room_level_price,
  rl.name AS room_level,
  rt.name AS room_type,
  rt.price AS room_type_price,
  rt.max_people,
  f.name AS floor_name,
  d.deal_name,
  COALESCE(d.discount_rate, 0) AS discount_rate,
  COALESCE(img.images, '[]') AS images,
  COALESCE(am.amenities, '[]') AS amenities,
  COALESCE(fb.feedbacks, '[]') AS feedbacks

FROM rooms r
JOIN room_levels rl ON r.room_level_id = rl.room_level_id
JOIN room_types rt ON r.room_type_id = rt.room_type_id
LEFT JOIN deals d ON r.deal_id = d.deal_id
LEFT JOIN floors f ON r.floor_id = f.floor_id

-- Lấy danh sách ảnh
LEFT JOIN LATERAL (
  SELECT json_agg(image_url) AS images
  FROM room_images
  WHERE room_id = r.room_id
) img ON TRUE

-- Lấy danh sách tiện ích
LEFT JOIN LATERAL (
  SELECT json_agg(json_build_object('name', a.name, 'icon', a.icon)) AS amenities
  FROM room_amenities ra
  JOIN amenities a ON a.amenity_id = ra.amenity_id
  WHERE ra.room_id = r.room_id
) am ON TRUE

-- Lấy danh sách feedbacks theo room_id
LEFT JOIN LATERAL (
  SELECT json_agg(
    json_build_object(
      'comment', f.comment,
      'rating', f.rating,
      'created_at', f.created_at,
      'user_name', u.name
    )
  ) AS feedbacks
  FROM feedbacks f
  JOIN booking_details bd ON f.booking_details_id = bd.booking_detail_id
  JOIN bookings b ON bd.booking_id = b.booking_id
  JOIN users u ON b.user_id = u.user_id
  WHERE bd.room_id = r.room_id
) fb ON TRUE

WHERE r.room_id = $1;
    `,
      [roomId]
    );
    return rows[0] || null;
  },
  getFilterOptions: async () => {
    try {
      const maxPeopleQuery = `
        SELECT DISTINCT rt.max_people
        FROM room_types rt
        JOIN rooms r ON r.room_type_id = rt.room_type_id
        WHERE rt.max_people IS NOT NULL
        ORDER BY rt.max_people ASC
      `;
      const maxPeopleResult = await pool.query(maxPeopleQuery);

      const roomLevelsQuery = `
        SELECT DISTINCT rl.room_level_id, rl.name, rl.price
        FROM room_levels rl
        JOIN rooms r ON r.room_level_id = rl.room_level_id
        ORDER BY rl.room_level_id ASC
      `;
      const roomLevelsResult = await pool.query(roomLevelsQuery);

      const amenitiesQuery = `
        SELECT DISTINCT a.amenity_id, a.name, a.icon
        FROM amenities a
        JOIN room_amenities ra ON ra.amenity_id = a.amenity_id
        JOIN rooms r ON r.room_id = ra.room_id
        ORDER BY a.name ASC
      `;
      const amenitiesResult = await pool.query(amenitiesQuery);

      const floorsQuery = `
        SELECT DISTINCT f.floor_id, f.name
        FROM floors f
        JOIN rooms r ON r.floor_id = f.floor_id
        ORDER BY f.floor_id ASC
      `;
      const floorsResult = await pool.query(floorsQuery);

      const roomTypesQuery = `
        SELECT DISTINCT rt.room_type_id, rt.name, rt.price, rt.max_people
        FROM room_types rt
        JOIN rooms r ON r.room_type_id = rt.room_type_id
        ORDER BY rt.name ASC
      `;
      const roomTypesResult = await pool.query(roomTypesQuery);

      const priceRangeQuery = `
        SELECT 
          MIN(rt.price + rl.price) as min_price,
          MAX(rt.price + rl.price) as max_price
        FROM rooms r
        JOIN room_types rt ON r.room_type_id = rt.room_type_id
        JOIN room_levels rl ON r.room_level_id = rl.room_level_id
      `;
      const priceRangeResult = await pool.query(priceRangeQuery);

      return {
        maxPeople: maxPeopleResult.rows.map((row) => row.max_people),
        roomLevels: roomLevelsResult.rows,
        amenities: amenitiesResult.rows,
        floors: floorsResult.rows,
        roomTypes: roomTypesResult.rows,
        priceRange: priceRangeResult.rows[0],
      };
    } catch (error) {
      throw error;
    }
  },

  updateDeal: async (roomId, dealId) => {
    const query = `
    UPDATE rooms 
    SET deal_id = $1 
    WHERE room_id = $2 
    RETURNING *;
  `;
    const result = await pool.query(query, [dealId, roomId]);
    return result.rows[0];
  },

  removeDeal: async (roomId) => {
    const query = `
    UPDATE rooms 
    SET deal_id = NULL 
    WHERE room_id = $1
    RETURNING *;
  `;
    const result = await pool.query(query, [roomId]);
    return result.rows[0];
  },

  getTopLuxuryRooms: async (limit = 3) => {
    const result = await pool.query(
      `
    SELECT 
      r.room_id, r.name, r.description, r.status,
      r.room_type_id, r.room_level_id, r.floor_id,
      rt.name AS room_type_name, rt.max_people, rt.price AS room_type_price,
      rl.name AS room_level_name, rl.price AS room_level_price,
      f.name AS floor_name
    FROM rooms r
    LEFT JOIN room_types rt ON r.room_type_id = rt.room_type_id
    LEFT JOIN room_levels rl ON r.room_level_id = rl.room_level_id
    LEFT JOIN floors f ON r.floor_id = f.floor_id
    WHERE r.room_level_id = 2
    ORDER BY r.room_id DESC
    LIMIT $1
    `,
      [limit]
    );

    const rooms = result.rows;
    const roomIds = rooms.map((r) => r.room_id);

    const amenities = await pool.query(
      `
    SELECT ra.room_id, a.amenity_id, a.name, a.icon
    FROM room_amenities ra
    JOIN amenities a ON a.amenity_id = ra.amenity_id
    WHERE ra.room_id = ANY($1::int[])
    `,
      [roomIds]
    );

    const images = await pool.query(
      `
    SELECT room_id, image_url
    FROM room_images
    WHERE room_id = ANY($1::int[])
    `,
      [roomIds]
    );

    const amenitiesMap = {};
    for (const row of amenities.rows) {
      if (!amenitiesMap[row.room_id]) amenitiesMap[row.room_id] = [];
      amenitiesMap[row.room_id].push(row);
    }

    const imagesMap = {};
    for (const row of images.rows) {
      if (!imagesMap[row.room_id]) imagesMap[row.room_id] = [];
      imagesMap[row.room_id].push(row.image_url);
    }

    const fullRooms = rooms.map((room) => ({
      ...room,
      price: (room.room_type_price || 0) + (room.room_level_price || 0),
      amenities: amenitiesMap[room.room_id] || [],
      images: imagesMap[room.room_id] || [],
    }));

    return fullRooms;
  },
};

module.exports = roomRepository;

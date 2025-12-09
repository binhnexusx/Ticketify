const pool = require("../config/db");

const Room = {
  findById: async (id) => {
    const query = "SELECT * FROM rooms WHERE room_id = $1";
    const values = [id];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  create: async (roomData, client) => {
    const query = `
      INSERT INTO rooms (name, status, description, room_type_id, room_level_id, floor_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING room_id
    `;
    const values = [
      roomData.name,
      roomData.status || "available",
      roomData.description,
      roomData.room_type_id,
      roomData.room_level_id,
      roomData.floor_id,
    ];
    const result = await client.query(query, values);
    return result.rows[0].room_id;
  },

  insertRoomImage: async (roomId, imageUrl, client) => {
    const query = `
      INSERT INTO room_images (room_id, image_url, uploaded_at)
      VALUES ($1, $2, NOW())
    `;
    await client.query(query, [roomId, imageUrl]);
  },

  insertRoomAmenityByName: async (roomId, amenityNameOrObj, client) => {
    const name =
      typeof amenityNameOrObj === "string"
        ? amenityNameOrObj
        : amenityNameOrObj.name;

    const query = `SELECT amenity_id FROM amenities WHERE name = $1`;
    const result = await client.query(query, [name]);
    if (result.rows.length === 0) {
      return;
    }
    const amenityId = result.rows[0].amenity_id;
    await client.query(
      `INSERT INTO room_amenities (room_id, amenity_id) VALUES ($1, $2)`,
      [roomId, amenityId]
    );
  },

  insertRoomAmenity: async (roomId, amenityId, client) => {
    const query = `
      INSERT INTO room_amenities (room_id, amenity_id)
      VALUES ($1, $2)
    `;
    await client.query(query, [roomId, amenityId]);
  },

  update: async (roomId, roomData, client) => {
    const query = `
      UPDATE rooms SET 
        name = $1, 
        description = $2, 
        status = $3, 
        room_type_id = $4,
        room_level_id = $5,
        floor_id = $6
      WHERE room_id = $7
      RETURNING *
    `;
    const values = [
      roomData.name,
      roomData.description,
      roomData.status,
      roomData.room_type_id,
      roomData.room_level_id,
      roomData.floor_id,
      roomId,
    ];
    const result = await client.query(query, values);

    if (roomData.image_urls && Array.isArray(roomData.image_urls)) {
      await client.query("DELETE FROM room_images WHERE room_id = $1", [
        roomId,
      ]);
      for (const imageUrl of roomData.image_urls) {
        await client.query(
          "INSERT INTO room_images (room_id, image_url, uploaded_at) VALUES ($1, $2, NOW())",
          [roomId, imageUrl]
        );
      }
    }

    return result.rows[0];
  },

  deleteRoomAmenities: async (roomId, client) => {
    const query = `DELETE FROM room_amenities WHERE room_id = $1`;
    await client.query(query, [roomId]);
  },
  updateDeal: async (roomId, dealId, client) => {
    const query = `
    UPDATE rooms
    SET deal_id = $1
    WHERE room_id = $2
    RETURNING *
  `;
    const values = [dealId, roomId];
    const result = await client.query(query, values);
    return result.rows[0];
  },
};

module.exports = Room;

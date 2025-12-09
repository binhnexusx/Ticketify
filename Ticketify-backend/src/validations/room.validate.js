const { body, param, validationResult } = require("express-validator");

const validateRoom = [
  body("name")
    .notEmpty()
    .withMessage("Room name is required")
    .custom(async (value, { req }) => {
      const pool = require("../config/db");
      const result = await pool.query(
        "SELECT room_id FROM rooms WHERE name = $1",
        [value]
      );
      if (result.rows.length > 0) {
        if (req.method === "PUT" && req.params.id) {
          const currentRoomId = parseInt(req.params.id, 10);
          if (result.rows.some((r) => r.room_id !== currentRoomId)) {
            throw new Error(
              "Room number already exists. Please enter a unique room number."
            );
          }
        } else {
          throw new Error(
            "Room number already exists. Please enter a unique room number."
          );
        }
      }
      return true;
    }),
  body("room_type_id").isInt().withMessage("room_type_id must be an integer"),
  body("room_level_id").isInt().withMessage("room_level_id must be an integer"),
  body("floor_id").isInt().withMessage("floor_id must be an integer"),
  body("status").isString().withMessage("Invalid status"),
  body("description").optional().isString(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }
    next();
  },
];

const validateRoomId = [
  param("id").isInt().withMessage("Room ID must be an integer"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid Room ID",
        errors: errors.array(),
      });
    }
    next();
  },
];

module.exports = { validateRoom, validateRoomId };

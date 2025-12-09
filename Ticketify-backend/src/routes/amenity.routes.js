const express = require("express");
const amenityController = require("../controllers/amenity.controller");

const router = express.Router();

router.get("/amenities", amenityController.getAmenities);

module.exports = router;
const express = require("express");
const floorController = require("../controllers/floor.controller");

const router = express.Router();

router.get("/floors", floorController.getFloors);

module.exports = router;
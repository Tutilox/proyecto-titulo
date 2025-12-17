const express = require("express");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/role");
const {
  getMeasurements,
  getMeasurementsByRange,
  getMeasurementsBySensor,
  createMeasurement,
  deleteMeasurement
} = require("../controllers/measurementController");

const router = express.Router();

// POST nueva medición
router.post("/", auth, role(["agricultor", "admin"]) , createMeasurement);

// DELETE una medición
router.delete("/:id", auth, role(["agricultor", "admin"]) , deleteMeasurement);

router.get("/", auth, role(["admin", "investigador", "agricultor"]), getMeasurements);

router.get("/sensor/:sensorId", auth, role(["admin", "investigador", "agricultor"]), getMeasurementsBySensor);

router.get("/range", auth, role(["admin", "investigador", "agricultor"]), getMeasurementsByRange);

module.exports = router;

const express = require("express");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/role");
const owner = require("../middleware/owner");
const {
  createSensor,
  getSensors,
  getSensor,
  updateSensor,
  deleteSensor
} = require("../controllers/sensorController");

const router = express.Router();



router.post("/", auth, role(["admin", "agricultor"]), createSensor);
router.patch("/:id", auth, role(["admin", "agricultor"]), updateSensor);
router.delete("/:id", auth, role(["admin", "agricultor"]), deleteSensor);

// Ver sensores todos los roles
router.get("/", auth, role(["admin", "investigador", "agricultor"]), getSensors);
router.get("/:id", auth, role(["admin", "investigador", "agricultor"]), getSensor);

module.exports = router;

const express = require("express");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/role");
const owner = require("../middleware/owner");
const {
  createPool,
  getPools,
  getPool,
  updatePool,
  deletePool
} = require("../controllers/poolController");

const router = express.Router();

router.get("/", auth, role(["admin", "investigador", "agricultor"]), getPools);
router.get("/:id", auth, role(["admin", "investigador", "agricultor"]), getPool);
router.post("/", auth, role(["admin", "agricultor"]), createPool);
router.patch("/:id", auth, role(["admin", "agricultor"]), updatePool);
router.delete("/:id", auth, role(["admin", "agricultor"]), deletePool);

module.exports = router;

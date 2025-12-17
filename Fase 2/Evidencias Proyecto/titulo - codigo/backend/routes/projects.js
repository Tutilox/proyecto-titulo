const express = require("express");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/role");
const owner = require("../middleware/owner");

const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject
} = require("../controllers/projectController");

const router = express.Router();

router.get("/", auth, role(["admin", "investigador", "agricultor"]), getProjects);
router.get("/:id", auth, role(["admin", "investigador", "agricultor"]), getProject);
router.post("/", auth, role(["admin", "agricultor"]), createProject);
router.patch("/:id", auth, role(["admin", "agricultor"]), owner, updateProject);
router.delete("/:id", auth, role(["admin", "agricultor"]), owner, deleteProject);

module.exports = router;

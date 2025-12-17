const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/role");

// ===============================
// 1) Obtener todos los usuarios (solo admin)
// ===============================
router.get("/", auth, role("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password -resetToken -resetTokenExpire");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// 2) Cambiar rol de un usuario (solo admin)
// ===============================
router.patch("/role/:id", auth, role("admin"), async (req, res) => {
  try {
    const { role: newRole } = req.body;

    const allowedRoles = ["agricultor", "investigador", "admin"];

    // Validar rol solicitado
    if (!allowedRoles.includes(newRole)) {
      return res.status(400).json({ error: "Rol inválido" });
    }

    // Seguridad: evitar que el admin elimine o degrade al único admin
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    // Evitar que un admin se elimine a sí mismo
    if (user._id.toString() === req.user.id && newRole !== "admin") {
      return res.status(400).json({ error: "No puedes quitarte permisos de admin a ti mismo" });
    }

    user.role = newRole;
    await user.save();

    res.json({ message: "Rol actualizado correctamente", user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// 3) Eliminar usuario (solo admin)
// ===============================
router.delete("/:id", auth, role("admin"), async (req, res) => {
  try {
    // Evitar que un admin se elimine a sí mismo
    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: "No puedes eliminarte a ti mismo" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Usuario eliminado correctamente" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

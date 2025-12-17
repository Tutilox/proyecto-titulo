const Project = require("../models/Project");

module.exports = async (req, res, next) => {
    const projectId = req.body.projectId || req.params.projectId;

    if (!projectId) return res.status(400).json({ error: "projectId requerido" });

    const project = await Project.findById(projectId);

    if (!project) return res.status(404).json({ error: "Proyecto no encontrado" });

    if (req.user.role === "admin" || req.user.role === "investigador") {
        return next();
    }

    if (project.ownerId.toString() !== req.user.id) {
        return res.status(403).json({ error: "No tienes permiso sobre este proyecto" });
    }

    next();
};


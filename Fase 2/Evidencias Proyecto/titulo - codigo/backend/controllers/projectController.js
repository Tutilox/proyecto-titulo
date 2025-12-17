const Project = require("../models/Project");

module.exports = {
    // ================================
    // Crear proyecto (solo agricultor)
    // ================================
    async createProject(req, res) {
        try {
            // El userId **NO** debe venir del body
            const userId = req.user.id;  
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({ error: "El nombre es obligatorio" });
            }

            const project = await Project.create({
                name,
                userId: userId,
                ownerId: userId
            });

            res.status(201).json(project);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // ================================
    // Obtener proyectos según rol
    // ================================
    async getProjects(req, res) {
        try {
            let filter = {};

            // Agricultor → solo sus proyectos
            if (req.user.role === "agricultor") {
                filter.ownerId = req.user.id;
            }

            // Investigador → puede ver todos (solo lectura)
            // Admin → puede ver todos

            const projects = await Project.find(filter).populate("ownerId");

            res.json(projects);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // ================================
    // Obtener un solo proyecto
    // ================================
    async getProject(req, res) {
        try {
            const project = await Project.findById(req.params.id).populate("ownerId");

            if (!project) {
                return res.status(404).json({ message: "Proyecto no encontrado" });
            }

            // Agricultor NO puede ver proyectos ajenos
            if (req.user.role === "agricultor" &&
                project.ownerId.toString() !== req.user.id) {
                return res.status(403).json({ error: "Acceso denegado" });
            }

            res.json(project);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // ================================
    // Actualizar proyecto
    // ================================
    async updateProject(req, res) {
        try {
            const project = await Project.findById(req.params.id);

            if (!project) {
                return res.status(404).json({ message: "Proyecto no encontrado" });
            }

            // Agricultor NO puede editar proyectos ajenos
            if (req.user.role === "agricultor" &&
                project.ownerId.toString() !== req.user.id) {
                return res.status(403).json({ error: "No tienes permiso para editar este proyecto" });
            }

            project.name = req.body.name || project.name;
            await project.save();

            res.json(project);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // ================================
    // Eliminar proyecto
    // ================================
    async deleteProject(req, res) {
        try {
            const project = await Project.findById(req.params.id);

            if (!project) {
                return res.status(404).json({ message: "Proyecto no encontrado" });
            }

            // Agricultor NO puede eliminar proyectos ajenos
            if (req.user.role === "agricultor" &&
                project.ownerId.toString() !== req.user.id) {
                return res.status(403).json({ error: "No tienes permiso para eliminar este proyecto" });
            }

            await project.deleteOne();

            res.json({ message: "Proyecto eliminado" });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

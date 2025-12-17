const Pool = require("../models/Pool");

module.exports = {
    async createPool(req, res) {
    try {
      const { projectId, name } = req.body;

      if (!projectId || !name) {
        return res.status(400).json({ error: "projectId y name son obligatorios" });
      }

      const pool = await Pool.create({ projectId, name });
      res.status(201).json(pool);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getPools(req, res) {
    const pools = await Pool.find().populate("projectId");
    res.json(pools);
  },

    async getPool(req, res) {
        try {
            const pool = await Pool.findById(req.params.id).populate("projectId");

            if (!pool) return res.status(404).json({ message: "Pool no encontrado" });

            res.json(pool);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async updatePool(req, res) {
        try {
            const pool = await Pool.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            res.json(pool);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async deletePool(req, res) {
        try {
            await Pool.findByIdAndDelete(req.params.id);
            res.json({ message: "Pool eliminado" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

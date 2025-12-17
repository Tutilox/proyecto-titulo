const Sensor = require("../models/Sensor");

module.exports = {
    async createSensor(req, res) {
    try {
      const { poolId, name } = req.body;

      if (!poolId || !name) {
        return res.status(400).json({ error: "poolId y name son obligatorios" });
      }

      const sensor = await Sensor.create({ poolId, name });
      res.status(201).json(sensor);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

    async getSensors(req, res) {
        try {
            const sensors = await Sensor.find().populate("poolId");
            res.json(sensors);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getSensor(req, res) {
        try {
            const sensor = await Sensor.findById(req.params.id).populate("poolId");

            if (!sensor) return res.status(404).json({ message: "Sensor no encontrado" });

            res.json(sensor);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async updateSensor(req, res) {
        try {
            const sensor = await Sensor.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            res.json(sensor);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async deleteSensor(req, res) {
        try {
            await Sensor.findByIdAndDelete(req.params.id);
            res.json({ message: "Sensor eliminado" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

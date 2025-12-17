const Measurement = require("../models/Measurement");

// GET todas las mediciones
async function getMeasurements(req, res) {
  try {
    const data = await Measurement.find()
      .sort({ timestamp: 1 })
      .populate("sensorId");
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// GET mediciones por sensor
async function getMeasurementsBySensor(req, res) {
  try {
    const { sensorId } = req.params;

    const data = await Measurement.find({ sensorId })
      .sort({ timestamp: 1 });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// GET mediciones por rango de tiempo
async function getMeasurementsByRange(req, res) {
  try {
    const { from, to, sensorId } = req.query;

    const filter = {};

    // Filtrar por sensor si viene
    if (sensorId) filter.sensorId = sensorId;

    // Filtrar por fechas
    if (from || to) {
      filter.timestamp = {};

      if (from) filter.timestamp.$gte = new Date(from);
      if (to) filter.timestamp.$lte = new Date(to);
    }

    const data = await Measurement.find(filter).sort({ timestamp: 1 });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// POST nueva medición
async function createMeasurement(req, res) {
  try {
    const medida = await Measurement.create({
      sensorId: req.body.sensorId,
      ph: req.body.ph,
      conductividad: req.body.conductividad,
      tds: req.body.tds,
      turbidez: req.body.turbidez,
      oxigeno: req.body.oxigeno,
    });

    res.status(201).json(medida);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// GET una medición
async function getMeasurement(req, res) {
  try {
    const m = await Measurement.findById(req.params.id).populate("sensorId");
    if (!m) return res.status(404).json({ message: "Medición no encontrada" });
    res.json(m);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// DELETE medición
async function deleteMeasurement(req, res) {
  try {
    await Measurement.findByIdAndDelete(req.params.id);
    res.json({ message: "Medición eliminada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getMeasurements,
  getMeasurementsBySensor,
  getMeasurementsByRange,   // agregado aquí
  createMeasurement,
  getMeasurement,
  deleteMeasurement
};

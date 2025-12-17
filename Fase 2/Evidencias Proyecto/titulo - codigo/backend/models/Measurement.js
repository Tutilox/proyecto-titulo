const mongoose = require("mongoose");

const MeasurementSchema = new mongoose.Schema({
  sensorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sensor",
    required: true
  },

  ph: Number,
  tds: Number,
  conductividad: Number,
  turbidez: Number,
  oxigeno: Number,

  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Measurement", MeasurementSchema);

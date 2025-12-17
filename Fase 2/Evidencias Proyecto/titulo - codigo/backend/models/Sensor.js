const mongoose = require("mongoose");

const SensorSchema = new mongoose.Schema({
  name: { type: String, required: true },

  poolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pool",
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Sensor", SensorSchema);

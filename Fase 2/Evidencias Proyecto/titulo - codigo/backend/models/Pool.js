const mongoose = require("mongoose");

const PoolSchema = new mongoose.Schema({
  name: { type: String, required: true },

  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Pool", PoolSchema);

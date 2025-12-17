const express = require("express");
const Measurement = require("../models/Measurement");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/role");

const router = express.Router();

// Exportar todas las mediciones a CSV
// Roles permitidos: admin, agricultor, investigador
router.get("/csv", auth, role(["admin", "investigador"]), async (req, res) => {
  try {
    const data = await Measurement.find().lean();

    if (!data.length) {
      return res.status(200).send("No hay datos");
    }

    // Cabecera CSV (ajustada al nuevo modelo)
    const header = "sensorId,ph,conductividad,tds,turbidez,oxigeno,timestamp\n";

    const rows = data.map(d => [
      d.sensorId,                        
      d.ph ?? "",
      d.conductividad ?? "",
      d.tds ?? "",
      d.turbidez ?? "",
      d.oxigeno ?? "",
      d.timestamp
        ? new Date(d.timestamp).toISOString()
        : ""
    ].join(","));

    const csv = header + rows.join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=mediciones.csv");

    res.send(csv);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

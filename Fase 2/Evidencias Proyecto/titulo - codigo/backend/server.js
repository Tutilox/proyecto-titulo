const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const createAdmin = require("./utils/createAdmin");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const exportsRoutes = require("./routes/export");
const projectRoutes = require("./routes/projects");
const poolRoutes = require("./routes/pools");
const sensorRoutes = require("./routes/sensors");
const measurementRoutes = require("./routes/mediciones");

const app = express();
app.use(cors());
app.use(express.json());

// Rutas API
app.use("/api/projects", projectRoutes);
app.use("/api/pools", poolRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/measurements", measurementRoutes);
app.use("/api/users", userRoutes);

const uri = process.env.MONGO_URI;

// Conexión a MongoDB Atlas
mongoose.connect(uri)                                       
  .then( async () => { console.log("MongoDB conectado");
  await createAdmin(); //
  }) 
  .catch(err => console.log(err));

app.use("/auth", authRoutes);
app.use("/api/export", exportsRoutes);

app.listen(3000, () => console.log("Servidor en puerto 3000"));




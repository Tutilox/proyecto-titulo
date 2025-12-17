const axios = require("axios");
const readline = require("readline");

// ======================
// CONFIGURACIÓN GENERAL
// ======================
const API_URL = "http://localhost:3000/api";
const INTERVAL = 1000; // 2 segundos

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MzNjODk1Y2M3ODk3MTE4NDY0MTQyYiIsImVtYWlsIjoiYWRtaW5AcGxhdGFmb3JtYS5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjU5ODc0ODcsImV4cCI6MTc2NjU5MjI4N30.puhN1aDFioryNPvS7RKQj-B7LxHxQvMXOFv9CnSKy7Q"; // Debes obtener este token de tu proceso de login
   

// ======================
// AXIOS CON TOKEN GLOBAL
// ======================
const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`
  }
});

// ======================
// CONSOLA
// ======================
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ======================
// RANGOS REALISTAS
// ======================
const ranges = {
  ph: { min: 6.5, max: 8.5, drift: 0.05 },
  conductividad: { min: 0.8, max: 1.6, drift: 0.03 },
  tds: { min: 400, max: 700, drift: 5 },
  turbidez: { min: 1, max: 6, drift: 0.1 },
  oxigeno: { min: 4, max: 9, drift: 0.1 }
};

// ======================
// ESTADO POR SENSOR
// ======================
const sensorState = {};

// ======================
// FUNCIÓN DE VARIACIÓN
// ======================
function variar(valor, config) {
  const drift = (Math.random() * 2 - 1) * config.drift;
  let nuevo = valor + drift;

  if (nuevo < config.min) nuevo = config.min + Math.random() * config.drift;
  if (nuevo > config.max) nuevo = config.max - Math.random() * config.drift;

  return parseFloat(nuevo.toFixed(2));
}

// ======================
// INICIALIZAR SENSOR
// ======================
function inicializarEstado(sensorId) {
  sensorState[sensorId] = {
    ph: Math.random() * 2 + 6.5,
    conductividad: Math.random() * 0.8 + 0.8,
    tds: Math.random() * 300 + 400,
    turbidez: Math.random() * 5 + 1,
    oxigeno: Math.random() * 5 + 4
  };
}

// ======================
// GENERAR VALORES
// ======================
function generarValores(sensorId) {
  const estado = sensorState[sensorId];

  estado.ph = variar(estado.ph, ranges.ph);
  estado.conductividad = variar(estado.conductividad, ranges.conductividad);
  estado.tds = Math.floor(variar(estado.tds, ranges.tds));
  estado.turbidez = variar(estado.turbidez, ranges.turbidez);
  estado.oxigeno = variar(estado.oxigeno, ranges.oxigeno);

  return {
    sensorId,
    ph: estado.ph,
    conductividad: estado.conductividad,
    tds: estado.tds,
    turbidez: estado.turbidez,
    oxigeno: estado.oxigeno
  };
}

// ======================
// ELEGIR PROYECTO
// ======================
async function elegirProyecto() {
  const res = await api.get("/projects");
  const projects = res.data;

  console.log("\nPROYECTOS DISPONIBLES:");
  projects.forEach((p, i) => {
    console.log(`${i + 1}) ${p.name}`);
  });

  return new Promise((resolve) => {
    rl.question("\nSelecciona proyecto: ", (num) => {
      rl.close();
      resolve(projects[num - 1]._id);
    });
  });
}

// ======================
// SIMULACIÓN
// ======================
async function simularProyecto(projectId) {
  try {
    const pools = (await api.get("/pools")).data;
    const sensors = (await api.get("/sensors")).data;

    const projectPools = pools.filter(p => p.project_id === projectId);

    console.log("\n=== CICLO DE SIMULACIÓN ===");

    for (const pool of projectPools) {
      console.log(`Pool: ${pool.name}`);

      const poolSensors = sensors.filter(s => s.pool_id === pool._id);

      for (const sensor of poolSensors) {

        if (!sensorState[sensor._id]) {
          inicializarEstado(sensor._id);
        }

        const payload = generarValores(sensor._id);

        try {
          await api.post("/measurements", payload);
          console.log(`✔ ${sensor.name} →`, payload);
        } catch (err) {
          console.log(`✖ Error (${sensor.name}):`, err.response?.data || err.message);
        }
      }
    }
  } catch (err) {
    console.log("Error simulación:", err.response?.data || err.message);
  }

  setTimeout(() => simularProyecto(projectId), INTERVAL);
}

// ======================
// INIT
// ======================
async function init() {
  try {
    const projectId = await elegirProyecto();
    console.log("\nSimulando proyecto:", projectId);
    simularProyecto(projectId);
  } catch (err) {
    console.error("Error iniciando simulador:", err.message);
  }
}

init();

 

const User = require("../models/User");
const bcrypt = require("bcryptjs");

async function createAdmin() {
  const adminEmail = "admin@plataforma.com";
  const adminPassword = "admin123"; // cambiarlo

  const exists = await User.findOne({ email: adminEmail });
  if (exists) {
    console.log("Admin ya existe");
    return;
  }

  const hashed = await bcrypt.hash(adminPassword, 10);

  await User.create({
    email: adminEmail,
    password: hashed,
    role: "admin"
  });

  console.log("Admin creado:", adminEmail);
}

module.exports = createAdmin;

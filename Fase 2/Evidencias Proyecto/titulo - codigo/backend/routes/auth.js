const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// ---------------------
// VALIDACIONES
// ---------------------
function isValidEmail(email) {
    return /^\S+@\S+\.\S+$/.test(email);
}

function isValidPassword(password) {
    return password && password.length >= 6;
}

// ---------------------
// REGISTER
// ---------------------
router.post("/register", async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password)
            return res.status(400).json({ error: "Todos los campos son obligatorios." });

        if (!isValidEmail(email))
            return res.status(400).json({ error: "Email inválido." });

        if (!isValidPassword(password))
            return res.status(400).json({ error: "La contraseña debe tener mínimo 6 caracteres." });

        // Validación del rol permitido
        const allowedRoles = ["agricultor", "investigador"];
        const finalRole = allowedRoles.includes(role) ? role : "agricultor";

        const existing = await User.findOne({ email });
        if (existing)
            return res.status(400).json({ error: "El usuario ya existe." });

        const hashed = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashed,
            role: finalRole   // 👈 Se asigna rol validado
        });

        await newUser.save();

        return res.json({ message: "Usuario registrado correctamente." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en el servidor." });
    }
});


// ---------------------
// LOGIN
// ---------------------
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ error: "Todos los campos son obligatorios." });

        if (!isValidEmail(email))
            return res.status(400).json({ error: "Email inválido." });

        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ error: "Usuario o contraseña incorrectos." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ error: "Usuario o contraseña incorrectos." });

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login exitoso",
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en el servidor." });
    }
});

// ---------------------
// FORGOT PASSWORD
// ---------------------
router.post("/forgot", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email)
            return res.status(400).json({ error: "Ingresa tu email." });

        const user = await User.findOne({ email });

        // Nunca revelar si el usuario existe → seguridad
        if (!user)
            return res.json({ message: "Si el correo existe, enviaremos instrucciones." });

        const token = crypto.randomBytes(20).toString("hex");

        user.resetToken = token;
        user.resetTokenExpire = Date.now() + 1000 * 60 * 10;
        await user.save();

        console.log("LINK RESET PASSWORD:", `http://localhost:5500/reset.html?token=${token}`);

        res.json({ message: "Si el correo existe, enviaremos instrucciones." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en el servidor." });
    }
});

// ---------------------
// RESET PASSWORD
// ---------------------
router.post("/reset", async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password)
            return res.status(400).json({ error: "Faltan datos." });

        if (password.length < 6)
            return res.status(400).json({ error: "La contraseña debe tener mínimo 6 caracteres." });

        const user = await User.findOne({
            resetToken: token,
            resetTokenExpire: { $gt: Date.now() }
        });

        if (!user)
            return res.status(400).json({ error: "Token inválido o expirado." });

        user.password = await bcrypt.hash(password, 10);
        user.resetToken = undefined;
        user.resetTokenExpire = undefined;

        await user.save();

        res.json({ message: "Contraseña restablecida correctamente." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en el servidor." });
    }
});

module.exports = router;

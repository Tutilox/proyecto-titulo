const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "user" },
    resetToken: String,
    resetTokenExpire: Date
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verificationCode: { type: String, required: true },
    status: { type: String, enum: ["pending", "verified"], default: "pending" },
    role: { type: String, enum: ["user", "admin"], default: "user" }
});

module.exports = mongoose.model("User", UserSchema);
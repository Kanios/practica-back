const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { generateCode } = require("../utils/codeGenerator");

const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(409).json({ message: "Email ya registrado" });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const code = generateCode();
        const newUser = new User({ email, password: hashedPassword, verificationCode: code, status: "pending", role: "user" });
        await newUser.save();
        
        const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ email: newUser.email, status: newUser.status, role: newUser.role, token });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
};

const validateEmail = async (req, res) => {
    try {
        const { code } = req.body;
        const user = await User.findById(req.user.id);
        if (!user || user.verificationCode !== code) return res.status(400).json({ message: "Código inválido" });
        
        user.status = "verified";
        await user.save();
        res.json({ message: "Email verificado" });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: "Credenciales incorrectas" });
        
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ email: user.email, status: user.status, role: user.role, token });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
};

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password -verificationCode");
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
};

const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.json({ message: "Usuario eliminado" });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
};

module.exports = { register, validateEmail, login, getUser, deleteUser };
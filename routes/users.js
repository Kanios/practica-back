const express = require("express");
const { register, validateEmail, login, getUser, deleteUser } = require("../controllers/userController");
const { validatorRegister, validatorLogin, validatorCode } = require("../validators/user");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", validatorRegister, register);
router.post("/validate", authMiddleware, validatorCode, validateEmail);
router.post("/login", validatorLogin, login);
router.get("/", authMiddleware, getUser);
router.delete("/", authMiddleware, deleteUser);

module.exports = router;
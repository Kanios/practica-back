const express = require('express');
const router = express.Router();
const controller = require('../controllers/users');
const { registerValidator, loginValidator } = require('../validators/users');
const { authMiddleware } = require('../middleware/auth');

// Ruta para registrar un nuevo usuario
router.post('/register', registerValidator, controller.register);

// Ruta para login de usuario
router.post('/login', loginValidator, controller.login);

// Ruta para validar el código recibido por email (requiere token)
router.put('/validation', authMiddleware, controller.validateUser);

module.exports = router;
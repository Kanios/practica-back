const express = require('express');
const router = express.Router();
const { register, login, validate } = require('../controllers/users');
const { registerValidator, loginValidator } = require('../validators/users');
const { authMiddleware } = require('../middleware/auth');
const { recoverPassword, resetPassword } = require('../controllers/users');

// Ruta para registrar un nuevo usuario
router.post('/register', registerValidator, register);

// Ruta para login de usuario
router.post('/login', loginValidator, login);

// Ruta para validar el código recibido por email (requiere token)
router.put('/validation', authMiddleware, validate);

// Solicitar recuperación
router.post('/recover', recoverPassword);

// Reset con token
router.put('/reset-password', resetPassword);

module.exports = router;
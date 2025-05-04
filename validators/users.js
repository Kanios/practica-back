const { check } = require('express-validator');

// Validaciones para el registro
const registerValidator = [
  check('email').isEmail().withMessage('Email inválido'),
  check('password').isLength({ min: 6 }).withMessage('Contraseña muy corta')
];

// Validaciones para el login
const loginValidator = [
  check('email').isEmail().withMessage('Email inválido'),
  check('password').exists().withMessage('Contraseña requerida')
];

module.exports = { registerValidator, loginValidator };
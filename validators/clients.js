const { check } = require('express-validator');

// Validaciones para crear/editar un cliente
const clientValidator = [
  check('name').notEmpty().withMessage('El nombre es obligatorio'),
  check('email').isEmail().withMessage('Email no válido'),
  check('phone').optional().isMobilePhone().withMessage('Teléfono no válido'),
];

module.exports = { clientValidator };
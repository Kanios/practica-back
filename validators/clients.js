const { check } = require('express-validator');

// Validaciones para crear/editar un cliente
const clientValidator = [
  check('name').notEmpty().withMessage('Nombre requerido'),
  check('email').optional().isEmail().withMessage('Email inválido'),
  check('phone').optional().isMobilePhone().withMessage('Teléfono inválido'),
  check('cif').optional(),
  check('address').optional()
];

module.exports = { clientValidator };
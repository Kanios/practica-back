const { check } = require('express-validator');

// Validaciones para albaranes
const albaranValidator = [
  check('type').isIn(['hours', 'materials']).withMessage('Tipo inválido'),
  check('project').isMongoId().withMessage('ID de proyecto inválido'),
  check('entries').isArray({ min: 1 }).withMessage('Se requiere al menos una entrada'),
  check('entries.*.name').notEmpty().withMessage('Nombre requerido'),
  check('entries.*.quantity').isNumeric().withMessage('Cantidad inválida'),
  check('entries.*.unit').notEmpty().withMessage('Unidad requerida')
];

module.exports = { albaranValidator };
const { check } = require('express-validator');

const projectValidator = [
  check('name').notEmpty().withMessage('Nombre del proyecto requerido'),
  check('description').optional(),
  check('client').isMongoId().withMessage('ID de cliente inválido')
];

module.exports = { projectValidator };
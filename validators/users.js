const { check } = require("express-validator");

exports.validatorRegister = [
    check("email").isEmail().withMessage("Email inválido"),
    check("password").isLength({ min: 8 }).withMessage("La contraseña debe tener al menos 8 caracteres")
];

exports.validatorLogin = [
    check("email").isEmail().withMessage("Email inválido"),
    check("password").not().isEmpty().withMessage("La contraseña es obligatoria")
];

exports.validatorCode = [
    check("code").isLength({ min: 6, max: 6 }).withMessage("El código debe tener 6 dígitos")
];
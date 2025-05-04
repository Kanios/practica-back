const User = require('../models/users');
const bcrypt = require('bcryptjs');
const { matchedData } = require('express-validator');
const { tokenSign, generateValidationCode } = require('../utils/token');

// Controlador: Registro de nuevo usuario
const register = async (req, res, next) => {
  try {
    const body = matchedData(req); // Filtra los datos validados
    const userExists = await User.findOne({ email: body.email });
    if (userExists) return res.status(409).json({ message: 'Usuario ya existe' });

    const hashedPass = await bcrypt.hash(body.password, 10);
    const validationCode = generateValidationCode(); // Genera un código de 6 dígitos

    const user = await User.create({
      ...body,
      password: hashedPass,
      validationCode,
    });

    // Simulación: en vez de enviar email, mostramos en consola
    console.log(`Código de validación para ${user.email}: ${validationCode}`);

    res.status(201).json({ message: 'Usuario creado. Revisa tu email para validar.' });
  } catch (err) {
    next(err);
  }
};

// Controlador: Validación del usuario usando el código enviado
const validateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const { code } = req.body;
    if (user.validationCode !== code) {
      return res.status(400).json({ message: 'Código inválido' });
    }

    user.verified = true;
    user.validationCode = null;
    await user.save();

    res.json({ message: 'Usuario validado correctamente' });
  } catch (err) {
    next(err);
  }
};

// Controlador: Inicio de sesión
const login = async (req, res, next) => {
  try {
    const body = matchedData(req);
    const user = await User.findOne({ email: body.email }).select('+password');

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const passwordOK = await bcrypt.compare(body.password, user.password);
    if (!passwordOK) return res.status(401).json({ message: 'Contraseña incorrecta' });

    const token = await tokenSign(user); // Genera token JWT
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, validateUser };
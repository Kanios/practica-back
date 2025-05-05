const User = require('../models/users');
const crypto = require('crypto');
const { matchedData } = require('express-validator');
const { handleHttpError } = require('../utils/handleError');
const { tokenSign } = require('../utils/handleJwt');
const { compare, encrypt } = require('../utils/handlePassword');
const { sendVerificationEmail, sendRecoveryEmail } = require('../utils/handleEmail');
const { sendInviteEmail } = require('../utils/handleEmail');

// REGISTRO DE USUARIO
const register = async (req, res, next) => {
  try {
    const body = matchedData(req); //extrae email, password, inviteCode...

    // Verificar si hay código de invitación
    const { inviteCode } = req.body;

    if (inviteCode && global.inviteCodes?.[inviteCode]) {
      const { company, expiresAt } = global.inviteCodes[inviteCode];
      if (Date.now() < expiresAt) {
        body.company = company; // ✅ Asignamos la misma empresa
      } else {
        return handleHttpError(res, 'Código de invitación expirado', 400);
      }
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const password = await encrypt(body.password);

    const user = await User.create({
      ...body,
      password,
      validationCode: code
    });

    await sendVerificationEmail(user.email, code);

    res.status(201).json({ message: 'Usuario registrado. Código enviado al correo.' });
  } catch (err) {
    next(err);
  }
};

// LOGIN DE USUARIO
const login = async (req, res, next) => {
  try {
    const body = matchedData(req);

    const user = await User.findOne({ email: body.email }).select('+password');
    if (!user) return handleHttpError(res, 'Usuario no encontrado', 404);

    const check = await compare(body.password, user.password);
    if (!check) return handleHttpError(res, 'Credenciales inválidas', 401);

    const token = await tokenSign(user);

    res.json({ token });
  } catch (err) {
    next(err);
  }
};

// VALIDAR USUARIO CON CÓDIGO ENVIADO POR EMAIL
const validate = async (req, res, next) => {
  try {
    const body = matchedData(req);

    const user = await User.findById(req.user._id);
    if (!user) return handleHttpError(res, 'No autorizado', 401);

    if (user.code !== body.code) {
      return handleHttpError(res, 'Código inválido', 400);
    }

    user.verified = true;
    await user.save();

    res.json({ message: 'Usuario validado correctamente' });
  } catch (err) {
    next(err);
  }
};

// Solicitar recuperación de contraseña
const recoverPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return handleHttpError(res, 'Usuario no encontrado', 404);

    // Generar token aleatorio
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await user.save();

    await sendRecoveryEmail(user.email, token); // te lo paso ahora

    res.json({ message: 'Correo de recuperación enviado' });
  } catch (err) {
    next(err);
  }
};

// Cambiar contraseña con token
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }
    }).select('+password');

    if (!user) return handleHttpError(res, 'Token inválido o expirado', 400);

    user.password = await encrypt(password);
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await user.save();

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    next(err);
  }
};

const inviteUser = async (req, res, next) => {
  try {
    const inviter = await User.findById(req.user._id);

    if (!inviter || !inviter.company) {
      return handleHttpError(res, 'No puedes invitar sin compañía asignada', 403);
    }

    const { email } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Guardamos el código y compañía en memoria temporal (o podrías usar Mongo)
    global.inviteCodes = global.inviteCodes || {};
    global.inviteCodes[code] = { company: inviter.company, expiresAt: Date.now() + 15 * 60 * 1000 }; // 15 min

    await sendInviteEmail(email, code, inviter.email);

    res.json({ message: 'Invitación enviada por correo' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  validate,
  recoverPassword,
  resetPassword,
  inviteUser
};
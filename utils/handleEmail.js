const nodemailer = require('nodemailer');

// Crear el transporter una sola vez y reutilizarlo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,  // Tu email
    pass: process.env.EMAIL_PASS   // Contraseña o app password
  }
});

/**
 * Envía un correo electrónico con el código de verificación al usuario.
 */
const sendVerificationEmail = async (to, code) => {
  await transporter.sendMail({
    from: `"No-Reply" <${process.env.EMAIL_FROM}>`,
    to,
    subject: 'Código de validación de usuario',
    html: `<h3>Tu código de validación es: <strong>${code}</strong></h3>`
  });
};

/**
 * Envía un correo con el token de recuperación de contraseña.
 */
const sendRecoveryEmail = async (to, token) => {
  const link = `${process.env.PUBLIC_URL}/reset-password?token=${token}`;

  const html = `
    <h3>Recuperación de contraseña</h3>
    <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
    <a href="${link}">${link}</a>
    <p>Este enlace caduca en 15 minutos.</p>
  `;

  await transporter.sendMail({
    from: `"No-Reply" <${process.env.EMAIL_FROM}>`,
    to,
    subject: 'Recuperación de contraseña',
    html
  });
};

module.exports = { sendVerificationEmail, sendRecoveryEmail };
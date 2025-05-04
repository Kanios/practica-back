const jwt = require('jsonwebtoken');

// Firma y devuelve un JWT válido
const tokenSign = async (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );
};

// Genera un código de validación de 6 cifras
const generateValidationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = { tokenSign, generateValidationCode };
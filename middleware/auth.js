const jwt = require('jsonwebtoken');

// Middleware que protege rutas privadas usando el token JWT
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token requerido' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Añade el usuario decodificado a la petición
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = { authMiddleware };
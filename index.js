require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/mongo');

const app = express();
connectDB();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Rutas
app.use('/api/users', require('./routes/users'));

// Middleware de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
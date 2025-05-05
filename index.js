require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/mongo');
const { handleHttpError } = require('./utils/handleError');
const swaggerDocs = require('./docs/swagger');

const app = express();
connectDB();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Documentación Swagger
swaggerDocs(app);

// Archivos estáticos (firmas)
app.use('/public', express.static('public'));

// Rutas
app.use('/api/users', require('./routes/users'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/albaranes', require('./routes/albaranes'));
app.use('/api/companies', require('./routes/companies'));

// Ruta de prueba para forzar un error 500 y probar Slack http://localhost:3000/error-test
app.get('/error-test', (req, res) => {
  throw new Error('Simulando error 500 para Slack');
});

// Middleware de errores
app.use((err, req, res, next) => {
  const code = err.status || 500;
  const message = err.message || 'Error interno del servidor';
  handleHttpError(res, message, code);
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
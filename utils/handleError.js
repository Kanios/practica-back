const axios = require('axios');

/**
 * Maneja errores HTTP y los envía a Slack si es un 5XX
 * @param {*} res - Objeto de respuesta de Express
 * @param {*} message - Mensaje de error
 * @param {*} code - Código de estado HTTP (por defecto 403)
 */
const handleHttpError = async (res, message = 'Error', code = 403) => {
  // Enviar a Slack si es error 500+ y hay webhook definido
  if (code >= 500 && process.env.SLACK_WEBHOOK_URL) {
    try {
      await axios.post(process.env.SLACK_WEBHOOK_URL, {
        text: `*Error ${code}* en servidor:\n> ${message}`
      });
    } catch (err) {
      console.error('Error al enviar mensaje a Slack:', err.message);
    }
  }

  // Devolver respuesta al cliente
  res.status(code).json({ error: message });
};

module.exports = { handleHttpError };
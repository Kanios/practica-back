const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Ruta /api/users funcionando correctamente' });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { createCompany, inviteExistingUser } = require('../controllers/companies');
const { authMiddleware } = require('../middleware/auth');

// Crear una compañía
router.post('/', authMiddleware, createCompany);

// Añadir un usuario ya registrado a la compañía
router.post('/invite-user', authMiddleware, inviteExistingUser);

module.exports = router;
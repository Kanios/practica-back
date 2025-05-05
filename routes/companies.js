const express = require('express');
const router = express.Router();
const { createCompany, inviteExistingUser } = require('../controllers/companies');
const { authMiddleware } = require('../middleware/auth');

/**
* @swagger
* tags:
*   name: Companies
*   description: Endpoints para gestión de compañías
*/


/**
 * @swagger
 * /api/companies:
 *   post:
 *     summary: Crear una nueva compañía y asociar al usuario actual
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Compañía creada y asociada al usuario
 */
router.post('/', authMiddleware, createCompany);

/**
 * @swagger
 * /api/companies/invite-user:
 *   post:
 *     summary: Invitar a un usuario ya existente a una compañía
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: invitado@empresa.com
 *     responses:
 *       200:
 *         description: Usuario añadido a la compañía correctamente
 *       404:
 *         description: Usuario no encontrado
 */
router.post('/invite-user', authMiddleware, inviteExistingUser);

module.exports = router;
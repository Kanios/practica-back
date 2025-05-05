const express = require('express');
const router = express.Router();
const controller = require('../controllers/clients');
const { authMiddleware } = require('../middleware/auth');

/**
* @swagger
* tags:
*   name: Clients
*   description: Endpoints para gestionar clientes (crear, ver, actualizar, archivar, eliminar)
*/

/**
 * @swagger
 * /api/clients:
 *   post:
 *     summary: Crear un nuevo cliente
 *     tags: [Clients]
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
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cliente creado
 */
router.post('/', authMiddleware, controller.createClient);

/**
 * @swagger
 * /api/clients:
 *   get:
 *     summary: Obtener todos los clientes del usuario o compañía
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes
 */
router.get('/', authMiddleware, controller.getClients);

/**
 * @swagger
 * /api/clients/{id}:
 *   get:
 *     summary: Obtener un cliente por ID
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Datos del cliente
 */
router.get('/:id', authMiddleware, controller.getClientById);

/**
 * @swagger
 * /api/clients/{id}:
 *   put:
 *     summary: Actualizar cliente
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente actualizado
 */
router.put('/:id', authMiddleware, controller.updateClient);

/**
 * @swagger
 * /api/clients/archive/{id}:
 *   delete:
 *     summary: Archivar cliente (soft delete)
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Cliente archivado
 */
router.delete('/archive/:id', authMiddleware, controller.archiveClient);

/**
 * @swagger
 * /api/clients/{id}/hard:
 *   delete:
 *     summary: Eliminar cliente definitivamente (hard delete)
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Cliente eliminado permanentemente
 */
router.delete('/:id/hard', authMiddleware, controller.deleteClient);

/**
 * @swagger
 * /api/clients/archived/all:
 *   get:
 *     summary: Ver clientes archivados
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes archivados
 */
router.get('/archived/all', authMiddleware, controller.getArchivedClients);

/**
 * @swagger
 * /api/clients/restore/{id}:
 *   post:
 *     summary: Restaurar cliente archivado
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Cliente restaurado
 */
router.post('/restore/:id', authMiddleware, controller.restoreClient);

module.exports = router;
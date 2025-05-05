const express = require('express');
const router = express.Router();
const controller = require('../controllers/albaranes');
const { authMiddleware } = require('../middleware/auth');
const { albaranValidator } = require('../validators/albaranes');

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Albaranes
 *   description: Endpoints para gestión de albaranes
 */

/**
 * @swagger
 * /api/albaranes:
 *   post:
 *     summary: Crear un albarán (horas o materiales)
 *     tags: [Albaranes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - project
 *               - entries
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [hours, materials]
 *               project:
 *                 type: string
 *               entries:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     unit:
 *                       type: string
 *     responses:
 *       201:
 *         description: Albarán creado correctamente
 */
router.post('/', albaranValidator, controller.create);

/**
 * @swagger
 * /api/albaranes:
 *   get:
 *     summary: Obtener todos los albaranes visibles para el usuario
 *     tags: [Albaranes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de albaranes
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/albaranes/archived:
 *   get:
 *     summary: Obtener albaranes archivados (soft deleted)
 *     tags: [Albaranes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de albaranes archivados
 */
router.get('/archived', controller.getArchived);

/**
 * @swagger
 * /api/albaranes/{id}:
 *   get:
 *     summary: Obtener un albarán por su ID
 *     tags: [Albaranes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del albarán
 *     responses:
 *       200:
 *         description: Albarán encontrado
 *       404:
 *         description: Albarán no encontrado
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/albaranes/archive/{id}:
 *   delete:
 *     summary: Archivar un albarán (soft delete)
 *     tags: [Albaranes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del albarán
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Albarán archivado
 */
router.delete('/archive/:id', controller.archive);

/**
 * @swagger
 * /api/albaranes/{id}:
 *   delete:
 *     summary: Eliminar un albarán (hard delete)
 *     tags: [Albaranes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Albarán eliminado
 */
router.delete('/:id', controller.remove);

/**
 * @swagger
 * /api/albaranes/restore/{id}:
 *   patch:
 *     summary: Restaurar un albarán archivado
 *     tags: [Albaranes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Albarán restaurado
 */
router.patch('/restore/:id', controller.restore);

/**
 * @swagger
 * /api/albaranes/sign/{id}:
 *   patch:
 *     summary: Firmar un albarán con base64
 *     tags: [Albaranes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               base64:
 *                 type: string
 *     responses:
 *       200:
 *         description: Firma guardada correctamente
 */
router.patch('/sign/:id', controller.sign);

module.exports = router;
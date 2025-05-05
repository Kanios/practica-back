const express = require('express');
const router = express.Router();
const controller = require('../controllers/projects');
const { authMiddleware } = require('../middleware/auth');

/**
* @swagger
* tags:
*   name: Projects
*   description: Endpoints para gestionar proyectos (crear, ver, actualizar, archivar, eliminar)
*/

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Crear un nuevo proyecto
 *     tags: [Projects]
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
 *               - client
 *             properties:
 *               name:
 *                 type: string
 *                 example: Proyecto REST Client
 *               description:
 *                 type: string
 *                 example: Descripción del proyecto
 *               client:
 *                 type: string
 *                 example: 605c5c45fc13ae34e8000000
 *     responses:
 *       201:
 *         description: Proyecto creado
 *       400:
 *         description: Datos inválidos o cliente no válido
 */   
router.post('/', authMiddleware, controller.createProject);


/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Obtener todos los proyectos del usuario o su compañía
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de proyectos
 */
router.get('/', authMiddleware, controller.getProjects);


/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Obtener un proyecto por ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del proyecto
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proyecto encontrado
 *       404:
 *         description: Proyecto no encontrado
 */
router.get('/:id', authMiddleware, controller.getProjectById);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Actualizar un proyecto
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: Proyecto actualizado desde Swagger
 *     responses:
 *       200:
 *         description: Proyecto actualizado
 */
router.put('/:id', authMiddleware, controller.updateProject);

/**
 * @swagger
 * /api/projects/archive/{id}:
 *   delete:
 *     summary: Archivar un proyecto (soft delete)
 *     tags: [Projects]
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
 *         description: Proyecto archivado
 */
router.delete('/archive/:id', authMiddleware, controller.archiveProject);

/**
 * @swagger
 * /api/projects/{id}/hard:
 *   delete:
 *     summary: Eliminar un proyecto (hard delete)
 *     tags: [Projects]
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
 *         description: Proyecto eliminado definitivamente
 */
router.delete('/:id/hard', authMiddleware, controller.deleteProject);

/**
 * @swagger
 * /api/projects/archived/all:
 *   get:
 *     summary: Obtener todos los proyectos archivados
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de proyectos archivados
 */
router.get('/archived/all', authMiddleware, controller.getArchivedProjects);

/**
 * @swagger
 * /api/projects/restore/{id}:
 *   post:
 *     summary: Restaurar un proyecto archivado
 *     tags: [Projects]
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
 *         description: Proyecto restaurado
 */
router.post('/restore/:id', authMiddleware, controller.restoreProject);

module.exports = router;
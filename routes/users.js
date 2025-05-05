const express = require('express');
const router = express.Router();
const { register, login, validate, inviteUser, archiveUser, hardDeleteUser } = require('../controllers/users');
const { registerValidator, loginValidator } = require('../validators/users');
const { authMiddleware } = require('../middleware/auth');
const { recoverPassword, resetPassword } = require('../controllers/users');

/**
* @swagger
* tags:
*   name: Users
*   description: Endpoints de autenticación y usuarios
*/

/**
* @swagger
* /api/users/register:
*   post:
*     summary: Registrar un nuevo usuario
*     tags: [Users]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - email
*               - password
*             properties:
*               email:
*                 type: string
*                 example: usuario@ejemplo.com
*               password:
*                 type: string
*                 example: 123456
*     responses:
*       201:
*         description: Usuario registrado. Código enviado al correo.
*/
router.post('/register', registerValidator, register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@ejemplo.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Token JWT generado
 */
router.post('/login', loginValidator, login);

/**
 * @swagger
 * /api/users/validation:
 *   put:
 *     summary: Validar usuario con código recibido por correo
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Usuario validado correctamente
 */
router.put('/validation', authMiddleware, validate);

/**
 * @swagger
 * /api/users/recover:
 *   post:
 *     summary: Solicitar recuperación de contraseña
 *     tags: [Users]
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
 *                 example: usuario@ejemplo.com
 *     responses:
 *       200:
 *         description: Correo de recuperación enviado
 */
router.post('/recover', recoverPassword);

/**
 * @swagger
 * /api/users/reset-password:
 *   put:
 *     summary: Cambiar contraseña con token de recuperación
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *                 example: nuevaPassword123
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 */
router.put('/reset-password', resetPassword);

/**
 * @swagger
 * /api/users/invite:
 *   post:
 *     summary: Invitar a un nuevo usuario a la compañía
 *     tags: [Users]
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
 *         description: Código de invitación enviado
 */
router.post('/invite', authMiddleware, inviteUser);

/**
 * @swagger
 * /api/users/archive/{id}:
 *   delete:
 *     summary: Archivar usuario (soft delete)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario archivado
 */
router.delete('/archive/:id', authMiddleware, archiveUser);

/**
 * @swagger
 * /api/users/{id}/hard:
 *   delete:
 *     summary: Eliminar usuario definitivamente (hard delete)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado permanentemente
 */
router.delete('/:id/hard', authMiddleware, hardDeleteUser);

module.exports = router;
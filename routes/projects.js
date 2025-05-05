const express = require('express');
const router = express.Router();
const controller = require('../controllers/projects');
const { authMiddleware } = require('../middleware/auth');

// Crear proyecto
router.post('/', authMiddleware, controller.createProject);

// Obtener todos los proyectos del usuario o su empresa
router.get('/', authMiddleware, controller.getProjects);

// Obtener un proyecto por ID
router.get('/:id', authMiddleware, controller.getProjectById);

// Editar proyecto
router.put('/:id', authMiddleware, controller.updateProject);

// Archivar proyecto (soft delete)
router.delete('/archive/:id', authMiddleware, controller.archiveProject);

// Eliminar proyecto completamente (hard delete)
router.delete('/:id/hard', authMiddleware, controller.deleteProject);

// Ver proyectos archivados
router.get('/archived/all', authMiddleware, controller.getArchivedProjects);

// Restaurar proyecto archivado
router.post('/restore/:id', authMiddleware, controller.restoreProject);

module.exports = router;
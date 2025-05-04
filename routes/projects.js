const express = require('express');
const router = express.Router();
const controller = require('../controllers/projects');
const { authMiddleware } = require('../middleware/auth');
const { projectValidator } = require('../validators/projects');

router.use(authMiddleware);

// CRUD
router.post('/', projectValidator, controller.createProject);
router.get('/', controller.getProjects);
router.get('/archived', controller.getArchivedProjects);
router.get('/:id', controller.getProjectById);
router.put('/:id', projectValidator, controller.updateProject);
router.delete('/archive/:id', controller.archiveProject);
router.delete('/:id', controller.deleteProject);
router.patch('/restore/:id', controller.restoreProject);

module.exports = router;
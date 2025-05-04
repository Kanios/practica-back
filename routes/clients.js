const express = require('express');
const router = express.Router();
const controller = require('../controllers/clients');
const { authMiddleware } = require('../middleware/auth');
const { clientValidator } = require('../validators/clients');

// Proteger todas las rutas
router.use(authMiddleware);

// CRUD
router.post('/', clientValidator, controller.createClient);
router.get('/', controller.getClients);
router.get('/archived', controller.getArchivedClients);
router.get('/:id', controller.getClientById);
router.put('/:id', clientValidator, controller.updateClient);
router.delete('/archive/:id', controller.archiveClient); // Soft delete
router.delete('/:id', controller.deleteClient);          // Hard delete
router.patch('/restore/:id', controller.restoreClient);  // Restaurar
module.exports = router;
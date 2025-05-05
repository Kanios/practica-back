const express = require('express');
const router = express.Router();
const controller = require('../controllers/clients');
const { authMiddleware } = require('../middleware/auth');

// Crear cliente
router.post('/', authMiddleware, controller.createClient);

// Obtener todos los clientes del usuario o compañía
router.get('/', authMiddleware, controller.getClients);

// Obtener un cliente por ID
router.get('/:id', authMiddleware, controller.getClientById);

// Editar cliente
router.put('/:id', authMiddleware, controller.updateClient);

// Archivar cliente (soft delete)
router.delete('/archive/:id', authMiddleware, controller.archiveClient);

// Eliminar cliente completamente (hard delete)
router.delete('/:id/hard', authMiddleware, controller.deleteClient);

// Ver clientes archivados
router.get('/archived/all', authMiddleware, controller.getArchivedClients);

// Restaurar cliente archivado
router.post('/restore/:id', authMiddleware, controller.restoreClient);

module.exports = router;
const express = require('express');
const router = express.Router();
const controller = require('../controllers/albaranes');
const { authMiddleware } = require('../middleware/auth');
const { albaranValidator } = require('../validators/albaranes');

router.use(authMiddleware);

router.post('/', albaranValidator, controller.create);
router.get('/', controller.getAll);
router.get('/archived', controller.getArchived);
router.get('/:id', controller.getById);
router.delete('/archive/:id', controller.archive);
router.delete('/:id', controller.remove);
router.patch('/restore/:id', controller.restore);
router.patch('/sign/:id', controller.sign);

module.exports = router;
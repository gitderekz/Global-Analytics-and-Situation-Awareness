const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticate, authorize } = require('../middlewares/auth');
const writeRoles = ['Super Admin', 'Admin', 'Operator'];
const deleteRoles = ['Super Admin', 'Admin'];

router.get('/geojson', authenticate, eventController.getGeoJSON);
router.get('/', authenticate, eventController.getAll);
router.get('/:id', authenticate, eventController.getById);
router.post('/', authenticate, authorize(...writeRoles), eventController.create);
router.put('/:id', authenticate, authorize(...writeRoles), eventController.update);
router.delete('/:id', authenticate, authorize(...deleteRoles), eventController.remove);

module.exports = router;

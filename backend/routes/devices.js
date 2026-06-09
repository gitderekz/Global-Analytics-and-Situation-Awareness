const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const { authenticate, authorize } = require('../middlewares/auth');
const writeRoles = ['Super Admin', 'Admin', 'Operator'];

router.get('/geojson', authenticate, deviceController.getGeoJSON);
router.get('/', authenticate, deviceController.getAll);
router.get('/:id', authenticate, deviceController.getById);
router.post('/', authenticate, authorize(...writeRoles), deviceController.create);
router.put('/:id', authenticate, authorize(...writeRoles), deviceController.update);
router.delete('/:id', authenticate, authorize('Super Admin', 'Admin'), deviceController.remove);

module.exports = router;

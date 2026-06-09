const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const { authenticate, authorize } = require('../middlewares/auth');
const writeRoles = ['Super Admin', 'Admin', 'Operator'];

router.get('/geojson', authenticate, assetController.getGeoJSON);
router.get('/', authenticate, assetController.getAll);
router.get('/:id/tracks', authenticate, assetController.getTracks);
router.get('/:id', authenticate, assetController.getById);
router.post('/', authenticate, authorize(...writeRoles), assetController.create);
router.put('/:id', authenticate, authorize(...writeRoles), assetController.update);
router.delete('/:id', authenticate, authorize('Super Admin', 'Admin'), assetController.remove);

module.exports = router;

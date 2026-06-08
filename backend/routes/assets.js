const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const { authenticate } = require('../middlewares/auth');

router.get('/geojson', authenticate, assetController.getGeoJSON);
router.get('/', authenticate, assetController.getAll);
router.get('/:id/tracks', authenticate, assetController.getTracks);
router.get('/:id', authenticate, assetController.getById);
router.post('/', authenticate, assetController.create);
router.put('/:id', authenticate, assetController.update);
router.delete('/:id', authenticate, assetController.remove);

module.exports = router;

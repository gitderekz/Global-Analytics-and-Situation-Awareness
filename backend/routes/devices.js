const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const { authenticate } = require('../middlewares/auth');

router.get('/geojson', authenticate, deviceController.getGeoJSON);
router.get('/', authenticate, deviceController.getAll);
router.get('/:id', authenticate, deviceController.getById);
router.post('/', authenticate, deviceController.create);
router.put('/:id', authenticate, deviceController.update);
router.delete('/:id', authenticate, deviceController.remove);

module.exports = router;

const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticate } = require('../middlewares/auth');

router.get('/geojson', authenticate, eventController.getGeoJSON);
router.get('/', authenticate, eventController.getAll);
router.get('/:id', authenticate, eventController.getById);
router.post('/', authenticate, eventController.create);
router.put('/:id', authenticate, eventController.update);
router.delete('/:id', authenticate, eventController.remove);

module.exports = router;

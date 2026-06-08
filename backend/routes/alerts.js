const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const { authenticate } = require('../middlewares/auth');

router.get('/', authenticate, alertController.getAll);
router.put('/:id/acknowledge', authenticate, alertController.acknowledge);
router.put('/:id/resolve', authenticate, alertController.resolve);

module.exports = router;

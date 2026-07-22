const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth');
const metricsController = require('../controllers/metricsController');

router.get('/', authenticate, authorize('Super Admin', 'Admin'), metricsController.getMetrics);
router.get('/jobs', authenticate, authorize('Super Admin', 'Admin'), metricsController.getJobs);
router.get('/logs', authenticate, authorize('Super Admin', 'Admin'), metricsController.getLogs);

module.exports = router;

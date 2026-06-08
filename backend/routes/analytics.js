const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticate } = require('../middlewares/auth');

router.get('/kpis', authenticate, analyticsController.getKPIs);
router.get('/severity', authenticate, analyticsController.getSeverityDistribution);
router.get('/event-types', authenticate, analyticsController.getEventTypes);
router.get('/threats', authenticate, analyticsController.getThreatAnalytics);
router.get('/fraud', authenticate, analyticsController.getFraudAnalytics);
router.get('/time-series', authenticate, analyticsController.getTimeSeries);
router.get('/search', authenticate, analyticsController.search);
router.get('/map-data', authenticate, analyticsController.getMapData);

module.exports = router;

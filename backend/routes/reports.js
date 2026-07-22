const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/', authenticate, reportController.list);
router.get('/generate/:type/:format', authenticate, authorize('Super Admin', 'Admin', 'Operator', 'Analyst'), reportController.generate);
router.get('/jobs/:jobId', authenticate, authorize('Super Admin', 'Admin', 'Operator', 'Analyst'), reportController.getJobStatus);
router.get('/download/:fileName', authenticate, reportController.download);

module.exports = router;

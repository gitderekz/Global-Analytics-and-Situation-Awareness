const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth');
const importController = require('../controllers/importController');

router.post('/upload/:type', authenticate, authorize('Super Admin', 'Admin', 'Operator'), importController.uploadMiddleware, importController.importData);

module.exports = router;

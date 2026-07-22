const express = require('express');
const multer = require('multer');
const path = require('path');
const { authenticate, authorize } = require('../middlewares/auth');
const tilesController = require('../controllers/tilesController');

const upload = multer({ dest: path.join(__dirname, '..', 'uploads', 'mbtiles') });
const router = express.Router();

router.get('/status', authenticate, authorize('Super Admin', 'Admin'), tilesController.getStatus);
router.post('/upload', authenticate, authorize('Super Admin', 'Admin'), upload.single('mbtiles'), tilesController.uploadMbtiles);
router.get('/:z/:x/:y.png', tilesController.getTile);

module.exports = router;
const express = require('express');
const router = express.Router();
const geographyController = require('../controllers/geographyController');
const { authenticate } = require('../middlewares/auth');

router.get('/continents', authenticate, geographyController.getContinents);
router.get('/countries', authenticate, geographyController.getCountries);
router.get('/regions', authenticate, geographyController.getRegions);
router.get('/cities', authenticate, geographyController.getCities);
router.get('/districts', authenticate, geographyController.getDistricts);

module.exports = router;

const express = require('express');
const router = express.Router();
const docsController = require('../controllers/docsController');

router.get('/openapi.json', docsController.getOpenApi);
router.get('/', docsController.getDocsPage);

module.exports = router;

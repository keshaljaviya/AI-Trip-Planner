const express = require('express');
const router = express.Router();
const attractionController = require('../controllers/attractionController');

router.get('/', attractionController.getAttractions);

module.exports = router;

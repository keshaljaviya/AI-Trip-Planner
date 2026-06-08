const express = require('express');
const router = express.Router();
const transportController = require('../controllers/transportController');

router.post('/', transportController.getTransportOptions);

module.exports = router;

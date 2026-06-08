const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/generate', tripController.generateTrip);

// Protected routes
router.post('/save', authMiddleware, tripController.saveTrip);
router.get('/my-trips', authMiddleware, tripController.getSavedTrips);
router.delete('/:id', authMiddleware, tripController.deleteTrip);

module.exports = router;

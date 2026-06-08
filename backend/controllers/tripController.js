const tripService = require('../services/tripService');
const Trip = require('../models/Trip');

exports.generateTrip = async (req, res) => {
    const { source, destinations, days, styles, budget } = req.body;

    if (!source || !destinations || !days || !styles || !budget) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const tripData = await tripService.generateTripPlan({ source, destinations, days, styles, budget });
        console.log("Trip successfully generated and sent to client.");
        res.json(tripData);
    } catch (error) {
        console.error("Generate Trip Controller Error:", error); // Logs full stack
        res.status(500).json({ error: error.message || "Failed to generate trip" });
    }
};

exports.saveTrip = async (req, res) => {
    try {
        const { source, destinations, days, styles, budget, tripData } = req.body;
        const userId = req.user.id; // From authMiddleware

        const newTrip = new Trip({
            userId,
            source,
            destinations,
            days,
            styles,
            budget,
            tripData
        });

        await newTrip.save();
        res.status(201).json(newTrip);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSavedTrips = async (req, res) => {
    try {
        const trips = await Trip.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(trips);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteTrip = async (req, res) => {
    try {
        const trip = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!trip) return res.status(404).json({ error: 'Trip not found' });
        res.json({ message: 'Trip deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

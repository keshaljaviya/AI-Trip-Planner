const attractionService = require('../services/attractionService');

exports.getAttractions = async (req, res) => {
    const { city } = req.query;

    if (!city) {
        return res.status(400).json({ error: "City query parameter is required" });
    }

    try {
        const attractions = await attractionService.getAttractionsByCity(city);
        res.json({ attractions });
    } catch (error) {
        console.error("Get Attractions Controller Error:", error.message);
        res.status(500).json({ error: "Failed to fetch attractions" });
    }
};

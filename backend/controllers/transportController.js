const transportService = require('../services/transportService');

exports.getTransportOptions = async (req, res) => {
    const { source, destination } = req.body;

    if (!source || !destination) {
        return res.status(400).json({ error: "Source and Destination required" });
    }

    try {
        const transportData = await transportService.getAllTransportOptions(source, destination);
        res.json(transportData);
    } catch (error) {
        console.error("Get Transport Controller Error:", error.message);
        res.status(500).json({ error: "Failed to fetch transport options" });
    }
};

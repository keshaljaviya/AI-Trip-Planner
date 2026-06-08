const axios = require('axios');
const geminiService = require('./geminiService');

class TransportService {
    async getCoordinates(placeName) {
        const geoUrl = `https://api.opentripmap.com/0.1/en/places/geoname?name=${encodeURIComponent(placeName)}&apikey=${process.env.OPENTRIPMAP_KEY}`;
        const response = await axios.get(geoUrl);
        if (response.data && response.data.lat) {
            return { lat: response.data.lat, lon: response.data.lon };
        }
        throw new Error(`Coordinates not found for ${placeName}`);
    }

    async getRoadInfo(source, destination) {
        try {
            const sourceCoords = await this.getCoordinates(source);
            const destCoords = await this.getCoordinates(destination);

            const orsUrl = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${process.env.OPENROUTESERVICE_KEY}&start=${sourceCoords.lon},${sourceCoords.lat}&end=${destCoords.lon},${destCoords.lat}`;
            const orsRes = await axios.get(orsUrl);

            if (orsRes.data && orsRes.data.features && orsRes.data.features.length > 0) {
                const summary = orsRes.data.features[0].properties.summary;
                const distanceKm = (summary.distance / 1000).toFixed(1);
                const durationHours = (summary.duration / 3600).toFixed(1);
                const fuelNeeded = distanceKm / 15;
                const cost = Math.round(fuelNeeded * 100);

                return {
                    time: `${durationHours}h`,
                    distance: `${distanceKm}km`,
                    cost: `₹${cost} approx fuel`
                };
            }
        } catch (error) {
            console.error("Road Info Service Error:", error.message);
        }
        return { time: "N/A", distance: "N/A", cost: "N/A" };
    }

    async getAIEstimates(source, destination) {
        const prompt = `Estimate transport options between ${source} and ${destination}.
        Provide strict JSON output.
        Format:
        {
           "train": { "time": "approx time in hours/mins", "cost": "approx cost range in INR" },
           "flight": { "time": "approx time in hours/mins", "cost": "approx cost range in INR" }
        }
        Do not include markdown.`;

        try {
            return await geminiService.generateContent(prompt);
        } catch (error) {
            console.error("Transport AI Estimate Error:", error.message);
            return { train: { time: "N/A", cost: "N/A" }, flight: { time: "N/A", cost: "N/A" } };
        }
    }

    async getAllTransportOptions(source, destination) {
        const [road, ai] = await Promise.all([
            this.getRoadInfo(source, destination),
            this.getAIEstimates(source, destination)
        ]);

        return {
            road,
            train: ai.train,
            flight: ai.flight
        };
    }
}

module.exports = new TransportService();

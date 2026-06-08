const axios = require('axios');

class AttractionService {
    constructor() {
        this.apiKey = process.env.OPENTRIPMAP_KEY;
    }

    async getAttractionsByCity(city) {
        try {
            // Step 1: Geocoding to get lat/lon for the city
            const geoUrl = `https://api.opentripmap.com/0.1/en/places/geoname?name=${encodeURIComponent(city)}&apikey=${this.apiKey}`;
            const geoRes = await axios.get(geoUrl);

            if (!geoRes.data || !geoRes.data.lat || !geoRes.data.lon) {
                throw new Error("City not found in OpenTripMap");
            }

            const { lat, lon } = geoRes.data;

            // Step 2: Discovery (radius search)
            const kinds = "museums,religion,fortifications,beaches,natural,interesting_places";
            const placesUrl = `https://api.opentripmap.com/0.1/en/places/radius?radius=10000&lon=${lon}&lat=${lat}&kinds=${kinds}&rate=2&format=json&limit=20&apikey=${this.apiKey}`;

            const placesRes = await axios.get(placesUrl);
            let places = placesRes.data;

            // Sort by rate descending (popular first)
            places.sort((a, b) => b.rate - a.rate);

            return places.map(place => ({
                name: place.name,
                xid: place.xid,
                rate: place.rate,
                kinds: place.kinds,
                osm: place.osm,
                dist: place.dist
            }));

        } catch (error) {
            console.error("Attraction Service Error:", error.message);
            throw error;
        }
    }
}

module.exports = new AttractionService();

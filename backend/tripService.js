const geminiService = require('./geminiService');

class TripService {
    async generateTripPlan({ source, destinations, days, styles, budget }) {
        // Safety check to ensure destinations is an array
        const destList = Array.isArray(destinations)
            ? destinations
            : destinations.split(',').map(d => d.trim()).filter(d => d);

        const prompt = `Act as a travel expert. Generate a strict JSON response. Create an informative and catchy ${days}-day itinerary for a trip starting from ${source} and visiting ${destList.join(', ')} in that specific order. 
        Travel Styles: ${styles.join(', ')}. 
        Budget: ${budget}. 

        Structure: A JSON object with the following keys:
        1. "travel_options": An array of objects. For EACH route in the sequence (${source} to ${destList[0]}, then between destinations, and ${destList[destList.length - 1]} to ${source}), provide ALL feasible and diverse travel options. Try to include multiple options per route if available, covering "type" (Flight, Train, Bus, Car, or Ferry where applicable). Include "route", "type", "details", "price_range" (String, e.g. "800-1200" - NO CURRENCY SYMBOL), "travel_duration". CRITICAL: DO NOT include local in-city transportation; only focus on transport BETWEEN the destination cities and the return journey home.
        2. "stay_options": An array of objects. For EACH city in ${destList.join(', ')}, provide 6 diverse best accommodation options. Each object MUST include "city" (matching one of the destinations EXACTLY), "name", "type" (Hotel/Hostel/Resort), "price_range" (String, e.g. "80-150" - NO CURRENCY SYMBOL), "rating", "address".
        3. "itinerary": An array of objects. Each object represents a "Day" and contains:
           - "day": integer
           - "city": string (The city being visited that day, must match your destinations)
           - "theme": string (A catchy title for the day)
           - "morning": { "place": string, "details": string, "time": string, "ticket_price": string }
           - "afternoon": { "place": string, "details": string, "time": string, "ticket_price": string }
           - "evening": { "place": string, "details": string, "time": string, "ticket_price": string }
           - "night": { "place": string, "details": string, "time": string, "ticket_price": string }
           - "best_food_locations": string
           - "must_try_food": string

        CRITICAL REQUIREMENTS: 
        - For each activity (morning, afternoon, evening, night), the "details" field MUST be exactly 1-2 concise and informative sentences. 
        - If a ticket price is involved, provide a specific estimate (e.g., "15" or "Free") - NO CURRENCY SYMBOL.

        Ensure the response is valid JSON only. No markdown formatting.`;

        try {
            console.log("TripService: Generating trip plan with single prompt...");
            return await geminiService.generateContent(prompt);
        } catch (error) {
            console.error("Trip Service Generation Error:", error.message);
            throw new Error(`Failed to generate trip plan: ${error.message}`);
        }
    }
}

module.exports = new TripService();

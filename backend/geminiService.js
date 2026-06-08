const axios = require('axios');

class GeminiService {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        if (!this.apiKey) {
            console.error("CRITICAL: GEMINI_API_KEY is missing in environment variables!");
        }
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
    }

    async generateContent(prompt) {
        try {
            console.log("GeminiService: Sending request to AI...");
            const response = await axios.post(
                `${this.baseUrl}?key=${this.apiKey}`,
                {
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        response_mime_type: "application/json",
                    }
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 60000 // 60 seconds timeout
                }
            );

            if (!response.data || !response.data.candidates || !response.data.candidates[0] || !response.data.candidates[0].content) {
                const finishReason = response.data.candidates?.[0]?.finishReason;
                console.error("Gemini API missing results. Finish Reason:", finishReason);
                console.error("Full Error Body:", JSON.stringify(response.data));
                throw new Error(`AI generation failed: ${finishReason || 'No candidates'}`);
            }

            const generatedText = response.data.candidates[0].content.parts[0].text;
            console.log("GeminiService: Received response. Content length:", generatedText.length);
            // console.log("RAW AI RESPONSE:", generatedText); // Uncomment if needed for deep debugging
            return this.cleanAndParseJSON(generatedText);
        } catch (error) {
            if (error.response) {
                console.error(`Gemini API Error [${error.response.status}]:`, error.response.data);
            } else {
                console.error("Gemini Service Exception:", error.message);
            }
            throw error;
        }
    }

    cleanAndParseJSON(text) {
        try {
            // Remove markdown if present
            let cleanText = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();

            // If it still looks like it's wrapped in other text, use regex
            if (!cleanText.startsWith('{')) {
                const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    cleanText = jsonMatch[0];
                }
            }

            return JSON.parse(cleanText);
        } catch (parseError) {
            console.error("JSON Parse Error Details:", parseError.message);
            console.error("Full failed text snippet (first 500):", text.substring(0, 500));
            throw new Error(`Failed to parse AI response: ${parseError.message}`);
        }
    }
}

module.exports = new GeminiService();

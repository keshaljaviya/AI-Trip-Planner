require('dotenv').config();
const axios = require('axios');

async function test() {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    try {
        const res = await axios.post(url, {
            contents: [{ parts: [{ text: "say hello" }] }]
        });
        console.log("SUCCESS:", res.data.candidates[0].content.parts[0].text);
    } catch (e) {
        console.log("ERROR:", e.response ? e.response.status : e.message);
        if (e.response) console.log(e.response.data);
    }
}
test();

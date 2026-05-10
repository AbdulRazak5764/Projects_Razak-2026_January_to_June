const { OpenAI } = require("openai");

async function test() {
    const openai = new OpenAI({
        apiKey: "YOUR_GROQ_API_KEY",
        baseURL: 'https://api.groq.com/openai/v1',
    });

    try {
        const completion = await openai.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [{ role: 'user', content: 'test' }],
        });
        console.log("Success:", completion.choices[0].message.content);
    } catch(err) {
        console.error("API Error details:", err.message);
    }
}
test();

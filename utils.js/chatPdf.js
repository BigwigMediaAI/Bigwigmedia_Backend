const openAI = require("openai");
require("dotenv").config();

const openai = new openAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const chatWithPdf = async (pdfText, userQuestion) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are an expert on this topic. Your goal is to answer the user's question accurately based on the provided PDF text."
                },
                {
                    role: "user",
                    content: `Question: ${userQuestion}\n\n${pdfText}`
                }
            ],
            max_tokens: 150,
            temperature: 0.7,
        });

        const answer = response.choices[0].message.content.trim();
        return answer;
    } catch (error) {
        throw new Error(`Error chatting with PDF: ${error.message}`);
    }
};

module.exports = chatWithPdf;
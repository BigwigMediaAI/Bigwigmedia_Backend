const openAI = require("openai");
require("dotenv").config();

const openai = new openAI.OpenAI(process.env.OPENAI_API_KEY);

async function getFinancialAdvice(description, amount) {
    try {
        const prompt = `Provide detailed financial advice for the following financial situation: 
        - Description: ${description}
        - Amount: $${amount}`;

        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: prompt,
                },
            ],
            model: "gpt-4-turbo",
        });

        if (!completion.choices || !completion.choices[0] || !completion.choices[0].message) {
            throw new Error("Invalid response structure from OpenAI API");
        }

        // Return the generated financial advice
        const financialAdvice = completion.choices[0].message.content.trim();
        return financialAdvice;
    } catch (error) {
        throw error;
    }
}

module.exports = getFinancialAdvice;
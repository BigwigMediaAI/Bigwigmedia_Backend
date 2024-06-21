const openAI = require("openai");
require("dotenv").config();

const openai = new openAI.OpenAI(process.env.OPENAI_API_KEY);

async function getFinancialAdvice(description, amount,language,outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {

        const prompt = `Provide detailed financial advice in ${language} language for the following financial situation: 
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
        responses.push(completion.choices[0].message.content.trim());
    }
        return responses;
    } catch (error) {
        throw error;
    }
}

module.exports = getFinancialAdvice;
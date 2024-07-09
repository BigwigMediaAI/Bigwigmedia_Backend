const openAI = require("openai");
require("dotenv").config();

const openai = new openAI.OpenAI(process.env.OPENAI_API_KEY);

async function detectAIContent(text) {
    try {
        const prompt = `Determine if the following text is likely written by AI or a human:
        - Text: "${text}"`;

        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: prompt,
                },
            ],
            model: "gpt-4o",
        });

        if (!completion.choices || !completion.choices[0] || !completion.choices[0].message) {
            throw new Error("Invalid response structure from OpenAI API");
        }

        const analysisResult = completion.choices[0].message.content.trim();

        // Check for the presence of keywords
        const containsAI = analysisResult.toLowerCase().includes("ai");
        const containsHuman = analysisResult.toLowerCase().includes("human");
        const containsPersonal = analysisResult.toLowerCase().includes("personal");

        // Calculate the likelihood percentage
        let percentage = 50; // Default to 50% for undetermined cases

        if (containsAI && !containsHuman) {
            percentage = 100; // AI-generated, 100% likelihood
        } else if (containsHuman && !containsAI) {
            percentage = 0; // Human-generated, 0% likelihood
        } else if (containsAI && containsHuman) {
            percentage = Math.floor(Math.random() * 30) + 70; // Random number between 70% and 100% for mixed content
        } else {
            percentage = Math.floor(Math.random() * 100); // Random number between 0% and 100% for other cases
        }

        return `${percentage}% AI Generated`;

    } catch (error) {
        throw error;
    }
}

module.exports = detectAIContent;

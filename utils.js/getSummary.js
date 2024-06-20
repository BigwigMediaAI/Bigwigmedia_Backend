const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function getSummary(text,language,output) {
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `Generate a summary of the following text in ${language} language  in simple and humanized language and provide ${output} output:\n\n" + text + "\n\nSummary:`
                },
                {
                    role: "user",
                    content: text
                }
            ],
            model: "gpt-4-turbo" // Specify the model parameter
        });

        if (!completion || !completion.choices || completion.choices.length === 0) {
            throw new Error("Invalid completion response");
        }

        const summary = completion.choices[0].message.content.trim();
        return summary;
    } catch (error) {
        console.error("Error:", error);
        return "Failed to generate text summary";
    }
}

module.exports =  getSummary ;
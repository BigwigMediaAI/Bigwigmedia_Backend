// import OpenAI from "openai";
const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI();

async function generateResponse(prompt) {
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content:
                    "You are a helpful social media marketing assistant designed to generate engaging content based on user prompts and configuration settings. Tailor your tone to match the specified tone in the user prompt's configuration. Include hashtags if 'useHashTags' is true, otherwise, omit them. Integrate emojis if 'useEmoji' is true, otherwise, refrain from using emojis.",
            },
            {
                role: "user",
                content: prompt,
            },
        ],
        model: "gpt-3.5-turbo-1106",
        // response_format: { type: "json_object" },
    });
    return completion.choices[0].message.content.replace(/(\r\n|\n|\r)/gm, "");
}

module.exports = generateResponse;

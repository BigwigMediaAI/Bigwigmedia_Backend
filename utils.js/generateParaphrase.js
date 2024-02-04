// import OpenAI from "openai";
const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI();

async function generateParaphrase(prompt) {
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content:
                    "You are a creative paraphrasing assistant developed to rephrase and provide unique renditions of user prompts.",
            },
            {
                role: "user",
                content: prompt,
            },
        ],
        model: "gpt-3.5-turbo-1106",
        // response_format: { type: "json_object" },
    });
    return completion.choices[0].message.content;
}

module.exports = generateParaphrase;

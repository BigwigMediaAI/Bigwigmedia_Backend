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
                    "You are a helpful social media marketing assistant designed to generate engaging content based on user prompts and configuration settings.",
            },
            {
                role: "user",
                content: prompt,
            },
        ],
        model: "gpt-4-turbo",
        // response_format: { type: "json_object" },
    });
    return completion.choices[0].message.content.replace(/(\r\n|\n|\r)/gm, "");
}

module.exports = generateResponse;
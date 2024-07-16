// import OpenAI from "openai";
const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI();

async function generateResponse(prompt) {
    let responses = [];

    for (let i = 0; i < 3; i++) {
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
        model: "gpt-4o",
        // response_format: { type: "json_object" },
    });
    responses.push(completion.choices[0].message.content.replace(/(\r\n|\n|\r)/gm, ""));
}
return responses
}
module.exports = generateResponse;

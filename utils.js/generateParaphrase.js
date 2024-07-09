// import OpenAI from "openai";
const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI();

async function generateParaphrase(prompt,tone,language,outputCount) {
    let responses = [];
   
    for (let i = 0; i < outputCount; i++) {

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content:
                    `You are a creative paraphrasing assistant developed to rephrase and provide unique renditions of user prompts according to ${tone} tone and ${language} language `,
            },
            {
                role: "user",
                content: prompt,
            },
        ],
        model: "gpt-4o",
        // response_format: { type: "json_object" },
    });
    responses.push(completion.choices[0].message.content);
}
return responses
}

module.exports = generateParaphrase;

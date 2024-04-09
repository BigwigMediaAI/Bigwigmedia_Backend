// from openai import OpenAI
const { OpenAI } = require("openai");
require("dotenv").config();
const openai = new OpenAI();

const QUALITY = {
    HD: "hd",
    STANDARD: "standard",
};
async function generateImage(prompt, n, quality, style) {
    const response = await openai.images.generate({
        model: "dall-e-2",
        prompt: prompt + "With style: " + style,
        n: n,
        size: "1024x1024",
        quality: quality,
    });
    return response.data;
}

module.exports = { generateImage, QUALITY };

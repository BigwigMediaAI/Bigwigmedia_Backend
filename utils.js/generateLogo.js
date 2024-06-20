const { OpenAI } = require("openai");
require("dotenv").config();
const openai = new OpenAI();

const Quality = {
    HD: "hd",
    STANDARD: "standard",
};

async function generateLogoImage(prompt, quality) {
    const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        size: "1024x1024",
        quality: quality,
    });
    return response.data[0];
}

module.exports = { generateLogoImage, Quality };

const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateProductDescriptionContent(productName, productFeatures, targetAudience, language, tone, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a product description in ${language} language. The description should highlight the following features for the product "${productName}". The target audience is ${targetAudience}, and the tone should be ${tone}.`
                    },
                    {
                        role: 'user',
                        content: `Product Features: ${productFeatures}`
                    }
                ],
                model: 'gpt-4o'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            responses.push(completion.choices[0].message.content.trim());
        }
        return responses;
    } catch (error) {
        console.error('Error generating product descriptions:', error);
        return 'Failed to generate product descriptions';
    }
}

module.exports = { generateProductDescriptionContent };
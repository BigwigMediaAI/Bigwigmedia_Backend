const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateProductBrochureContent(productName, productDescription, features, benefits, language, tone, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Create a product brochure in ${language} language. The brochure should be for the product named "${productName}". It should include the following description: "${productDescription}", highlight these features: "${features}", and emphasize these benefits: "${benefits}". The tone of the brochure should be ${tone}.`
                    },
                    {
                        role: 'user',
                        content: ``
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
        console.error('Error generating product brochure:', error);
        return 'Failed to generate product brochure';
    }
}

module.exports = { generateProductBrochureContent };
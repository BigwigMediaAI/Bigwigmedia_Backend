const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateGMBProductDescriptionContent(productName, productFeatures, targetAudience, language, tone, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a Google My Business product description in ${language} language. The description should be written in a ${tone} tone and targeted towards ${targetAudience}.`
                    },
                    {
                        role: 'user',
                        content: `Product Name: ${productName}\nProduct Features: ${productFeatures}`
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
        console.error('Error generating product description:', error);
        return 'Failed to generate product description';
    }
}

module.exports = { generateGMBProductDescriptionContent };
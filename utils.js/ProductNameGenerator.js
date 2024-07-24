const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateProductNameContent(productDescription, targetAudience, tone, language, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a product name in ${language} language with a ${tone} tone.`
                    },
                    {
                        role: 'user',
                        content: `
                        Product Description: ${productDescription}
                        Target Audience: ${targetAudience}

                        Generate a unique and compelling product name for the above details.
                        `
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            responses.push(completion.choices[0].message.content.trim());
        }
        return responses;
    } catch (error) {
        console.error('Error generating product name:', error);
        return 'Failed to generate product name';
    }
}

module.exports = { generateProductNameContent };

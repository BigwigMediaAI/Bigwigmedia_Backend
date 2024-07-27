const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateUVP({ productName, targetAudience, keyBenefit, tone, language, outputCount }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a unique value proposition in ${language} with a ${tone} tone.`
                    },
                    {
                        role: 'user',
                        content: `Product Name: ${productName}\nTarget Audience: ${targetAudience}\nKey Benefit: ${keyBenefit}`
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
        console.error('Error generating UVP:', error);
        return 'Failed to generate UVP';
    }
}

module.exports = { generateUVP };
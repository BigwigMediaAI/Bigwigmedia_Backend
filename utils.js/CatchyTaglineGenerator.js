const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateTaglineContent(productDescription, targetAudience, tone, language, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a catchy tagline in ${language} language with a ${tone} tone.`
                    },
                    {
                        role: 'user',
                        content: `
                        Product Description: ${productDescription}
                        Target Audience: ${targetAudience}

                        Generate a catchy and compelling tagline for the above details.
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
        console.error('Error generating catchy tagline:', error);
        return 'Failed to generate catchy tagline';
    }
}

module.exports = { generateTaglineContent };

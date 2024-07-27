const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateSubheadings({ heading, tone, language, outputCount, context }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate subheadings in ${language} language with a ${tone} tone.`
                    },
                    {
                        role: 'user',
                        content: `Heading: ${heading}\nContext: ${context}`
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
        console.error('Error generating subheadings:', error);
        return 'Failed to generate subheadings';
    }
}

module.exports = { generateSubheadings };
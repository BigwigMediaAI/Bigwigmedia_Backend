const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateBulletPointsContent(topic, language, tone, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate bullet points for the topic "${topic}" in ${language} language with a ${tone} tone.`
                    },
                    {
                        role: 'user',
                        content: `Topic: ${topic}`
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
        console.error('Error generating bullet points:', error);
        return 'Failed to generate bullet points';
    }
}

module.exports = { generateBulletPointsContent };
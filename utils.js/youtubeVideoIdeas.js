const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateYouTubeVideoIdeas(topic, tone, language, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a short YouTube video idea in ${language} language with a ${tone} tone for the topic: ${topic}. Keep the response concise.`
                    },
                    {
                        role: 'user',
                        content: 'Provide a concise and engaging video idea that aligns with the given topic and tone.'
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            responses.push(completion.choices[0].message.content.trim());
        }
        return responses.slice(0, outputCount);
    } catch (error) {
        console.error('Error generating YouTube video ideas:', error);
        return 'Failed to generate YouTube video ideas';
    }
}

module.exports = { generateYouTubeVideoIdeas };
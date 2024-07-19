const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateReelIdeas(topic, tone, language, outputCount) {
    let ideas = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate creative and engaging Instagram reel ideas for the topic "${topic}" in ${language} language. The tone should be ${tone}.`
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

            ideas.push(completion.choices[0].message.content.trim());
        }
        return ideas;
    } catch (error) {
        console.error('Error generating reel ideas:', error);
        return 'Failed to generate reel ideas';
    }
}

module.exports = { generateReelIdeas };
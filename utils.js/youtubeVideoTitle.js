const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateYouTubeVideoTitle(topic, keywords, targetAudience, tone, language, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a YouTube video title for the following topic in ${language} language. The title should be targeted towards ${targetAudience} and include the following keywords: ${keywords}. The tone should be ${tone}.`
                    },
                    {
                        role: 'user',
                        content: `${topic}`
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
        console.error('Error generating titles:', error);
        return 'Failed to generate titles';
    }
}

module.exports = { generateYouTubeVideoTitle };
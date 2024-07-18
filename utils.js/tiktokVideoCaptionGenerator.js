const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI();

async function tiktokCaptionGenerator(videoDescription, tone, language, outputCount) {
    try {
        let responses = [];

        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a TikTok video caption in ${language} language with a ${tone} tone. Video description: ${videoDescription}.`
                    },
                    {
                        role: 'user',
                        content: 'Create a catchy and engaging TikTok video caption that reflects the given video description, tone, and language.'
                    }
                ],
                model: 'gpt-4o'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            responses.push(completion.choices[0].message.content);
        }
        return responses;

    } catch (error) {
        console.error('Error generating TikTok video captions:', error);
        throw new Error('Failed to generate TikTok video captions');
    }
}

module.exports = tiktokCaptionGenerator;

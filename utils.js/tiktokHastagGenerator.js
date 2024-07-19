const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI();

async function tiktokHashtagsGenerator(videoDescription, tone, language, outputCount) {
    try {
        let responses = [];

        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a list of TikTok hashtags in ${language} language with a ${tone} tone. Video description: ${videoDescription}.`
                    },
                    {
                        role: 'user',
                        content: 'Create a set of catchy and relevant TikTok hashtags that reflect the given video description, tone, and language.'
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            responses.push(completion.choices[0].message.content.split('\n'));
        }
        return responses;

    } catch (error) {
        console.error('Error generating TikTok hashtags:', error);
        throw new Error('Failed to generate TikTok hashtags');
    }
}

module.exports = tiktokHashtagsGenerator;

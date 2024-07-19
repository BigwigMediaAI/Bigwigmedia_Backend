const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generatePost(platform, topic, keywords, tone, language, outputCount) {
    let posts = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a social media post for ${platform} in ${language}. The post should be about ${topic}, include the following keywords: ${keywords}, and have a ${tone} tone.`
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

            posts.push(completion.choices[0].message.content.trim());
        }
        return posts;
    } catch (error) {
        console.error('Error generating social media posts:', error);
        return 'Failed to generate social media posts';
    }
}

module.exports = { generatePost };
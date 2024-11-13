
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generatePost(platform, description, tone, language, outputCount, includeEmoji, includeHashtag) {
    let posts = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            // Build the initial part of the prompt
            let prompt = `Generate a social media post for ${platform} in ${language}. `;
            prompt += `The post should be about "${description}" and have a ${tone} tone. `;

            // Explicitly tell the model to avoid adding emojis and hashtags if they are false
            if (includeEmoji) {
                prompt += "Include relevant emojis in the post. ";
            } else {
                prompt += "Do not use emojis in the post. ";
            }

            if (includeHashtag) {
                prompt += "Add relevant hashtags to the post. ";
            } else {
                prompt += "Do not use hashtags in the post. ";
            }

            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: prompt
                    },
                    {
                        role: 'user',
                        content: description
                    }
                ],
                model: 'gpt-4'
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

module.exports = { generatePost };
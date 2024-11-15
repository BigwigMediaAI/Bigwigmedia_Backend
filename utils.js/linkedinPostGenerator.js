const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateLinkedInPostContent(topic, content, tone, language, outputCount, useEmoji, useHashTags) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            // Build the prompt dynamically
            let prompt = `Generate a LinkedIn post in ${language}. `;
            prompt += `The post should be about "${topic}" and have a ${tone} tone. `;
            prompt += `Use the following content as a base: "${content}". `;

            // Add emoji and hashtag instructions based on user preferences
            if (useEmoji) {
                prompt += "Include relevant emojis in the post. ";
            } else {
                prompt += "Do not use emojis in the post. ";
            }

            if (useHashTags) {
                prompt += "Add relevant hashtags to the post. ";
            } else {
                prompt += "Do not use hashtags in the post. ";
            }

            // OpenAI completion request
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are an AI assistant that helps users create professional LinkedIn posts.`
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                model: 'gpt-4'
            });

            // Validate completion response
            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            // Add the generated post to responses
            responses.push(completion.choices[0].message.content.trim());
        }

        return responses;
    } catch (error) {
        console.error('Error generating LinkedIn post content:', error);
        return 'Failed to generate LinkedIn post content';
    }
}


module.exports = { generateLinkedInPostContent };

const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateLinkedInPostContent(topic, content, tone, language, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a LinkedIn post in ${language} language with a ${tone} tone on the topic "${topic}". Use the following content as a base: ${content}`
                    },
                    {
                        role: 'user',
                        content: `LinkedIn Post:\n\n- `
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
        console.error('Error generating LinkedIn post content:', error);
        return 'Failed to generate LinkedIn post content';
    }
}

module.exports = { generateLinkedInPostContent };

const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateGMBPostContent(businessUpdate, companyName, language, tone, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a Google My Business post in ${language} language. The post should be about the following business update for ${companyName}, written in a ${tone} tone.`
                    },
                    {
                        role: 'user',
                        content: `${businessUpdate}`
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
        console.error('Error generating GMB post:', error);
        return 'Failed to generate GMB post';
    }
}

module.exports = { generateGMBPostContent };
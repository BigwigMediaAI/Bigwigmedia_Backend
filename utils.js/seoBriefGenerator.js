const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateSeoBriefUtil(topic, keywords, targetAudience, language, tone, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate an SEO content brief in ${language} language. The brief should target ${targetAudience} and include the following keywords: ${keywords}. The tone should be ${tone}.`
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
        console.error('Error generating SEO content brief:', error);
        return 'Failed to generate SEO content brief';
    }
}

module.exports = { generateSeoBriefUtil };
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateNewsletterNames(industry, keywords, tone, audience, language, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a newsletter name in ${language} language with a ${tone} tone.`
                    },
                    {
                        role: 'user',
                        content: `Industry: ${industry}\nKeywords: ${keywords.join(', ')}\nTarget Audience: ${audience}`
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            responses.push(completion.choices[0].message.content.trim());
        }
        return responses;
    } catch (error) {
        console.error('Error generating newsletter names:', error);
        return 'Failed to generate newsletter names';
    }
}

module.exports = { generateNewsletterNames };
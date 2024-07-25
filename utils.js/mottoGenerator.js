const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateMottoContent(companyName, industry, values, language, tone, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a company motto in ${language} language. The motto should reflect the values of ${companyName}, which operates in the ${industry} industry. The tone should be ${tone}. The company's values are: ${values}.`
                    },
                    {
                        role: 'user',
                        content: ``
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
        console.error('Error generating mottos:', error);
        return 'Failed to generate mottos';
    }
}

module.exports = { generateMottoContent };
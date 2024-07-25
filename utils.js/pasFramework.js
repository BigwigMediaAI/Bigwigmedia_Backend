const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generatePASContent(companyName, productDescription, language, tone, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a PAS (Problem-Agitate-Solution) content in ${language} language. The tone should be ${tone}.`
                    },
                    {
                        role: 'user',
                        content: `Company/Product Name: ${companyName}\nProduct Description: ${productDescription}`
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
        console.error('Error generating PAS content:', error);
        return 'Failed to generate PAS content';
    }
}

module.exports = { generatePASContent };
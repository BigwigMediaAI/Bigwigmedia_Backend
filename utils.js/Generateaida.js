const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateAIDAContent(companyName, productDescription, language, tone, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate an AIDA (Attention, Interest, Desire, Action) content in ${language} language. The tone should be ${tone}.`
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
        console.error('Error generating AIDA content:', error);
        return 'Failed to generate AIDA content';
    }
}

module.exports = { generateAIDAContent };
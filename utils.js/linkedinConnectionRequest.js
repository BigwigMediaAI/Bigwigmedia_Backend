const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateConnectionRequestContent(name, reason, tone, language, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a LinkedIn connection request message in ${language} language with a ${tone} tone for the following details:`
                    },
                    {
                        role: 'user',
                        content: `Name: ${name}\nReason: ${reason}`
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
        console.error('Error generating connection request content:', error);
        return 'Failed to generate connection request content';
    }
}

module.exports = { generateConnectionRequestContent };

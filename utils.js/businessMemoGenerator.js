const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateMemoContent(subject, memoContent, tone, language, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a business memo with the following details in ${language} language. The tone should be ${tone}.`
                    },
                    {
                        role: 'user',
                        content: `Subject: ${subject}\n\nContent: ${memoContent}`
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
        console.error('Error generating memo content:', error);
        return 'Failed to generate memo content';
    }
}

module.exports = { generateMemoContent };
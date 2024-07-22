const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateReviewResponseUtil(reviewText, responseTone, language, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a response to the following review with a ${responseTone} tone in ${language} language.`
                    },
                    {
                        role: 'user',
                        content: reviewText
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
        console.error('Error generating review responses:', error);
        return 'Failed to generate review responses';
    }
}

module.exports = { generateReviewResponseUtil};
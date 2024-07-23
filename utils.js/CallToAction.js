const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateCallToActionContent(targetAudience, purpose, desiredAction, tone, language, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a call to action in ${language} language with a ${tone} tone.`
                    },
                    {
                        role: 'user',
                        content: `
                        Target Audience: ${targetAudience}
                        Purpose: ${purpose}
                        Desired Action: ${desiredAction}

                        Generate a compelling call to action for the target audience: ${targetAudience}. The purpose is ${purpose} and the desired action is ${desiredAction}.
                        `
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
        console.error('Error generating call to action:', error);
        return 'Failed to generate call to action';
    }
}

module.exports = { generateCallToActionContent };

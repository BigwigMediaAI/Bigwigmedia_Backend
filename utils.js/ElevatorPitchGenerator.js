const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateElevatorPitchContent(name, profession, targetAudience, uniqueSellingPoint, tone, language, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate an elevator pitch in ${language} language with a ${tone} tone.`
                    },
                    {
                        role: 'user',
                        content: `
                        Name: ${name}
                        Profession: ${profession}
                        Target Audience: ${targetAudience}
                        Unique Selling Point: ${uniqueSellingPoint}

                        Generate a compelling elevator pitch for ${name}, a ${profession}, aimed at ${targetAudience}. Highlight the unique selling point: ${uniqueSellingPoint}.
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
        console.error('Error generating elevator pitch:', error);
        return 'Failed to generate elevator pitch';
    }
}

module.exports = { generateElevatorPitchContent };

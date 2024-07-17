const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateLinkedInBioContent(name, profession, experience, tone, language, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a LinkedIn bio in ${language} language with a ${tone} tone for the following details:`
                    },
                    {
                        role: 'user',
                        content: `Name: ${name}\nProfession: ${profession}\nExperience: ${experience}`
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
        console.error('Error generating LinkedIn bio content:', error);
        return 'Failed to generate LinkedIn bio content';
    }
}

module.exports = { generateLinkedInBioContent };

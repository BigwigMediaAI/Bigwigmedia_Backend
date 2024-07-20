const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateTinderBioUtil(personalityTraits, interests, tone, language, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a Tinder bio in ${language} language. The bio should reflect the following personality traits: ${personalityTraits}, and include these interests: ${interests}. The tone should be ${tone}.`
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
        console.error('Error generating Tinder bios:', error);
        return 'Failed to generate Tinder bios';
    }
}

module.exports = { generateTinderBioUtil };
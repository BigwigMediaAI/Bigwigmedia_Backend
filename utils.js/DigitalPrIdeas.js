const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generatePRIdeasContent(companyName, industry, targetAudience, goals, tone, language, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate creative digital PR ideas in ${language} language with a ${tone} tone.`
                    },
                    {
                        role: 'user',
                        content: `
                        Company Name: ${companyName}
                        Industry: ${industry}
                        Target Audience: ${targetAudience}
                        Goals: ${goals}

                        Generate innovative and engaging digital PR ideas for the above details.
                        `
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
        console.error('Error generating PR ideas:', error);
        return 'Failed to generate PR ideas';
    }
}

module.exports = { generatePRIdeasContent };

const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateJobSummaries(jobTitle, companyName, keyResponsibilities, requirements, location, tone, language, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a job summary in ${language} language with a ${tone} tone.`
                    },
                    {
                        role: 'user',
                        content: `Job Title: ${jobTitle}\nCompany Name: ${companyName}\nLocation: ${location}\nKey Responsibilities: ${keyResponsibilities.join(', ')}\nRequirements: ${requirements.join(', ')}`
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
        console.error('Error generating job summaries:', error);
        return 'Failed to generate job summaries';
    }
}

module.exports = { generateJobSummaries };

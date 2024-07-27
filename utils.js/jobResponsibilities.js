const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateJobResponsibilities(jobTitle, companyName, tone, language, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate job responsibilities in ${language} language with a ${tone} tone.`
                    },
                    {
                        role: 'user',
                        content: `Job Title: ${jobTitle}\nCompany Name: ${companyName}`
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
        console.error('Error generating job responsibilities:', error);
        return 'Failed to generate job responsibilities';
    }
}

module.exports = { generateJobResponsibilities };
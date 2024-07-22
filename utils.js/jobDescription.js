const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateJobDescriptionUtil(jobTitle, responsibilities, qualifications, companyInfo, tone, language, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a job description for the following position in ${language} language. The tone should be ${tone}.`
                    },
                    {
                        role: 'user',
                        content: `Job Title: ${jobTitle}\nResponsibilities: ${responsibilities}\nQualifications: ${qualifications}\nCompany Info: ${companyInfo}`
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
        console.error('Error generating job descriptions:', error);
        return 'Failed to generate job descriptions';
    }
}

module.exports = { generateJobDescriptionUtil};
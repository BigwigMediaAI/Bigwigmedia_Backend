const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateCompanyProfileUtil(companyName, industry, services, mission, vision, targetAudience, language, tone, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a detailed company profile in ${language} language. The profile should include the company's name, industry, services offered, mission, vision, and target audience. The tone should be ${tone}.`
                    },
                    {
                        role: 'user',
                        content: `Company Name: ${companyName}\nIndustry: ${industry}\nServices: ${services}\nMission: ${mission}\nVision: ${vision}\nTarget Audience: ${targetAudience}`
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
        console.error('Error generating company profile:', error);
        return 'Failed to generate company profile';
    }
}

module.exports = { generateCompanyProfileUtil };
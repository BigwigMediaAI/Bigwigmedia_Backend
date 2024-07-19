const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateAboutCompany(companyName, industry, mission, values,  tone, language, outputCount) {
    let pages = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate an "About Company" page for a company in the ${industry} industry. The company's name is ${companyName}. The mission is "${mission}" and the values are "${values}". The content should be in ${language} and in ${tone} tone.`
                    },
                    {
                        role: 'user',
                        content: `Company Name: ${companyName}\nIndustry: ${industry}\nMission: ${mission}\nValues: ${values}`
                    }
                ],
                model: 'gpt-4o'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            pages.push(completion.choices[0].message.content.trim());
        }
        return pages;
    } catch (error) {
        console.error('Error generating About Company page:', error);
        return 'Failed to generate About Company page';
    }
}

module.exports = { generateAboutCompany };
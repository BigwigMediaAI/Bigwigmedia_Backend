const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateExperienceLetterContent(employeeName, position, department, duration, achievements, company, tone, language, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate an experience letter in ${language} language with a ${tone} tone.`
                    },
                    {
                        role: 'user',
                        content: `
                        Employee Name: ${employeeName}
                        Position: ${position}
                        Department: ${department}
                        Duration: ${duration}
                        Achievements: ${achievements}
                        Company: ${company}

                        Generate a detailed and compelling experience letter for the above details.
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
        console.error('Error generating experience letter:', error);
        return 'Failed to generate experience letter';
    }
}

module.exports = { generateExperienceLetterContent };

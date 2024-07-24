const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateSOPContent(applicantName, background, goals, whyThisProgram, tone, language, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a statement of purpose in ${language} language with a ${tone} tone.`
                    },
                    {
                        role: 'user',
                        content: `
                        Applicant Name: ${applicantName}
                        Background: ${background}
                        Goals: ${goals}
                        Why This Program: ${whyThisProgram}

                        Generate a detailed and compelling statement of purpose for the above details.
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
        console.error('Error generating SOP:', error);
        return 'Failed to generate SOP';
    }
}

module.exports = { generateSOPContent };

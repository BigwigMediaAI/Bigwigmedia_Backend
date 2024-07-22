const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateResumeSkillsContent(profession, experienceLevel, industry, tone, language, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a list of resume skills in ${language} language with a ${tone} tone.`
                    },
                    {
                        role: 'user',
                        content: `
                        Profession: ${profession}
                        Experience Level: ${experienceLevel}
                        Industry: ${industry}

                        Generate a comprehensive list of skills for a resume for a ${experienceLevel} ${profession} in the ${industry} industry.
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
        console.error('Error generating resume skills:', error);
        return 'Failed to generate resume skills';
    }
}

module.exports = { generateResumeSkillsContent };

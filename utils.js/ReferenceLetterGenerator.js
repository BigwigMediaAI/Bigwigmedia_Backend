const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateReferenceLetterContent(candidateName, relationship, skills, achievements, tone, language, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a reference letter in ${language} language with a ${tone} tone.`
                    },
                    {
                        role: 'user',
                        content: `
                        Candidate Name: ${candidateName}
                        Relationship: ${relationship}
                        Skills: ${skills.join(', ')}
                        Achievements: ${achievements.join(', ')}

                        Generate a compelling reference letter for the above details.
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
        console.error('Error generating reference letter:', error);
        return 'Failed to generate reference letter';
    }
}

module.exports = { generateReferenceLetterContent };

const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateTimeline({ projectName, projectDescription, startDate, endDate, milestones, tone, language, outputCount }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a project timeline in ${language} with a ${tone} tone.`
                    },
                    {
                        role: 'user',
                        content: `Project Name: ${projectName}\nProject Description: ${projectDescription}\nStart Date: ${startDate}\nEnd Date: ${endDate}\nMilestones: ${milestones.join(', ')}\nCreate a detailed timeline.`
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
        console.error('Error generating project timeline:', error);
        return 'Failed to generate project timeline';
    }
}

module.exports = { generateTimeline };
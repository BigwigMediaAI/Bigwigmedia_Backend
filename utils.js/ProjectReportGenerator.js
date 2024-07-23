const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateProjectReportContent(projectName, projectDescription, keyMilestones, projectOutcome, length, tone, language, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a detailed project report in ${language} language. The report should be written in a ${tone} tone and have a length of ${length}.`
                    },
                    {
                        role: 'user',
                        content: `Project Name: ${projectName}\nProject Description: ${projectDescription}\nKey Milestones: ${keyMilestones}\nProject Outcome: ${projectOutcome}`
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
        console.error('Error generating project report:', error);
        return 'Failed to generate project report';
    }
}

module.exports = { generateProjectReportContent};
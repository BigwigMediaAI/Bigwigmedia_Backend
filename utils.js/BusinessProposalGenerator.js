const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateBusinessProposalContent(companyName, projectDescription, objectives, deliverables, timeline, budget, tone, language, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a business proposal in ${language} language with a ${tone} tone.`
                    },
                    {
                        role: 'user',
                        content: `
                        Company Name: ${companyName}
                        Project Description: ${projectDescription}
                        Objectives: ${objectives.join(', ')}
                        Deliverables: ${deliverables.join(', ')}
                        Timeline: ${timeline}
                        Budget: ${budget}

                        Generate a detailed and compelling business proposal for the above details.
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
        console.error('Error generating business proposal:', error);
        return 'Failed to generate business proposal';
    }
}

module.exports = { generateBusinessProposalContent };

const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateOKR({ objective, department, timeFrame, keyResultsCount, tone, language, outputCount }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate an OKR in ${language} with a ${tone} tone.`
                    },
                    {
                        role: 'user',
                        content: `Objective: ${objective}\nDepartment: ${department}\nTime Frame: ${timeFrame}\nGenerate ${keyResultsCount} key results for this objective.`
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
        console.error('Error generating OKRs:', error);
        return 'Failed to generate OKRs';
    }
}

module.exports = { generateOKR };
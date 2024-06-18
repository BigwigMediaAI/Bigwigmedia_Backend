
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateSWOTAnalysis(topic) {
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `Generate a SWOT analysis for the topic: ${topic}`
                },
                {
                    role: 'user',
                    content: `Strengths:\n\n- \n\nWeaknesses:\n\n- \n\nOpportunities:\n\n- \n\nThreats:\n\n- `
                }
            ],
            model: 'gpt-4'
        });

        if (!completion || !completion.choices || completion.choices.length === 0) {
            throw new Error('Invalid completion response');
        }

        const swotAnalysis = completion.choices[0].message.content.trim();
        return swotAnalysis;
    } catch (error) {
        console.error('Error generating SWOT analysis:', error);
        return 'Failed to generate SWOT analysis';
    }
}

module.exports = { generateSWOTAnalysis };

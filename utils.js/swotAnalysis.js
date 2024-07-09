
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateSWOTAnalysis(topic,language,outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `Generate a SWOT analysis for the topic in ${language} language: ${topic}`
                },
                {
                    role: 'user',
                    content: `Strengths:\n\n- \n\nWeaknesses:\n\n- \n\nOpportunities:\n\n- \n\nThreats:\n\n- `
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
        console.error('Error generating SWOT analysis:', error);
        return 'Failed to generate SWOT analysis';
    }
}

module.exports = { generateSWOTAnalysis };

const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateLinkedInRecommendationContent(name, relationship, skills, accomplishments, tone, language, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a LinkedIn recommendation in ${language} language with a ${tone} tone for the following details:`
                    },
                    {
                        role: 'user',
                        content: `Name: ${name}\nRelationship: ${relationship}\nSkills: ${skills}\nAccomplishments: ${accomplishments}`
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
        console.error('Error generating LinkedIn recommendation content:', error);
        return 'Failed to generate LinkedIn recommendation content';
    }
}

module.exports = { generateLinkedInRecommendationContent };

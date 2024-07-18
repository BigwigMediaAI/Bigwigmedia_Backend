const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI();

async function aboutMeGenerator(personalInfo, outputLength, tone, language, outputCount){
    try {
        let responses = [];

        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a ${outputLength} "About Me" text in ${language} language with a ${tone} tone. Personal Information: ${personalInfo}.`
                    },
                    {
                        role: 'user',
                        content: 'Create a personalized "About Me" section that reflects the given personal information, tone, and length.'
                    }
                ],
                model: 'gpt-4o'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            responses.push(completion.choices[0].message.content);
        }
        return responses

    } catch (error) {
        console.error('Error generating About Me content:', error);
        res.status(500).send('Failed to generate About Me content');
    }
}

module.exports = aboutMeGenerator;
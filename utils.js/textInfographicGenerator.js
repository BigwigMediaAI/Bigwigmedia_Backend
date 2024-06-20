const openai = require('openai');
require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY;
const openaiInstance = new openai(apiKey);

async function generateInfographicText(topic, sections, tone = 'neutral', nOutputs = 1, language = 'en') {
    try {
        const sectionTextPromises = sections.map(async (section) => {
            const completion = await openaiInstance.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Please provide information about ${section} in a ${tone} tone.`,
                    },
                    {
                        role: 'user',
                        content: `Topic: ${topic}. Language: ${language}.`,
                    },
                ],
                model: 'gpt-4',
                max_tokens: 150,
                temperature: 0.3,
                top_p: 1.0,
                n: nOutputs,
                stop: ['\n'],
            });

            if (!completion || !completion.choices) {
                throw new Error('Invalid completion response');
            }

            const sectionContents = completion.choices.map(choice => choice.message.content.trim());
            return sectionContents.map(content => `${section}:\n${content}`).join('\n\n');
        });

        const sectionTexts = await Promise.all(sectionTextPromises);

        const infographicText = `Topic: ${topic}\nSections:\n${sectionTexts.join('\n\n')}`;
        return infographicText;
    } catch (error) {
        console.error('Error generating infographic text:', error);
        throw error;
    }
}

module.exports = { generateInfographicText };

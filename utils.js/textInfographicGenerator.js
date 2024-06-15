const openai = require('openai');
require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY;
const openaiInstance = new openai(apiKey);

async function generateInfographicText(topic, sections) {
    try {
        const sectionTextPromises = sections.map(async (section) => {
            const completion = await openaiInstance.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Please provide information about ${section}:`,
                    },
                    {
                        role: 'user',
                        content: topic,
                    },
                ],
                model: 'gpt-4', // Adjust model based on availability and suitability
                max_tokens: 150, // Adjust to control the length of the generated text
                temperature: 0.3, // Adjust temperature for creativity vs. conservativeness
                top_p: 1.0, // Adjust top_p for diversity of outputs
                n: 1, // Number of completions to generate
                stop: ['\n'], // Stop generating text at a new line
            });

            if (!completion || !completion.choices || !completion.choices[0] || !completion.choices[0].message || !completion.choices[0].message.content) {
                throw new Error('Invalid completion response');
            }

            const sectionContent = completion.choices[0].message.content.trim();
            return `${section}:\n${sectionContent}`;
        });

        const sectionTexts = await Promise.all(sectionTextPromises);

        const infographicText = `Topic: ${topic}\nSections:\n${sectionTexts.join('\n')}`;
        return infographicText;
    } catch (error) {
        console.error('Error generating infographic text:', error);
        throw error;
    }
}

module.exports = { generateInfographicText };

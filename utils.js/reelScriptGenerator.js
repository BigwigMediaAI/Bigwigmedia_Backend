const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateReelScript(topic, tone, language, outputCount) {
    let scripts = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a short, engaging reel script on the topic "${topic}" in ${language} language. The tone should be ${tone}. Ensure the script is concise, catchy, and suitable for a short video format.`
                    },
                    {
                        role: 'user',
                        content: `Topic: ${topic}`
                    }
                ],
                model: 'gpt-4o'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            scripts.push(completion.choices[0].message.content.trim());
        }
        return scripts;
    } catch (error) {
        console.error('Error generating reel script:', error);
        return 'Failed to generate reel script';
    }
}

module.exports = { generateReelScript };
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateScriptOutline(topic, tone, language, outputCount) {
    let outlines = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a compelling YouTube script outline in the ${language} language on the topic "${topic}". Describe the video's purpose, key points to cover, and a suggested call-to-action. Aim for a ${tone} tone. Ensure the outline includes an engaging introduction, detailed body with key insights or steps, and a strong conclusion summarizing key takeaways.`
                    },
                    {
                        role: 'user',
                        content: `Introduction:\n\n\nBody:\n\n\nConclusion:\n\n`
                    }
                ],
                model: 'gpt-4o'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            outlines.push(completion.choices[0].message.content.trim());
        }
        return outlines;
    } catch (error) {
        console.error('Error generating script outline:', error);
        return ['Failed to generate script outline'];
    }
}

module.exports = { generateScriptOutline };
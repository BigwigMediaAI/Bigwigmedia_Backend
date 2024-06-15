const openAI = require('openai');
require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY;
const openai = new openAI(apiKey);

async function summarizeNewsArticle(articleText) {
    try {
        // Ensure articleText is converted to a string if necessary
        articleText = typeof articleText === 'string' ? articleText : JSON.stringify(articleText);

        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'Please summarize the following news article:',
                },
                {
                    role: 'user',
                    content: articleText,
                },
            ],
            model: 'gpt-4', // Adjust model based on availability and suitability
            max_tokens: 150, // Adjust to control the length of the summary
            temperature: 0.3, // Adjust temperature for creativity vs. conservativeness
            top_p: 1.0, // Adjust top_p for diversity of outputs
            n: 1, // Number of completions to generate
            stop: ['\n'], // Stop generating text at a new line
        });

        if (!completion || !completion.choices || !completion.choices[0] || !completion.choices[0].message || !completion.choices[0].message.content) {
            throw new Error('Invalid completion response');
        }

        const summary = completion.choices[0].message.content.trim();
        return summary;
    } catch (error) {
        console.error('Error summarizing article:', error);
        throw error;
    }
}

module.exports = summarizeNewsArticle;
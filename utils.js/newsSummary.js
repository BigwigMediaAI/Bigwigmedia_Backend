const openAI = require('openai');
require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY;
const openai = new openAI(apiKey);

async function summarizeNewsArticle(articleText, languageCode, output) {
    try {
        // Ensure articleText is converted to a string if necessary
        articleText = typeof articleText === 'string' ? articleText : JSON.stringify(articleText);

        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `Please summarize the following news article in ${languageCode}:`,
                },
                {
                    role: 'user',
                    content: articleText,
                },
            ],
            model: 'gpt-4o', // Adjust model based on availability and suitability
            max_tokens: 150, // Adjust to control the length of each summary
            temperature: 0.3, // Adjust temperature for creativity vs. conservativeness
            top_p: 1.0, // Adjust top_p for diversity of outputs
            n: output, // Number of completions to generate
            stop: ['\n'], // Stop generating text at a new line
            presence_penalty: 0.5, // Controls the penalty for repetition
            frequency_penalty: 0.5, // Controls the penalty for frequency of words/phrases
        });

        if (!completion || !completion.choices || completion.choices.length === 0) {
            throw new Error('Invalid completion response');
        }

        const summaries = completion.choices.map(choice => choice.message.content.trim());
        const summaryText = summaries.join('\n');
        return { summaryText };
    } catch (error) {
        console.error('Error summarizing article:', error);
        throw error;
    }
}

module.exports = summarizeNewsArticle;

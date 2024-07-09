const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

const translateText = async (text, targetLanguage) => {
    const prompt = `Translate the following text to ${targetLanguage}:\n\n${text}`;
    
    const response = await openai.chat.completions.create({
        model: 'gpt-4o',  // Use the latest GPT-4 model
        messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
    });

    return response.choices[0].message.content.trim();
};

module.exports = translateText ;
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateReply(tweetContent, userHandle, tone, language, outputCount) {
    let replies = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a reply to the following tweet in ${language}. The tone should be ${tone}.`
                    },
                    {
                        role: 'user',
                        content: `Tweet: ${tweetContent}\nUser Handle: ${userHandle}`
                    }
                ],
                model: 'gpt-4o'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            replies.push(completion.choices[0].message.content.trim());
        }
        return replies;
    } catch (error) {
        console.error('Error generating tweet reply:', error);
        return 'Failed to generate tweet reply';
    }
}

module.exports = { generateReply };
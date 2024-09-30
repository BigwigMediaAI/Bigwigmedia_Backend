const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateReplyEmailUtil(to, receivedEmail, tone, language, outputCount, replyIntent) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a reply in ${language} with a ${tone} tone. The reply should focus on "${replyIntent}".`
                    },
                    {
                        role: 'user',
                        content: `To: ${to}\nReceived Email: ${receivedEmail}`
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            responses.push(completion.choices[0].message.content.trim());
        }

        return responses;
    } catch (error) {
        console.error('Error generating email replies:', error);
        return 'Failed to generate email replies';
    }
}

module.exports = { generateReplyEmailUtil };

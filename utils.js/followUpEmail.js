const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateFollowUpEmailUtil(mailReceived, purposeOfFollowUpEmail, tone, language, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a ${tone} follow-up email in ${language}.`
                    },
                    {
                        role: 'user',
                        content: `Mail received: ${mailReceived}\n\nPurpose of follow-up email: ${purposeOfFollowUpEmail}`
                    }
                ],
                model: 'gpt-4o'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            responses.push(completion.choices[0].message.content.trim());
        }

        return responses;
    } catch (error) {
        console.error('Error generating follow-up emails:', error);
        return 'Failed to generate follow-up emails';
    }
}

module.exports = { generateFollowUpEmailUtil };
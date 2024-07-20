const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateEventReminderEmailUtil(eventName, eventDate, recipientName, tone, language, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate an event reminder email in ${language} language. The email should remind the recipient about the event. The event details are as follows: Event Name: ${eventName}, Event Date: ${eventDate}. The recipient's name is ${recipientName}. The tone should be ${tone}.`
                    },
                    {
                        role: 'user',
                        content: ``
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
        console.error('Error generating event reminder emails:', error);
        return 'Failed to generate event reminder emails';
    }
}

module.exports = { generateEventReminderEmailUtil };
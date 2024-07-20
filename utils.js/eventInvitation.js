const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateEventInvitationEmailUtil(eventName, eventDate, eventLocation, eventDescription, recipientName, senderName, language, tone, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate an event invitation email in ${language} language. The email should include the event name, date, location, description, recipient's name, and sender's name. The tone should be ${tone}.`
                    },
                    {
                        role: 'user',
                        content: `Event Name: ${eventName}\nEvent Date: ${eventDate}\nEvent Location: ${eventLocation}\nEvent Description: ${eventDescription}\nRecipient Name: ${recipientName}\nSender Name: ${senderName}`
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
        console.error('Error generating event invitation email:', error);
        return 'Failed to generate event invitation email';
    }
}

module.exports = { generateEventInvitationEmailUtil };
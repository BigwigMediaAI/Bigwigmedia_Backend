const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateMeetingInviteContent(meetingTitle, date, time, participants, agenda, tone, language, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a meeting invite in ${language} language with a ${tone} tone.`
                    },
                    {
                        role: 'user',
                        content: `
                        Meeting Title: ${meetingTitle}
                        Date: ${date}
                        Time: ${time}
                        Participants: ${participants.join(', ')}
                        Agenda: ${agenda}

                        Generate a meeting invite for the above details.
                        `
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
        console.error('Error generating meeting invite:', error);
        return 'Failed to generate meeting invite';
    }
}

module.exports = { generateMeetingInviteContent };

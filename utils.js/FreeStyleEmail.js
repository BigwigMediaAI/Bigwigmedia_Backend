const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateFreestyleEmailUtil(to, subject, content, tone, writingStyle, recipient, language, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are a professional email writer. Generate a properly formatted email in ${language} with a ${tone} tone and a ${writingStyle} writing style.`
                    },
                    {
                        role: 'user',
                        content: `To: ${to}\nSubject: ${subject}\nContent: ${content}\n${recipient ? `Recipient: ${recipient}\n` : ''}`
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            // Formatting the response in an email format
            const formattedEmail = `
To: ${to}
Subject: ${subject}

${completion.choices[0].message.content.trim()}
            `;

            responses.push(formattedEmail);
        }

        return responses;
    } catch (error) {
        console.error('Error generating freestyle emails:', error);
        return 'Failed to generate freestyle emails';
    }
}

module.exports = generateFreestyleEmailUtil ;

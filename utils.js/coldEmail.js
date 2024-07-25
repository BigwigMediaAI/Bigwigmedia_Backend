const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateColdEmails(recipientName, companyName, yourCompanyName, yourProductService, language, tone, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a cold email in ${language} language with a ${tone} tone.`
                    },
                    {
                        role: 'user',
                        content: `Recipient's Name: ${recipientName}\nRecipient's Company Name: ${companyName}\nYour Company Name: ${yourCompanyName}\nYour Product/Service Description: ${yourProductService}`
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
        console.error('Error generating cold emails:', error);
        return 'Failed to generate cold emails';
    }
}

module.exports = { generateColdEmails };
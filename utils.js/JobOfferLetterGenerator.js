const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateJobOfferLetterContent(recipientName, position, companyName, startDate, salary, tone, language, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a job offer letter in ${language} language with a ${tone} tone.`
                    },
                    {
                        role: 'user',
                        content: `
                        Recipient Name: ${recipientName}
                        Position: ${position}
                        Company Name: ${companyName}
                        Start Date: ${startDate}
                        Salary: ${salary}

                        Dear ${recipientName},

                        We are pleased to offer you the position of ${position} at ${companyName}. Your start date will be ${startDate}, and your salary will be ${salary}.

                        Sincerely,
                        [Your Name]
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
        console.error('Error generating job offer letter:', error);
        return 'Failed to generate job offer letter';
    }
}

module.exports = { generateJobOfferLetterContent };

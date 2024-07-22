const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateResignationLetterUtil(employeeName, position, companyName, lastWorkingDay, reasonForLeaving, tone, language, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate a resignation letter in ${language} language. The tone should be ${tone}.`
                    },
                    {
                        role: 'user',
                        content: `Employee Name: ${employeeName}\nPosition: ${position}\nCompany Name: ${companyName}\nLast Working Day: ${lastWorkingDay}\nReason for Leaving: ${reasonForLeaving}`
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
        console.error('Error generating resignation letters:', error);
        return 'Failed to generate resignation letters';
    }
}

module.exports = { generateResignationLetterUtil };
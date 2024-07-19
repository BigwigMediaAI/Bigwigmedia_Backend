const OpenAI = require("openai");
const moment = require("moment");
require("dotenv").config();

const openai = new OpenAI();

async function contentCalendarGenerator(topic, tone, language, outputCount) {
    try {
        let responses = [];

        for (let i = 0; i < outputCount; i++) {
            const startDate = moment().add(i * 7, 'days'); // Start dates increment by one week
            const endDate = moment(startDate).add(6, 'days'); // End date is 6 days after start date

            const systemMessage = `Generate a content calendar entry in ${language} language with a ${tone} tone. Topic: ${topic}. The calendar should be for the upcoming dates from ${startDate.format("MMMM D, YYYY")} to ${endDate.format("MMMM D, YYYY")}.`;

            const userMessage = `Create a detailed content calendar entry including the date, content title, and a brief description that reflects the given topic, tone, and language. Ensure the dates are within the upcoming weeks.`;

            const completion = await openai.chat.completions.create({
                messages: [
                    { role: 'system', content: systemMessage },
                    { role: 'user', content: userMessage }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            responses.push(completion.choices[0].message.content);
        }
        return responses;

    } catch (error) {
        console.error('Error generating content calendar entries:', error);
        throw new Error('Failed to generate content calendar entries');
    }
}

module.exports = contentCalendarGenerator;
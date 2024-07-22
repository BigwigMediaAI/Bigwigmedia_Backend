const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generatePerformanceReviewUtil(employeeName, position, reviewPeriod, keyAchievements, areasOfImprovement, futureGoals, tone, language, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content:`Generate a performance review in ${language} language. The tone should be ${tone}.`
                    },
                    {
                        role: 'user',
                        content:`Employee Name: ${employeeName}\nPosition: ${position}\nReview Period: ${reviewPeriod}\nKey Achievements: ${keyAchievements}\nAreas of Improvement: ${areasOfImprovement}\nFuture Goals: ${futureGoals}`
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
        console.error('Error generating performance reviews:', error);
        return 'Failed to generate performance reviews';
    }
}

module.exports = { generatePerformanceReviewUtil };
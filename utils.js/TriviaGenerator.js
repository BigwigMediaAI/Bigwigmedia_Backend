const openAI = require("openai");
require("dotenv").config();

const openai = new openAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function generateTrivia(topic, numberOfQuestions, numberOfAnswers, difficultyLevel,language) {
    const prompt = `Topic: ${topic}\nDifficulty Level: ${difficultyLevel}\nGenerate ${numberOfQuestions} trivia questions each with ${numberOfAnswers} answer choices in ${language} language. Provide the correct answer for each question. Format the output as JSON array with fields: question, answers, correctAnswer.`;

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "You are a trivia master. Your goal is to generate interesting and challenging trivia questions based on the given topic and difficulty level. Each question should have multiple answer choices, and the correct answer should be clearly marked."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        model: "gpt-4"
    });

    const triviaQuestions = JSON.parse(completion.choices[0].message.content);
    return triviaQuestions;
}

module.exports = generateTrivia;

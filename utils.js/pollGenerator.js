const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI();

async function generatePoll(question, options) {
  try {
    let prompt = `Create a poll based on the following question and options:
Question: "${question}"
Options: ${options.join(", ")}`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gpt-4o",
    });

    const pollResponse = completion.choices[0].message.content.trim();
    return pollResponse;
  } catch (error) {
    console.error("Error generating poll:", error);
    throw error;
  }
}

module.exports = generatePoll;

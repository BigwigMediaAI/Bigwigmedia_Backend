const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI();

async function generateCurrentTopicsContent(category, keywords, numTopics) {
  try {
    let prompt = `Generate ${numTopics} current topics on the category "${category}". also provide some details on these category`;
    if (keywords) {
      prompt += ` Include keywords: ${keywords}.`;
    }

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gpt-4",
    });

    const topicsResponse = completion.choices[0].message.content.trim().split('\n');
    return topicsResponse;
  } catch (error) {
    console.error("Error generating current topics content:", error);
    throw error;
  }
}

module.exports = generateCurrentTopicsContent;
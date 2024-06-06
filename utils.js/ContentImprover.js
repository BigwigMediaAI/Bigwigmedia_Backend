const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI();

async function improveContent(content, tone) {
  try {
    let prompt = `Improve the following content: "${content}". Make it more engaging and error-free.`;
    if (tone) {
      prompt += ` Adjust the tone to be ${tone}.`;
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

    const improvedContentResponse = completion.choices[0].message.content.trim();
    return improvedContentResponse;
  } catch (error) {
    console.error("Error improving content:", error);
    throw error;
  }
}

module.exports = improveContent;
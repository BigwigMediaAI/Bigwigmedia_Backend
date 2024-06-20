const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateYoutubeScript(topic, tone, length,language) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Generate a YouTube script in ${language} language on the topic of:\n\n${topic}\n\nTone: ${tone}\n\nLength: ${length}\n\nScript:`
        },
        {
          role: "user",
          content: topic
        }
      ],
      model: "gpt-4-turbo"
    });

    if (!completion || !completion.choices || completion.choices.length === 0) {
      throw new Error("Invalid completion response");
    }

    const script = completion.choices[0].message.content.trim();
    return script;
  } catch (error) {
    console.error("Error:", error);
    return "Failed to generate YouTube script";
  }
}

module.exports =  generateYoutubeScript;
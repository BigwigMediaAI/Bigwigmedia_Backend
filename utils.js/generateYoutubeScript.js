const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateYoutubeScript(topic, tone, length,language,outputCount) {
  let responses = [];
  try {
    for (let i = 0; i < outputCount; i++) {
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
      model: "gpt-4o"
    });
    

    if (!completion || !completion.choices || completion.choices.length === 0) {
      throw new Error("Invalid completion response");
    }

    responses.push(completion.choices[0].message.content.trim());
  }
    return responses;
  } catch (error) {
    console.error("Error:", error);
    return "Failed to generate YouTube script";
  }
}

module.exports =  generateYoutubeScript;
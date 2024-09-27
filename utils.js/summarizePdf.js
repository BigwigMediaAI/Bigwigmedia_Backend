const openAI = require("openai");
require("dotenv").config();

const openai = new openAI({
    apiKey: process.env.OPENAI_API_KEY,
});


const summarizeText = async (text,language) => {
   
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert summarizer. Your goal is to provide concise and accurate summaries of given texts."
        },
        {
          role: "user",
          content: `Summarize the following text:\n\n${text} in ${language}`
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const summarizedContent = response.choices[0].message.content.trim();
    return summarizedContent;
  } catch (error) {
    throw new Error(`Error summarizing text: ${error.message}`);
  }
};

module.exports =  summarizeText ;
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function getCoverLetter(jobDescription, userDetails, highlights) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Generate a professional cover letter based on the following job description, user details, and highlights in simple and humanized language."
        },
        {
          role: "user",
          content: `Job Description: ${jobDescription}\n\nUser Details: ${JSON.stringify(userDetails)}\n\nHighlights: ${highlights}\n\nCover Letter:`
        }
      ],
      model: "gpt-4" // Specify the model parameter
    });

    if (!completion || !completion.choices || completion.choices.length === 0) {
      throw new Error("Invalid completion response");
    }

    const coverLetter = completion.choices[0].message.content.trim();
    return coverLetter;
  } catch (error) {
    console.error("Error:", error);
    return "Failed to generate cover letter";
  }
}

module.exports = getCoverLetter;

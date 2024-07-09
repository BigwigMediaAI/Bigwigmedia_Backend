const openai = require("openai");
require("dotenv").config();
const openaiInstance = new openai.OpenAI();

async function getCodeConverter(command, structure, design) {
  if (!command || !structure || !design) {
    throw new Error("Missing required parameters.");
  }

  const completion = await openaiInstance.chat.completions.create({
    messages: [
      {
        role: "system",
        content: command,
      },
      {
        role: "user",
        content: `Convert the above code to ${structure} and apply ${design} design and show only prettier format without any additional explanatory text and Backslash`,
      },
    ],
    model: "gpt-4o",
  });

  const response = completion.choices[0].message.content;

  if (!response) {
    throw new Error("No response received from OpenAI.");
  }

  // Remove backslashes and escaped double quotes from the response
  const cleanedResponse = response.replace(/```|\"|\n/g, "");

  // Return the cleaned response
  return cleanedResponse;
}

module.exports = getCodeConverter;

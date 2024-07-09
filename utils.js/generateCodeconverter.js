const openai = require("openai");
require("dotenv").config();

const openaiInstance = new openai.OpenAI();

async function getCodeConverter(sourceCode, targetLanguage) {
    if (!sourceCode) {
        console.error("Source code is null or undefined.");
    }

    const completion = await openaiInstance.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `${sourceCode} Convert the above code to ${targetLanguage} and don't show the statement only show converted code and also don't show the converted code language name`
            },
            {
                role: "user",
                content: sourceCode
            }
        ],
        model: "gpt-4o"
    });

    const response = completion.choices[0].message.content;

    if (!response) {
        throw new Error("No response received from OpenAI.");
    }

    // Remove escape characters from the response content
    const convertedCode = response.replace(/\\/g, '');

    return convertedCode;
}

module.exports = getCodeConverter;

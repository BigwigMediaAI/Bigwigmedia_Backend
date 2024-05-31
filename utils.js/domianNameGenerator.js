const openAI = require("openai");
require("dotenv").config();

const openai = new openAI.OpenAI(process.env.OPENAI_API_KEY);

async function generateDomainNames(companyName, companyType,length, count) {
    try {
        const prompt = `Generate ${count} domain names related to ${companyName} and ${companyType} with a length of ${length} characters or less.`;

        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: prompt,
                },
            ],
            model: "gpt-4-turbo",
        });

        if (!completion.choices || !completion.choices[0] || !completion.choices[0].message) {
            throw new Error("Invalid response structure from OpenAI API");
        }

        // Split the content into lines, remove any numbering and trim whitespace
        const domainNames = completion.choices[0].message.content
            .split('\n')
            .map(line => line.replace(/^\d+\.\s*/, '').trim())
            .filter(line => line); // Filter out any empty lines

        return domainNames;
    } catch (error) {
        throw error;
    }
}

module.exports = generateDomainNames;
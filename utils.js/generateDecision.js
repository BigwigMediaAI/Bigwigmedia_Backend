const openAI = require("openai");
require("dotenv").config();

const openai = new openAI();

async function getDecisionTool(prompt,language) {
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `Can you list the pros and cons of [decision] in ${language} language in points? Please include factors such as [factors of decision].`
                },
                {
                    role: "user",
                    content: prompt,
                }
            ],
            model: "gpt-4"
        });

        // Check if completion response is valid
        if (!completion || !completion.choices || !completion.choices[0] || !completion.choices[0].message || !completion.choices[0].message.content) {
            throw new Error("Invalid completion response");
        }

        // Extract pros and cons from the completion
        const response = completion.choices[0].message.content;

        // Split the response into sections based on the newline character (\n)
        const sections = response.split("\n");

        // Filter out any empty sections
        const filteredSections = sections.filter(section => section.trim().length > 0);

        // Find the index where the "Cons" section starts
        const consIndex = filteredSections.findIndex(section => section.includes("Cons"));

        // Separate the sections into pros and cons arrays
        const pros = filteredSections.slice(1, consIndex).map(section => section.trim());
        const cons = filteredSections.slice(consIndex).map(section => section.trim());

        // Format pros and cons into smaller points
        const formatPoints = (points) => {
            return points.map(point => {
                // Remove the numbering or bullet point
                return point.replace(/^\d+\.\s*/, "- ","#","*").trim()
            });
        };

        // Return formatted pros and cons as JSON
        return {
            pros: formatPoints(pros),
            cons: formatPoints(cons)
        };
    } catch (error) {
        // Handle error
        console.error("Error getting response:", error);
        throw error;
    }
}

module.exports = getDecisionTool;

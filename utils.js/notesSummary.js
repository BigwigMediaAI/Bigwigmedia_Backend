const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function getNotesSummary(notes,language) {
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a summarizer that categorizes key points from a meeting based on specific sections. Please provide a summary of the meeting with section headers followed by key points in ${language} language . Example:\n\nMarketing Strategy:\n- Digital marketing plan discussed.\n- Budget allocated: $50,000.\n\nProduct Development Update:\n- Prototype nearing completion.\n- Testing scheduled for next week.\n\nCustomer Support Preparation:\n- Plan to hire additional staff.\n\nFinance Department Insights:\n- Revenue projections discussed.\n- Break-even expected within six months.\n\nSummary:`
                },
                {
                    role: "user",
                    content: notes
                }
            ],
            model: "gpt-4o"
        });

        if (!completion || !completion.choices || completion.choices.length === 0) {
            throw new Error("Invalid completion response");
        }

        let summary = completion.choices[0].message.content.trim();

        // Ensure the summary follows the specified format
        const formattedSummary = formatSummary(summary);

        return { "Key_Points": formattedSummary };
    } catch (error) {
        console.error("Error:", error.message);
        return { "summary": { "error": "Failed to generate notes summary" } };
    }
}

function formatSummary(summary) {
    let formattedSummary = {};

    // Split the summary into lines and categorize key points
    const lines = summary.split('\n').map(line => line.trim());
    let currentSection = '';

    lines.forEach(line => {
        if (line.endsWith(':')) {
            // Found a section header
            const section = line.slice(0, -1).trim();
            formattedSummary[section] = [];
            currentSection = section;
        } else if (currentSection && line.startsWith('-')) {
            // Found a key point
            formattedSummary[currentSection].push(line.slice(1).trim());
        }
    });

    return formattedSummary;
}

module.exports = { getNotesSummary };
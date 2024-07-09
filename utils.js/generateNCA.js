const openAI = require("openai");
require("dotenv").config();

const openai = new openAI.OpenAI(process.env.OPENAI_API_KEY);

async function generateNCA(employer, employee, restrictedActivities, restrictedDuration, restrictedTerritory,language) {
    const prompt = `Create a Non-Compete Agreement (NCA) in ${language} language between the Employer and the Employee with the following details:
    - Employer: ${employer}
    - Employee: ${employee}
    - Restricted Activities: ${restrictedActivities}
    - Restricted Duration: ${restrictedDuration}
    - Restricted Territory: ${restrictedTerritory}

    The NCA should include the following sections:
    1. Definitions
    2. Non-Compete Covenant
    3. Duration of Covenant
    4. Geographic Scope
    5. Consideration
    6. Confidentiality
    7. Acknowledgments
    8. Remedies
    9. Miscellaneous

    Please draft the NCA accordingly.`;

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "You are a legal expert specialized in drafting Non-Compete Agreements. Provide a detailed and clear NCA based on the provided information."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        model: "gpt-4o"
    });

    let ncaContent = completion.choices[0].message.content;

    // Format the NCA content to ensure numbered sections are properly formatted in markdown
    ncaContent = ncaContent.replace(/(\d\.\s[A-Za-z])/g, '\n$1');
    
    // Ensure each bullet point starts on a new line
    ncaContent = ncaContent.replace(/- /g, '\n- ');

    // Format the response to properly display as an ordered list
    ncaContent = ncaContent.replace(/(\d\.)/g, '\n$1');

    return ncaContent;
}

module.exports = generateNCA;

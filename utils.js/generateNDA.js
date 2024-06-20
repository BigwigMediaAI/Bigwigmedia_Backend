const openAI = require("openai");
require("dotenv").config();

const openai = new openAI.OpenAI(process.env.OPENAI_API_KEY);

async function generateNDA(disclosingParty, receivingParty,language,DateAgreement) {
    const prompt = `Create a Non-Disclosure Agreement (NDA) in ${language} language between the Disclosing Party and the Receiving Party with the following details:
    - Disclosing Party: ${disclosingParty}
    - Receiving Party: ${receivingParty}
    - Date : ${DateAgreement}

    The NDA should include the following sections:
    1. Definitions
    2. Confidential Information
    3. Obligations of Receiving Party
    4. Exclusions from Confidential Information
    5. Term
    6. Return of Materials
    7. Remedies
    8. Miscellaneous

    Please draft the NDA accordingly.`;

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "You are a legal expert specialized in drafting Non-Disclosure Agreements. Provide a detailed and clear NDA based on the provided information."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        model: "gpt-4"
    });

    let ndaContent = completion.choices[0].message.content;

    // Format the NDA content to ensure numbered sections are properly formatted in markdown
    ndaContent = ndaContent.replace(/(\d\.\s[A-Za-z])/g, '\n$1');
    
    // Ensure each bullet point starts on a new line
    ndaContent = ndaContent.replace(/- /g, '\n- ');

    // Format the response to properly display as an ordered list
    ndaContent = ndaContent.replace(/(\d\.)/g, '\n$1');

    return ndaContent;
}

module.exports = generateNDA;

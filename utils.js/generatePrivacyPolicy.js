const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI();

async function generatePrivacyPolicy(companyName, address, websiteURL,language) {
    try {
        const prompt = `Generate a privacy policy in ${language} for a company with the following details:\nCompany Name: ${companyName}\nAddress: ${address}\nWebsite URL: ${websiteURL}\n\nPrivacy Policy:`;

        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                }
            ],
            model: "gpt-4o",
        });

        const privacyPolicy = completion.choices[0].message.content.trim();
        return {
            data: {
                privacyPolicy: privacyPolicy
            }
        };
    } catch (error) {
        console.error("Error generating privacy policy:", error);
        return null;
    }
}

module.exports = generatePrivacyPolicy;

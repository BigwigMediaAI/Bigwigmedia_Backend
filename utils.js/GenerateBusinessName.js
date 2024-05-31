const OpenAI=require("openai")
require("dotenv").config()

const openai=new OpenAI()

async function getCompanyNames(companyType, companyMission, targetAudience, namingStyle, competitor, languagePreference){
    try {
        const prompt = `You're creating a tool to generate company names. Please provide some details about your business or the type of company name you're looking for.\nCompany Type: ${companyType}\nCompany Mission: ${companyMission}\nTarget Audience: ${targetAudience}\nNaming Style: ${namingStyle}\nCompetitor: ${competitor}\nLanguage Preferences: ${languagePreference}\n`;

        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                }
            ],
            model: "gpt-4",
        });

        const companyNameResponse = completion.choices[0].message.content.replace(/(\|\r\n|\n|\r)/gm, "");
        const companyNames = companyNameResponse.split(/\d+\./).map(name => name.trim()).filter(Boolean);
        return {
            data: {
                companyNames: companyNames
            }
        };
    } catch (error) {
        console.error("Error generating company names:", error);
        return null;
    }
    
}




module.exports = getCompanyNames;

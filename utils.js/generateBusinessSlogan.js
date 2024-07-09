const openAI = require("openai");
require("dotenv").config();

const openai = new openAI();

async function generateBusinessSlogans(businessName, whatItDoes, numberOfSlogans,language) {
    const prompt = `Business Name: ${businessName}\nWhat it Does: ${whatItDoes}\n`;

    const slogans = [];

    for (let i = 0; i < numberOfSlogans; i++) {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are now a creative genius in the world of business slogans. Your goal is to come up with catchy and memorable slogans in ${language} language for various businesses. Think about what makes a good slogan - it should be short, impactful, and reflective of the brand's identity. Try to infuse a sense of personality and uniqueness into each slogan. Remember, the goal is to grab attention and leave a lasting impression on potential customers.`,
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "gpt-4o"
        });

        const slogan = completion.choices[0].message.content.replace(/(\|\r\n|\n|\r)/gm, "");
        // Remove any occurrences of "Slogan:" in the generated slogan
        slogans.push(slogan.replace("Slogan: ", ""));
    }

    return slogans;
}

module.exports = generateBusinessSlogans;
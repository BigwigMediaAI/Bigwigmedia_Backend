const openAI = require("openai");
require("dotenv").config();

const openai = new openAI();

async function getMarketingCampaign(prompt,language) {
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `Generate a marketing campaign strategy in ${language} language for a product launch. Provide detailed information about the product, its target market, and key features. Based on this input, outline a comprehensive campaign strategy covering the following aspects:

### Product Introduction:
Introduce the product and its unique selling points.

### Market Analysis:
Provide a brief analysis of the product's strengths, weaknesses, opportunities, and threats.

### Product Positioning:
Define how the product will be positioned in the market relative to competitors and in the minds of consumers.

### Target Audience Segmentation:
Identify and segment the target audience based on demographics, psychographics, and behavior.

### Marketing Goals:
Outline specific, measurable, achievable, relevant, and time-bound goals for the marketing campaign.

### Marketing Budget Allocation:
Allocate the marketing budget across various channels and activities effectively.

### STP Marketing:
Develop a strategy focusing on segmentation, targeting, and positioning to reach the target audience effectively.

### Content Creation:
Outline the type of content to be created for the campaign, including messaging, visuals, and formats.

### Advertising Channels:
Determine the most suitable advertising channels (e.g., social media, traditional media, influencer marketing) to reach the target audience.

### Performance Measurement:
Define key performance indicators (KPIs) and metrics to measure the success of the marketing campaign.

### Role of Data Analytics and Personalization:
Explain how data analytics and personalization will be utilized to optimize the campaign's effectiveness and tailor it to individual consumer preferences.`,
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "gpt-4o"
        });

        // Extracting text content from response
        const responseText = completion.choices[0].message.content.replace(/\n\n/g, '');

        // Define an object to store the sections
        const sections = {
            "Product Introduction": [],
            "Market Analysis": [],
            "Product Positioning": [],
            "Target Audience Segmentation": [],
            "Marketing Goals": [],
            "Marketing Budget Allocation": [],
            "STP Marketing": [],
            "Content Creation": [],
            "Advertising Channels": [],
            "Performance Measurement": [],
            "Role of Data Analytics and Personalization": []
        };

        // Split the response into sections based on the titles
        responseText.split(/###\s/).forEach(section => {
            // Find the factor name (e.g., "Introduction:")
            const match = section.match(/^([A-Za-z\s]+):/);
            if (match && match[1]) {
                const factor = match[1].trim();
                // Special handling for Market Analysis (SWOT Analysis) and Marketing Goals (SMART)
                if (factor === "Market Analysis" || factor === "Marketing Goals") {
                    sections[factor].push(section.trim());
                } else {
                    sections[factor].push(section.replace(match[0], '').trim());
                }
            }
        });

        // Return the sections object
        return sections;
    } catch (error) {
        console.error("Error getting response:", error);
        // Return an empty object or handle the error as per your requirement
        return {};
    }
}

module.exports = getMarketingCampaign;

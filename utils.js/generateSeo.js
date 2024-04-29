const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI();

async function GetSeo(prompt) {
    try {
        const completion = await openai.chat.completions.create({
            messages: [{
                    role: "system",
                    content: `Write a detailed proper and professional SEO keyword research report content for[topic] The keywords will be target the type, and list at least 10 related clusters with 10 keywords for each clusters, and also show search volume for each keyword. `,
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "gpt-4-turbo",
        });

        if (!completion || !completion.choices || completion.choices.length === 0) {
            throw new Error("Invalid completion response");
        }

        // Extracted data from the content
        const reportContent = completion.choices[0].message.content;

        // Parse the report content to extract clusters
        const clustersRegex = /Cluster \d+:([\s\S]+?)(?=(Cluster \d+|$))/g;
        const clusters = [];
        let match;
        while ((match = clustersRegex.exec(reportContent)) !== null) {
            const clusterData = match[1].trim();
            const lines = clusterData.split('\n').map(line => line.trim());
            const clusterTitle = lines.shift(); // First line is the cluster title
            if (clusterTitle) {
                const keywords = lines.map(line => {
                    const [keyword, volume] = line.split(' - ');
                    return { keyword: keyword ? keyword.trim() : '', searchVolume: volume ? volume.trim() : '' };
                });
                clusters.push({ title: clusterTitle.trim(), keywords });
            }
        }
        
        return clusters;
    } catch (error) {
        console.error("Error:", error);
        return { error: "Failed to generate SEO keyword research report" };
    }
}

module.exports = GetSeo;

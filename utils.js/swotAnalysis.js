
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateSWOTAnalysis(topic,language,outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `Generate a SWOT analysis for the topic in ${language} language: ${topic}`
                },
                {
                    role: 'user',
                    content: `Strengths:\n\n- \n\nWeaknesses:\n\n- \n\nOpportunities:\n\n- \n\nThreats:\n\n- `
                }
            ],
            model: 'gpt-4o'
        });

        if (!completion || !completion.choices || completion.choices.length === 0) {
            throw new Error('Invalid completion response');
        }

        responses.push(completion.choices[0].message.content.trim());
    }
        return responses;
    } catch (error) {
        console.error('Error generating SWOT analysis:', error);
        return 'Failed to generate SWOT analysis';
    }
}


async function generateSEOSuggestions(content, language, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Analyze the following content and suggest SEO improvements in ${language} language: ${content}`
                    },
                    {
                        role: 'user',
                        content: `Please suggest keyword optimization, meta description improvements, and content structure changes.`
                    }
                ],
                model: 'gpt-4o'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            responses.push(completion.choices[0].message.content.trim());
        }

        return responses;
    } catch (error) {
        console.error('Error generating SEO suggestions:', error);
        return 'Failed to generate SEO suggestions';
    }
}


async function generateSEOImprovements(content, language, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are an SEO expert. Analyze and suggest improvements for the following content in ${language}. Focus on keyword optimization, meta descriptions, and content structure.`
                    },
                    {
                        role: 'user',
                        content: `Content:\n\n${content}`
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            // Push the generated SEO improvement suggestion into the response array
            responses.push(completion.choices[0].message.content.trim());
        }

        return responses;
    } catch (error) {
        console.error('Error generating SEO improvements:', error);
        return 'Failed to generate SEO improvements';
    }
}


module.exports = { generateSWOTAnalysis, generateSEOSuggestions, generateSEOImprovements };

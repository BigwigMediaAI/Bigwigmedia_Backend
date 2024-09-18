// utils/videoPromptGenerator.js
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateVideoPromptContent(mainObject, style, mood, cameraAngles, sceneType, language, duration, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Create a prompt for generating a video with the following details: 
                                  Main Object: ${mainObject}, 
                                  Style: ${style}, 
                                  Mood: ${mood}, 
                                  Camera Angles: ${cameraAngles}, 
                                  Scene Type: ${sceneType}, 
                                  Duration: ${duration} seconds. 
                                  The prompt should be in ${language}.`
                    },
                    {
                        role: 'user',
                        content: ``
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            responses.push(completion.choices[0].message.content.trim());
        }
        return responses;
    } catch (error) {
        console.error('Error generating video prompts:', error);
        return 'Failed to generate prompts';
    }
}

module.exports = { generateVideoPromptContent };
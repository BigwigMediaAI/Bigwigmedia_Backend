const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

// Function to generate multiple image prompts
async function generateImagePrompt(mainObject, style, feeling, colors, background, language, outputCount) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Create a prompt for generating an image with the following details: 
                                  Main Object: ${mainObject}, 
                                  Style: ${style}, 
                                  Feeling: ${feeling}, 
                                  Colors: ${colors}, 
                                  Background: ${background}. 
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
        console.error('Error generating image prompts:', error);
        return 'Failed to generate prompts';
    }
}

// Function to generate image from a selected prompt
async function generateImageFromSelectedPrompt(selectedPrompt) {
    try {
        const response = await openai.images.generate({
            model: 'dall-e-3',
            prompt: `${selectedPrompt}`,
            size: '1024x1024',
        });
        return response.data;
    } catch (error) {
        console.error('Error generating image from selected prompt:', error);
        return 'Failed to generate image';
    }
}

module.exports = { generateImagePrompt, generateImageFromSelectedPrompt };

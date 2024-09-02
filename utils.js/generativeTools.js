const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateCaption({ postDetails, tone, language, outputCount, useEmoji, useHashtags }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const emojiText = useEmoji ? 'Include emojis.' : 'Do not include emojis.';
            const hashtagText = useHashtags ? 'Include relevant hashtags.' : 'Do not include hashtags.';

            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate an Instagram caption in ${language} with a ${tone} tone. ${emojiText} ${hashtagText}`
                    },
                    {
                        role: 'user',
                        content: `Post Details: ${postDetails}`
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
        console.error('Error generating captions:', error);
        return 'Failed to generate captions';
    }
}


async function generateInstagramBio({ profile, tone, language, outputCount, useEmoji, useHashtags }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate an Instagram bio in ${language} with a ${tone} tone${useEmoji ? ' and use emojis' : ''}${useHashtags ? ' and include hashtags' : ''}.`
                    },
                    {
                        role: 'user',
                        content: `Profile: ${profile}`
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
        console.error('Error generating Instagram bios:', error);
        return 'Failed to generate Instagram bios';
    }
}


async function generateInstagramStory({ story, tone, language, outputCount, useEmoji, useHashtags }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate an Instagram story post in ${language} with a ${tone} tone${useEmoji ? ' and use emojis' : ''}${useHashtags ? ' and include hashtags' : ''}.`
                    },
                    {
                        role: 'user',
                        content: `Story: ${story}`
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
        console.error('Error generating Instagram story:', error);
        return 'Failed to generate Instagram story';
    }
}

async function generateReelPost({ theme, tone, language, outputCount, useEmoji, useHashtags }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are a social media expert creating Instagram Reel captions. Generate a short, engaging, and dynamic caption for an Instagram Reel in ${language} with a ${tone} tone${useEmoji ? ' that includes emojis' : ''}${useHashtags ? ' and relevant hashtags' : ''}.`
                    },
                    {
                        role: 'user',
                        content: `Create an Instagram Reel caption for the following theme: "${theme}". The caption should be suitable for a dynamic video Reel and include a call to action for viewers.`
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
        console.error('Error generating Instagram Reel post:', error);
        return 'Failed to generate Instagram Reel post';
    }
}



module.exports = { generateCaption,generateInstagramBio,generateInstagramStory,generateReelPost };
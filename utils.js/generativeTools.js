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
            const emojiText = useEmoji ? ' with emojis' : ' without emojis';
            const hashtagText = useHashtags ? ' and include relevant hashtags' : ' and without any hashtags';
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Generate an Instagram story post in ${language} with a ${tone} tone${emojiText}${hashtagText}.`
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
            const emojiText = useEmoji ? ' with emojis' : ' without emojis';
            const hashtagText = useHashtags ? ' and include relevant hashtags' : ' and without any hashtags';
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are a social media expert creating Instagram Reel captions. Generate a short, engaging, and dynamic caption for an Instagram Reel in ${language} with a ${tone} tone${emojiText}${hashtagText}.`
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


async function generateThreadsPost({ theme, tone, language, outputCount, useEmoji, useHashtags }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const emojiText = useEmoji ? ' with emojis' : ' without emojis';
            const hashtagText = useHashtags ? ' and include relevant hashtags' : ' and without any hashtags';

            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are a social media expert creating Instagram Threads content. Generate a concise, engaging, and thoughtful post in ${language} with a ${tone} tone${emojiText}${hashtagText}.`
                    },
                    {
                        role: 'user',
                        content: `Create an Instagram Threads post based on the following theme: "${theme}". The post should resonate with the Threads community and encourage interaction.`
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
        console.error('Error generating Instagram Threads post:', error);
        return 'Failed to generate Instagram Threads post';
    }
}


async function generateFacebookPost({ theme, tone, language, outputCount, useEmoji, useHashtags }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const emojiText = useEmoji ? ' with emojis' : ' without emojis';
            const hashtagText = useHashtags ? ' and include relevant hashtags' : ' and without any hashtags';

            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are a social media expert creating Facebook posts. Generate a well-crafted, engaging, and shareable Facebook post in ${language} with a ${tone} tone${emojiText}${hashtagText}.`
                    },
                    {
                        role: 'user',
                        content: `Create a Facebook post based on the following theme: "${theme}". The post should be engaging, encourage interaction, and be suitable for a broad audience.`
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            let generatedPost = completion.choices[0].message.content.trim();

            responses.push(generatedPost);
        }
        return responses;
    } catch (error) {
        console.error('Error generating Facebook post:', error);
        return 'Failed to generate Facebook post';
    }
}


async function generateFacebookAdHeadline({ brandOrProductName, purpose, businessType, tone, language, outputCount, useEmoji }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const emojiText = useEmoji ? ' with emojis' : ' without emojis';

            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are a copywriting expert creating Facebook Ad headlines. Generate a catchy, compelling, and concise headline in ${language} with a ${tone} tone${emojiText}. The headline should be tailored to the specified business type and align with the purpose.`
                    },
                    {
                        role: 'user',
                        content: `Brand/Product: ${brandOrProductName}\nPurpose: ${purpose}\nBusiness Type: ${businessType}`
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            let generatedHeadline = completion.choices[0].message.content.trim();


            responses.push(generatedHeadline);
        }
        return responses;
    } catch (error) {
        console.error('Error generating Facebook Ad headline:', error);
        return 'Failed to generate Facebook Ad headline';
    }
}


async function generateFacebookBio({ description, tone, language, outputCount, useEmoji, useHashtags }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const emojiText = useEmoji ? ' with emojis' : ' without emojis';
            const hashtagText = useHashtags ? ' and include relevant hashtags' : ' and without any hashtags';

            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are a social media expert creating Facebook bios. Generate a well-crafted, engaging, and shareable Facebook bio in ${language} with a ${tone} tone${emojiText}${hashtagText}.`
                    },
                    {
                        role: 'user',
                        content: `Create a Facebook bio based on the following theme: "${description}". The post should be engaging, encourage interaction, and be suitable for a broad audience.`
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            let generatedPost = completion.choices[0].message.content.trim();

            responses.push(generatedPost);
        }
        return responses;
    } catch (error) {
        console.error('Error generating Facebook bio:', error);
        return 'Failed to generate Facebook bio';
    }
}
async function generateFacebookGroupPost({ description, tone, language, outputCount, useEmoji, useHashtags }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const emojiText = useEmoji ? ' with emojis' : ' without emojis';
            const hashtagText = useHashtags ? ' and include relevant hashtags' : ' and without any hashtags';

            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are a social media expert creating Facebook group posts. Generate a well-crafted, engaging, and shareable Facebook group post in ${language} with a ${tone} tone${emojiText}${hashtagText}.`
                    },
                    {
                        role: 'user',
                        content: `Create a Facebook group post based on the following theme: "${description}". The post should be engaging, encourage interaction, and be suitable for a broad audience.`
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            let generatedPost = completion.choices[0].message.content.trim();

            responses.push(generatedPost);
        }
        return responses;
    } catch (error) {
        console.error('Error generating Facebook group post:', error);
        return 'Failed to generate Facebook group post';
    }
}


async function generateFacebookGroupDescription({ description, tone, language, outputCount, useEmoji, useHashtags }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const emojiText = useEmoji ? ' with emojis' : ' without emojis';
            const hashtagText = useHashtags ? ' and include relevant hashtags' : ' and without any hashtags';

            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are a social media expert creating Facebook group description. Generate a well-crafted, engaging, and shareable Facebook group description in ${language} with a ${tone} tone${emojiText}${hashtagText}.`
                    },
                    {
                        role: 'user',
                        content: `Create a Facebook group description based on the following description: "${description}". The post should be engaging, encourage interaction, and be suitable for a broad audience.`
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            let generatedPost = completion.choices[0].message.content.trim();

            responses.push(generatedPost);
        }
        return responses;
    } catch (error) {
        console.error('Error generating Facebook group description:', error);
        return 'Failed to generate Facebook group description';
    }
}


async function FacebookPageDescription ({ description, tone, language, outputCount, useEmoji, useHashtags }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const emojiText = useEmoji ? ' with emojis' : ' without emojis';
            const hashtagText = useHashtags ? ' and include relevant hashtags' : ' and without any hashtags';

            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are a social media expert creating Facebook page description. Generate a well-crafted, engaging, and shareable Facebook page description in ${language} with a ${tone} tone${emojiText}${hashtagText}.`
                    },
                    {
                        role: 'user',
                        content: `Create a Facebook page description based on the following description: "${description}". The post should be engaging, encourage interaction, and be suitable for a broad audience.`
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            let generatedPost = completion.choices[0].message.content.trim();

            responses.push(generatedPost);
        }
        return responses;
    } catch (error) {
        console.error('Error generating Facebook page description:', error);
        return 'Failed to generate Facebook page description';
    }
}
async function YouTubePostTitle ({ description, tone, language, outputCount, useEmoji, useHashtags }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const emojiText = useEmoji ? ' with emojis' : ' without emojis';
            const hashtagText = useHashtags ? ' and include relevant hashtags' : ' and without any hashtags';

            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are a social media expert creating YouTube Post Title. Generate a well-crafted, engaging, and shareable YouTube Post Title in ${language} with a ${tone} tone${emojiText}${hashtagText}.`
                    },
                    {
                        role: 'user',
                        content: `Create a YouTube Post Title based on the following description: "${description}". The post should be engaging, encourage interaction, and be suitable for a broad audience.`
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            let generatedPost = completion.choices[0].message.content.trim();

            responses.push(generatedPost);
        }
        return responses;
    } catch (error) {
        console.error('Error generating YouTube Post Title:', error);
        return 'Failed to generate YouTube Post Title';
    }
}
async function YouTubePostDescription ({ description, tone, language, outputCount, useEmoji, useHashtags }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const emojiText = useEmoji ? ' with emojis' : ' without emojis';
            const hashtagText = useHashtags ? ' and include relevant hashtags' : ' and without any hashtags';

            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are a social media expert creating YouTube Post Description. Generate a well-crafted, engaging, and shareable YouTube Post Description in ${language} with a ${tone} tone${emojiText}${hashtagText}.`
                    },
                    {
                        role: 'user',
                        content: `Create a YouTube Post Description based on the following description: "${description}". The post should be engaging, encourage interaction, and be suitable for a broad audience.`
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            let generatedPost = completion.choices[0].message.content.trim();

            responses.push(generatedPost);
        }
        return responses;
    } catch (error) {
        console.error('Error generating YouTube Post Description:', error);
        return 'Failed to generate YouTube Post Description';
    }
}


async function TwitterBio ({ description, tone, language, outputCount, useEmoji, useHashtags }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const emojiText = useEmoji ? ' with emojis' : ' without emojis';
            const hashtagText = useHashtags ? ' and include relevant hashtags' : ' and without any hashtags';

            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are a social media expert creating Twitter Bio. Generate a well-crafted, engaging, and shareable Twitter Bio in ${language} with a ${tone} tone${emojiText}${hashtagText}.`
                    },
                    {
                        role: 'user',
                        content: `Create a Twitter Bio Generator based on the following description: "${description}". The post should be engaging, encourage interaction, and be suitable for a broad audience.`
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            let generatedPost = completion.choices[0].message.content.trim();

            responses.push(generatedPost);
        }
        return responses;
    } catch (error) {
        console.error('Error generating Twitter Bio Generator:', error);
        return 'Failed to generate Twitter Bio Generator';
    }
}
async function TwitterPost ({ description, tone, language, outputCount, useEmoji, useHashtags }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const emojiText = useEmoji ? ' with emojis' : ' without emojis';
            const hashtagText = useHashtags ? ' and include relevant hashtags' : ' and without any hashtags';

            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are a social media expert creating Twitter Post. Generate a well-crafted, engaging, and shareable Twitter Post in ${language} with a ${tone} tone${emojiText}${hashtagText}.`
                    },
                    {
                        role: 'user',
                        content: `Create a Twitter Post based on the following description: "${description}". The post should be engaging, encourage interaction, and be suitable for a broad audience.`
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            let generatedPost = completion.choices[0].message.content.trim();

            responses.push(generatedPost);
        }
        return responses;
    } catch (error) {
        console.error('Error generating Twitter Post:', error);
        return 'Failed to generate Twitter Post';
    }
}
async function TwitterThreadsPost ({ description, tone, language, outputCount, useEmoji, useHashtags }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const emojiText = useEmoji ? ' with emojis' : ' without emojis';
            const hashtagText = useHashtags ? ' and include relevant hashtags' : ' and without any hashtags';

            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are a social media expert creating Twitter Threads Post. Generate a well-crafted, engaging, and shareable Twitter Threads Post in ${language} with a ${tone} tone${emojiText}${hashtagText}.`
                    },
                    {
                        role: 'user',
                        content: `Create a Twitter Threads Post based on the following description: "${description}". The post should be engaging, encourage interaction, and be suitable for a broad audience.`
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            let generatedPost = completion.choices[0].message.content.trim();

            responses.push(generatedPost);
        }
        return responses;
    } catch (error) {
        console.error('Error generating Twitter Threads Post:', error);
        return 'Failed to generate Twitter Threads Post';
    }
}
async function TwitterThreadsBio ({ description, tone, language, outputCount, useEmoji, useHashtags }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const emojiText = useEmoji ? ' with emojis' : ' without emojis';
            const hashtagText = useHashtags ? ' and include relevant hashtags' : ' and without any hashtags';

            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are a social media expert creating Twitter Threads Bio. Generate a well-crafted, engaging, and shareable Twitter Threads Bio in ${language} with a ${tone} tone${emojiText}${hashtagText}.`
                    },
                    {
                        role: 'user',
                        content: `Create a Twitter Threads Bio based on the following description: "${description}". The post should be engaging, encourage interaction, and be suitable for a broad audience.`
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            let generatedPost = completion.choices[0].message.content.trim();

            responses.push(generatedPost);
        }
        return responses;
    } catch (error) {
        console.error('Error generating Twitter Threads Bio :', error);
        return 'Failed to generate Twitter Threads Bio ';
    }
}
async function LinkedInPageHeadline({ description, tone, language, outputCount, useEmoji, useHashtags }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const emojiText = useEmoji ? ' with emojis' : ' without emojis';
            const hashtagText = useHashtags ? ' and include relevant hashtags' : ' and without any hashtags';

            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are a social media expert creating LinkedIn Page Headline. Generate a well-crafted, engaging, and shareable LinkedIn Page Headline in ${language} with a ${tone} tone${emojiText}${hashtagText}.`
                    },
                    {
                        role: 'user',
                        content: `Create a LinkedIn Page Headline based on the following description: "${description}". The post should be engaging, encourage interaction, and be suitable for a broad audience.`
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            let generatedPost = completion.choices[0].message.content.trim();

            responses.push(generatedPost);
        }
        return responses;
    } catch (error) {
        console.error('Error LinkedIn Page Headline:', error);
        return 'Failed to LinkedIn Page Headline';
    }
}

async function LinkedinCompanyPageHeadline({ description, tone, language, outputCount, useEmoji, useHashtags }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const emojiText = useEmoji ? ' with emojis' : ' without emojis';
            const hashtagText = useHashtags ? ' and include relevant hashtags' : ' and without any hashtags';

            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are a social media expert creating Linkedin Company Page Headline. Generate a well-crafted, engaging, and shareable Linkedin Company Page Headline in ${language} with a ${tone} tone${emojiText}${hashtagText}.`
                    },
                    {
                        role: 'user',
                        content: `Create a Linkedin Company Page Headline based on the following description: "${description}". The post should be engaging, encourage interaction, and be suitable for a broad audience.`
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            let generatedPost = completion.choices[0].message.content.trim();

            responses.push(generatedPost);
        }
        return responses;
    } catch (error) {
        console.error('Error Linkedin Company Page Headline:', error);
        return 'Failed to Linkedin Company Page Headline';
    }
}


async function LinkedInPageSummary({ description, tone, language, outputCount, useEmoji, useHashtags }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const emojiText = useEmoji ? ' with emojis' : ' without emojis';
            const hashtagText = useHashtags ? ' and include relevant hashtags' : ' and without any hashtags';

            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are a social media expert creating LinkedIn Page Summary. Generate a well-crafted, engaging, and shareable LinkedIn Page Summary in ${language} with a ${tone} tone${emojiText}${hashtagText}.`
                    },
                    {
                        role: 'user',
                        content: `Create a LinkedIn Page Summary based on the following description: "${description}". The post should be engaging, encourage interaction, and be suitable for a broad audience.`
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            let generatedPost = completion.choices[0].message.content.trim();

            responses.push(generatedPost);
        }
        return responses;
    } catch (error) {
        console.error('Error LinkedIn Page Summary:', error);
        return 'Failed to LinkedIn Page Summary';
    }
}


async function LinkedInCompanySummary({ description, tone, language, outputCount, useEmoji, useHashtags }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const emojiText = useEmoji ? ' with emojis' : ' without emojis';
            const hashtagText = useHashtags ? ' and include relevant hashtags' : ' and without any hashtags';

            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are a social media expert creating LinkedIn Company Summary. Generate a well-crafted, engaging, and shareable LinkedIn Company Summary in ${language} with a ${tone} tone${emojiText}${hashtagText}.`
                    },
                    {
                        role: 'user',
                        content: `Create a LinkedIn Company Summary based on the following description: "${description}". The post should be engaging, encourage interaction, and be suitable for a broad audience.`
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            let generatedPost = completion.choices[0].message.content.trim();

            responses.push(generatedPost);
        }
        return responses;
    } catch (error) {
        console.error('Error LinkedIn Company Summary:', error);
        return 'Failed to LinkedIn Company Summary';
    }
}



module.exports = { generateCaption,generateInstagramBio,generateInstagramStory,generateReelPost, generateThreadsPost, generateFacebookPost, generateFacebookAdHeadline, generateFacebookBio,generateFacebookGroupPost,generateFacebookGroupDescription,FacebookPageDescription,YouTubePostTitle,YouTubePostDescription,TwitterBio,TwitterPost,TwitterThreadsPost,TwitterThreadsBio,LinkedInPageHeadline,LinkedinCompanyPageHeadline,LinkedInPageSummary,LinkedInCompanySummary};
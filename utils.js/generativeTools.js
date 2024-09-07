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

async function PostHashtags({ description, language, outputCount }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are a social media expert specializing in creating relevant and trending hashtags for posts. Generate a list of effective and popular hashtags in ${language}.`
                    },
                    {
                        role: 'user',
                        content: `Based on the following description: "${description}", generate a set of hashtags that would help increase visibility and engagement for this post.`
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            let generatedHashtags = completion.choices[0].message.content.trim();

            responses.push(generatedHashtags);
        }
        return responses;
    } catch (error) {
        console.error('Error generating hashtags:', error);
        return 'Failed to generate hashtags';
    }
}


async function BlogPost({ title, description, keywords, tone, language, wordCount, includeIntroduction, includeConclusion, outputCount }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are an experienced content writer. Generate a well-structured and engaging blog post in ${language} with a ${tone} tone. The blog post should be informative, well-researched, and optimized for SEO.`
                    },
                    {
                        role: 'user',
                        content: `
                            Title: "${title}"
                            Description: "${description}"
                            Keywords: "${keywords.join(', ')}"
                            Word Count: ${wordCount}
                            Include Introduction: ${includeIntroduction}
                            Include Conclusion: ${includeConclusion}
                        `
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
        console.error('Error generating blog post:', error);
        return 'Failed to generate blog post';
    }
}

async function ArticleGenerator({ description, tone, language, outputCount }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are a skilled article writer. Generate a well-researched and engaging article in ${language} with a ${tone} tone. The article should be informative, clear, and relevant to the target audience.`
                    },
                    {
                        role: 'user',
                        content: `Based on the following description: "${description}", create an article that effectively conveys the message and engages the audience.`
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            let generatedArticle = completion.choices[0].message.content.trim();

            responses.push(generatedArticle);
        }
        return responses;
    } catch (error) {
        console.error('Error generating article:', error);
        return 'Failed to generate article';
    }
}

async function PressRelease({ organizationName, eventName, tone, language, outputCount }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are a public relations expert. Write a well-crafted and professional press release in ${language} with a ${tone} tone. The press release should be informative, engaging, and suitable for media distribution.`
                    },
                    {
                        role: 'user',
                        content: `Organization: "${organizationName}"\nEvent: "${eventName}".\nCreate a press release that effectively communicates the importance of this event and engages the target audience.`
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            let generatedPressRelease = completion.choices[0].message.content.trim();

            responses.push(generatedPressRelease);
        }
        return responses;
    } catch (error) {
        console.error('Error generating press release:', error);
        return 'Failed to generate press release';
    }
}

async function Newsletter({ organizationName, event, tone, language, outputCount }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert in crafting engaging newsletters. Write a well-structured and appealing newsletter in ${language} with a ${tone} tone. The newsletter should effectively communicate the key points and engage the readers.`
                    },
                    {
                        role: 'user',
                        content: `Organization: "${organizationName}"\nEvent: "${event}".\nCreate a newsletter that highlights the event and provides relevant information to the subscribers.`
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            let generatedNewsletter = completion.choices[0].message.content.trim();

            responses.push(generatedNewsletter);
        }
        return responses;
    } catch (error) {
        console.error('Error generating newsletter:', error);
        return 'Failed to generate newsletter';
    }
}


async function GoogleAdsHeadline({ serviceName, keywordsAndHighlights, tone, adPurpose, businessType, language, outputCount }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert in creating compelling Google Ads headlines. Generate catchy and effective headlines in ${language} with a ${tone} tone. The headlines should be tailored for ${businessType} and align with the ad purpose: ${adPurpose}.`
                    },
                    {
                        role: 'user',
                        content: `Service: "${serviceName}"\nKeywords and Highlights: "${keywordsAndHighlights.join(', ')}"\nAd Purpose: ${adPurpose}\nBusiness Type: ${businessType}`
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            let generatedHeadlines = completion.choices[0].message.content.trim();

            responses.push(generatedHeadlines);
        }
        return responses;
    } catch (error) {
        console.error('Error generating Google Ads headlines:', error);
        return 'Failed to generate Google Ads headlines';
    }
}


async function GoogleAdDescription({ serviceName, keywordsAndHighlights, tone, adPurpose, businessType, language, outputCount }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert in creating compelling Google Ad Description. Generate catchy and effective Description in ${language} with a ${tone} tone. The Description should be tailored for ${businessType} and align with the ad purpose: ${adPurpose}.`
                    },
                    {
                        role: 'user',
                        content: `Service: "${serviceName}"\nKeywords and Highlights: "${keywordsAndHighlights.join(', ')}"\nAd Purpose: ${adPurpose}\nBusiness Type: ${businessType}`
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            let generatedDescription = completion.choices[0].message.content.trim();

            responses.push(generatedDescription);
        }
        return responses;
    } catch (error) {
        console.error('Error generating Google Ads Description:', error);
        return 'Failed to generate Google Ads Description';
    }
}

async function MarketingPlan({ describeBusiness, goal, objective, tone, language, outputCount }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are a marketing expert. Generate a comprehensive marketing plan in ${language} with a ${tone} tone. The plan should be well-structured and tailored to achieve the stated goal and objective for the described business.`
                    },
                    {
                        role: 'user',
                        content: `
                            Business Description: "${describeBusiness}"
                            Goal: "${goal}"
                            Objective: "${objective}"
                        `
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            let generatedMarketingPlan = completion.choices[0].message.content.trim();

            responses.push(generatedMarketingPlan);
        }
        return responses;
    } catch (error) {
        console.error('Error generating marketing plan:', error);
        return 'Failed to generate marketing plan';
    }
}

async function MarketingFunnel({ productOrService, targetAudience, budget, goal, tone, language, outputCount }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are a marketing strategist. Generate a detailed marketing funnel in ${language} with a ${tone} tone. The funnel should be designed to effectively guide the target audience through the stages of awareness, consideration, and conversion, given the product or service and budget constraints.`
                    },
                    {
                        role: 'user',
                        content: `
                            Product/Service: "${productOrService}"
                            Target Audience: "${targetAudience}"
                            Budget: "${budget}"
                            Goal: "${goal}"
                        `
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            let generatedFunnel = completion.choices[0].message.content.trim();

            responses.push(generatedFunnel);
        }
        return responses;
    } catch (error) {
        console.error('Error generating marketing funnel:', error);
        return 'Failed to generate marketing funnel';
    }
}


async function ProductDescription({ description, tone, language, outputCount }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are a product description specialist. Generate a compelling and engaging product description in ${language} with a ${tone} tone. The description should highlight the key features and benefits of the product effectively.`
                    },
                    {
                        role: 'user',
                        content: `Product Details: "${description}"`
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            let generatedDescription = completion.choices[0].message.content.trim();

            responses.push(generatedDescription);
        }
        return responses;
    } catch (error) {
        console.error('Error generating product description:', error);
        return 'Failed to generate product description';
    }
}


async function ArticleIdeas({ topic, tone, language, outputCount }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are a creative content strategist. Generate unique and engaging article ideas in ${language} with a ${tone} tone. The ideas should be fresh, relevant to the topic, and suitable for a wide audience.`
                    },
                    {
                        role: 'user',
                        content: `Topic: "${topic}"`
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            let generatedIdeas = completion.choices[0].message.content.trim();

            responses.push(generatedIdeas);
        }
        return responses;
    } catch (error) {
        console.error('Error generating article ideas:', error);
        return 'Failed to generate article ideas';
    }
}


async function ArticleOutline({ topic, tone, language, outputCount }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert content strategist. Generate a detailed and structured article outline in ${language} with a ${tone} tone. The outline should cover key points, subheadings, and flow logically to create a comprehensive article on the given topic.`
                    },
                    {
                        role: 'user',
                        content: `Topic: "${topic}"`
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            let generatedOutline = completion.choices[0].message.content.trim();

            responses.push(generatedOutline);
        }
        return responses;
    } catch (error) {
        console.error('Error generating Article Outline:', error);
        return 'Failed to generate Article Outline';
    }
}


async function ArticleIntro({ topic, tone, language, outputCount }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert content strategist. Generate a detailed and structured Article Intro in ${language} with a ${tone} tone. The Intro should cover key points, subheadings, and flow logically to create a comprehensive article on the given topic.`
                    },
                    {
                        role: 'user',
                        content: `Topic: "${topic}"`
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            let generatedOutline = completion.choices[0].message.content.trim();

            responses.push(generatedOutline);
        }
        return responses;
    } catch (error) {
        console.error('Error generating Article Intro:', error);
        return 'Failed to generate Article Intro';
    }
}


async function BlogIdeas({ topic, language, outputCount }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are a creative content strategist. Generate unique and engaging blog post ideas in ${language}. The ideas should be fresh, relevant to the topic, and suitable for a wide audience.`
                    },
                    {
                        role: 'user',
                        content: `Topic: "${topic}"`
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            let generatedIdeas = completion.choices[0].message.content.trim();

            responses.push(generatedIdeas);
        }
        return responses;
    } catch (error) {
        console.error('Error generating blog ideas:', error);
        return 'Failed to generate blog ideas';
    }
}


async function BlogTitles({ topic, tone, language, outputCount }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are a creative content strategist. Generate catchy and compelling blog titles in ${language} with a ${tone} tone. The titles should be relevant to the topic and designed to capture the reader's attention.`
                    },
                    {
                        role: 'user',
                        content: `Topic: "${topic}"`
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            let generatedTitles = completion.choices[0].message.content.trim();

            responses.push(generatedTitles);
        }
        return responses;
    } catch (error) {
        console.error('Error generating blog titles:', error);
        return 'Failed to generate blog titles';
    }
}

async function BlogOutline({ topic, mainPointsForIntro, tone, language, outputCount }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const introPointsText = mainPointsForIntro ? ` The introduction should cover the following points: "${mainPointsForIntro}".` : '';

            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are an experienced content strategist. Generate a well-structured blog outline in ${language} with a ${tone} tone. The outline should cover key points, subheadings, and flow logically to create a comprehensive blog post on the given topic.${introPointsText}`
                    },
                    {
                        role: 'user',
                        content: `Topic: "${topic}"`
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            let generatedOutline = completion.choices[0].message.content.trim();

            responses.push(generatedOutline);
        }
        return responses;
    } catch (error) {
        console.error('Error generating blog outline:', error);
        return 'Failed to generate blog outline';
    }
}


async function BlogIntro({ topic, mainPointsForIntro, tone, language, outputCount }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const introPointsText = mainPointsForIntro ? ` The introduction should cover the following points: "${mainPointsForIntro}".` : '';

            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are an experienced content strategist. Generate a well-structured blog intro in ${language} with a ${tone} tone. The intro should cover key points, subheadings, and flow logically to create a comprehensive blog post on the given topic.${introPointsText}`
                    },
                    {
                        role: 'user',
                        content: `Topic: "${topic}"`
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            let generatedOutline = completion.choices[0].message.content.trim();

            responses.push(generatedOutline);
        }
        return responses;
    } catch (error) {
        console.error('Error generating blog intro:', error);
        return 'Failed to generate blog intro';
    }
}

async function SEOTitleDescription({ companyName, description, fewKeywords, tone, language, outputCount }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert in SEO and content creation. Generate an SEO-optimized title and meta description for a company in ${language} with a ${tone} tone. The title and description should include the provided keywords and effectively represent the company's offerings.`
                    },
                    {
                        role: 'user',
                        content: `
                            Company Name: "${companyName}"
                            Description: "${description}"
                            Keywords: "${fewKeywords.join(', ')}"
                        `
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            let generatedTitleDescription = completion.choices[0].message.content.trim();

            responses.push(generatedTitleDescription);
        }
        return responses;
    } catch (error) {
        console.error('Error generating SEO title and description:', error);
        return 'Failed to generate SEO title and description';
    }
}

async function PromptGenerator({ context, purpose, tone, creativityLevel, language, outputCount }) {
    let responses = [];

    try {
        for (let i = 0; i < outputCount; i++) {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are a creative expert in generating prompts. Create a series of prompts that are innovative, engaging, and aligned with the specified context and purpose. The prompts should be written in ${language} with a ${tone} tone and match the creativity level of ${creativityLevel}.`
                    },
                    {
                        role: 'user',
                        content: `
                            Context: "${context}"
                            Purpose: "${purpose}"
                        `
                    }
                ],
                model: 'gpt-4'
            });

            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new Error('Invalid completion response');
            }

            let generatedPrompt = completion.choices[0].message.content.trim();

            responses.push(generatedPrompt);
        }
        return responses;
    } catch (error) {
        console.error('Error generating prompt:', error);
        return 'Failed to generate prompt';
    }
}



module.exports = { generateCaption,generateInstagramBio,generateInstagramStory,generateReelPost, generateThreadsPost, generateFacebookPost, generateFacebookAdHeadline, generateFacebookBio,generateFacebookGroupPost,generateFacebookGroupDescription,FacebookPageDescription,YouTubePostTitle,YouTubePostDescription,TwitterBio,TwitterPost,TwitterThreadsPost,TwitterThreadsBio,LinkedInPageHeadline,LinkedinCompanyPageHeadline,LinkedInPageSummary,LinkedInCompanySummary,PostHashtags,BlogPost,ArticleGenerator,PressRelease,Newsletter,GoogleAdsHeadline,GoogleAdDescription,MarketingPlan,MarketingFunnel,ProductDescription,ArticleIdeas,ArticleOutline,ArticleIntro,BlogIdeas,BlogTitles,BlogOutline,BlogIntro,SEOTitleDescription,PromptGenerator};
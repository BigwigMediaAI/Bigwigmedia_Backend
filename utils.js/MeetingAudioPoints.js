const fs = require('fs');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const FormData = require('form-data');
const axios = require('axios');
const { OpenAI } = require('openai');

// Set up FFmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

// Initialize OpenAI client
const openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Function to convert audio to MP3 using FFmpeg
function convertMP3(audioPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(audioPath)
            .toFormat('mp3')
            .on('end', () => resolve(outputPath))
            .on('error', (err) => reject(err))
            .save(outputPath);
    });
}

// Function to transcribe audio to text using OpenAI API
async function transcribeAudioMeeting(audioPath, language, apiKey) {
    const mp3Path = `uploads/${Date.now()}_converted.mp3`; // Path for the converted MP3 file

    // Convert audio to MP3 if not already in MP3 format
    await convertMP3(audioPath, mp3Path);

    const formData = new FormData();
    formData.append('file', fs.createReadStream(mp3Path));
    formData.append('model', 'whisper-1'); // Ensure the model name is correct
    formData.append('language', language); // Set the language for transcription

    try {
        const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                ...formData.getHeaders(),
            },
        });
        return response.data.text; // Return the transcribed text
    } catch (error) {
        throw new Error(`Transcription failed: ${error.response?.data?.error?.message || error.message}`);
    } finally {
        // Clean up the temporary MP3 file
        fs.unlinkSync(mp3Path);
    }
}

// Function to convert text to bullet points using GPT-4
async function convertToBulletPoints(text) {
    const prompt = `Convert the following text into attractive and informative bullet points that highlight the key points and topics discussed in the meeting. Each point should be concise and useful for someone to understand the meeting content quickly:${text}`;

    try {
        const response = await openaiClient.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 150,
            n: 1,
            temperature: 0.7,
        });

        const bulletPoints = response.choices[0].message.content.trim();
        return bulletPoints;
    } catch (error) {
        throw new Error(`Failed to convert text to bullet points: ${error.response?.data?.error?.message || error.message}`);
    }
}

module.exports = {
    convertMP3,
    transcribeAudioMeeting,
    convertToBulletPoints,
};

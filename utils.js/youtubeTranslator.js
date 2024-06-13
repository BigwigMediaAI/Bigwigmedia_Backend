
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const ytdl = require('ytdl-core');
const OpenAIApi = require('openai');

ffmpeg.setFfmpegPath(ffmpegPath);
require('dotenv').config();


const openai = new OpenAIApi({
    apiKey: process.env.OPENAI_API_KEY,
});

const uploadDir = path.resolve(__dirname, 'uploads');
// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Function to download video and audio separately and merge them
async function ytdldownloadAndMerge(url, outputPath) {
    console.log('Validating YouTube URL...');
    if (!ytdl.validateURL(url)) {
        throw new Error('Invalid YouTube URL');
    }

    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;
    const sanitizedTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const videoPath = path.resolve(outputPath, `${sanitizedTitle}_video.mp4`);
    const audioPath = path.resolve(outputPath, `${sanitizedTitle}_audio.mp4`);
    const outputPathFinal = path.resolve(outputPath, `${sanitizedTitle}.mp4`);

    console.log('Downloading video and audio...');
    // Download video
    const videoStream = ytdl(url, { filter: 'videoonly', quality: 'highestvideo' });
    const audioStream = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' });

    // Save video and audio to files
    const videoPromise = new Promise((resolve, reject) => {
        videoStream.pipe(fs.createWriteStream(videoPath))
            .on('finish', resolve)
            .on('error', reject);
    });

    const audioPromise = new Promise((resolve, reject) => {
        audioStream.pipe(fs.createWriteStream(audioPath))
            .on('finish', resolve)
            .on('error', reject);
    });

    await Promise.all([videoPromise, audioPromise]);

    console.log('Merging video and audio...');
    // Merge video and audio using FFmpeg
    await new Promise((resolve, reject) => {
        ffmpeg()
            .input(videoPath)
            .input(audioPath)
            .outputOptions('-c:v copy')
            .outputOptions('-c:a aac')
            .save(outputPathFinal)
            .on('end', () => {
                // Clean up the individual files
                fs.unlinkSync(videoPath);
                fs.unlinkSync(audioPath);
                resolve();
            })
            .on('error', reject);
    });

    return outputPathFinal;
}

async function ytdlextractAndConvertToMP3(videoPath, outputPath) {
    console.log('Extracting and converting to MP3...');
    return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .output(outputPath)
            .on('end', () => resolve(outputPath))
            .on('error', (err) => reject(err))
            .run();
    });
}

async function ytdltranscribeAudio(audioPath) {
    console.log('Transcribing audio...');
    const formData = new FormData();
    formData.append('file', fs.createReadStream(audioPath));
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');

    try {
        const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                ...formData.getHeaders(),
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(`Transcription failed: ${error.response.data.error.message}`);
    }
}

async function ytdltranslateText(text, targetLanguage) {
    console.log('Translating text...');
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that translates text."
                },
                {
                    role: "user",
                    content: `Translate the following text to ${targetLanguage}:\n\n${text}`
                }
            ],
            max_tokens: 1000,
        });
        return response.choices[0].message.content.trim();
    } catch (error) {
        throw new Error(`Translation failed: ${error.message}`);
    }
}

async function ytdltextToSpeech(text, tone) {
    console.log('Converting text to speech...');
    try {
        const mp3 = await openai.audio.speech.create({
            model: 'tts-1',
            voice: tone,
            input: text,
        });
        const arrayBuffer = await mp3.arrayBuffer();
        const filePath = path.resolve(uploadDir, `${Date.now()}_output.mp3`);
        fs.writeFileSync(filePath, Buffer.from(arrayBuffer));
        return filePath;
    } catch (error) {
        throw new Error(`Text to speech conversion failed: ${error.message}`);
    }
}

async function ytdlmergeAudioWithVideo(videoPath, audioPath, outputPath) {
    console.log('Merging audio with video...');
    return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .input(audioPath)
            .outputOptions([
                '-c:v copy',
                '-c:a aac',
                '-map 0:v:0',
                '-map 1:a:0',
                '-shortest' // Ensure the output duration matches the shortest input
            ])
            .save(outputPath)
            .on('end', () => resolve(outputPath))
            .on('error', (err) => reject(err));
    });
}


module.exports={ytdldownloadAndMerge,ytdlextractAndConvertToMP3,ytdltranscribeAudio,ytdltranslateText,ytdltextToSpeech,ytdlmergeAudioWithVideo}
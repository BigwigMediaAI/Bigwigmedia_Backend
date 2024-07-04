const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');

// Set the path to the FFmpeg binary
ffmpeg.setFfmpegPath(ffmpegPath);

// Function to download video and audio separately and merge them
async function downloadAndMerge(url, outputPath) {
    if (!ytdl.validateURL(url)) {
        throw new Error('Invalid YouTube URL');
    }

    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;
    const sanitizedTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const videoPath = path.resolve(outputPath, `${sanitizedTitle}_video.mp4`);
    const audioPath = path.resolve(outputPath, `${sanitizedTitle}_audio.mp4`);
    const outputPathFinal = path.resolve(outputPath, `${sanitizedTitle}.mp4`);

    // Download video
    const videoStream = ytdl(url, { filter: 'videoonly', quality: '248' });
    const audioStream = ytdl(url, { filter: 'audioonly', quality: 'highest' });

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

module.exports = downloadAndMerge

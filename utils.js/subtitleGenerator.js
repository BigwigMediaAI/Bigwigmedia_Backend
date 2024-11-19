const OPENAI = require('openai');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);
require('dotenv').config();
const key = process.env.OPENAI_API_KEY;
const openaiClient = new OPENAI({ apiKey: process.env.VITE_OPEN_API_KEY_AUDIO });


// Transcribe audio to text using Whisper API
async function transcribeTheAudio(audioPath) {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(audioPath));
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');
  
    try {
      const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
        headers: {
          Authorization: `Bearer ${key}`,
          ...formData.getHeaders(),
        },
      });
      return response.data.text;
    } catch (error) {
      throw new Error(`Transcription failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }
  
  
  
  function generateSubtitles(transcription, subtitlePath, videoDuration) {
    return new Promise((resolve, reject) => {
      const words = transcription.split(' ');
      const wordsPerLine = 8; // Number of words per subtitle line
      const totalLines = Math.ceil(words.length / wordsPerLine);
      const durationPerLine = videoDuration / totalLines;
  
      const subtitles = [];
      for (let i = 0; i < totalLines; i++) {
        const start = i * durationPerLine;
        const end = start + durationPerLine;
  
        const startTime = formatTime(start);
        const endTime = formatTime(end);
  
        const line = words.slice(i * wordsPerLine, (i + 1) * wordsPerLine).join(' ');
  
        subtitles.push(`${i + 1}\n${startTime} --> ${endTime}\n${line}\n`);
      }
      fs.writeFile(subtitlePath, subtitles.join('\n'), (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
  
  
  // Add subtitles to the video
  function addSubtitlesToVideo(videoPath, subtitlePath, outputVideoPath) {
    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .outputOptions('-vf', `subtitles=${subtitlePath.replace(/\\/g, '/')}`) // Use escaped path
        .output(outputVideoPath)
        .on('end', resolve)
        .on('error', reject)
        .run();
    });
  }
  
  // Helper function to get video duration
  function getVideoDuration(videoPath) {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(videoPath, (err, metadata) => {
        if (err) return reject(err);
        resolve(metadata.format.duration); // Duration in seconds
      });
    });
  }
  
  // Extract audio from video
  function extractAudio(videoPath, audioPath) {
    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .output(audioPath)
        .on('end', resolve)
        .on('error', reject)
        .run();
    });
  }

  // Format time in HH:MM:SS,mmm format for SRT
function formatTime(seconds) {
    const date = new Date(seconds * 1000);
    const hh = String(date.getUTCHours()).padStart(2, '0');
    const mm = String(date.getUTCMinutes()).padStart(2, '0');
    const ss = String(date.getUTCSeconds()).padStart(2, '0');
    const ms = String(date.getUTCMilliseconds()).padStart(3, '0');
    return `${hh}:${mm}:${ss},${ms}`;
  }
  
  
  
module.exports={ transcribeTheAudio, generateSubtitles, addSubtitlesToVideo, getVideoDuration, extractAudio}  
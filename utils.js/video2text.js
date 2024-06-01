const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);

require("dotenv").config();

const key = process.env.VITE_OPEN_API_KEY_AUDIO;

const MAX_SIZE = 100 * 1024 * 1024; // 100MB

// Utility function to extract audio from video and convert to MP3
function extractAndConvertToMP3(videoPath, outputPath) {
    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', err => reject(err))
        .run();
    });
  }

// Utility function to transcribe audio using OpenAI API
async function transcribeAudio(audioPath) {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(audioPath));
    formData.append('model', 'whisper-1'); // Adjust the model name as needed
  
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/audio/transcriptions',
        formData,
        {
          headers: {
            Authorization: `Bearer ${key}`,
            ...formData.getHeaders(),
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Transcription failed: ${error.response.data.error.message}`);
    }
  }

module.exports = {
  MAX_SIZE,
  extractAndConvertToMP3,
  transcribeAudio,
};
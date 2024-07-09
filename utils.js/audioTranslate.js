const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const OPENAI = require('openai');
require('dotenv').config();
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegPath);

const openaiClient = new OPENAI({ apiKey: process.env.VITE_OPEN_API_KEY_AUDIO });
const key = process.env.VITE_OPEN_API_KEY_AUDIO;

// Step 1: Convert audio to MP3 using FFmpeg
function convertMP3(audioPath, outputPath) {
    return new Promise((resolve, reject) => {
      ffmpeg(audioPath)
        .toFormat('mp3')
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err))
        .save(outputPath);
    });
  }
  
  // Step 2: Convert audio to text using OpenAI API
  async function transcribeaudio(audioPath) {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(audioPath));
    formData.append('model', 'whisper-1'); // Adjust the model name as needed
    formData.append('language', 'en'); // Ensure transcription is done in English
  
    try {
      const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
        headers: {
          Authorization: `Bearer ${key}`,
          ...formData.getHeaders(),
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Transcription failed: ${error.response.data.error.message}`);
    }
  }
  
  // Step 3: Translate text using OpenAI GPT-4 model
  async function translatetext(text, targetLanguage) {
    try {
      const response = await openaiClient.chat.completions.create({
        model: "gpt-4o",
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
  
  // Step 4: Convert text to audio using OpenAI TTS-1 model
  async function textTospeech(text, tone) {
    try {
      const mp3 = await openaiClient.audio.speech.create({
        model: 'tts-1',
        voice: tone,
        input: text,
      });
      const arrayBuffer = await mp3.arrayBuffer();
      const filePath = `uploads/${Date.now()}_output.mp3`;
      fs.writeFileSync(filePath, Buffer.from(arrayBuffer));
      return filePath;
    } catch (error) {
      throw new Error(`Text to speech conversion failed: ${error.message}`);
    }
  }
  

  module.exports = {convertMP3, transcribeaudio, translatetext, textTospeech };
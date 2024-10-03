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
function convertToAudio(audioPath, outputPath) {
    return new Promise((resolve, reject) => {
      ffmpeg(audioPath)
        .toFormat('mp3')
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err))
        .save(outputPath);
    });
  }
  
  // Step 2: Convert audio to text using OpenAI Whisper API
  async function transcribeToaudio(audioPath) {
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
      throw new Error(`Transcription failed: ${error.response.data.error.message}`);
    }
  }
  
  // Step 3: Rephrase text using OpenAI GPT-4
  async function rephrasetext(text) {
    try {
      const response = await openaiClient.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that rephrases text while keeping the original meaning."
          },
          {
            role: "user",
            content: `Rephrase the following text:\n\n${text}`
          }
        ],
        max_tokens: 1000,
      });
      return response.choices[0].message.content.trim();
    } catch (error) {
      throw new Error(`Rephrasing failed: ${error.message}`);
    }
  }
  
  // Step 4: Convert rephrased text to audio using OpenAI TTS
  async function textToVoice(text, tone) {
    try {
      const mp3 = await openaiClient.audio.speech.create({
        model: 'tts-1',
        voice: tone, // Voice tone for TTS
        input: text,
      });
      const arrayBuffer = await mp3.arrayBuffer();
      return Buffer.from(arrayBuffer); // Return audio as Buffer
    } catch (error) {
      throw new Error(`Text to speech conversion failed: ${error.message}`);
    }
  }

  module.exports = {convertToAudio, transcribeToaudio, rephrasetext,textToVoice};
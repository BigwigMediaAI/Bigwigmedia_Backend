
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const OpenAIApi = require('openai');

ffmpeg.setFfmpegPath(ffmpegPath);
require('dotenv').config();


const openai = new OpenAIApi({
  apiKey: process.env.OPENAI_API_KEY,
});


async function extractConvertToMP3(videoPath, outputPath) {
    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err))
        .run();
    });
  }
  
  async function transcribe_Audio(audioPath) {
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
  
  async function translateTheText(text, targetLanguage) {
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
  
  async function text_To_Speech(text, tone) {
    try {
      const mp3 = await openai.audio.speech.create({
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
  
  async function merge_Audio_With_Video(videoPath, audioPath, outputPath) {
    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .input(audioPath)
        .outputOptions([
          '-c:v copy',
          '-c:a aac',
          '-map 0:v:0',
          '-map 1:a:0',
          '-shortest'
        ])
        .save(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err));
    });
  }


  module.exports={extractConvertToMP3,transcribe_Audio,translateTheText,text_To_Speech,merge_Audio_With_Video}
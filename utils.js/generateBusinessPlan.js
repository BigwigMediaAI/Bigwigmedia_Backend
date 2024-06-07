const openAI = require('openai');
require('dotenv').config();

const openai = new openAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateBusinessPlan(businessType, industry, targetMarket) {
  const prompt = `
  Create a detailed business plan for a ${businessType} in the ${industry} industry targeting ${targetMarket}. Include sections on:
  1. Executive Summary
  2. Company Description
  3. Market Analysis
  4. Organization and Management
  5. Service or Product Line
  6. Marketing and Sales
  7. Funding Request
  8. Financial Projections
  9. Appendix
  `;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a business plan expert. Your goal is to generate comprehensive and detailed business plans based on the given business type, industry, and target market."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    model: "gpt-4"
  });

  const businessPlan = completion.choices[0].message.content.trim();
  return businessPlan;
}

module.exports = generateBusinessPlan;
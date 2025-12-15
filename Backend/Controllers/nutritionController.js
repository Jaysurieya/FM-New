const axios = require('axios');

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

async function callGeminiWithRetry(prompt, apiKey, maxRetries = 3) {
  let attempt = 0;
  let delayMs = 1000;
  while (attempt <= maxRetries) {
    try {
      const { data } = await axios.post(
        `${GEMINI_URL}?key=${apiKey}`,
        { contents: [{ parts: [{ text: prompt }] }] },
        { headers: { 'Content-Type': 'application/json' } }
      );
      return data;
    } catch (err) {
      const status = err.response?.status;
      if (status === 429 && attempt < maxRetries) {
        await new Promise((res) => setTimeout(res, delayMs));
        delayMs *= 2;
        attempt += 1;
        continue;
      }
      throw err;
    }
  }
}

function buildPrompt(foodName) {
  return `Give nutritional values for a standard serving of ${foodName}.
Return ONLY valid JSON in this format:
{
  "protein": number,
  "fats": number,
  "carbs": number,
  "fibre": number,
  "calories": number
}
Values in grams, calories in kcal.`;
}

function extractJSONFromCandidates(data) {
  const candidates = data?.candidates || [];
  if (!candidates.length) throw new Error('No candidates returned from Gemini');
  const parts = candidates[0]?.content?.parts || [];
  const rawText = parts.map((p) => p.text).join(' ');
  const match = rawText.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON found in Gemini response');
  return JSON.parse(match[0]);
}

exports.getNutrition = async (req, res) => {
  try {
    const { foodName } = req.body;
    if (!foodName || typeof foodName !== 'string') {
      return res.status(400).json({ error: 'foodName is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
    }

    const prompt = buildPrompt(foodName);
    const data = await callGeminiWithRetry(prompt, apiKey, 3);
    const nutrition = extractJSONFromCandidates(data);

    return res.json({ nutrition });
  } catch (err) {
    const status = err.response?.status || 500;
    const message = err.response?.data || err.message || 'Unknown error';
    return res.status(status === 429 ? 429 : 500).json({ error: message });
  }
};

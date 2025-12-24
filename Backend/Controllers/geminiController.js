const axios = require('axios');



// Helper: build prompt.messages from incoming payload (supports `contents` or `messages` shapes)
function buildPromptMessages(payload) {
  const out = [];

  // If frontend sends `contents` (legacy front shape), each item has { role, parts: [{ text }] }
  if (Array.isArray(payload?.contents)) {
    for (const item of payload.contents) {
      const author = item.role === 'model' ? 'assistant' : (item.role === 'system' ? 'system' : 'user');
      const texts = [];
      if (Array.isArray(item.parts)) {
        for (const p of item.parts) {
          if (typeof p === 'string') texts.push(p);
          else if (p && typeof p.text === 'string') texts.push(p.text);
        }
      }
      if (texts.length) {
        out.push({ author, content: texts.map(t => ({ type: 'text', text: t })) });
      }
    }
  }

  // Support direct `messages` array with { role, text }
  if (Array.isArray(payload?.messages)) {
    for (const m of payload.messages) {
      const author = m.role === 'model' ? 'assistant' : (m.role === 'system' ? 'system' : 'user');
      const text = typeof m.text === 'string' ? m.text : (m.content || '');
      if (text) out.push({ author, content: [{ type: 'text', text }] });
    }
  }

  // If neither were provided, but there is a `text` top-level field, add it as user
  if (!out.length && typeof payload?.text === 'string') {
    out.push({ author: 'user', content: [{ type: 'text', text: payload.text }] });
  }

  return out;
}

function extractTextFromResponse(data) {
  if (!data) return '';

  // Generic recursive collector
  const texts = [];
  const collect = (node) => {
    if (node == null) return;
    if (Array.isArray(node)) return node.forEach(collect);
    if (typeof node === 'string') return texts.push(node);
    if (typeof node === 'object') {
      if (typeof node.text === 'string') texts.push(node.text);
      // some responses use `type: 'output_text'` with `text`
      if (node.type === 'output_text' && typeof node.text === 'string') texts.push(node.text);
      // parts or content fields
      if (node.parts) collect(node.parts);
      if (node.content) collect(node.content);
      // For candidate -> message -> content structure
      if (node.message) collect(node.message);
    }
  };

  // Check known candidate locations
  const candidates = data?.candidates || data?.output?.candidates || data?.candidatesList || [];
  if (candidates.length) {
    for (const c of candidates) {
      collect(c.content || c.output || c);
      if (texts.length) return texts.join(' ');
    }
  }

  // older/simpler reply fields
  if (typeof data.reply === 'string') return data.reply;

  // Some responses are under output[0].content
  if (Array.isArray(data?.output)) {
    collect(data.output[0]);
    if (texts.length) return texts.join(' ');
  }

  // last resort: stringify
  try { return JSON.stringify(data); } catch (e) { return String(data); }
}

// Proxy POST /chat -> call Gemini API server-side using configured model/key
exports.postGeminiChat = async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });

    const payload = req.body;
    if (!payload) return res.status(400).json({ error: 'Missing payload' });

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateMessage?key=${apiKey}`;

    // Build prompt.messages in the shape expected by the Generative Language API
    const messages = buildPromptMessages(payload);
    if (!messages.length) {
      return res.status(400).json({ error: 'No messages provided in payload' });
    }

    const apiBody = {
      prompt: {
        messages,
      },
      temperature: typeof payload.temperature === 'number' ? payload.temperature : 0.2,
      candidateCount: 1,
    };

    const { data } = await axios.post(apiUrl, apiBody, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
    });

    const text = extractTextFromResponse(data);
    return res.json({ reply: text, raw: data });
  } catch (err) {
    console.error('❌ Gemini proxy error:', err?.response?.data || err.message || err);
    const status = err.response?.status || 500;
    const body = err.response?.data || { message: err.message };
    return res.status(status).json({ error: body });
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'GROQ_API_KEY is not configured on Vercel.' });
    }

    const userCountry = req.headers['x-vercel-ip-country'] || 'Unknown Country';
    const userCity = req.headers['x-vercel-ip-city'] || 'Unknown City';

    const systemInstruction = `You are a world-class AI Film Director & Chatbot named "AI Director Assistant", behaving exactly like Google Gemini.

    LOCATION CONTEXT: Country: "${userCountry}", City: "${userCity}".

    RULES:
    1. INSTANT EXECUTION: If asked for a script or story, generate it immediately in clean Markdown without extra questions.
    2. CONVERSATIONAL CHAT: If user is chatting, respond as a friendly Director in natural Roman Urdu/Hinglish.
    3. STREAMING OUTPUT: Output clean, continuous text for live rendering.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2048,
        stream: true
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      return res.status(response.status).json({ error: errData.error?.message || 'Groq API Error' });
    }

    // Set headers for Server-Sent Events (Streaming)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      res.write(chunk);
    }

    res.end();

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

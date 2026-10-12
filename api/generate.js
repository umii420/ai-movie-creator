export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, model } = req.body;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GROQ_API_KEY is not configured on Vercel.' });
    }

    // Auto-Detect Visitor Location from Vercel Request Headers
    const userCountry = req.headers['x-vercel-ip-country'] || 'Unknown Country';
    const userCity = req.headers['x-vercel-ip-city'] || 'Unknown City';

    // System Prompt for Exact Gemini-Style AI Director
    const systemInstruction = `You are a highly intelligent AI Film Director and assistant, behaving exactly like Google Gemini.

    LOCATION CONTEXT:
    User is from Country: "${userCountry}", City: "${userCity}".

    CORE BEHAVIOR RULES (GEMINI STYLE):
    1. INSTANT EXECUTION FOR REQUESTS: If the user explicitly asks for a script, scene, story, or content (e.g., "script do", "kahani likho", "write a movie scene"), IMMEDIATELY generate a complete, rich, cinematic script in beautiful Markdown format. DO NOT ask clarifying questions or delay the response.
    2. CONVERSATIONAL FOR CHAT: If the user is just saying hello, asking questions, or discussing ideas, respond as a friendly, creative Director in natural Roman Urdu / Hinglish (or their local language).
    3. NO REFUSAL OR EXTRA QUESTIONS: Never make the user wait by asking "which genre do you want?" when they ask for a script. Pick a compelling concept automatically and deliver the full script directly.
    4. SCRIPT FORMATTING: Use bold character names, scene headings, and clean Markdown text that renders cleanly.`;

    const selectedModel = 'openai/gpt-oss-120b';

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2048
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Groq API Error' });
    }

    const aiScript = data.choices[0]?.message?.content || '';
    return res.status(200).json({ script: aiScript, detectedCountry: userCountry });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

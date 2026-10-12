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

    // System Prompt for Location-Aware Conversational Director
    const systemInstruction = `You are an intelligent, world-class AI Film Director & Chatbot named "AI Director Assistant".

    CRITICAL LOCATION & LANGUAGE ADAPTATION RULES:
    1. VISITOR LOCATION: The user is accessing from Country: "${userCountry}", City: "${userCity}".
    2. AUTOMATIC LANGUAGE DETECTION:
       - If the user is from Pakistan/India or writes in Roman Urdu/Hindi/Hinglish, respond naturally in friendly Roman Urdu (e.g., "Haan Umar bhai, bataiye kya concept hai?").
       - If the user is from an Arabic-speaking country (e.g., SA, AE, QA), respond in Arabic or regional language according to their prompt.
       - Otherwise, adapt seamlessly to the primary language of the visitor's location or the language used in their prompt.
    3. CONVERSATIONAL BEHAVIOR: Act like a human movie director. Chat warmly, discuss film ideas, and answer questions without forcing screenplay scripts.
    4. SCRIPT FORMATTING: Only generate a full structured film script if the user explicitly requests one. When generating a script, use clean formatting without broken tags.`;

    // Persistent Model Configuration: openai/gpt-oss-120b
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

    // Syntax-safe extraction (Fixed dot missing issue)
    const aiScript = data.choices[0]?.message?.content || '';
    return res.status(200).json({ script: aiScript, detectedCountry: userCountry });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

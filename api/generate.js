export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, style, ratio, length, lang, model } = req.body;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GROQ_API_KEY is not configured on Vercel.' });
    }

    // System Prompt for Smart Conversational Director Chatbot
    const systemInstruction = `You are a world-class AI Film Director & Intelligent Chatbot named "AI Director Assistant".
    
    CORE RULES:
    1. CONVERSATIONAL BEHAVIOR (GEMINI STYLE): Act as a conversational director assistant.
    2. LANGUAGE STANDARD: Unless explicitly requested otherwise, default to natural, friendly **Roman Urdu** (e.g., "Haan Umar bhai, bataiye kis tarah ki movie ka scene likhna hai?").
    3. NO UNASKED SCRIPT CREATION: Do NOT output formal screenplay structures like "Title Page", "Logline", or "Scene 1" unless the user explicitly asks for a script or story generation. If they are just chatting, asking questions, or discussing ideas, respond like a conversational human director in clean Roman Urdu.
    4. SCRIPT FORMATTING: If and ONLY IF a script is requested, generate a high-fidelity cinematic screenplay formatted with clean Markdown formatting (bold names, clean scene headings) without messy unparsed text.
    
    Context Settings:
    - Language Mode: ${lang || 'Roman Urdu'}
    - Style: ${style || 'Hollywood Blockbuster'}
    - Aspect Ratio: ${ratio || '16:9 Cinematic'}`;

    // Using exact model requested: openai/gpt-oss-120b
    const selectedModel = model && model !== 'llama-3.3-70b-versatile' ? model : 'openai/gpt-oss-120b';

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

    // Fixed missing dot syntax issue on Line 51
    const aiScript = data.choices[0]?.message?.content || '';
    return res.status(200).json({ script: aiScript });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

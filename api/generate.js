export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, style, ratio, length, lang, model } = req.body;

  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    return res.status(500).json({ error: 'Groq API Key is not configured on server.' });
  }

  const systemPrompt = `You are an expert film director. Style: ${style || 'Hollywood Blockbuster'}. Format: ${ratio || '16:9 Cinematic'}. Length: ${length || 'Detailed Multi-Scene Story'}. Write a professional cinematic script in ${lang || 'Roman Urdu'}. Include visual prompts, camera directions, and dialogues based on the user prompt.`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model || "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(response.status).json({ error: `Groq API Error: ${errorData}` });
    }

    const data = await response.json();
    const scriptText = data.choices?.[0]?.message?.content || "";

    return res.status(200).json({ script: scriptText });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

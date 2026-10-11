export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'GROQ_API_KEY environment variable is missing on Vercel.' });
    }

    try {
        const { prompt, style, ratio, length, lang } = req.body;

        const systemPrompt = `You are an expert film director. Style: ${style || 'Hollywood Blockbuster'}. Format: ${ratio || '16:9 Cinematic'}. Length: ${length || 'Detailed Multi-Scene Story'}. Write a professional cinematic script in ${lang || 'Roman Urdu'}. Include visual prompts, camera directions, and dialogues based on the user prompt.`;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey.trim()}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ 
                error: data.error?.message || `Groq API Error: ${response.status} ${response.statusText}` 
            });
        }

        const scriptText = data.choices?.[0]?.message?.content || '';
        return res.status(200).json({ script: scriptText });

    } catch (error) {
        return res.status(500).json({ error: "Server Catch Error: " + error.message });
    }
}

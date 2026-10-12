export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, imageBase64, lang } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'GROQ_API_KEY is not configured on Vercel.' });
    }

    const systemInstruction = `You are an AI Film Director. 
    Analyze the provided input (and image if uploaded). 
    If an image is uploaded, examine its visual elements (characters, background, emotions, color tone) and write a highly creative movie scene or script based on it in ${lang || 'Roman Urdu'}. 
    Be direct, engaging, and atmospheric in clean Markdown formatting.`;

    let messages = [{ role: 'system', content: systemInstruction }];

    // Handle Vision Input (Image + Text)
    if (imageBase64) {
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: prompt || 'Analyze this image and turn it into a cinematic movie scene script.' },
          { type: 'image_url', image_url: { url: imageBase64 } }
        ]
      });
    } else {
      messages.push({ role: 'user', content: prompt });
    }

    // Vision model for images, GPT-OSS/Llama for text
    const selectedModel = imageBase64 ? 'llama-3.2-11b-vision-preview' : 'openai/gpt-oss-120b';

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: messages,
        temperature: 0.7,
        max_tokens: 2048
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Groq Vision API Error' });
    }

    const aiScript = data.choices[0]?.message?.content || '';
    return res.status(200).json({ script: aiScript });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    const imageBase64 = typeof body.imageBase64 === 'string' ? body.imageBase64 : '';
    const allowedLanguages = ['English', 'Roman Urdu', 'Urdu'];
    const lang = allowedLanguages.includes(body.lang) ? body.lang : 'Roman Urdu';
    const allowedCategories = ['script', 'scene', 'image', 'Titan Shorts', 'Titan Video'];
    const category = allowedCategories.includes(body.category) ? body.category : 'script';
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'GROQ_API_KEY is not configured on Vercel.' });
    }

    if (prompt.length > 5000) {
      return res.status(413).json({ error: 'Your idea is too long. Please keep it under 5,000 characters.' });
    }

    if (imageBase64.length > 8 * 1024 * 1024) {
      return res.status(413).json({ error: 'Image is too large. Please use an image under 6 MB.' });
    }

    if (imageBase64 && !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/i.test(imageBase64)) {
      return res.status(400).json({ error: 'Please provide a valid PNG, JPG or WEBP image.' });
    }

    const safePrompt = prompt || 'Create a cinematic scene';
    const systemInstruction = `You are an AI Film Director.
Analyze the provided idea and image if supplied.
Create a useful, original movie script or scene in ${lang}.
The requested workflow is: ${category}.
Be direct, engaging, and atmospheric in clean Markdown formatting.`;

    const messages = [{ role: 'system', content: systemInstruction }];

    if (imageBase64) {
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: safePrompt },
          { type: 'image_url', image_url: { url: imageBase64 } }
        ]
      });
    } else {
      messages.push({ role: 'user', content: safePrompt });
    }

    const selectedModel = imageBase64
      ? 'llama-3.2-11b-vision-preview'
      : 'openai/gpt-oss-120b';

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    let response;
    try {
      response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: selectedModel,
          messages,
          temperature: 0.7,
          max_tokens: 2048
        }),
        signal: controller.signal
      });
    } finally {
      clearTimeout(timeout);
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || 'The AI provider could not complete this request.'
      });
    }

    const aiScript = data.choices?.[0]?.message?.content || '';
    if (!aiScript) {
      return res.status(502).json({ error: 'The AI provider returned an empty result. Please try again.' });
    }

    // Script generation is active; actual video rendering is not connected yet.
    return res.status(200).json({
      script: aiScript,
      videoUrl: null,
      videoGenerationAvailable: false
    });

  } catch (error) {
    if (error.name === 'AbortError') {
      return res.status(504).json({ error: 'AI generation took too long. Please try again.' });
    }
    console.error('TITAN generation error:', error);
    return res.status(500).json({ error: 'Something went wrong while generating your content.' });
  }
}

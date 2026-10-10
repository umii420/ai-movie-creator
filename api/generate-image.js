export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { prompt, apiKey } = req.body;

        if (!prompt || !apiKey) {
            return res.status(400).json({ error: 'Prompt and API Key required' });
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                instances: [{ prompt: prompt }],
                parameters: {
                    sampleCount: 1,
                    aspectRatio: "16:9",
                    outputOptions: { mimeType: "image/jpeg" }
                }
            })
        });

        const data = await response.json();

        if (data.predictions && data.predictions[0]?.bytesBase64Encoded) {
            const imageBase64 = `data:image/jpeg;base64,${data.predictions[0].bytesBase64Encoded}`;
            return res.status(200).json({ imageUrl: imageBase64 });
        } else {
            return res.status(500).json({ error: 'Gemini image generation failed', details: data });
        }

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
        }

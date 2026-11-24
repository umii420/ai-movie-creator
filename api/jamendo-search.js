// Server-side Jamendo catalog proxy. Keep the client ID in Vercel environment variables.
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const term = String(req.query?.q || "").trim().slice(0, 100);
  if (!term) return res.status(400).json({ error: "Enter a song, artist, or genre to search." });

  const clientId = process.env.JAMENDO_CLIENT_ID;
  if (!clientId) {
    return res.status(503).json({
      error: "Jamendo is not configured yet. Add JAMENDO_CLIENT_ID in the server environment."
    });
  }

  try {
    const url = new URL("https://api.jamendo.com/v3.0/tracks/");
    url.search = new URLSearchParams({
      client_id: clientId,
      format: "json",
      search: term,
      limit: "20",
      audioformat: "mp32",
      imagesize: "300",
      include: "licenses,musicinfo",
      type: "single albumtrack"
    }).toString();

    const upstream = await fetch(url, { headers: { Accept: "application/json" } });
    if (!upstream.ok) throw new Error("Jamendo catalog request failed");
    const payload = await upstream.json();
    if (payload?.headers?.status && payload.headers.status !== "success") {
      console.error("Jamendo API response:", payload.headers.code, payload.headers.error_message);
      return res.status(502).json({ error: "Jamendo API rejected the request. Check the application key and API plan." });
    }
    const tracks = Array.isArray(payload.results) ? payload.results : [];
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({
      tracks: tracks.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artist_name,
        album: track.album_name || "",
        image: track.album_image || track.image || "",
        audio: track.audio || "",
        duration: Number(track.duration) || 0,
        license: track.license_ccurl || "",
        licenses: track.licenses || null,
        musicinfo: track.musicinfo || null
      }))
    });
  } catch (error) {
    console.error("Jamendo search failed:", error.message);
    return res.status(502).json({ error: "Jamendo search is temporarily unavailable." });
  }
}

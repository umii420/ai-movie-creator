import crypto from "node:crypto";

function base64url(value) {
  return Buffer.from(value).toString("base64url");
}

function createDeveloperToken() {
  const teamId = process.env.APPLE_MUSIC_TEAM_ID;
  const keyId = process.env.APPLE_MUSIC_KEY_ID;
  const privateKey = (process.env.APPLE_MUSIC_PRIVATE_KEY || "").replace(/\\n/g, "\n");

  if (!teamId || !keyId || !privateKey) {
    throw new Error("Apple Music credentials are not configured");
  }

  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "ES256", kid: keyId }));
  const payload = base64url(JSON.stringify({
    iss: teamId,
    iat: now,
    exp: now + 30 * 60
  }));
  const unsignedToken = header + "." + payload;
  const signer = crypto.createSign("SHA256");
  signer.update(unsignedToken);
  signer.end();
  const signature = signer.sign({
    key: privateKey,
    dsaEncoding: "ieee-p1363"
  }).toString("base64url");

  return unsignedToken + "." + signature;
}

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const token = createDeveloperToken();
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ token });
  } catch (error) {
    console.error("Apple Music token unavailable:", error.message);
    return res.status(503).json({
      error: "Apple Music is not configured yet. Add the required server environment variables."
    });
  }
}

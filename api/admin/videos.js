import crypto from 'node:crypto';

const PROJECT_ID = 'titanai-3a3aa';
const ADMIN_EMAIL = 'umaralipakistan07@gmail.com';
const API_KEY = 'AIzaSyB1R9HB5diMfai85WBxqhi3Bcntmg0ZG3Y';

function b64url(value) {
  return Buffer.from(typeof value === 'string' ? value : JSON.stringify(value))
    .toString('base64').replace(/=/g, '').replace(/\\+/g, '-').replace(/\\//g, '_');
}
function serviceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT is not configured in Vercel.');
  return JSON.parse(raw);
}
async function accessToken(account) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url({ alg: 'RS256', typ: 'JWT' });
  const claim = b64url({
    iss: account.client_email,
    scope: 'https://www.googleapis.com/auth/datastore',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600
  });
  const unsigned = header + '.' + claim;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(unsigned);
  signer.end();
  const assertion = unsigned + '.' + signer.sign(account.private_key).toString('base64url');
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion
    })
  });
  const data = await response.json();
  if (!response.ok || !data.access_token) throw new Error('Google service authentication failed.');
  return data.access_token;
}
async function verifyAdmin(req) {
  const token = (req.headers.authorization || '').replace(/^Bearer\\s+/i, '');
  if (!token) return false;
  const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' + API_KEY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken: token })
  });
  const data = await response.json();
  const user = data.users && data.users[0];
  return !!user && user.emailVerified === true &&
    String(user.email || '').toLowerCase() === ADMIN_EMAIL;
}
function decode(doc) {
  const f = doc.fields || {};
  const value = x => x && (x.stringValue ?? x.integerValue ?? x.booleanValue ?? x.timestampValue);
  return {
    id: doc.name.split('/').pop(),
    title: value(f.title) || 'Untitled video',
    description: value(f.description) || '',
    type: value(f.type) || 'long',
    videoUrl: value(f.videoUrl) || '',
    ownerUid: value(f.ownerUid) || '',
    status: value(f.status) || 'draft',
    createdAt: value(f.createdAt) || ''
  };
}
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!['GET', 'POST'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    if (!(await verifyAdmin(req))) return res.status(403).json({ error: 'Admin access required.' });
    const account = serviceAccount();
    const token = await accessToken(account);
    const base = 'https://firestore.googleapis.com/v1/projects/' + PROJECT_ID + '/databases/(default)/documents';
    if (req.method === 'GET') {
      const response = await fetch(base + '/videos?pageSize=100', {
        headers: { Authorization: 'Bearer ' + token }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Could not load pending videos.');
      const videos = (data.documents || []).map(decode)
        .filter(v => v.status === 'draft' && v.videoUrl.startsWith('https://res.cloudinary.com/'));
      return res.status(200).json({ videos });
    }
    const id = String(req.body?.videoId || '');
    if (!/^[A-Za-z0-9_-]{1,150}$/.test(id)) return res.status(400).json({ error: 'Invalid video ID.' });
    const docUrl = base + '/videos/' + encodeURIComponent(id);
    const existing = await fetch(docUrl, { headers: { Authorization: 'Bearer ' + token } });
    const doc = await existing.json();
    if (!existing.ok) return res.status(existing.status).json({ error: 'Video not found.' });
    const video = decode(doc);
    if (video.status !== 'draft' || !video.videoUrl.startsWith('https://res.cloudinary.com/')) {
      return res.status(409).json({ error: 'Only valid private drafts can be approved.' });
    }
    const updated = await fetch(docUrl + '?updateMask.fieldPaths=status&updateMask.fieldPaths=updatedAt', {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: {
          status: { stringValue: 'published' },
          updatedAt: { timestampValue: new Date().toISOString() }
        }
      })
    });
    const result = await updated.json();
    if (!updated.ok) throw new Error(result.error?.message || 'Could not publish video.');
    return res.status(200).json({ success: true, videoId: id });
  } catch (error) {
    console.error('TITAN admin publish:', error);
    return res.status(500).json({ error: error.message || 'Publishing service is not configured.' });
  }
}

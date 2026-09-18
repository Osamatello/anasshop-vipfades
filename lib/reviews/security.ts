import 'server-only';

import { timingSafeEqual } from 'node:crypto';
import { google } from 'googleapis';

export function authorizedSecret(request: Request, secret: string | undefined) {
  if (!secret || secret.length < 32) return false;
  const provided = request.headers.get('authorization');
  if (!provided?.startsWith('Bearer ')) return false;
  const a = Buffer.from(provided.slice(7));
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function authorizedPubSub(request: Request) {
  const audience = process.env.GOOGLE_REVIEWS_PUBSUB_AUDIENCE;
  const email = process.env.GOOGLE_REVIEWS_PUBSUB_SERVICE_ACCOUNT_EMAIL;
  const token = request.headers.get('authorization')?.match(/^Bearer (\S+)$/)?.[1];
  if (!audience || !email || !token || token.length > 8192) return false;
  try {
    const ticket = await new google.auth.OAuth2().verifyIdToken({ idToken: token, audience });
    const payload = ticket.getPayload();
    return !!payload && payload.email === email && payload.email_verified === true &&
      (payload.iss === 'accounts.google.com' || payload.iss === 'https://accounts.google.com');
  } catch { return false; }
}

export async function boundedJson(request: Request, maxBytes = 65536): Promise<unknown> {
  if (Number(request.headers.get('content-length')) > maxBytes || !request.body) throw new Error('Invalid payload');
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) { await reader.cancel(); throw new Error('Payload too large'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

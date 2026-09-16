import { z } from 'zod';
import { authorizedPubSub, boundedJson } from '@/lib/reviews/security';
import { reviewLocation, syncGoogleReviews } from '@/lib/reviews/sync';

export const runtime = 'nodejs';
export const maxDuration = 60;

const Envelope = z.object({
  subscription: z.string(),
  message: z.object({ messageId: z.string(), data: z.string().max(60000) }),
});
const Notification = z.object({
  notification_type: z.string().optional(), notificationType: z.string().optional(), type: z.string().optional(),
  location_name: z.string().optional(), locationName: z.string().optional(),
});

export async function POST(request: Request) {
  if (!await authorizedPubSub(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const subscription = process.env.GOOGLE_REVIEWS_PUBSUB_SUBSCRIPTION;
    if (!subscription) return Response.json({ error: 'notification_setup_required' }, { status: 503 });
    const envelope = Envelope.parse(await boundedJson(request));
    if (envelope.subscription !== subscription) return Response.json({ error: 'Unexpected subscription' }, { status: 403 });
    const notification = Notification.parse(JSON.parse(Buffer.from(envelope.message.data, 'base64').toString('utf8')));
    const type = notification.notification_type || notification.notificationType || notification.type;
    if (type !== 'NEW_REVIEW' && type !== 'UPDATED_REVIEW') return new Response(null, { status: 204 });
    const location = notification.location_name || notification.locationName;
    const expected = reviewLocation();
    if (location !== expected && location !== expected.slice(expected.indexOf('locations/'))) return new Response(null, { status: 204 });
    // Acknowledge only after the atomic upsert succeeds. Pub/Sub retries failures.
    await syncGoogleReviews();
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof z.ZodError || error instanceof SyntaxError) return Response.json({ error: 'Invalid notification' }, { status: 400 });
    return Response.json({ error: 'notification_sync_failed' }, { status: 503 });
  }
}

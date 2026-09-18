import { authorizedSecret } from '@/lib/reviews/security';
import { purgeExpiredReviews, ReviewsSyncError, syncGoogleReviews } from '@/lib/reviews/sync';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

async function run(request: Request, secret: string | undefined) {
  if (!authorizedSecret(request, secret)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await purgeExpiredReviews();
    const result = await syncGoogleReviews();
    return Response.json(result, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    const known = error instanceof ReviewsSyncError;
    return Response.json({ error: known ? error.code : 'sync_failed', ...(known && error.missing.length ? { requiredEnvironmentVariables: error.missing } : {}) }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}

/** Daily cron fallback. Vercel cron runs only in Production, not on Preview. */
export const GET = (request: Request) => run(request, process.env.CRON_SECRET);
/** Explicit initial/manual sync also works against a Preview URL. */
export const POST = (request: Request) => run(request, process.env.GOOGLE_REVIEWS_SYNC_SECRET);

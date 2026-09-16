import { getGoogleReviews } from '@/lib/reviews/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getGoogleReviews();
    return Response.json(data, {
      headers: { 'Cache-Control': data.status === 'ready' ? 'public, max-age=60, s-maxage=60' : 'no-store' },
    });
  } catch {
    return Response.json({ stats: null, reviews: [], status: 'unavailable' }, { headers: { 'Cache-Control': 'no-store' } });
  }
}

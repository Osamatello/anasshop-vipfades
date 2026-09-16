import { getGoogleReviews } from '@/lib/reviews/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getGoogleReviews();
    // Preview-only readiness metadata: never expose values, tokens or upstream errors.
    const preview = process.env.VERCEL_ENV === 'preview';
    const databaseUsesOverride = !!process.env.GOOGLE_REVIEWS_SUPABASE_URL;
    const required = [
      'GOOGLE_REVIEWS_CLIENT_ID', 'GOOGLE_REVIEWS_CLIENT_SECRET',
      'GOOGLE_REVIEWS_REFRESH_TOKEN', 'GOOGLE_REVIEWS_LOCATION_NAME',
      'GOOGLE_REVIEWS_SYNC_SECRET',
      ...(databaseUsesOverride
        ? ['GOOGLE_REVIEWS_SUPABASE_URL', 'GOOGLE_REVIEWS_SUPABASE_PUBLISHABLE_KEY', 'GOOGLE_REVIEWS_SUPABASE_SECRET_KEY']
        : ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SECRET_KEY']),
    ];
    const location = process.env.GOOGLE_REVIEWS_LOCATION_NAME?.trim();
    return Response.json({
      ...data,
      ...(preview ? { diagnostics: {
        ...data.diagnostics,
        missingEnvironmentVariables: required.filter((name) => !process.env[name]?.trim()),
        databaseUsesOverride,
        locationIdentifierStatus: !location ? 'missing' : /^accounts\/\d+\/locations\/\d+$/.test(location) ? 'valid-format' : 'invalid-format',
      } } : {}),
    }, {
      headers: { 'Cache-Control': !preview && data.status === 'ready' ? 'public, max-age=60, s-maxage=60' : 'no-store' },
    });
  } catch {
    return Response.json({ stats: null, reviews: [], status: 'unavailable' }, { headers: { 'Cache-Control': 'no-store' } });
  }
}

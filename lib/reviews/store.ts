import 'server-only';

import { createClient } from '@supabase/supabase-js';
import type { GoogleReviewsData } from '@/lib/reviews/types';

/** Dedicated clients: no dependency on booking repositories or booking RPCs. */
export function reviewsClient(privileged = false) {
  const overrideUrl = process.env.GOOGLE_REVIEWS_SUPABASE_URL;
  const url = overrideUrl || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = privileged
    ? process.env.GOOGLE_REVIEWS_SUPABASE_SECRET_KEY || (!overrideUrl ? process.env.SUPABASE_SECRET_KEY : undefined)
    : process.env.GOOGLE_REVIEWS_SUPABASE_PUBLISHABLE_KEY || (!overrideUrl ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : undefined);
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function getGoogleReviews(): Promise<GoogleReviewsData & { diagnostics?: { databaseErrorCode: string } }> {
  const client = reviewsClient();
  if (!client) return { stats: null, reviews: [], status: 'pending' };
  // Both stats and cards are read in a single database snapshot.
  const { data, error } = await client.rpc('get_google_reviews');
  if (error || !data) return {
    stats: null, reviews: [], status: 'pending',
    ...(process.env.VERCEL_ENV === 'preview' ? { diagnostics: {
      databaseErrorCode: error ? /^(PGRST\d{3}|[0-9A-Z]{5})$/.test(error.code) ? error.code : 'review_read_failed' : 'empty_cache',
    } } : {}),
  };
  return data as GoogleReviewsData;
}

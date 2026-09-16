import 'server-only';

import { google } from 'googleapis';
import { reviewsClient } from '@/lib/reviews/store';

const REQUIRED = ['GOOGLE_REVIEWS_CLIENT_ID', 'GOOGLE_REVIEWS_CLIENT_SECRET', 'GOOGLE_REVIEWS_REFRESH_TOKEN', 'GOOGLE_REVIEWS_LOCATION_NAME'] as const;
const STAR_VALUES: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

type ApiReview = {
  reviewId?: string;
  reviewer?: { displayName?: string; isAnonymous?: boolean };
  starRating?: string;
  comment?: string;
  createTime?: string;
  updateTime?: string;
};
type ApiReviewsPage = {
  reviews?: ApiReview[];
  averageRating?: number;
  totalReviewCount?: number;
  nextPageToken?: string;
};

export class ReviewsSyncError extends Error {
  constructor(public code: string, public missing: string[] = []) { super(code); }
}

export function reviewLocation() {
  const location = process.env.GOOGLE_REVIEWS_LOCATION_NAME?.trim();
  if (!location || !/^accounts\/\d+\/locations\/\d+$/.test(location)) {
    throw new ReviewsSyncError('invalid_location', ['GOOGLE_REVIEWS_LOCATION_NAME']);
  }
  return location;
}

/** Cached API content is temporary, never a permanent review archive. */
export async function purgeExpiredReviews() {
  const client = reviewsClient(true);
  if (!client) return;
  const { error } = await client.rpc('purge_expired_google_reviews');
  if (error) throw new ReviewsSyncError('review_migration_required');
}

/** Full pagination recovers missed notifications, changed text and deleted reviews. */
export async function syncGoogleReviews() {
  const missing = REQUIRED.filter((name) => !process.env[name]?.trim());
  if (missing.length) throw new ReviewsSyncError('google_setup_required', [...missing]);
  const client = reviewsClient(true);
  if (!client) throw new ReviewsSyncError('review_database_configuration_required');
  const location = reviewLocation();
  // Deliberately separate from the Google Calendar booking credentials/scopes.
  const oauth = new google.auth.OAuth2(process.env.GOOGLE_REVIEWS_CLIENT_ID, process.env.GOOGLE_REVIEWS_CLIENT_SECRET);
  oauth.setCredentials({ refresh_token: process.env.GOOGLE_REVIEWS_REFRESH_TOKEN });

  const startedAt = new Date().toISOString();
  const deadline = Date.now() + 45_000;
  const reviews = new Map<string, ApiReview>();
  const seenTokens = new Set<string>();
  let nextPageToken: string | undefined;
  let rating = 0;
  let reviewCount = 0;
  let completed = false;

  for (let page = 0; page < 20; page++) {
    if (Date.now() >= deadline) throw new ReviewsSyncError('sync_timeout');
    const url = new URL(`https://mybusiness.googleapis.com/v4/${location}/reviews`);
    url.searchParams.set('pageSize', '50');
    url.searchParams.set('orderBy', 'updateTime desc');
    if (nextPageToken) url.searchParams.set('pageToken', nextPageToken);

    let data: ApiReviewsPage;
    try {
      const response = await oauth.request<ApiReviewsPage>({ url: url.toString(), method: 'GET', timeout: Math.min(15_000, deadline - Date.now()), retry: false });
      data = response.data;
    } catch {
      // No upstream body, token, credentials or request headers leak into logs/responses.
      throw new ReviewsSyncError('google_api_access_failed');
    }
    if (page === 0) {
      reviewCount = data.totalReviewCount ?? 0;
      rating = data.averageRating ?? 0;
      if (!Number.isInteger(reviewCount) || reviewCount < 0 || !Number.isFinite(rating) || rating < 0 || rating > 5 || (reviewCount > 0 && rating < 1)) {
        throw new ReviewsSyncError('invalid_google_stats');
      }
    }
    for (const review of data.reviews ?? []) {
      if (!review.reviewId || !STAR_VALUES[review.starRating ?? ''] || !review.createTime || !review.updateTime || !Number.isFinite(Date.parse(review.createTime)) || !Number.isFinite(Date.parse(review.updateTime))) {
        throw new ReviewsSyncError('invalid_google_review');
      }
      reviews.set(review.reviewId, review);
    }
    nextPageToken = data.nextPageToken;
    if (!nextPageToken) { completed = true; break; }
    if (seenTokens.has(nextPageToken)) throw new ReviewsSyncError('repeated_page_token');
    seenTokens.add(nextPageToken);
  }
  if (!completed) throw new ReviewsSyncError('pagination_limit_exceeded');

  // Only the seven needed written reviews are cached; Google's aggregate includes ALL ratings.
  const latestWritten = Array.from(reviews.values())
    .filter((review) => typeof review.comment === 'string' && review.comment.trim().length > 0)
    .sort((a, b) => Date.parse(b.createTime!) - Date.parse(a.createTime!) || a.reviewId!.localeCompare(b.reviewId!))
    .slice(0, 7)
    .map((review) => ({
      google_review_id: review.reviewId!,
      reviewer_name: review.reviewer?.displayName || 'Google-Nutzer',
      rating: STAR_VALUES[review.starRating!],
      review_text: review.comment!,
      published_at: review.createTime!,
      updated_at: review.updateTime!,
    }));
  const { data, error } = await client.rpc('sync_google_reviews', {
    p_location_name: location, p_rating: rating, p_total_review_count: reviewCount,
    p_reviews: latestWritten, p_synced_at: startedAt,
  });
  if (error) throw new ReviewsSyncError('review_storage_failed');
  return { status: data === false ? 'superseded' : 'synced', writtenReviews: latestWritten.length, totalReviewCount: reviewCount };
}

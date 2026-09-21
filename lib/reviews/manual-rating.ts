import type { GoogleBusinessStats } from '@/lib/reviews/types';

// Temporary owner-verified manual fallback; live API stats take priority once configured.
export const TEMPORARY_GOOGLE_RATING: Pick<GoogleBusinessStats, 'rating' | 'totalReviewCount'> = {
  rating: 5.0,
  totalReviewCount: 169,
};

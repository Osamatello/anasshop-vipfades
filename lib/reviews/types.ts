export type GoogleReview = {
  id: string;
  name: string;
  rating: number;
  text: string;
  publishedAt: string;
  updatedAt: string;
};

export type GoogleBusinessStats = {
  rating: number;
  totalReviewCount: number;
  lastSyncedAt: string;
};

export type GoogleReviewsData = {
  stats: GoogleBusinessStats | null;
  reviews: GoogleReview[];
  status: 'loading' | 'ready' | 'pending' | 'unavailable';
};

export const GOOGLE_REVIEWS_LINK =
  'https://www.google.com/maps/search/?api=1&query=VIP+FADES+An+der+Moselbr%C3%BCcke+9+Koblenz&query_place_id=ChIJeT1y02d9vkcRFsgzNiDZ2uI';

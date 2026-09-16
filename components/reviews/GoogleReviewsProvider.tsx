'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { GoogleReviewsData } from '@/lib/reviews/types';

const INITIAL: GoogleReviewsData = { stats: null, reviews: [], status: 'loading' };
const GoogleReviewsContext = createContext<GoogleReviewsData>(INITIAL);

/** One request and one snapshot for both Hero and Testimonials. */
export default function GoogleReviewsProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<GoogleReviewsData>(INITIAL);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/google-reviews', { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('Reviews unavailable');
        return response.json() as Promise<GoogleReviewsData>;
      })
      .then(setData)
      .catch(() => {
        if (!controller.signal.aborted) {
          setData({ stats: null, reviews: [], status: 'unavailable' });
        }
      });
    return () => controller.abort();
  }, []);

  return <GoogleReviewsContext.Provider value={data}>{children}</GoogleReviewsContext.Provider>;
}

export const useGoogleReviews = () => useContext(GoogleReviewsContext);

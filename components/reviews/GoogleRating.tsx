'use client';

import { Star } from 'lucide-react';
import { Oswald } from 'next/font/google';
import { useGoogleReviews } from '@/components/reviews/GoogleReviewsProvider';
import { GOOGLE_REVIEWS_LINK } from '@/lib/reviews/types';
import { TEMPORARY_GOOGLE_RATING } from '@/lib/reviews/manual-rating';

const ratingFont = Oswald({ subsets: ['latin'], weight: '700', display: 'swap' });

export default function GoogleRating({ compact = false, reviewBlock = false }: { compact?: boolean; reviewBlock?: boolean }) {
  const { stats: liveStats } = useGoogleReviews();
  const stats = liveStats ?? TEMPORARY_GOOGLE_RATING;
  const starSize = reviewBlock ? 'h-3.5 w-3.5' : compact ? 'h-4 w-4 sm:h-5 sm:w-5' : 'h-5 w-5';

  return (
    <div className={`inline-flex items-center text-brand-cream ${compact ? 'min-h-9 gap-2.5 text-left sm:min-h-12 sm:gap-4' : 'min-h-12 flex-wrap justify-center gap-4'}`}>
      {(
        <a
          href={GOOGLE_REVIEWS_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cream ${compact ? 'gap-2 sm:gap-3' : 'gap-3'}`}
          aria-label={`${stats.rating.toFixed(1)} von 5 Sternen bei ${stats.totalReviewCount} Google-Bewertungen – auf Google ansehen`}
        >
          <span className={`${ratingFont.className} leading-none tabular-nums ${compact ? 'order-last text-[32px] sm:text-5xl' : 'text-3xl'}`}>{stats.rating.toFixed(1)}</span>
          <span className={compact ? 'text-right' : 'text-left'}>
            <span aria-hidden="true" className="flex gap-0.5">
              {Array.from({ length: 5 }, (_, index) => (
                <span key={index} className={`relative block ${starSize}`}>
                  <Star className={`absolute ${starSize} text-brand-cream/30`} />
                  <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${Math.max(0, Math.min(1, stats.rating - index)) * 100}%` }}>
                    <Star className={`${starSize} fill-brand-cream text-brand-cream`} />
                  </span>
                </span>
              ))}
            </span>
            <span className={`block font-sans font-bold uppercase tracking-[0.12em] tabular-nums ${compact ? 'mt-1 text-[9px] sm:mt-1.5 sm:text-[11px]' : 'mt-1.5 text-[9px]'}`}>
              {new Intl.NumberFormat('de-DE').format(stats.totalReviewCount)} Google-Bewertungen
            </span>
          </span>
        </a>
      )}
      {reviewBlock && (
        <>
          <span aria-hidden="true" className="h-px w-5 bg-brand-cream/40" />
          <a href={GOOGLE_REVIEWS_LINK} target="_blank" rel="noopener noreferrer" className="rounded text-[11px] font-medium transition-colors hover:text-brand-textPrimary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cream">
            Auf Google ansehen
          </a>
        </>
      )}
    </div>
  );
}

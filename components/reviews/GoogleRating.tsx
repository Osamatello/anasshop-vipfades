'use client';

import { Star } from 'lucide-react';
import { useGoogleReviews } from '@/components/reviews/GoogleReviewsProvider';
import { GOOGLE_REVIEWS_LINK } from '@/lib/reviews/types';
import { TEMPORARY_GOOGLE_RATING } from '@/lib/reviews/manual-rating';

export default function GoogleRating({ compact = false, reviewBlock = false }: { compact?: boolean; reviewBlock?: boolean }) {
  const { stats: liveStats } = useGoogleReviews();
  const stats = liveStats ?? TEMPORARY_GOOGLE_RATING;

  return (
    <div className={`inline-flex min-h-12 items-center gap-4 text-brand-cream ${compact ? 'text-left' : 'flex-wrap justify-center'}`}>
      {(
        <a
          href={GOOGLE_REVIEWS_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cream"
          aria-label={`${stats.rating.toFixed(1)} von 5 Sternen bei ${stats.totalReviewCount} Google-Bewertungen – auf Google ansehen`}
        >
          <span className={`font-serif leading-none tabular-nums ${compact ? 'order-last text-[42px] sm:text-5xl' : 'text-3xl'}`}>{stats.rating.toFixed(1)}</span>
          <span className={compact ? 'text-right' : 'text-left'}>
            <span aria-hidden="true" className="flex gap-0.5">
              {Array.from({ length: 5 }, (_, index) => (
                <span key={index} className="relative block h-3.5 w-3.5">
                  <Star className="absolute h-3.5 w-3.5 text-brand-cream/30" />
                  <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${Math.max(0, Math.min(1, stats.rating - index)) * 100}%` }}>
                    <Star className="h-3.5 w-3.5 fill-brand-cream text-brand-cream" />
                  </span>
                </span>
              ))}
            </span>
            <span className={`mt-1.5 block font-medium tabular-nums ${compact ? 'text-[11px] tracking-wide' : 'text-[9px] uppercase tracking-[0.12em]'}`}>
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

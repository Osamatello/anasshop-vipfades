'use client';

import { Star } from 'lucide-react';
import { useGoogleReviews } from '@/components/reviews/GoogleReviewsProvider';
import { GOOGLE_REVIEWS_LINK } from '@/lib/reviews/types';

export default function GoogleRating({ compact = false }: { compact?: boolean }) {
  const { stats, status } = useGoogleReviews();

  return (
    <a
      href={GOOGLE_REVIEWS_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-12 items-center gap-3 rounded text-brand-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cream ${compact ? 'text-left' : 'flex-wrap justify-center'}`}
      aria-label={stats ? `${stats.rating.toFixed(1)} von 5 Sternen bei ${stats.totalReviewCount} Google-Bewertungen – auf Google ansehen` : 'Unsere Bewertungen auf Google ansehen'}
    >
      {stats ? (
        <>
          <span className="font-serif text-3xl leading-none tabular-nums">{stats.rating.toFixed(1)}</span>
          <span>
            <span aria-hidden="true" className="flex gap-0.5">
              {Array.from({ length: 5 }, (_, index) => (
                <span key={index} className="relative block h-3 w-3">
                  <Star className="absolute h-3 w-3 text-brand-cream/30" />
                  <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${Math.max(0, Math.min(1, stats.rating - index)) * 100}%` }}>
                    <Star className="h-3 w-3 fill-brand-cream text-brand-cream" />
                  </span>
                </span>
              ))}
            </span>
            <span className="mt-1.5 block text-[9px] font-medium uppercase tracking-[0.12em]">
              {new Intl.NumberFormat('de-DE').format(stats.totalReviewCount)} Google-Bewertungen
            </span>
          </span>
        </>
      ) : (
        <span className="text-[10px] font-medium uppercase tracking-[0.12em]">
          Google-Bewertungen
          <span className="mt-1 block text-[9px] font-light normal-case tracking-normal text-brand-textPrimary/70">
            {status === 'loading' ? 'Bewertungen werden geladen …' : 'Auf Google ansehen'}
          </span>
        </span>
      )}
    </a>
  );
}

'use client';

import { Pause, Play, Quote, Star } from 'lucide-react';
import { useState } from 'react';
import GoogleRating from '@/components/reviews/GoogleRating';
import { useGoogleReviews } from '@/components/reviews/GoogleReviewsProvider';
import { GOOGLE_REVIEWS_LINK, type GoogleReview } from '@/lib/reviews/types';

export default function ClientExperiences() {
  const { reviews, status } = useGoogleReviews();
  const [paused, setPaused] = useState(false);
  const firstRow = reviews.filter((_, index) => index % 2 === 0);
  const secondRow = reviews.filter((_, index) => index % 2 !== 0);

  return (
    <section className="border-t border-brand-border py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5">
        {/* Section heading */}
        <div className="mb-14 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-brand-cream">
            Google-Bewertungen
          </p>

          <h2 className="mt-4 font-serif text-4xl font-light tracking-tight text-brand-textPrimary sm:text-5xl lg:text-6xl">
            Das sagen unsere Kunden
          </h2>

          <div className="gold-divider mt-4" />

          <div className="mt-6"><GoogleRating /></div>

          <p className="mx-auto mt-6 max-w-lg text-base font-light leading-relaxed text-brand-textPrimary/85">
            Echte Erfahrungen unserer Kunden auf Google.
          </p>
        </div>

        {/* Reviews marquee */}
        {reviews.length > 0 ? <>
        <div className="flex justify-end">
          <button type="button" onClick={() => setPaused((value) => !value)} className="flex items-center gap-2 rounded text-[11px] text-brand-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cream" aria-label={paused ? 'Bewertungsanimation fortsetzen' : 'Bewertungsanimation pausieren'}>
            {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
            {paused ? 'Fortsetzen' : 'Pausieren'}
          </button>
        </div>
        <div className={`reviews-window relative overflow-hidden py-8 ${paused ? 'reviews-paused' : ''}`}>
          {/* First row */}
          <div className="reviews-track-left flex w-max items-stretch gap-10">
            {[...firstRow, ...firstRow, ...firstRow].map(
              (review, index) => (
                <ReviewItem
                  key={`first-${review.id}-${index}`}
                  review={review}
                  duplicate={index >= firstRow.length}
                />
              )
            )}
          </div>

          {/* Second row */}
          {secondRow.length > 0 && <div className="reviews-track-right mt-8 flex w-max items-stretch gap-10">
            {[...secondRow, ...secondRow, ...secondRow].map(
              (review, index) => (
                <ReviewItem
                  key={`second-${review.id}-${index}`}
                  review={review}
                  duplicate={index >= secondRow.length}
                />
              )
            )}
          </div>}
        </div>
        </> : <div className="flex min-h-[210px] items-center justify-center text-center text-sm font-light text-brand-textSecondary">
          {status === 'loading' ? <p>Google-Bewertungen werden geladen …</p> : <a href={GOOGLE_REVIEWS_LINK} target="_blank" rel="noopener noreferrer" className="rounded text-brand-cream underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cream">Unsere Kundenbewertungen auf Google ansehen</a>}
        </div>}
      </div>

      <style jsx>{`
        .reviews-window::before,
        .reviews-window::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 140px;
          z-index: 10;
          pointer-events: none;
        }

        .reviews-window::before {
          left: 0;
          background: linear-gradient(
            to right,
            var(--brand-bg, #070707),
            transparent
          );
        }

        .reviews-window::after {
          right: 0;
          background: linear-gradient(
            to left,
            var(--brand-bg, #070707),
            transparent
          );
        }

        .reviews-track-left {
          animation: reviews-scroll-left 120s linear infinite;
        }

        .reviews-track-right {
          animation: reviews-scroll-right 120s linear infinite;
        }

        .reviews-paused .reviews-track-left,
        .reviews-paused .reviews-track-right,
        .reviews-window:hover .reviews-track-left,
        .reviews-window:hover .reviews-track-right {
          animation-play-state: paused;
        }

        @keyframes reviews-scroll-left {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-33.333%);
          }
        }

        @keyframes reviews-scroll-right {
          from {
            transform: translateX(-33.333%);
          }

          to {
            transform: translateX(0);
          }
        }

        @media (max-width: 640px) {
          .reviews-window::before,
          .reviews-window::after {
            width: 50px;
          }

          .reviews-track-left,
          .reviews-track-right {
            gap: 2rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .reviews-track-left,
          .reviews-track-right {
            animation: none;
            flex-wrap: wrap;
            width: auto;
            justify-content: center;
          }
          .reviews-window::before, .reviews-window::after { display: none; }
        }
      `}</style>
    </section>
  );
}

function ReviewItem({
  review,
  duplicate,
}: {
  review: GoogleReview;
  duplicate: boolean;
}) {
  return (
    <article aria-hidden={duplicate || undefined} className={`group flex min-h-[210px] w-[300px] flex-shrink-0 flex-col justify-between py-5 sm:w-[330px] ${duplicate ? 'motion-reduce:hidden' : ''}`}>
      <div>
        {/* Rating and quote */}
        <div className="mb-5 flex items-center justify-between">
          <div
            className="flex gap-1"
            aria-label={`${review.rating} von 5 Sternen`}
          >
            {Array.from({ length: 5 }).map((_, starIndex) => (
              <Star
                key={starIndex}
                className={`h-3.5 w-3.5 ${starIndex < review.rating
                  ? 'fill-brand-cream text-brand-cream'
                  : 'fill-transparent text-brand-cream/30'
                  }`}
              />
            ))}
          </div>

          <Quote className="h-4 w-4 text-brand-cream/20" />
        </div>

        {/* Review text */}
        <p className="text-[13px] font-light leading-6 text-brand-textPrimary/75">
          “{review.text}”
        </p>
      </div>

      {/* Client identity */}
      <div className="mt-7 flex items-center gap-3 border-t border-brand-border/30 pt-4">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-brand-cream/20 bg-brand-cream/[0.03] text-[9px] font-semibold uppercase tracking-[0.08em] text-brand-cream/80">
          {review.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join('')}
        </div>

        <div>
          <p className="text-[13px] font-medium text-brand-textPrimary/90">
            {review.name}
          </p>

          <p className="mt-1 text-[10px] font-light uppercase tracking-[0.12em] text-brand-cream/55">
            <time dateTime={review.publishedAt}>{new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Berlin' }).format(new Date(review.publishedAt))}</time>
          </p>
        </div>
      </div>
    </article>
  );
}

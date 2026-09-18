'use client';

import { Quote, Star } from 'lucide-react';

import GoogleRating from '@/components/reviews/GoogleRating';
import { useGoogleReviews } from '@/components/reviews/GoogleReviewsProvider';
import {
  GOOGLE_REVIEWS_LINK,
  type GoogleReview,
} from '@/lib/reviews/types';

const reviewDateFormatter = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'Europe/Berlin',
});

function reviewerInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'G';
}

function formatReviewDate(value: string) {
  const date = new Date(value);

  if (!Number.isFinite(date.getTime())) {
    return 'Google-Bewertung';
  }

  return reviewDateFormatter.format(date);
}

export default function ClientExperiences() {
  const { reviews, status } = useGoogleReviews();

  const firstRow = reviews.slice(0, 4);
  const secondRow = reviews.slice(4, 7);
  const hasReviews = reviews.length > 0;

  return (
    <section className="border-t border-brand-border py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-14 text-center">
          <h2 className="font-serif text-4xl font-light tracking-tight text-brand-textPrimary sm:text-5xl lg:text-6xl">
            Das sagen unsere Kunden
          </h2>

          <div className="gold-divider mt-4" />

          <div className="mt-6">
            <GoogleRating />
          </div>
        </div>

        {hasReviews ? (
          <div className="reviews-window relative overflow-hidden py-8">
            <div className="reviews-track-left flex w-max items-stretch gap-10">
              {[...firstRow, ...firstRow, ...firstRow].map((review, index) => (
                <ReviewItem
                  key={`first-${review.id}-${index}`}
                  review={review}
                />
              ))}
            </div>

            {secondRow.length > 0 && (
              <div className="reviews-track-right mt-8 flex w-max items-stretch gap-10">
                {[...secondRow, ...secondRow, ...secondRow].map((review, index) => (
                  <ReviewItem
                    key={`second-${review.id}-${index}`}
                    review={review}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mx-auto max-w-xl py-6 text-center">
            <p className="text-sm font-light leading-7 text-brand-textPrimary/70 sm:text-base">
              {status === 'loading'
                ? 'Google-Bewertungen werden geladen.'
                : 'Aktuelle Google-Bewertungen findest du direkt auf unserem Google-Profil.'}
            </p>

            <a
              href={GOOGLE_REVIEWS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex rounded-full border border-brand-cream/50 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-cream transition-colors hover:border-brand-cream hover:text-brand-textPrimary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cream"
            >
              Google-Bewertungen ansehen
            </a>
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <GoogleRating reviewBlock />
        </div>
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
          animation: reviews-scroll-left 55s linear infinite;
        }

        .reviews-track-right {
          animation: reviews-scroll-right 55s linear infinite;
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
            gap: 1.4rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .reviews-track-left,
          .reviews-track-right {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

function ReviewItem({
  review,
}: {
  review: GoogleReview;
}) {
  return (
    <article className="group flex min-h-[147px] w-[210px] flex-shrink-0 flex-col justify-between py-3.5 sm:min-h-[210px] sm:w-[330px] sm:py-5">
      <div>
        <div className="mb-3.5 flex items-center justify-between sm:mb-5">
          <div
            className="flex gap-0.5 sm:gap-1"
            aria-label={`${review.rating} von 5 Sternen`}
          >
            {Array.from({ length: 5 }).map((_, starIndex) => (
              <Star
                key={starIndex}
                className={`h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 ${
                  starIndex < review.rating
                    ? 'fill-brand-cream text-brand-cream'
                    : 'fill-transparent text-brand-cream/30'
                }`}
              />
            ))}
          </div>

          <Quote className="h-3 w-3 text-brand-cream/20 sm:h-4 sm:w-4" />
        </div>

        <p className="text-[11px] font-light leading-[1.15rem] text-brand-textPrimary/75 sm:text-[13px] sm:leading-6">
          “{review.text}”
        </p>
      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-brand-border/30 pt-3 sm:mt-7 sm:gap-3 sm:pt-4">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-brand-cream/20 bg-brand-cream/[0.03] text-[8px] font-semibold uppercase tracking-[0.08em] text-brand-cream/80 sm:h-9 sm:w-9 sm:text-[9px]">
          {reviewerInitials(review.name)}
        </div>

        <div>
          <p className="text-[11px] font-medium text-brand-textPrimary/90 sm:text-[13px]">
            {review.name}
          </p>

          <p className="mt-0.5 text-[9px] font-light uppercase tracking-[0.1em] text-brand-cream/55 sm:mt-1 sm:text-[10px] sm:tracking-[0.12em]">
            {formatReviewDate(review.publishedAt)}
          </p>
        </div>
      </div>
    </article>
  );
}

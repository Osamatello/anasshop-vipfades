'use client';

import { Quote, Star } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    rating: 5,
    text: 'Top Service, top Haarschnitt – kann ich jedem empfehlen.',
    name: 'Sead Sokolovic',
    date: 'vor 3 Wochen',
    initials: 'SS',
  },
  {
    id: 2,
    rating: 5,
    text: 'Sehr gut! Bin ohne Termin reingekommen und direkt drangekommen. Die Rasur hat ungefähr acht Minuten gedauert.',
    name: 'Camden Leslie',
    date: 'vor 8 Monaten',
    initials: 'CL',
  },
  {
    id: 3,
    rating: 5,
    text: 'Gute Stimmung, starke Barber-Skills und super Service für nur 20 Euro. Klare Empfehlung!',
    name: 'Daniel Tian',
    date: 'vor 1 Jahr',
    initials: 'DT',
  },
  {
    id: 4,
    rating: 5,
    text: 'Meine Bedürfnisse werden korrekt wahrgenommen und umgesetzt! Ob Termin oder nicht, ich hatte nie lange Wartezeit. Die Preise sind echt unschlagbar. Kann ich jedem empfehlen.',
    name: 'Johannes Brunke',
    date: 'vor 1 Monat',
    initials: 'JB',
  },
  {
    id: 5,
    rating: 5,
    text: 'Ich bin absolut begeistert! Der Service war erstklassig, das Team super freundlich und professionell. Auf meine Wünsche wurde perfekt eingegangen und das Ergebnis ist einfach top.',
    name: 'Jeremy Menges',
    date: 'vor 3 Monaten',
    initials: 'JM',
  },
  {
    id: 6,
    rating: 5,
    text: 'Sehr guter Laden, immer gute Haarschnitte und alles sehr sauber. Parfums sind auch sehr hochwertig. Gerne Kunde dort.',
    name: 'Nicolas Yarro',
    date: 'vor 3 Wochen',
    initials: 'NY',
  },
  {
    id: 7,
    rating: 5,
    text: 'War zweimal da, alles war perfekt und sehr sauber geschnitten. Kann ich nur weiterempfehlen.',
    name: 'Wade3 Selawi',
    date: 'vor 3 Wochen',
    initials: 'WS',
  },
];

const FIRST_ROW = [
  REVIEWS[0],
  REVIEWS[3],
  REVIEWS[2],
  REVIEWS[5],
];

const SECOND_ROW = [
  REVIEWS[1],
  REVIEWS[4],
  REVIEWS[6],
];

export default function ClientExperiences() {
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

          <p className="mx-auto mt-6 max-w-lg text-base font-light leading-relaxed text-brand-textPrimary/85">
            Echte Erfahrungen unserer Kunden auf Google.
          </p>
        </div>

        {/* Reviews marquee */}
        <div className="reviews-window relative overflow-hidden py-8">
          {/* First row */}
          <div className="reviews-track-left flex w-max items-stretch gap-10">
            {[...FIRST_ROW, ...FIRST_ROW, ...FIRST_ROW].map(
              (review, index) => (
                <ReviewItem
                  key={`first-${review.id}-${index}`}
                  review={review}
                />
              )
            )}
          </div>

          {/* Second row */}
          <div className="reviews-track-right mt-8 flex w-max items-stretch gap-10">
            {[...SECOND_ROW, ...SECOND_ROW, ...SECOND_ROW].map(
              (review, index) => (
                <ReviewItem
                  key={`second-${review.id}-${index}`}
                  review={review}
                />
              )
            )}
          </div>
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
          animation: reviews-scroll-left 120s linear infinite;
        }

        .reviews-track-right {
          animation: reviews-scroll-right 120s linear infinite;
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
          }
        }
      `}</style>
    </section>
  );
}

function ReviewItem({
  review,
}: {
  review: (typeof REVIEWS)[number];
}) {
  return (
    <article className="group flex min-h-[210px] w-[300px] flex-shrink-0 flex-col justify-between py-5 sm:w-[330px]">
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
          {review.initials}
        </div>

        <div>
          <p className="text-[13px] font-medium text-brand-textPrimary/90">
            {review.name}
          </p>

          <p className="mt-1 text-[10px] font-light uppercase tracking-[0.12em] text-brand-cream/55">
            {review.date}
          </p>
        </div>
      </div>
    </article>
  );
}
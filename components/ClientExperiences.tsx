'use client';

import { Star } from 'lucide-react';

// Placeholder reviews — replace with real Google Reviews when available
const PLACEHOLDER_REVIEWS = [
  {
    id: 1,
    rating: 5,
    text: 'Absolutely clean fade and a great atmosphere. The attention to detail is unmatched. Highly recommended for anyone who takes their look seriously.',
    name: 'Sample Client 01',
    date: 'July 2025',
    initials: 'SC',
  },
  {
    id: 2,
    rating: 5,
    text: 'Premium experience from start to finish. The barber took time to understand exactly what I wanted and delivered perfectly. Will be back every week.',
    name: 'Sample Client 02',
    date: 'July 2025',
    initials: 'SC',
  },
  {
    id: 3,
    rating: 5,
    text: 'Best barbershop in Koblenz. The shop looks incredible and the haircut quality is on another level. Booking through the website was seamless.',
    name: 'Sample Client 03',
    date: 'June 2025',
    initials: 'SC',
  },
];

export default function ClientExperiences() {
  return (
    <section className="section-padding bg-brand-bgSecondary px-5 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-accent block mb-3">
            Reviews
          </span>
          <h2 className="font-serif text-4xl font-light tracking-tight text-brand-textPrimary sm:text-5xl lg:text-6xl">
            Client Experiences
          </h2>
          <div className="mt-4 gold-divider" />
          <p className="mt-6 mx-auto max-w-lg text-base font-light text-brand-textSecondary">
            What our clients say about the VIP FADES experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {PLACEHOLDER_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="reveal p-7 rounded-xl border border-brand-border bg-brand-card/25 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-brand-accent fill-brand-accent stroke-[1.5]"
                    />
                  ))}
                </div>
                <p className="text-sm font-light leading-relaxed text-brand-textSecondary">
                  "{review.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-brand-border/30 mt-6">
                <div className="h-9 w-9 rounded-full border border-brand-border/60 bg-brand-bgSecondary/80 flex items-center justify-center text-[10px] tracking-tighter text-brand-accent font-semibold">
                  {review.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-brand-textPrimary">{review.name}</p>
                  <p className="text-[11px] text-brand-textSecondary/70">{review.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

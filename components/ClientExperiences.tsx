'use client';

import { Quote, Star } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    rating: 5,
    text: 'Great service, great hair cut, recommend to everyone.',
    name: 'Sead Sokolovic',
    date: '3 weeks ago',
    initials: 'SS',
  },
  {
    id: 2,
    rating: 5,
    text: 'Very nice! Walk in appointment and got in right away. Took about eight minutes for a shave.',
    name: 'Camden Leslie',
    date: '8 months ago',
    initials: 'CL',
  },
  {
    id: 3,
    rating: 5,
    text: 'Good vibe, great barber skills, amazing service for just 20 euro. I totally recommend!',
    name: 'Daniel Tian',
    date: '1 year ago',
    initials: 'DT',
  },
  {
    id: 4,
    rating: 5,
    text: 'Meine Bedürfnisse werden korrekt wahrgenommen und umgesetzt! Ob Termin oder nicht, ich hatte nie lange Wartezeit. Die Preise sind echt unschlagbar. Kann ich jedem empfehlen.',
    name: 'Johannes Brunke',
    date: '1 month ago',
    initials: 'JB',
  },
  {
    id: 5,
    rating: 5,
    text: 'Ich bin absolut begeistert! Der Service war erstklassig, das Team super freundlich und professionell. Auf meine Wünsche wurde perfekt eingegangen und das Ergebnis ist einfach top.',
    name: 'Jeremy Menges',
    date: '3 months ago',
    initials: 'JM',
  },
  {
    id: 6,
    rating: 5,
    text: 'Sehr guter Laden, immer gute Haarschnitte und alles sehr sauber. Parfums sind auch sehr hochwertig. Gerne Kunde dort.',
    name: 'Nicolas Yarro',
    date: '3 weeks ago',
    initials: 'NY',
  },
  {
    id: 7,
    rating: 5,
    text: 'War zweimal da, alles war perfekt und sehr sauber geschnitten. Kann ich nur weiterempfehlen.',
    name: 'Wade3 Selawi',
    date: '3 weeks ago',
    initials: 'WS',
  },
  {
    id: 8,
    rating: 5,
    text: 'Mega! Handwerklich einfach super, schneidet mit Perfektion und Erfahrung. Als Kunde fühlt man sich aufgenommen. Mega Service und mega freundlich.',
    name: 'Jason Seve',
    date: '3 months ago',
    initials: 'JS',
  },
];

export default function ClientExperiences() {
  return (
    <section className="section-padding bg-brand-bgSecondary px-5 sm:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <div className="mb-14 text-center">
          <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-cream">
            Google Reviews
          </span>

          <h2 className="font-serif text-4xl font-light tracking-tight text-brand-textPrimary sm:text-5xl lg:text-6xl">
            Client Experiences
          </h2>

          <div className="gold-divider mt-4" />

          <p className="mx-auto mt-6 max-w-lg text-base font-light leading-relaxed text-brand-textPrimary/85">
            Real experiences shared by our clients on Google.
          </p>
        </div>

        {/* Review cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {REVIEWS.map((review, index) => (
            <article
              key={review.id}
              className={`reveal reveal-delay-${(index % 3) + 1
                } group relative flex h-full min-h-[320px] flex-col justify-between overflow-hidden rounded-2xl border border-brand-border bg-brand-card/35 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-cream/60 hover:shadow-[0_16px_45px_rgba(232,220,200,0.08)]`}
            >
              <div>
                {/* Rating and quote */}
                <div className="mb-5 flex items-center justify-between">
                  <div
                    className="flex gap-1"
                    aria-label={`${review.rating} out of 5 stars`}
                  >
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        className={`h-4 w-4 ${starIndex < review.rating
                            ? 'fill-brand-cream text-brand-cream'
                            : 'fill-transparent text-brand-cream/30'
                          }`}
                      />
                    ))}
                  </div>

                  <Quote className="h-5 w-5 text-brand-cream/40" />
                </div>

                {/* Review text */}
                <p className="text-sm font-light leading-7 text-brand-textPrimary/85">
                  “{review.text}”
                </p>
              </div>

              {/* Client identity */}
              <div className="mt-8 flex items-center gap-3 border-t border-brand-border/60 pt-6">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-brand-cream/35 bg-brand-cream/5 text-[10px] font-semibold uppercase tracking-[0.08em] text-brand-cream transition-all duration-300 group-hover:border-brand-cream/60 group-hover:bg-brand-cream/10">
                  {review.initials}
                </div>

                <div>
                  <p className="text-sm font-medium text-brand-textPrimary">
                    {review.name}
                  </p>

                  <p className="mt-1 text-[11px] font-light uppercase tracking-[0.12em] text-brand-cream/75">
                    {review.date}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
'use client';

import { Star } from 'lucide-react';

export default function ClientExperiences() {
  const placeholders = [1, 2, 3];

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
            Factual reviews and client feedback from our verified booking platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {placeholders.map((id) => (
            <div
              key={id}
              className="reveal p-7 rounded-xl border border-brand-border bg-brand-card/25 flex flex-col justify-between h-56"
            >
              <div>
                {/* Star rating placeholder */}
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-brand-accent/30 fill-brand-accent/5 stroke-[1.5]" />
                  ))}
                </div>

                {/* Skeleton lines representing review text */}
                <div className="space-y-2.5">
                  <div className="h-2 w-full bg-brand-border/40 rounded-full" />
                  <div className="h-2 w-11/12 bg-brand-border/40 rounded-full" />
                  <div className="h-2 w-4/5 bg-brand-border/40 rounded-full" />
                </div>
              </div>

              {/* Author placeholder */}
              <div className="flex items-center gap-3 pt-6 border-t border-brand-border/30">
                <div className="h-8 w-8 rounded-full border border-brand-border/60 bg-brand-bgSecondary/50 flex items-center justify-center text-[10px] tracking-tighter text-brand-textSecondary font-mono">
                  VIP
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="h-2 w-16 bg-brand-border/50 rounded-full" />
                  <div className="h-1.5 w-10 bg-brand-border/30 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

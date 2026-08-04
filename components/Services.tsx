'use client';

import { Clock } from 'lucide-react';
import { SERVICES, type Service } from '@/lib/data';

export default function Services() {
  return (
    <section id="services" className="section-padding bg-brand-bg px-5 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-cream block mb-3">
            The Menu
          </span>
          <h2 className="font-serif text-4xl font-light tracking-tight text-brand-textPrimary sm:text-5xl lg:text-6xl">
            Signature Cuts
          </h2>
          <div className="mt-4 gold-divider" />
          <p className="mt-6 mx-auto max-w-lg text-base font-light text-brand-textSecondary">
            Considered craftsmanship at transparent prices. Select a grooming package tailored to your routine.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {SERVICES.map((s: Service, i: number) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
        </div>

        <p className="reveal reveal-delay-3 mt-14 text-center text-xs font-light tracking-wide text-brand-textSecondary/80">
          Walk-ins welcome during opening hours · Cash and card accepted
        </p>
      </div>
    </section>
  );
}

function ServiceCard({ service: s, index: i }: { service: Service; index: number }) {
  const isPopular = s.id === 'haircut-beard';

  return (
    <div
      className={`reveal reveal-delay-${(i % 3) + 1} relative flex flex-col justify-between p-7 rounded-xl border transition-all duration-300 group h-full min-h-[220px] ${
        isPopular
          ? 'border-brand-accent/50 bg-brand-bgSecondary/70 hover:border-brand-accent'
          : 'border-brand-border bg-brand-card/30 hover:border-brand-accent/30'
      }`}
    >
      {isPopular && (
        <span className="absolute -top-3 left-6 rounded-full bg-brand-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-textPrimary border border-brand-accent/30">
          Most Popular
        </span>
      )}

      <div>
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-serif text-xl font-light text-brand-textPrimary group-hover:text-brand-accent transition-colors duration-300">
            {s.name}
          </h3>
          <span className="font-serif text-2xl font-light text-brand-textPrimary flex-shrink-0">
            €{s.price}
          </span>
        </div>
        {s.duration && (
          <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-light text-brand-textSecondary">
            <Clock className="h-3 w-3 text-brand-cream/80" />
            {s.duration} min
          </span>
        )}
        <p className="mt-4 text-sm font-light text-brand-textSecondary leading-relaxed">
          {s.description}
        </p>
      </div>
    </div>
  );
}

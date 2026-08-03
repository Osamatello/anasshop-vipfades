'use client';

import { Clock } from 'lucide-react';
import { SERVICES, type Service } from '@/lib/data';
import { SectionHeading } from './SectionHeading';

export default function Services() {
  return (
    <section id="services" className="section-padding bg-ink-950 px-5 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="The Menu"
          title="Services & Pricing"
          description="Considered craftsmanship at fair, transparent prices. Choose your service and your barber."
          light
        />

        <div className="mt-16 grid gap-x-12 gap-y-0 sm:grid-cols-2">
          {SERVICES.map((s: Service, i) => (
            <ServiceRow key={s.id} service={s} index={i} />
          ))}
        </div>

        <p className="reveal reveal-delay-3 mt-12 text-center text-sm font-light text-ink-300">
          Walk-ins welcome during opening hours · Cash &amp; card accepted
        </p>
      </div>
    </section>
  );
}

function ServiceRow({ service, index }: { service: Service; index: number }) {
  return (
    <div
      className={`reveal ${
        index % 2 === 0 ? 'reveal-delay-2' : 'reveal-delay-3'
      } group flex items-baseline gap-5 border-b border-white/5 py-6 transition-colors hover:border-gold/30`}
    >
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-3">
          <h3 className="font-serif text-xl font-medium text-warm sm:text-2xl">
            {service.name}
          </h3>
          {service.duration && (
            <span className="flex items-center gap-1 text-xs font-light text-ink-300">
              <Clock className="h-3 w-3 text-gold/70" />
              {service.duration} min
            </span>
          )}
        </div>
        <p className="mt-1.5 text-sm font-light text-ink-300">
          {service.description}
        </p>
      </div>
      <span className="flex-1 self-center border-b border-dotted border-white/10" />
      <span className="font-serif text-2xl font-medium text-gold">
        €{service.price}
      </span>
    </div>
  );
}

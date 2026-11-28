'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
import { BARBERS, type Barber } from '@/lib/data';

const BARBER_PHOTOS: Record<string, string> = {
  anas: '/images/anas-barber.jpeg',
};

export default function Barbers() {
  return (
    <section
      id="barbers"
      className="section-padding bg-brand-bg px-5 sm:px-8"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <div className="mb-10 text-center">

          <h2 className="font-serif text-4xl font-light tracking-tight text-brand-textPrimary sm:text-5xl lg:text-6xl">
            Der Barber hinter jedem Cut
          </h2>

          <div className="gold-divider mt-4" />

          <p className="mx-auto mt-6 max-w-lg text-base font-light leading-relaxed text-brand-textPrimary/85">
            Ein Barber. Ein Standard. Jeder Cut von Anas persönlich.
          </p>
        </div>

        {/* Barber card */}
        <div className="mx-auto max-w-xl">
          {BARBERS.map((barber: Barber) => (
            <BarberCard key={barber.id} barber={barber} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BarberCard({ barber }: { barber: Barber }) {
  const avatar = BARBER_PHOTOS[barber.id] ?? '/images/anas-barber.jpeg';

  const features = [
    'Fades & präzise Konturen',
    'Persönliche Beratung',
    'Premium-Grooming-Produkte',
  ];

  return (
    <article className="reveal reveal-delay-2 group relative flex h-full flex-col overflow-hidden rounded-2xl border border-brand-border bg-brand-card/45 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-brand-cream/60 hover:shadow-[0_16px_45px_rgba(232,220,200,0.08)] sm:p-10">
      {/* Barber identity */}
      <div className="flex items-center gap-5 sm:gap-6">
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border border-brand-border bg-brand-bgSecondary ring-1 ring-brand-cream/20 transition-all duration-300 group-hover:border-brand-cream/40 group-hover:ring-brand-cream/30 sm:h-28 sm:w-28">
          <img
            src={avatar}
            alt={`${barber.name} – Barber bei VIP FADES in Koblenz`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>

        <div>
          <h3 className="font-serif text-3xl font-light text-brand-textPrimary">
            {barber.name}
          </h3>

          <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-brand-cream">
            {barber.title}
          </p>
        </div>
      </div>

      {/* Specialty */}
      <p className="mt-6 text-base font-light leading-relaxed text-brand-textPrimary/85 sm:mt-7">
        {barber.specialty}
      </p>

      {/* Features */}
      <ul className="mt-5 space-y-3 sm:mt-6">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-3 text-sm font-light text-brand-textPrimary/80"
          >
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-brand-cream/25 bg-brand-cream/5">
              <Check className="h-3.5 w-3.5 text-brand-cream" />
            </span>

            {feature}
          </li>
        ))}
      </ul>

      {/* Booking button */}
      <Link
        href={`/booking?barber=${encodeURIComponent(
          barber.name.toLowerCase(),
        )}`}
        className="mt-auto pt-7 sm:pt-8"
      >
        <span className="flex w-full items-center justify-center rounded-full border border-brand-cream bg-brand-cream px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.14em] text-brand-bg transition-all duration-300 hover:border-brand-textPrimary hover:bg-brand-textPrimary sm:text-sm">
          Termin bei {barber.name} buchen
        </span>
      </Link>
    </article>
  );
}

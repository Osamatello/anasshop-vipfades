'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
import { BARBERS, type Barber } from '@/lib/data';

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
            Die Barber hinter jedem Cut
          </h2>

          <div className="gold-divider mt-4" />

          <p className="mx-auto mt-6 max-w-lg text-base font-light leading-relaxed text-brand-textPrimary/85">
            Zwei Barber. Ein Standard. Wähle den Barber, der am besten zu
            deinem persönlichen Style passt.
          </p>
        </div>

        {/* Barber cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-10">
          {BARBERS.map((barber: Barber, index: number) => (
            <BarberCard
              key={barber.id}
              barber={barber}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function BarberCard({
  barber,
  index,
}: {
  barber: Barber;
  index: number;
}) {
  const avatar =
    barber.name.toLowerCase() === 'anas'
      ? '/images/anas-barber.jpeg'
      : '/images/abd-barber.jpeg';


  const features = [
    'Fades & präzise Konturen',
    'Persönliche Beratung',
    'Premium-Grooming-Produkte',
  ];

  return (
    <article
      className={`reveal ${index === 0 ? 'reveal-delay-2' : 'reveal-delay-3'
        } group relative flex h-full flex-col overflow-hidden rounded-2xl border border-brand-border bg-brand-card/45 p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-brand-cream/60 hover:shadow-[0_16px_45px_rgba(232,220,200,0.08)] max-sm:p-4 sm:p-10`}
    >
      {/* Barber identity */}
      <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:gap-6 sm:text-left">
        <div className="relative h-16 w-16 flex-shrink-0 sm:h-24 sm:w-24 overflow-hidden rounded-2xl border border-brand-border bg-brand-bgSecondary ring-1 ring-brand-cream/20 transition-all duration-300 group-hover:border-brand-cream/40 group-hover:ring-brand-cream/30">
          <img
            src={avatar}
            alt={`${barber.name} – Barber bei VIP FADES in Koblenz`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>

        <div>
          <h3 className="font-serif text-2xl font-light text-brand-textPrimary sm:text-3xl">
            {barber.name}
          </h3>

          <p className="mt-1 flex min-h-[2.5rem] items-start justify-center text-[9px] font-medium uppercase leading-snug tracking-[0.14em] text-brand-cream sm:mt-2 sm:block sm:min-h-0 sm:text-xs sm:tracking-[0.2em]">
            {barber.title}
          </p>
        </div>
      </div>

      {/* Specialty */}
      <p className="mt-3 min-h-[3.75rem] text-center text-xs font-light leading-relaxed text-brand-textPrimary/85 sm:mt-7 sm:min-h-0 sm:text-left sm:text-base">
        {barber.specialty}
      </p>

      {/* Features */}
      <ul className="mt-3 space-y-2 sm:mt-6 sm:space-y-3">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-2 text-[11px] font-light leading-snug text-brand-textPrimary/80 sm:gap-3 sm:text-sm"
          >
            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full sm:h-6 sm:w-6 border border-brand-cream/25 bg-brand-cream/5">
              <Check className="h-3 w-3 text-brand-cream sm:h-3.5 sm:w-3.5" />
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
        className="mt-auto pt-4 sm:pt-8"
      >
        <span className="flex w-full items-center justify-center rounded-full border border-brand-cream bg-brand-cream px-2 py-2.5 text-center text-[10px] font-semibold uppercase leading-tight tracking-[0.08em] sm:px-6 sm:py-3.5 sm:text-sm sm:tracking-[0.14em] text-brand-bg transition-all duration-300 hover:border-brand-textPrimary hover:bg-brand-textPrimary">
          Termin bei {barber.name} buchen
        </span>
      </Link>
    </article>
  );
}
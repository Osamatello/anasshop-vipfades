'use client';

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
        <div className="mb-14 text-center">
          <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-cream">
            The Team
          </span>

          <h2 className="font-serif text-4xl font-light tracking-tight text-brand-textPrimary sm:text-5xl lg:text-6xl">
            The Artists Behind Every Cut
          </h2>

          <div className="gold-divider mt-4" />

          <p className="mx-auto mt-6 max-w-lg text-base font-light leading-relaxed text-brand-textPrimary/85">
            Two artists. One standard. Select the specialist who aligns with
            your personal style.
          </p>
        </div>

        {/* Barber cards */}
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-10">
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
    index === 0
      ? '/images/barber_placeholder_1.png'
      : '/images/barber_placeholder_2.png';

  const scrollToBooking = () => {
    document
      .querySelector('#booking')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    'Fades & precision lines',
    'Personalised consultation',
    'Premium grooming products',
  ];

  return (
    <article
      className={`reveal ${index === 0 ? 'reveal-delay-2' : 'reveal-delay-3'
        } group relative flex h-full flex-col overflow-hidden rounded-2xl border border-brand-border bg-brand-card/45 p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-brand-cream/60 hover:shadow-[0_16px_45px_rgba(232,220,200,0.08)] sm:p-10`}
    >
      {/* Barber identity */}
      <div className="flex items-center gap-6">
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border border-brand-border bg-brand-bgSecondary ring-1 ring-brand-cream/20 transition-all duration-300 group-hover:border-brand-cream/40 group-hover:ring-brand-cream/30">
          <img
            src={avatar}
            alt={`${barber.name} portrait placeholder`}
            className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
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
      <p className="mt-7 text-base font-light leading-relaxed text-brand-textPrimary/85">
        {barber.specialty}
      </p>

      {/* Features */}
      <ul className="mt-6 space-y-3">
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
      <button
        type="button"
        onClick={scrollToBooking}
        className="mt-auto pt-8"
      >
        <span className="flex w-full items-center justify-center rounded-full border border-brand-cream bg-brand-cream px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-brand-bg transition-all duration-300 hover:border-brand-textPrimary hover:bg-brand-textPrimary">
          Book with {barber.name}
        </span>
      </button>
    </article>
  );
}
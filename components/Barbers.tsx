'use client';

import { Check } from 'lucide-react';
import { BARBERS, type Barber } from '@/lib/data';

export default function Barbers() {
  return (
    <section id="barbers" className="section-padding bg-brand-bg px-5 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-cream block mb-3">
            The Team
          </span>
          <h2 className="font-serif text-4xl font-light tracking-tight text-brand-textPrimary sm:text-5xl lg:text-6xl">
            The Artists Behind Every Cut
          </h2>
          <div className="mt-4 gold-divider" />
          <p className="mt-6 mx-auto max-w-lg text-base font-light text-brand-textSecondary">
            Two artists. One standard. Select the specialist who aligns with your personal style.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 sm:gap-10">
          {BARBERS.map((b: Barber, i) => (
            <BarberCard key={b.id} barber={b} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BarberCard({ barber, index }: { barber: Barber; index: number }) {
  const avatar = index === 0 ? '/images/barber_placeholder_1.png' : '/images/barber_placeholder_2.png';

  return (
    <div
      className={`reveal ${
        index === 0 ? 'reveal-delay-2' : 'reveal-delay-3'
      } group relative overflow-hidden rounded-2xl border border-brand-border bg-brand-card/45 p-8 transition-all duration-300 hover:border-brand-accent/30 hover:-translate-y-1 shadow-lg sm:p-10`}
    >
      <div className="flex items-center gap-6">
        <div className="relative h-20 w-20 overflow-hidden rounded-full ring-1 ring-brand-accent/30 flex-shrink-0 bg-brand-bgSecondary border border-brand-border">
          <img
            src={avatar}
            alt={`${barber.name} avatar`}
            className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
          />
        </div>
        <div>
          <h3 className="font-serif text-3xl font-light text-brand-textPrimary">{barber.name}</h3>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-brand-cream font-medium">
            {barber.title}
          </p>
        </div>
      </div>

      <p className="mt-6 text-base font-light leading-relaxed text-brand-textSecondary">
        {barber.specialty}
      </p>

      <ul className="mt-6 space-y-2.5">
        {[
          'Fades & precision lines',
          'Personalised consultation',
          'Premium grooming products',
        ].map((feat) => (
          <li
            key={feat}
            className="flex items-center gap-3 text-sm font-light text-brand-textSecondary"
          >
            <Check className="h-4 w-4 flex-shrink-0 text-brand-cream" />
            {feat}
          </li>
        ))}
      </ul>

      <button
        onClick={() =>
          document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' })
        }
        className="mt-8 w-full rounded-full border border-brand-border bg-brand-bgSecondary/40 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-brand-textPrimary transition-all duration-300 hover:border-brand-accent hover:bg-brand-accent hover:text-brand-textPrimary"
      >
        Book with {barber.name}
      </button>
    </div>
  );
}

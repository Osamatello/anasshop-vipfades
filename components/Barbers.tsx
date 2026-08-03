'use client';

import { Check } from 'lucide-react';
import { BARBERS, type Barber } from '@/lib/data';
import { SectionHeading } from './SectionHeading';

export default function Barbers() {
  return (
    <section id="barbers" className="section-padding bg-ink-950 px-5 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="The Team"
          title="Meet the Barbers"
          description="Two artists. One standard. Choose the barber whose style matches yours."
          light
        />

        <div className="mt-16 grid gap-8 sm:grid-cols-2 sm:gap-10">
          {BARBERS.map((b: Barber, i) => (
            <BarberCard key={b.id} barber={b} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BarberCard({ barber, index }: { barber: Barber; index: number }) {
  // small red/blue accent bars referencing the logo
  const accent = index === 0 ? 'bg-vip-red' : 'bg-vip-blue';
  return (
    <div
      className={`reveal ${
        index === 0 ? 'reveal-delay-2' : 'reveal-delay-3'
      } group relative overflow-hidden rounded-3xl border border-white/5 bg-ink-900 p-8 transition-all hover:border-gold/30 sm:p-10`}
    >
      <div className={`absolute left-0 top-0 h-1 w-16 ${accent}`} />
      <div className="flex items-center gap-5">
        <div className="relative h-20 w-20 overflow-hidden rounded-2xl ring-1 ring-gold/30">
          <img
            src="/images/VIP_FADES_LOGO.jpeg"
            alt={`${barber.name} avatar`}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-serif text-3xl text-warm">{barber.name}</h3>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gold">
            {barber.title}
          </p>
        </div>
      </div>

      <p className="mt-6 text-base font-light leading-relaxed text-ink-200">
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
            className="flex items-center gap-3 text-sm font-light text-warm/70"
          >
            <Check className="h-4 w-4 flex-shrink-0 text-gold" />
            {feat}
          </li>
        ))}
      </ul>

      <button
        onClick={() =>
          document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' })
        }
        className="mt-8 w-full rounded-full border border-white/15 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-warm transition-all hover:border-gold hover:bg-gold hover:text-ink-950"
      >
        Book with {barber.name}
      </button>
    </div>
  );
}

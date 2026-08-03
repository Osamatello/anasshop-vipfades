'use client';

import { Sparkles, Users, Clock } from 'lucide-react';
import { BUSINESS } from '@/lib/data';
import { SectionHeading } from './SectionHeading';

const FEATURES = [
  {
    icon: Sparkles,
    title: 'Premium Experience',
    text: 'Every detail considered — from the chair to the finish.',
  },
  {
    icon: Users,
    title: 'Choose Your Barber',
    text: 'Anas or Abd. Pick the artist who fits your style.',
  },
  {
    icon: Clock,
    title: 'On-Time Service',
    text: 'Respect for your schedule, every single visit.',
  },
];

export default function ShopExperience() {
  return (
    <section id="experience" className="section-padding bg-ink-900 px-5 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Image */}
          <div className="reveal relative order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-[1.75rem]">
              <img
                src="/images/IN-SHOP_PIC.jpeg"
                alt="VIP FADES clean shop interior"
                className="aspect-[4/5] w-full object-cover sm:aspect-square"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
            </div>
            {/* accent badge */}
            <div className="absolute -bottom-5 -right-3 hidden rounded-2xl border border-gold/30 bg-ink-950/90 px-5 py-4 backdrop-blur sm:block">
              <p className="font-serif text-3xl text-gold">100%</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-warm/60">
                Client Focus
              </p>
            </div>
          </div>

          {/* Text */}
          <div className="order-1 lg:order-2">
            <SectionHeading
              eyebrow="The Experience"
              title="More Than a Haircut"
              description="Step into a space designed for calm, precision and detail. Premium finishes, a relaxed atmosphere, and barbers who treat every cut like a craft."
              align="left"
              light
            />

            <div className="mt-10 space-y-6">
              {FEATURES.map((f, i) => (
                <div
                  key={f.title}
                  className={`reveal reveal-delay-${i + 2} flex gap-4`}
                >
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/5">
                    <f.icon className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-warm">{f.title}</h3>
                    <p className="mt-1 text-sm font-light text-ink-200">
                      {f.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="reveal reveal-delay-5 mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-300">
              <span className="rounded-full border border-white/10 px-4 py-1.5">
                {BUSINESS.hours.days}
              </span>
              <span className="rounded-full border border-white/10 px-4 py-1.5">
                {BUSINESS.hours.time}
              </span>
              <span className="rounded-full border border-gold/30 px-4 py-1.5 text-gold">
                {BUSINESS.hours.walkins}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

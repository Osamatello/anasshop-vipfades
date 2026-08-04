'use client';

import {
  Calendar,
  Clock,
  ShieldCheck,
  Sparkles,
  Tag,
  UserRound,
} from 'lucide-react';

import ChatInterface from './chat/ChatInterface';

const FEATURES = [
  {
    icon: Calendar,
    label: 'Book in under a minute',
  },
  {
    icon: Tag,
    label: 'See live prices',
  },
  {
    icon: Clock,
    label: 'Check real availability',
  },
  {
    icon: UserRound,
    label: 'Pick your preferred barber',
  },
];

const BOOKING_STEPS = [
  'Choose a service',
  'Pick your barber',
  'Select a date & time',
  'Enter your name & phone',
  'Confirm your booking',
];

export default function BookingAssistant() {
  return (
    <section
      id="booking"
      className="section-padding bg-brand-bg px-5 sm:px-8"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <div className="reveal reveal-delay-1 flex flex-col items-center text-center">
          <span className="flex items-center gap-2 rounded-full border border-brand-cream/30 bg-brand-cream/5 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.28em] text-brand-cream">
            <Sparkles className="h-3.5 w-3.5" />
            AI Powered
          </span>

          <h2 className="mt-6 font-serif text-4xl leading-[1.05] text-brand-textPrimary sm:text-5xl lg:text-[3.4rem]">
            Your Personal Grooming Concierge
          </h2>

          <div className="mt-6 h-px w-12 bg-brand-cream" />

          <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-brand-textPrimary/85 sm:text-lg">
            Chat with our digital concierge to book an appointment, check
            prices, see availability, and choose your barber, all in one place.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
          {/* Left column */}
          <div className="reveal reveal-delay-2 flex flex-col justify-between gap-8">
            {/* Feature cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              {FEATURES.map((feature) => {
                const FeatureIcon = feature.icon;

                return (
                  <div
                    key={feature.label}
                    className="group flex items-center gap-4 rounded-2xl border border-brand-border bg-brand-card/45 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-cream/50 hover:shadow-[0_14px_40px_rgba(232,220,200,0.07)]"
                  >
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-brand-cream/30 bg-brand-cream/5 transition-all duration-300 group-hover:border-brand-cream/50 group-hover:bg-brand-cream/10">
                      <FeatureIcon className="h-5 w-5 text-brand-cream" />
                    </div>

                    <span className="text-sm font-medium leading-snug text-brand-textPrimary/90">
                      {feature.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* How it works */}
            <div className="rounded-2xl border border-brand-cream/20 bg-gradient-to-br from-brand-bgSecondary to-brand-bg p-6 transition-all duration-300 hover:border-brand-cream/35">
              <div className="flex items-center gap-2 text-brand-cream">
                <ShieldCheck className="h-5 w-5" />

                <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                  How it works
                </span>
              </div>

              <ol className="mt-5 space-y-3">
                {BOOKING_STEPS.map((step, index) => (
                  <li
                    key={step}
                    className="flex items-center gap-3 text-sm font-light text-brand-textPrimary/85"
                  >
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-brand-cream/30 bg-brand-cream/5 text-xs font-semibold text-brand-cream">
                      {index + 1}
                    </span>

                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Right column: chat */}
          <div className="reveal reveal-delay-3 h-[560px] lg:h-[600px]">
            <ChatInterface />
          </div>
        </div>
      </div>
    </section>
  );
}
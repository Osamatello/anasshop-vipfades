'use client';

import { Calendar, Tag, Clock, UserRound, Sparkles, ShieldCheck } from 'lucide-react';
import ChatInterface from './chat/ChatInterface';

const FEATURES = [
  { icon: Calendar, label: 'Book in under a minute' },
  { icon: Tag, label: 'See live prices' },
  { icon: Clock, label: 'Check real availability' },
  { icon: UserRound, label: 'Pick your preferred barber' },
];

export default function BookingAssistant() {
  return (
    <section id="booking" className="section-padding bg-ink-950 px-5 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="reveal reveal-delay-1 flex flex-col items-center text-center">
          <span className="flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.28em] text-gold">
            <Sparkles className="h-3.5 w-3.5" />
            AI Powered
          </span>
          <h2 className="mt-6 font-serif text-4xl leading-[1.05] text-warm sm:text-5xl lg:text-[3.4rem]">
            Your Booking Assistant
          </h2>
          <div className="mt-6 h-px w-12 bg-gold" />
          <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-ink-200 sm:text-lg">
            Chat with our assistant to book an appointment, check prices, see
            availability and choose your barber — all in one place.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
          {/* Left: feature list */}
          <div className="reveal reveal-delay-2 flex flex-col justify-between gap-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {FEATURES.map((f) => (
                <div
                  key={f.label}
                  className="flex items-center gap-4 rounded-2xl border border-white/5 bg-ink-900 p-5 transition-colors hover:border-gold/30"
                >
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/5">
                    <f.icon className="h-5 w-5 text-gold" />
                  </div>
                  <span className="text-sm font-medium text-warm/85">
                    {f.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-gold/20 bg-gradient-to-br from-ink-900 to-ink-950 p-6">
              <div className="flex items-center gap-2 text-gold">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                  How it works
                </span>
              </div>
              <ol className="mt-4 space-y-2.5 text-sm font-light text-ink-200">
                {[
                  'Choose a service',
                  'Pick your barber',
                  'Select a date & time',
                  'Enter your name & phone',
                  'Confirm your booking',
                ].map((s, i) => (
                  <li key={s} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gold/10 text-xs font-semibold text-gold ring-1 ring-gold/30">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Right: chat */}
          <div className="reveal reveal-delay-3 h-[560px] lg:h-[600px]">
            <ChatInterface />
          </div>
        </div>
      </div>
    </section>
  );
}

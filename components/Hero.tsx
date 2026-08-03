'use client';

import { Scissors, ArrowDown, Clock, Phone } from 'lucide-react';
import { BUSINESS } from '@/lib/data';

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/images/VIP_FADES_PIC.jpeg"
          alt="VIP FADES barbershop interior"
          className="h-full w-full object-cover animate-subtle-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-bg/70 via-brand-bg/40 to-brand-bg" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-bg/85 via-transparent to-brand-bg/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#070707_95%)] opacity-85" />
        <div className="absolute inset-0 film-grain" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-5 pt-24 text-center sm:px-8">
        <div className="reveal visible flex flex-col items-center">
          <div className="mb-6 flex items-center gap-3 rounded-full border border-brand-border bg-brand-bgSecondary/60 px-4 py-2 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-pulse" />
            <span className="text-[11px] uppercase tracking-[0.28em] text-brand-textSecondary">
              Koblenz · {BUSINESS.hours.days}
            </span>
          </div>

          <h1 className="font-serif text-5xl font-medium leading-[1.02] text-brand-textPrimary sm:text-7xl lg:text-[5.5rem]">
            {BUSINESS.tagline.split('.')[0]}.
            <br />
            <span className="text-brand-accent">{BUSINESS.tagline.split('.')[1]}.</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg font-light leading-relaxed text-brand-textSecondary sm:text-xl">
            {BUSINESS.description}
          </p>

          <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <button
              onClick={() =>
                document
                  .querySelector('#booking')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              className="group flex items-center justify-center gap-2 rounded-full bg-brand-accent px-8 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-brand-textPrimary transition-all hover:bg-brand-hover border border-brand-accent/20"
            >
              <Scissors className="h-4 w-4" />
              Book Appointment
            </button>
            <button
              onClick={() =>
                document
                  .querySelector('#services')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              className="flex items-center justify-center gap-2 rounded-full border border-brand-border bg-brand-bgSecondary/30 px-8 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-brand-textPrimary backdrop-blur-sm transition-all hover:border-brand-accent hover:text-brand-textPrimary"
            >
              Explore Services
            </button>
          </div>

          {/* Info row */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-brand-textSecondary/80">
            <span className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-brand-accent" />
              {BUSINESS.hours.time}
            </span>
            <span className="hidden h-4 w-px bg-brand-border sm:block" />
            <span className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-brand-accent" />
              {BUSINESS.phoneFormatted}
            </span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() =>
          document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })
        }
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-brand-textSecondary/50 transition-colors hover:text-brand-accent"
        aria-label="Scroll down"
      >
        <ArrowDown className="h-5 w-5 animate-bounce" />
      </button>
    </section>
  );
}

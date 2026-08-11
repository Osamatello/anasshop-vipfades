'use client';

import Link from 'next/link';
import { ArrowDown, Clock, Phone, Scissors } from 'lucide-react';
import { BUSINESS } from '@/lib/data';

export default function Hero() {
  const [firstTagline, secondTagline] = BUSINESS.tagline.split('.');

  const scrollToSection = (sectionId: string) => {
    document
      .querySelector(sectionId)
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/images/ChatGPT_Image_Aug_4,_2026,_09_39_47_AM.png"
          alt="VIP FADES barbershop interior"
          className="h-full w-full animate-subtle-zoom object-cover"
        />

        {/* Overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-bg/85 via-brand-bg/60 to-brand-bg" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-bg/90 via-brand-bg/50 to-brand-bg/55" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#070707_90%)] opacity-90" />
        <div className="film-grain absolute inset-0" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-5 pt-24 text-center sm:px-8">
        <div className="reveal visible flex flex-col items-center">
          {/* Location label */}
          <div className="mb-6 flex items-center gap-3 rounded-full border border-brand-border bg-brand-bgSecondary/70 px-4 py-2 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-textPrimary" />

            <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-brand-textPrimary">
              Koblenz · {BUSINESS.hours.days}
            </span>
          </div>

          {/* Main heading */}
          <h1 className="font-serif text-5xl font-medium leading-[1.02] text-brand-textPrimary sm:text-7xl lg:text-[5.5rem]">
            {firstTagline}.
            <br />
            <span className="text-brand-cream">{secondTagline}.</span>
          </h1>

          {/* Description */}
          <p className="mt-7 max-w-xl text-lg font-light leading-relaxed text-brand-textPrimary/90 sm:text-xl">
            {BUSINESS.description}
          </p>

          {/* Primary CTA */}
          <div className="mt-10 flex flex-col items-center">
            <Link
              href="/booking"
              className="group flex items-center justify-center gap-2 rounded-full border border-brand-cream bg-brand-cream px-8 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-brand-bg transition-all duration-300 hover:border-brand-textPrimary hover:bg-brand-textPrimary"
            >
              <Scissors className="h-4 w-4" />
              Book Appointment
            </Link>

            <div className="mt-8 text-center">
              <p className="font-serif text-2xl font-light tracking-[0.08em] text-brand-textPrimary sm:text-3xl">
                YOUR TIME. YOUR CHAIR.
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm font-light leading-relaxed text-brand-textPrimary/75 sm:text-base">
                From the first consultation to the final mirror check.
              </p>
            </div>
          </div>

          {/* Business information */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-brand-textPrimary">
            <span className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4 text-brand-textPrimary" />
              {BUSINESS.hours.time}
            </span>

            <span className="hidden h-4 w-px bg-brand-border sm:block" />

            <a
              href={`tel:${BUSINESS.phone}`}
              className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-brand-cream"
            >
              <Phone className="h-4 w-4 text-brand-textPrimary" />
              {BUSINESS.phoneFormatted}
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        type="button"
        onClick={() => scrollToSection('#services')}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-brand-cream/70 transition-colors hover:text-brand-cream"
        aria-label="Scroll to services"
      >
        <ArrowDown className="h-5 w-5 animate-bounce" />
      </button>
    </section >
  );
}
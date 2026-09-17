'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ArrowDown, Clock, Phone, Scissors } from 'lucide-react';
import { BUSINESS } from '@/lib/data';
import GoogleRating from '@/components/reviews/GoogleRating';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [firstTagline, secondTagline] = BUSINESS.tagline.split('.');

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      if (preference.matches) {
        videoRef.current?.pause();
      }
    };
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  const scrollToSection = (sectionId: string) => {
    document
      .querySelector(sectionId)
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          ref={videoRef}
          src="/videos/vip-fades-hero.mp4"
          poster="/images/vip-fades-hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          className="h-full w-full object-cover"
        />

        {/* Overlays for readability */}
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-brand-bg" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-5 pt-24 text-center [text-shadow:0_2px_12px_rgba(0,0,0,0.7)] sm:px-8">
        <div className="reveal visible flex flex-col items-center">
          {/* Location label */}
          <div className="mb-6 flex items-center gap-3 px-4 py-2">
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
          <p className="mt-7 max-w-xl text-lg font-light leading-relaxed text-brand-textPrimary sm:text-xl">
            {BUSINESS.description}
          </p>

          {/* Primary CTA */}
          <div className="mt-10 flex flex-col items-center">
            <Link
              href="/booking"
              className="group flex items-center justify-center gap-2 rounded-full border border-brand-cream bg-brand-cream px-8 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-brand-bg transition-all duration-300 hover:border-brand-textPrimary hover:bg-brand-textPrimary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cream [text-shadow:none]"
            >
              <Scissors className="h-4 w-4" />
              Termin buchen
            </Link>

            <div className="mt-8 text-center">
              <p className="font-serif text-2xl font-light tracking-[0.08em] text-brand-textPrimary sm:text-3xl">
                DEINE ZEIT. DEIN STUHL.
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm font-light leading-relaxed text-brand-textPrimary/90 sm:text-base">
                Von der ersten Beratung bis zum letzten Blick in den Spiegel.
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
      <div className="absolute bottom-6 left-5 z-10 [text-shadow:0_2px_8px_rgba(0,0,0,0.7)] sm:left-8">
        <GoogleRating compact />
      </div>
      <button
        type="button"
        onClick={() => scrollToSection('#services')}
        className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 rounded text-brand-cream/70 transition-colors hover:text-brand-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cream sm:block"
        aria-label="Zu den Leistungen scrollen"
      >
        <ArrowDown className="h-5 w-5 animate-bounce motion-reduce:animate-none" />
      </button>
    </section >
  );
}
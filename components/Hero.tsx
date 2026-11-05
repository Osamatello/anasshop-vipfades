'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ArrowDown, Clock, Phone, Scissors } from 'lucide-react';
import { BUSINESS } from '@/lib/data';
import GoogleRating from '@/components/reviews/GoogleRating';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [firstTagline, secondTagline] = BUSINESS.tagline.split(' – ');

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isVisible = true;

    const syncPlayback = () => {
      const video = videoRef.current;
      if (!video) return;

      if (preference.matches || !isVisible) {
        video.pause();
        return;
      }

      void video.play().catch(() => {
        // Autoplay can be blocked by the browser; the poster remains visible.
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        syncPlayback();
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    syncPlayback();
    preference.addEventListener('change', syncPlayback);

    return () => {
      observer.disconnect();
      preference.removeEventListener('change', syncPlayback);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    document
      .querySelector(sectionId)
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-end justify-start overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/images/vip-fades-hero-poster.jpg')" }}
      >
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
          className="absolute left-0 top-1/2 h-[90%] w-full -translate-y-1/2 object-cover object-[48%_center] sm:static sm:h-full sm:translate-y-0 sm:object-center"
        />

        {/* Overlays for readability */}
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-brand-bg" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-24 text-left [text-shadow:0_2px_12px_rgba(0,0,0,0.7)] sm:px-8 sm:pb-20">
        <div className="reveal visible flex flex-col items-start">
          {/* Main heading */}
          <h1 className="font-serif font-medium text-brand-textPrimary">
            <span className="block text-lg leading-snug sm:text-2xl lg:text-3xl">
              {secondTagline}
            </span>
            <span className="sr-only"> – </span>
            <span className="mt-2 block text-[2rem] leading-[1.05] text-brand-cream sm:text-6xl lg:text-7xl">
              {firstTagline}
            </span>
          </h1>

          {/* Google rating */}
          <div className="mt-3">
            <GoogleRating />
          </div>

          {/* Primary CTA */}
          <div className="mt-6 flex flex-col items-start">
            <Link
              href="/booking"
              className="group flex items-center justify-center gap-2 rounded-full border border-brand-cream bg-brand-cream px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.16em] text-brand-bg transition-all duration-300 hover:border-brand-textPrimary hover:bg-brand-textPrimary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cream [text-shadow:none] sm:text-sm"
            >
              <Scissors className="h-4 w-4" />
              Termin buchen
            </Link>
          </div>

          {/* Business information */}
          <div className="mt-7 flex flex-col items-start gap-x-8 gap-y-3 text-brand-textPrimary sm:flex-row sm:items-center">
            <div className="flex flex-col items-start gap-1.5">
              <span className="flex items-center gap-2 text-[13px] font-medium sm:text-sm">
                <Clock className="h-4 w-4 text-brand-textPrimary" />
                {BUSINESS.hours.open}
              </span>

              <span className="flex items-center gap-2 text-[13px] font-medium sm:text-sm">
                <Clock className="h-4 w-4 text-brand-textPrimary" />
                Online-Termine nur Mo–Do, {BUSINESS.hours.onlineTime}
              </span>
            </div>

            <span className="hidden h-4 w-px bg-brand-border sm:block" />

            <a
              href={`tel:${BUSINESS.phone}`}
              className="flex items-center gap-2 text-[13px] font-medium transition-colors hover:text-brand-cream sm:text-sm"
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
        className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 rounded text-brand-cream/70 transition-colors hover:text-brand-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cream sm:block"
        aria-label="Zu den Leistungen scrollen"
      >
        <ArrowDown className="h-5 w-5 animate-bounce motion-reduce:animate-none" />
      </button>
    </section >
  );
}

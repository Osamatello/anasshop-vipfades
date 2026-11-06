'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { Clock, Phone, Scissors } from 'lucide-react';
import { BUSINESS } from '@/lib/data';
import GoogleRating from '@/components/reviews/GoogleRating';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
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
      <div className="relative z-10 mx-auto max-w-5xl -translate-y-8 px-5 pt-24 text-center [text-shadow:0_2px_12px_rgba(0,0,0,0.7)] sm:translate-y-0 sm:px-8">
        <div className="reveal visible flex flex-col items-center">
          {/* Main heading */}
          <h1 className="font-serif text-[2.25rem] font-medium leading-[1.2] text-brand-textPrimary sm:text-6xl sm:leading-[1.2] lg:text-7xl lg:leading-[1.2] xl:text-[5.5rem]">
            VIP FADES BY ANAS
            <br />
            Barbershop{' '}
            <em className="font-medium text-brand-cream">in Koblenz</em>
          </h1>

          {/* Details */}
          <p className="mt-7 max-w-xl sm:mt-9 text-base font-light leading-relaxed text-brand-textPrimary sm:text-lg">
            <strong className="font-semibold">Dein Barbershop &amp; Herrenfriseur in Koblenz.</strong>{' '}
            Präzise Herrenhaarschnitte, Skin Fades, Bartpflege und modernes Styling.
          </p>

          {/* Business information */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-brand-textPrimary sm:mt-10">
            <div className="flex flex-col items-center gap-1.5 sm:items-start">
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

          {/* Primary CTA */}
          <div className="mt-8 flex flex-col items-center sm:mt-10">
            <Link
              href="/booking"
              className="group flex items-center justify-center gap-2 rounded-full border border-brand-cream bg-brand-cream px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.16em] text-brand-bg transition-all duration-300 hover:border-brand-textPrimary hover:bg-brand-textPrimary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cream [text-shadow:none] sm:text-sm"
            >
              <Scissors className="h-4 w-4" />
              Termin buchen
            </Link>
          </div>
        </div>
      </div>

      {/* Google rating */}
      <div className="absolute bottom-24 left-5 z-10 [text-shadow:0_2px_8px_rgba(0,0,0,0.7)] sm:left-8 lg:bottom-6">
        <GoogleRating compact />
      </div>

    </section >
  );
}

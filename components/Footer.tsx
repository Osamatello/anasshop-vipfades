'use client';

import { Phone, Instagram, MapPin, Scissors, ArrowUp } from 'lucide-react';
import { BUSINESS } from '@/lib/data';

const NAV = [
  { label: 'Services', href: '#services' },
  { label: 'Experience', href: '#experience' },
  { label: 'Barbers', href: '#barbers' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Booking', href: '#booking' },
  { label: 'Contact', href: '#contact' },
];

export default function Footer() {
  const go = (href: string) =>
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer className="relative overflow-hidden bg-ink-950 px-5 pt-20 pb-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full ring-1 ring-gold/40">
                <img
                  src="/images/VIP_FADES_LOGO.jpeg"
                  alt="VIP FADES logo"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif text-xl font-semibold text-warm">
                  VIP FADES
                </span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-gold">
                  by Anas
                </span>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-sm font-light leading-relaxed text-ink-300">
              {BUSINESS.tagline} {BUSINESS.description}
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={`tel:${BUSINESS.phone}`}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-warm/70 transition-all hover:border-gold hover:text-gold"
                aria-label="Call"
              >
                <Phone className="h-4 w-4" />
              </a>
              <a
                href={BUSINESS.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-warm/70 transition-all hover:border-gold hover:text-gold"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(BUSINESS.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-warm/70 transition-all hover:border-gold hover:text-gold"
                aria-label="Map"
              >
                <MapPin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Nav */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold">
              Explore
            </p>
            <ul className="mt-5 space-y-3">
              {NAV.map((n) => (
                <li key={n.href}>
                  <button
                    onClick={() => go(n.href)}
                    className="text-sm font-light text-warm/70 transition-colors hover:text-gold"
                  >
                    {n.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold">
              Visit
            </p>
            <p className="mt-5 text-sm font-light leading-relaxed text-warm/70">
              {BUSINESS.address}
            </p>
            <p className="mt-3 text-sm font-light text-warm/70">
              {BUSINESS.hours.days}
              <br />
              {BUSINESS.hours.time}
            </p>
            <p className="mt-3 text-sm text-gold">{BUSINESS.hours.walkins}</p>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs font-light text-ink-400">
            © {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-warm/60 transition-colors hover:text-gold"
          >
            Back to top
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}

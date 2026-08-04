'use client';

import { Phone, Instagram, MapPin, Scissors, ArrowUp } from 'lucide-react';
import { BUSINESS } from '@/lib/data';

const NAV = [
  { label: 'Signature Cuts', href: '#services' },
  { label: 'The VIP Experience', href: '#experience' },
  { label: 'The Artists', href: '#barbers' },
  { label: 'Booking', href: '#booking' },
  { label: 'Visit', href: '#contact' },
];

export default function Footer() {
  const go = (href: string) =>
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer className="relative overflow-hidden bg-brand-bg px-5 pt-20 pb-10 sm:px-8 border-t border-brand-border">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12">
                <img
                  src="/images/vip-fades-logo.png"
                  alt="VIP FADES BY ANAS logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif text-xl font-semibold text-brand-textPrimary">
                  VIP FADES
                </span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-brand-accent font-semibold">
                  by Anas
                </span>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-sm font-light leading-relaxed text-brand-textSecondary">
              {BUSINESS.tagline} {BUSINESS.description}
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={`tel:${BUSINESS.phone}`}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border text-brand-textSecondary transition-all hover:border-brand-accent hover:text-brand-accent"
                aria-label="Call"
              >
                <Phone className="h-4 w-4" />
              </a>
              <a
                href={BUSINESS.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border text-brand-textSecondary transition-all hover:border-brand-accent hover:text-brand-accent"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(BUSINESS.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border text-brand-textSecondary transition-all hover:border-brand-accent hover:text-brand-accent"
                aria-label="Map"
              >
                <MapPin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Nav */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-brand-accent font-semibold">
              Explore
            </p>
            <ul className="mt-5 space-y-3">
              {NAV.map((n) => (
                <li key={n.href}>
                  <button
                    onClick={() => go(n.href)}
                    className="text-sm font-light text-brand-textSecondary transition-colors hover:text-brand-accent"
                  >
                    {n.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-brand-accent font-semibold">
              Visit
            </p>
            <p className="mt-5 text-sm font-light leading-relaxed text-brand-textSecondary">
              {BUSINESS.address}
            </p>
            <p className="mt-3 text-sm font-light text-brand-textSecondary">
              {BUSINESS.hours.days}
              <br />
              {BUSINESS.hours.time}
            </p>
            <p className="mt-3 text-sm text-brand-accent font-medium">{BUSINESS.hours.walkins}</p>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-brand-border pt-8 sm:flex-row">
          <p className="text-xs font-light text-brand-textSecondary/80">
            © {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-brand-textSecondary transition-colors hover:text-brand-accent"
          >
            Back to top
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}

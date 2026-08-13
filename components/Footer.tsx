'use client';

import { ArrowUp, Instagram, MapPin, Phone } from 'lucide-react';
import { BUSINESS } from '@/lib/data';

const NAV = [
  { label: 'Signature Cuts', href: '#services' },
  { label: 'Das VIP Erlebnis', href: '#experience' },
  { label: 'Unsere Barber', href: '#barbers' },
  { label: 'Termin buchen', href: '#booking' },
  { label: 'Besuch uns', href: '#contact' },
];

export default function Footer() {
  const go = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    BUSINESS.address,
  )}`;

  return (
    <footer className="relative overflow-hidden border-t border-brand-border bg-brand-bg px-5 pb-10 pt-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-3"
              aria-label="Nach oben"
            >
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-brand-cream/30 bg-white shadow-sm">
                <img
                  src="/images/favicon.png"
                  alt="VIP FADES logo"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col items-start leading-none">
                <span className="font-serif text-xl font-semibold tracking-wide text-brand-textPrimary">
                  VIP FADES
                </span>

                <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-cream">
                  BY ANAS
                </span>
              </div>
            </button>

            <p className="mt-5 max-w-xs text-sm font-light leading-relaxed text-brand-textPrimary/80">
              {BUSINESS.tagline} {BUSINESS.description}
            </p>

            <div className="mt-6 flex gap-3">
              <a
                href={`tel:${BUSINESS.phone}`}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border text-brand-textPrimary/75 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-cream/60 hover:bg-brand-cream/5 hover:text-brand-cream"
                aria-label="VIP FADES anrufen"
              >
                <Phone className="h-4 w-4" />
              </a>

              <a
                href={BUSINESS.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border text-brand-textPrimary/75 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-cream/60 hover:bg-brand-cream/5 hover:text-brand-cream"
                aria-label="Instagram öffnen"
              >
                <Instagram className="h-4 w-4" />
              </a>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border text-brand-textPrimary/75 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-cream/60 hover:bg-brand-cream/5 hover:text-brand-cream"
                aria-label="Route öffnen"
              >
                <MapPin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-cream">
              Entdecken
            </p>

            <ul className="mt-5 space-y-3">
              {NAV.map((item) => (
                <li key={item.href}>
                  <button
                    type="button"
                    onClick={() => go(item.href)}
                    className="relative text-sm font-light text-brand-textPrimary/75 transition-colors duration-300 hover:text-brand-cream after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-brand-cream after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit information */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-cream">
              Besuch
            </p>

            <p className="mt-5 text-sm font-light leading-relaxed text-brand-textPrimary/80">
              {BUSINESS.address}
            </p>

            <p className="mt-3 text-sm font-light leading-relaxed text-brand-textPrimary/80">
              {BUSINESS.hours.days}
              <br />
              {BUSINESS.hours.time}
            </p>

            <p className="mt-3 text-sm font-medium text-brand-cream">
              {BUSINESS.hours.walkins}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-brand-border pt-8 sm:flex-row">
          <p className="text-xs font-light text-brand-textPrimary/60">
            © {new Date().getFullYear()} {BUSINESS.name}. Alle Rechte vorbehalten.
          </p>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-brand-cream transition-colors hover:text-brand-textPrimary"
          >
            Nach oben
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
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
    <footer className="relative overflow-hidden border-t border-brand-border bg-brand-bg px-5 pb-4 pt-7 sm:px-8 sm:pb-5 sm:pt-9">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-[0.85fr_1.15fr] gap-x-5 gap-y-5 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-x-10 lg:gap-y-0">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2.5"
              aria-label="Nach oben"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-brand-cream/30 bg-white shadow-sm sm:h-11 sm:w-11">
                <img
                  src="/images/favicon.png"
                  alt="VIP FADES logo"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col items-start leading-none">
                <span className="font-serif text-lg font-semibold tracking-wide text-brand-textPrimary">
                  VIP FADES
                </span>

                <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.27em] text-brand-cream">
                  BY ANAS
                </span>
              </div>
            </button>

            <p className="mt-4 hidden max-w-sm text-sm font-light leading-7 text-brand-textPrimary/70 lg:block">
              Premium Cuts. Saubere Fades. Präzises Barbering, moderner Style und ein Premium-Erlebnis in Koblenz.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-cream sm:text-[11px]">
              Entdecken
            </p>

            <ul className="mt-2 space-y-1.5">
              {NAV.map((item) => (
                <li key={item.href}>
                  <button
                    type="button"
                    onClick={() => go(item.href)}
                    className="relative text-[12px] font-light leading-5 text-brand-textPrimary/75 transition-colors duration-300 hover:text-brand-cream after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-brand-cream after:transition-all after:duration-300 hover:after:w-full sm:text-[13px]"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit information */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-cream sm:text-[11px]">
              Besuch
            </p>

            <p className="mt-2 text-[12px] font-light leading-5 text-brand-textPrimary/80 sm:text-[13px]">
              {BUSINESS.address}
            </p>

            <p className="mt-1.5 text-[12px] font-light leading-5 text-brand-textPrimary/80 sm:text-[13px]">
              {BUSINESS.hours.days}
              <br />
              {BUSINESS.hours.time}
            </p>

            <p className="mt-1.5 text-[12px] font-medium text-brand-cream sm:text-[13px]">
              {BUSINESS.hours.walkins}
            </p>

            <div className="mt-2 flex flex-col items-start gap-1 text-[12px] font-light leading-5 text-brand-textPrimary/75 sm:text-[13px]">
              <a href="tel:+4917663782674" className="rounded transition-colors hover:text-brand-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cream">
                +49 176 63782674
              </a>
              <a href="mailto:vipfadeskoplenz@gmail.com" className="break-all rounded transition-colors hover:text-brand-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cream">
                vipfadeskoplenz@gmail.com
              </a>
            </div>

            <div className="mt-2.5 flex gap-2">
              <a
                href={`tel:${BUSINESS.phone}`}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-border text-brand-textPrimary/75 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-cream/60 hover:bg-brand-cream/5 hover:text-brand-cream"
                aria-label="VIP FADES anrufen"
              >
                <Phone className="h-3.5 w-3.5" />
              </a>

              <a
                href={BUSINESS.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-border text-brand-textPrimary/75 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-cream/60 hover:bg-brand-cream/5 hover:text-brand-cream"
                aria-label="Instagram öffnen"
              >
                <Instagram className="h-3.5 w-3.5" />
              </a>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-border text-brand-textPrimary/75 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-cream/60 hover:bg-brand-cream/5 hover:text-brand-cream"
                aria-label="Route öffnen"
              >
                <MapPin className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-brand-border pt-3.5 sm:flex-row">
          <p className="text-[10px] font-light text-brand-textPrimary/60 sm:text-[11px]">
            © {new Date().getFullYear()} {BUSINESS.name}. Alle Rechte vorbehalten.
          </p>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.15em] text-brand-cream transition-colors hover:text-brand-textPrimary sm:text-[11px]"
          >
            Nach oben
            <ArrowUp className="h-3 w-3" />
          </button>
        </div>
      </div>
    </footer>
  );
}

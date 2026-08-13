'use client';

import { Clock, Instagram, MapPin, Phone } from 'lucide-react';
import { BUSINESS } from '@/lib/data';

export default function Contact() {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    BUSINESS.address,
  )}`;

  return (
    <section
      id="contact"
      className="section-padding border-t border-brand-border bg-brand-bgSecondary px-5 sm:px-8"
    >
      <div className="mx-auto max-w-5xl">
        {/* Section heading */}
        <div className="mb-14 text-center">
          <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-cream">
            Besuch uns
          </span>

          <h2 className="font-serif font-light tracking-tight">
            <span className="block text-3xl text-brand-textPrimary sm:text-4xl lg:text-5xl">
              Visit
            </span>

            <span className="mt-2 block text-5xl text-brand-cream sm:text-6xl lg:text-7xl">
              VIP FADES
            </span>

            <span className="mx-auto mt-5 block h-px w-16 bg-brand-cream/70" />
          </h2>

          <p className="mx-auto mt-8 max-w-lg text-base font-light leading-relaxed text-brand-textPrimary/85">
            Besuch uns im Herzen von Koblenz. Komm jederzeit spontan vorbei oder buche
            deinen Termin online von Montag bis Donnerstag.
          </p>
        </div>

        {/* Contact cards */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ContactCard
            icon={MapPin}
            label="Adresse"
            lines={[BUSINESS.address]}
            href={directionsUrl}
            external
          />

          <ContactCard
            icon={Phone}
            label="Telefon"
            lines={[BUSINESS.phoneFormatted]}
            href={`tel:${BUSINESS.phone}`}
          />

          <ContactCard
            icon={Clock}
            label="Online-Termine"
            lines={[
              'Montag bis Donnerstag',
              '10:00 – 19:00',
              'Walk-ins täglich willkommen',
            ]}
          />

          <ContactCard
            icon={Instagram}
            label="Instagram"
            lines={[
              BUSINESS.instagram,
              'Entdecke unsere neuesten Cuts',
            ]}
            href={BUSINESS.instagramUrl}
            external
          />
        </div>

        {/* Map */}
        <div className="reveal reveal-delay-4 mt-12 flex flex-col items-center">
          <div className="group w-full overflow-hidden rounded-2xl border border-brand-border shadow-lg transition-all duration-300 hover:border-brand-cream/45 hover:shadow-[0_18px_50px_rgba(232,220,200,0.08)]">
            <iframe
              title="Standort von VIP FADES"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                BUSINESS.address,
              )}&output=embed`}
              className="h-[300px] w-full grayscale contrast-110 opacity-90 transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100 sm:h-[380px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-cream bg-brand-cream px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-bg transition-all duration-300 hover:border-brand-textPrimary hover:bg-brand-textPrimary"
          >
            <MapPin className="h-4 w-4" />
            Route anzeigen
          </a>
        </div>
      </div>
    </section>
  );
}

function ContactCard({
  icon: Icon,
  label,
  lines,
  href,
  external = false,
}: {
  icon: React.ElementType;
  label: string;
  lines: string[];
  href?: string;
  external?: boolean;
}) {
  const cardContent = (
    <div className="reveal reveal-delay-2 group flex h-full flex-col items-start rounded-2xl border border-brand-border bg-brand-bg p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-cream/55 hover:shadow-[0_14px_40px_rgba(232,220,200,0.07)]">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-cream/30 bg-brand-cream/5 transition-all duration-300 group-hover:border-brand-cream/55 group-hover:bg-brand-cream/10">
        <Icon className="h-5 w-5 text-brand-cream" />
      </div>

      <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-cream">
        {label}
      </p>

      <div className="mt-2 space-y-1">
        {lines.map((line, index) => (
          <p
            key={`${label}-${index}`}
            className={
              index === 0
                ? 'text-sm font-medium leading-relaxed text-brand-textPrimary'
                : 'text-sm font-light leading-relaxed text-brand-textPrimary/80'
            }
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );

  if (!href) {
    return cardContent;
  }

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="block h-full"
    >
      {cardContent}
    </a>
  );
}
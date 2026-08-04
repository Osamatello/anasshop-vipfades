'use client';

import { Phone, MapPin, Clock, Instagram } from 'lucide-react';
import { BUSINESS } from '@/lib/data';

export default function Contact() {
  return (
    <section id="contact" className="section-padding bg-brand-bgSecondary px-5 sm:px-8 border-t border-brand-border">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-cream block mb-3">
            Visit Us
          </span>
          <h2 className="font-serif text-4xl font-light tracking-tight text-brand-textPrimary sm:text-5xl lg:text-6xl">
            Visit VIP FADES
          </h2>
          <div className="mt-4 gold-divider" />
          <p className="mt-6 mx-auto max-w-lg text-base font-light text-brand-textSecondary">
            Find us in the heart of Koblenz. Walk in during opening hours or secure your slot online.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ContactCard
            icon={MapPin}
            label="Address"
            lines={[BUSINESS.address]}
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(BUSINESS.address)}`}
          />
          <ContactCard
            icon={Phone}
            label="Phone"
            lines={[BUSINESS.phoneFormatted]}
            href={`tel:${BUSINESS.phone}`}
          />
          <ContactCard
            icon={Clock}
            label="Hours"
            lines={[BUSINESS.hours.days, BUSINESS.hours.time, BUSINESS.hours.walkins]}
          />
          <ContactCard
            icon={Instagram}
            label="Instagram"
            lines={[BUSINESS.instagram]}
            href={BUSINESS.instagramUrl}
          />
        </div>

        <div className="reveal reveal-delay-4 mt-12 flex flex-col items-center">
          <div className="w-full overflow-hidden rounded-2xl border border-brand-border shadow-lg">
            <iframe
              title="VIP FADES location map"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                BUSINESS.address
              )}&output=embed`}
              className="h-[300px] w-full grayscale contrast-110 opacity-80 hover:opacity-100 transition-opacity duration-500 sm:h-[380px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(BUSINESS.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-accent px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-textPrimary transition-all duration-300 hover:bg-brand-hover border border-brand-accent/20"
          >
            Get Directions
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
}: {
  icon: React.ElementType;
  label: string;
  lines: string[];
  href?: string;
}) {
  const inner = (
    <div className="reveal reveal-delay-2 group flex h-full flex-col items-start rounded-2xl border border-brand-border bg-brand-bg p-6 transition-all duration-300 hover:border-brand-accent/30">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-accent/30 bg-brand-accent/5">
        <Icon className="h-5 w-5 text-brand-cream" />
      </div>
      <p className="mt-5 text-[11px] uppercase tracking-[0.22em] text-brand-cream font-semibold">
        {label}
      </p>
      <div className="mt-2 space-y-0.5">
        {lines.map((l, i) => (
          <p
            key={i}
            className={`text-sm font-light text-brand-textSecondary ${
              i === 0 ? 'font-medium text-brand-textPrimary' : ''
            }`}
          >
            {l}
          </p>
        ))}
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        {inner}
      </a>
    );
  }
  return inner;
}
